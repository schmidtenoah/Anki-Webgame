import JSZip from "jszip";
import DOMPurify from "dompurify";
import initSqlJs, { type Database } from "sql.js";
import { decompress as zstdDecompress } from "fzstd";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

export interface Flashcard {
  id: number;
  questionHtml: string;
  answerHtml: string;
}

let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;
let activeObjectUrls: string[] = [];
const MAX_COLLECTION_BYTES = 200 * 1024 * 1024;
const MAX_MEDIA_BYTES = 12 * 1024 * 1024;
const MAX_MEDIA_FILES = 250;
const MAX_TOTAL_MEDIA_BYTES = 64 * 1024 * 1024;

export function clearApkgObjectUrls() {
  activeObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  activeObjectUrls = [];
}

async function getSql() {
  if (SQL) return SQL;
  SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  return SQL;
}

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">",
  "&quot;": '"', "&#39;": "'",
};

const ALLOWED_CARD_TAGS = [
  "a", "abbr", "b", "blockquote", "br", "cite", "code", "dd", "del", "div", "dl", "dt",
  "em", "hr", "i", "img", "kbd", "li", "mark", "ol", "p", "pre", "q", "rp", "rt", "ruby",
  "s", "samp", "small", "span", "strong", "sub", "sup", "table", "tbody", "td", "tfoot",
  "th", "thead", "tr", "u", "ul", "var",
];

const ALLOWED_CARD_ATTRS = [
  "alt", "colspan", "height", "href", "rowspan", "src", "title", "width",
];

function decodeEntities(s: string) {
  return s.replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m] ?? m);
}

function sanitizeHtml(html: string, mediaMap: Map<string, string>): string {
  if (!html) return "";
  let out = html.replace(/\[sound:[^\]]*\]/g, "");
  // Rewrite packaged Anki media to local blob URLs before applying the allowlist sanitizer.
  out = out.replace(/<img\b([^>]*?)\ssrc\s*=\s*("([^"]*)"|'([^']*)')([^>]*)>/gi,
    (_m, pre, _q, dq, sq, post) => {
      const raw = decodeEntities(dq ?? sq ?? "");
      const name = raw.split(/[?#]/)[0];
      const url = mediaMap.get(name) ?? mediaMap.get(decodeURIComponent(name));
      if (!url) return `<img${pre}${post} alt="" style="display:none">`;
      return `<img${pre} src="${url}"${post} alt="">`;
    });

  return DOMPurify.sanitize(out, {
    ALLOWED_TAGS: ALLOWED_CARD_TAGS,
    ALLOWED_ATTR: ALLOWED_CARD_ATTRS,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|blob:)/i,
    FORBID_TAGS: ["audio", "base", "embed", "form", "iframe", "input", "link", "meta", "object", "script", "style", "svg", "video"],
    FORBID_ATTR: ["style", "srcset"],
  });
}

function isMostlyEmpty(html: string) {
  const text = html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  return text.length === 0 && !/<img|<audio|<video/i.test(html);
}

function isZstd(bytes: Uint8Array): boolean {
  return bytes[0] === 0x28 && bytes[1] === 0xb5 && bytes[2] === 0x2f && bytes[3] === 0xfd;
}

function decompressIfZstd(bytes: Uint8Array): Uint8Array {
  return isZstd(bytes) ? zstdDecompress(bytes) : bytes;
}

function readVarint(bytes: Uint8Array, offset: number): [number, number] {
  let value = 0;
  let shift = 0;
  let i = offset;

  while (i < bytes.length) {
    const byte = bytes[i++];
    value += (byte & 0x7f) * 2 ** shift;
    if ((byte & 0x80) === 0) return [value, i];
    shift += 7;
  }

  throw new Error("Unvollständige Protobuf-Varint im Medienindex.");
}

function skipProtobufValue(bytes: Uint8Array, offset: number, wireType: number): number {
  switch (wireType) {
    case 0:
      return readVarint(bytes, offset)[1];
    case 1:
      return offset + 8;
    case 2: {
      const [length, valueOffset] = readVarint(bytes, offset);
      return valueOffset + length;
    }
    case 5:
      return offset + 4;
    default:
      throw new Error(`Unbekannter Protobuf-Wire-Type im Medienindex: ${wireType}`);
  }
}

function decodeMediaEntry(bytes: Uint8Array): { name?: string; legacyZipFilename?: number } {
  const entry: { name?: string; legacyZipFilename?: number } = {};
  let offset = 0;

  while (offset < bytes.length) {
    const [tag, valueOffset] = readVarint(bytes, offset);
    const fieldNumber = Math.floor(tag / 8);
    const wireType = tag & 7;
    offset = valueOffset;

    if (fieldNumber === 1 && wireType === 2) {
      const [length, stringOffset] = readVarint(bytes, offset);
      entry.name = new TextDecoder("utf-8", { fatal: false })
        .decode(bytes.subarray(stringOffset, stringOffset + length));
      offset = stringOffset + length;
      continue;
    }

    if (fieldNumber === 255 && wireType === 0) {
      const [legacyZipFilename, nextOffset] = readVarint(bytes, offset);
      entry.legacyZipFilename = legacyZipFilename;
      offset = nextOffset;
      continue;
    }

    offset = skipProtobufValue(bytes, offset, wireType);
  }

  return entry;
}

