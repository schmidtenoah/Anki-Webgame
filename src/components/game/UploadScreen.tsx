import { useCallback, useState, type CSSProperties } from "react";
import { parseApkg, type Flashcard } from "@/lib/apkg";
import { sfx } from "@/lib/sfx";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { DUNGEONS, FOLKLORES, type DungeonId, type FolkloreId } from "@/lib/gameConfig";

const MAX_APKG_SIZE = 100 * 1024 * 1024;

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  folkloreId: FolkloreId;
  dungeonId: DungeonId;
  onSelectFolklore: (id: FolkloreId) => void;
  onSelectDungeon: (id: DungeonId) => void;
  onLoaded: (cards: Flashcard[]) => void;
}

export function UploadScreen({
  dark,
  onToggleTheme,
  soundMuted,
  onToggleSound,
  folkloreId,
  dungeonId,
  onSelectFolklore,
  onSelectDungeon,
  onLoaded,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const selectedFolklore = FOLKLORES.find((lore) => lore.id === folkloreId) ?? FOLKLORES[0];
  const selectedDungeon = DUNGEONS.find((dungeon) => dungeon.id === dungeonId) ?? DUNGEONS[0];

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.name.toLowerCase().endsWith(".apkg")) {
        setError("Please choose an .apkg deck file.");
        return;
      }
      if (file.size > MAX_APKG_SIZE) {
        setError("Deck is too large. Please use an .apkg file under 100 MB.");
        return;
      }
      setLoading(true);
      sfx.prime();
      sfx.click();
      try {
        const cards = await parseApkg(file);
        onLoaded(cards);
      } catch (e) {
        setError(e instanceof Error ? e.message : "The file could not be read.");
      } finally {
        setLoading(false);
      }
    },
    [onLoaded],
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ "--lore-accent": selectedFolklore.accent } as CSSProperties}
    >
      {/* Decorative background glyphs */}
      <div
        aria-hidden
        className="absolute right-6 top-6 vertical-jp text-[10rem] leading-none font-display select-none pointer-events-none bg-kanji"
      >
        {selectedFolklore.decorativeGlyphs[0]}
      </div>
      <div
        aria-hidden
        className="absolute left-6 bottom-6 vertical-jp text-[8rem] leading-none font-display select-none pointer-events-none bg-kanji"
      >
        {selectedFolklore.decorativeGlyphs[1]}
      </div>

      <div className="relative w-full max-w-xl animate-ink">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="seal h-10 w-10 text-lg">{selectedFolklore.sealGlyph}</span>
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-fg-dim">Anki Lore Dungeon</p>
              <h1 className="text-2xl font-display font-light">{selectedFolklore.heroName} Dungeon</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle muted={soundMuted} onToggle={onToggleSound} />
            <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          </div>
        </div>

        {/* Card */}
        <div className="card-surface p-8 md:p-10">
          <div className="mb-7 grid gap-5">
            <section>
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-fg-dim mb-3">Folklore</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FOLKLORES.map((lore) => {
                  const selected = lore.id === folkloreId;
                  return (
                    <button
                      key={lore.id}
                      type="button"
                      onClick={() => { sfx.click(); onSelectFolklore(lore.id); }}
                      className="ui-button option-button p-3 text-left"
                      data-selected={selected}
                      aria-pressed={selected}
                    >
                      <span className="block font-display text-xl leading-none mb-2">{lore.sealGlyph}</span>
                      <span className="block text-[0.55rem] uppercase tracking-[0.25em]">{lore.label}</span>
                      <span className="block mt-1 text-[0.65rem] leading-snug text-fg-dim">{lore.shortDescription}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-fg-dim mb-3">Dungeon</p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {DUNGEONS.map((dungeon) => {
                  const selected = dungeon.id === dungeonId;
                  return (
                    <button
                      key={dungeon.id}
                      type="button"
                      onClick={() => { sfx.click(); onSelectDungeon(dungeon.id); }}
                      className="ui-button option-button p-3 text-left"
                      data-selected={selected}
                      aria-pressed={selected}
                    >
                      <span className="block text-[0.52rem] uppercase tracking-[0.25em]">{dungeon.shortLabel}</span>
                      <span className="block mt-1 font-display text-sm">
                        {dungeon.lives === null ? "∞ lives" : `${dungeon.lives} ${dungeon.lives === 1 ? "life" : "lives"}`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-fg-mid">{selectedDungeon.description}</p>
            </section>
          </div>

          <h2 className="text-xl font-display font-light mb-2">Enter the dungeon</h2>
          <p className="text-sm text-fg-mid mb-6 leading-relaxed">
            Drop an <span className="text-foreground">.apkg</span> deck here. Each card becomes a
            {` ${selectedFolklore.heroName.toLowerCase()} encounter. Reveal the answer, judge yourself, and defeat the dungeon.`}
          </p>

          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`relative block cursor-pointer border border-dashed rounded-sm py-10 px-6 text-center transition-colors ${
              drag ? "border-accent" : "border-border hover:border-accent"
            }`}
          >
            <input
              type="file"
              accept=".apkg,application/zip,application/octet-stream"
              className="sr-only"
              onClick={(e) => { (e.currentTarget as HTMLInputElement).value = ""; }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {loading ? (
              <p className="font-display font-light text-lg text-fg-mid">Unsealing the deck...</p>
            ) : (
              <>
                <p className="font-display font-light text-lg mb-1">Drop .apkg here</p>
                <p className="text-[0.55rem] text-fg-dim tracking-widest uppercase">
                  or click to choose
                </p>
              </>
            )}
          </label>

          {error && (
            <p className="mt-4 text-sm text-destructive border-l-2 border-destructive pl-3">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-[0.55rem] text-fg-dim text-center tracking-widest uppercase">
          {selectedDungeon.lives === null
            ? "Study mode · no life limit"
            : `${selectedDungeon.label} · ${selectedDungeon.lives} ${selectedDungeon.lives === 1 ? "life" : "lives"}`}
        </p>
      </div>
    </div>
  );
}
