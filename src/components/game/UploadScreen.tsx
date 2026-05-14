import { useCallback, useState } from "react";
import { parseApkg, type Flashcard } from "@/lib/apkg";
import { sfx } from "@/lib/sfx";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const MAX_APKG_SIZE = 100 * 1024 * 1024;

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
  onLoaded: (cards: Flashcard[]) => void;
}

export function UploadScreen({ dark, onToggleTheme, onLoaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background kanji */}
      <div
        aria-hidden
        className="absolute right-6 top-6 vertical-jp text-[10rem] leading-none font-display select-none pointer-events-none bg-kanji"
      >
        天狗
      </div>
      <div
        aria-hidden
        className="absolute left-6 bottom-6 vertical-jp text-[8rem] leading-none font-display select-none pointer-events-none bg-kanji"
      >
        河童
      </div>

      <div className="relative w-full max-w-xl animate-ink">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="seal h-10 w-10 text-lg">鬼</span>
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-fg-dim">Anki Dungeon</p>
              <h1 className="text-2xl font-display font-light">Yokai Dungeon</h1>
            </div>
          </div>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        </div>

        {/* Card */}
        <div className="card-surface p-8 md:p-10">
          <h2 className="text-xl font-display font-light mb-2">Enter the dungeon</h2>
          <p className="text-sm text-fg-mid mb-6 leading-relaxed">
            Drop an <span className="text-foreground">.apkg</span> deck here. Each card becomes a
            yokai. Reveal the answer, judge yourself, and defeat the dungeon.
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
          一期一会 · One encounter, one chance
        </p>
      </div>
    </div>
  );
}
