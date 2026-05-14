export function initTheme(): void {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = saved !== null ? saved === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", dark);
}

export function toggleTheme(): void {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}
