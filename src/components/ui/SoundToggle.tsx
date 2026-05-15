interface Props {
  muted: boolean;
  onToggle: () => void;
}

export function SoundToggle({ muted, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      title={muted ? "Turn sound on" : "Turn sound off"}
      className="ui-button subtle-button flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem]"
      style={{
        background: "var(--toggle-bg)",
        border: "1px solid var(--toggle-border)",
        color: "var(--toggle-text)",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          background: muted ? "transparent" : "var(--foreground)",
          color: muted ? "var(--toggle-text)" : "var(--background)",
          boxShadow: muted ? "0 0 0 1px var(--toggle-border)" : "none",
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        >
          <path d="M3.5 8v4h3l4 3V5l-4 3h-3z" />
          {muted ? (
            <>
              <path d="M14 8l3 4" />
              <path d="M17 8l-3 4" />
            </>
          ) : (
            <>
              <path d="M13.5 7.5c.7.7 1 1.5 1 2.5s-.3 1.8-1 2.5" />
              <path d="M15.8 5.5c1.2 1.2 1.8 2.7 1.8 4.5s-.6 3.3-1.8 4.5" />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}
