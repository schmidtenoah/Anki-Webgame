import { useCallback, useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";

const SOUND_STORAGE_KEY = "sound-muted";

function getInitialMuted(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
}

export function useSound() {
  const [muted, setMuted] = useState(getInitialMuted);

  useEffect(() => {
    sfx.setMuted(muted);
    localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
  }, [muted]);

  const toggle = useCallback(() => {
    setMuted((value) => {
      const next = !value;
      sfx.setMuted(next);
      if (!next) sfx.click();
      return next;
    });
  }, []);

  return { muted, toggle };
}
