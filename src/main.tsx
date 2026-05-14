import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./App";
import { initTheme } from "@/lib/theme";

initTheme();

const root = document.getElementById("root")!;

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  const pre = document.createElement("pre");
  pre.style.color = "red";
  pre.style.padding = "2rem";
  pre.style.fontSize = "14px";
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = `RENDER ERROR:\n${e instanceof Error ? e.message : String(e)}`;
  root.replaceChildren(pre);
}
