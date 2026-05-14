# Yokai Dungeon

A browser game that turns an Anki `.apkg` deck into a dungeon run. Each flashcard is an enemy encounter — reveal the answer, judge yourself honestly, and cut down yokai as you advance through the deck.

**Live:** https://schmidtenoah.github.io/Anki-Webgame/

---

## How to Play

1. In Anki, export your deck: **File → Export**, select **Anki Deck Package (.apkg)**, and make sure **Include Media** is checked — otherwise any images in your cards won't show up.
2. Drop the `.apkg` file onto the upload screen.
3. For each card: read the question, hit **Draw blade · Reveal**, then judge yourself — **Hit** if you knew it, **Miss** if you didn't.
4. A correct answer slashes the yokai and moves you to the next floor. A wrong answer costs a life (you have three).
5. Clear every card to win. Lose all lives and the run ends.

Use the toggle in the top-right corner to switch between light and dark mode.

---

## What It Does

- Loads Anki `.apkg` decks directly in the browser — no account, no upload.
- Parses the Anki SQLite collection with sql.js.
- Renders question and answer HTML from the deck.
- Synthesized sound effects via the Web Audio API (no audio files).
- Light and dark theme.
- Static Vite app deployed on GitHub Pages.

---

## Privacy and Security

Everything runs locally. Your deck never leaves your browser.

- No backend, server, database, or account system.
- No network path for sending card data anywhere.
- Anki card HTML is sanitized with DOMPurify before rendering.
- Dangerous tags (`script`, `iframe`, `object`, `embed`, `svg`, `video`, `audio`) are blocked.
- Only `.apkg` files accepted through the upload UI.
- File size and content limits guard against browser freezes from oversized decks.
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

---

## Local Development

```bash
npm install
npm run dev
```

```bash
npm run build    # production build
npm run preview  # preview the build
```

The Vite base path is set to `/Anki-Webgame/` for GitHub Pages. The deployment workflow builds and publishes `dist` via GitHub Actions.

---

## A Note on Culture

I'm not Japanese — I built this out of genuine interest in the Japanese language and appreciation for its folklore and aesthetics. If anything here feels inaccurate or disrespectful, please open an issue or reach out. I'd rather fix it than get it wrong.

---

## License

MIT
