interface Props {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.55rem] uppercase tracking-[0.25em] transition-colors"
      style={{
        background: "var(--toggle-bg)",
        border: "1px solid var(--toggle-border)",
        color: "var(--toggle-text)",
        cursor: "pointer",
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full text-[0.65rem]"
        style={{
          background: dark ? "#1e1a16" : "#f5f1eb",
          color: dark ? "#c8bfb4" : "#1e1a14",
          boxShadow: dark ? "none" : "0 0 0 1px rgba(30,26,20,0.12)",
        }}
      >
        {dark ? "☀" : "☽"}
      </span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
