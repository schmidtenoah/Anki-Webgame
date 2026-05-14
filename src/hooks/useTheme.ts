import { useCallback, useState } from "react";
import { toggleTheme, isDark } from "@/lib/theme";

export function useTheme() {
  const [dark, setDark] = useState(isDark);

  const toggle = useCallback(() => {
    toggleTheme();
    setDark(isDark());
  }, []);

  return { dark, toggle };
}
