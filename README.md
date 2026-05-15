# Anki Lore Dungeon

A browser game that turns an Anki `.apkg` deck into a folklore dungeon run. Pick a lore theme, choose a difficulty dungeon, reveal each answer, judge yourself honestly, and push through the deck.

**Live:** https://schmidtenoah.github.io/Anki-Webgame/

---

## How to Play

1. In Anki, export your deck: **File → Export**, select **Anki Deck Package (.apkg)**, and make sure **Include Media** is checked - otherwise any images in your cards won't show up.
2. Pick a folklore theme and dungeon difficulty, then drop the `.apkg` file onto the upload screen.
3. For each card: read the question, hit **Draw blade · Reveal**, then judge yourself - **Hit** if you knew it, **Miss** if you didn't.
4. Dungeon 0 is practice mode with infinite lives. Later dungeons get stricter: 5, 3, 2, then 1 life.
5. Clear every card to win. In finite-life dungeons, lose all lives and the run ends.

Use the toggles in the top-right corner to switch theme or mute sound.

---

## What It Does

- Loads Anki `.apkg` decks directly in the browser - no account, no upload.
- Parses the Anki SQLite collection with sql.js.
- Renders question and answer HTML from the deck.
- Offers Japanese, Nordic, and Celtic folklore themes through one shared configuration model.
- Includes five dungeon difficulties from infinite-life practice to one-life exam mode.
- Synthesized sound effects via the Web Audio API (no audio files).
- Light/dark theme and persistent sound mute.
- Static Vite app deployed on GitHub Pages.

---

## Privacy and Security

Everything runs locally. Your deck never leaves your browser.

- No backend, server, database, or account system.
- No network path for sending card data anywhere.
- Anki card HTML is sanitized with DOMPurify before rendering.
- Dangerous tags (`script`, `iframe`, `object`, `embed`, `svg`, `video`, `audio`) are blocked.
- Only `.apkg` files accepted through the upload UI.
- File size, collection size, media count, per-media, and total-media limits guard against browser freezes from oversized decks.
- Deck media is served through temporary object URLs and cleaned up when a new deck loads.
- `npm audit` reports `0 vulnerabilities`.

---

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- sql.js
- JSZip
- DOMPurify
- fzstd
- Vitest

---

## Local Development

```bash
npm install
npm run dev
```

```bash
npm test         # unit tests for game rules/config
npm run build    # production build
npm run preview  # preview the build
```

The Vite base path is set to `/Anki-Webgame/` for GitHub Pages. The deployment workflow builds and publishes `dist` via GitHub Actions.

---

## A Note on Folklore

The folklore themes are stylized game skins, not academic references. If any description feels inaccurate or disrespectful, please open an issue so it can be improved.

---

## License

MIT
