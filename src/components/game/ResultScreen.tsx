import { sfx } from "@/lib/sfx";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { CSSProperties } from "react";

interface Props {
  title: string;
  glyph: string;
  subtitle: string;
  detail?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  variant?: "victory" | "defeat";
  dark: boolean;
  onToggleTheme: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  accent: string;
}

export function ResultScreen({
  title,
  glyph,
  subtitle,
  detail,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  variant = "victory",
  dark,
  onToggleTheme,
  soundMuted,
  onToggleSound,
  accent,
}: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ "--lore-accent": accent } as CSSProperties}
    >
      {/* Toggle - top right */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <SoundToggle muted={soundMuted} onToggle={onToggleSound} />
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>

      {/* Massive BG glyph */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center vertical-jp font-display select-none pointer-events-none bg-kanji"
        style={{ fontSize: "28rem" }}
      >
        {glyph}
      </div>

      <div className="card-surface relative p-10 max-w-lg w-full text-center animate-fade-in-soft">
        <p className="text-[0.55rem] uppercase tracking-[0.4em] text-fg-dim mb-3">
          {variant === "victory" ? "Victory" : "Defeat"}
        </p>
        <h1 className="font-display font-light text-4xl mb-4">{title}</h1>

        {/* Thin center rule */}
        <div
          className="w-8 mx-auto mb-4"
          style={{ height: "1px", background: "var(--rule)" }}
        />

        <p className="text-sm text-fg-mid leading-relaxed mb-2">{subtitle}</p>
        {detail && <p className="text-sm mb-6" style={{ color: "var(--fg-dim)" }}>{detail}</p>}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { sfx.click(); onPrimary(); }}
            className="ui-button px-6 py-3 font-display font-light tracking-widest text-[0.55rem] uppercase"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              onClick={() => { sfx.click(); onSecondary(); }}
              className="ui-button px-6 py-3 font-display font-light tracking-widest text-[0.55rem] uppercase"
              style={{ border: "1px solid var(--card-border)", color: "var(--fg-mid)" }}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