function decodeMediaEntries(bytes: Uint8Array): Record<string, string> | null {
  const entries: Array<{ name?: string; legacyZipFilename?: number }> = [];
  let offset = 0;

  try {
    while (offset < bytes.length) {
      const [tag, valueOffset] = readVarint(bytes, offset);
      const fieldNumber = Math.floor(tag / 8);
      const wireType = tag & 7;
      offset = valueOffset;

      if (fieldNumber === 1 && wireType === 2) {
        const [length, messageOffset] = readVarint(bytes, offset);
        entries.push(decodeMediaEntry(bytes.subarray(messageOffset, messageOffset + length)));
        offset = messageOffset + length;
        continue;
      }

      offset = skipProtobufValue(bytes, offset, wireType);
    }
  } catch {
    return null;
  }

  if (!entries.some((entry) => entry.name)) return null;

  const mapping: Record<string, string> = {};
  entries.forEach((entry, index) => {
    if (!entry.name) return;
    mapping[String(entry.legacyZipFilename ?? index)] = entry.name;
  });

  return mapping;
}

async function readCollectionBytes(zip: JSZip): Promise<Uint8Array> {
  const b = zip.file("collection.anki21b");
  let bytes: Uint8Array;
  if (b) {
    const raw = await b.async("uint8array");
    bytes = decompressIfZstd(raw);
  } else {
    const a21 = zip.file("collection.anki21");
    if (a21) bytes = await a21.async("uint8array");
    else {
      const a2 = zip.file("collection.anki2");
      if (a2) bytes = await a2.async("uint8array");
      else throw new Error("No Anki collection was found in this file.");
    }
  }

  if (bytes.byteLength > MAX_COLLECTION_BYTES) {
    throw new Error("Deck database is too large to open safely in the browser.");
  }
  return bytes;
}

async function buildMediaMap(zip: JSZip): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const mediaFile = zip.file("media");
  if (!mediaFile) return map;
  const raw = decompressIfZstd(await mediaFile.async("uint8array"));

  // Try JSON (older .apkg/.apkg21 format)
  let mapping: Record<string, string> | null = null;
  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(raw);
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) {
      mapping = JSON.parse(trimmed) as Record<string, string>;
    }
  } catch {
    /* not JSON — likely protobuf (anki21b) */
  }

  if (!mapping) {
    mapping = decodeMediaEntries(raw) ?? {};
  }

  let totalMediaBytes = 0;
  for (const [key, originalName] of Object.entries(mapping).slice(0, MAX_MEDIA_FILES)) {
    const entry = zip.file(key);
    if (!entry) continue;
    const bytes = decompressIfZstd(await entry.async("uint8array"));
    if (bytes.byteLength > MAX_MEDIA_BYTES) continue;
    if (totalMediaBytes + bytes.byteLength > MAX_TOTAL_MEDIA_BYTES) break;
    totalMediaBytes += bytes.byteLength;

    const ext = originalName.split(".").pop()?.toLowerCase() ?? "";
    const mime =
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "gif" ? "image/gif" :
      ext === "webp" ? "image/webp" :
      null;
    if (!mime) continue;
    const typed = new Blob([new Uint8Array(bytes).buffer], { type: mime });
    const url = URL.createObjectURL(typed);
    activeObjectUrls.push(url);
    map.set(originalName, url);
    // Also map basename in case src has a path.
    const basename = originalName.split("/").pop()!;
    if (basename !== originalName) map.set(basename, url);
  }

  return map;
}

export async function parseApkg(file: File): Promise<Flashcard[]> {
  clearApkgObjectUrls();
  const zip = await JSZip.loadAsync(file);
  const [dbBytes, mediaMap] = await Promise.all([
    readCollectionBytes(zip),
    buildMediaMap(zip),
  ]);
  const sql = await getSql();
  const db: Database = new sql.Database(dbBytes);

  const result = db.exec("SELECT id, flds FROM notes");
  if (!result.length) {
    db.close();
    throw new Error("No notes were found.");
  }

  const cards: Flashcard[] = [];
  for (const row of result[0].values) {
    const id = Number(row[0]);
    const flds = String(row[1] ?? "");
    const parts = flds.split("\x1f");
    const q = sanitizeHtml(parts[0] ?? "", mediaMap);
    const a = sanitizeHtml(parts.slice(1).join("<hr>"), mediaMap);
    if (isMostlyEmpty(q) || isMostlyEmpty(a)) continue;
    if (q.toLowerCase().includes("bitte installieren sie die aktuelle anki-version")) continue;
    cards.push({ id, questionHtml: q, answerHtml: a });
  }
  db.close();

  if (!cards.length) throw new Error("No valid cards were found.");
  return cards;
}
