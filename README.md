# Yokai Dungeon

Yokai Dungeon is a small browser game that turns an Anki `.apkg` deck into a dungeon run. Each flashcard becomes an enemy encounter: reveal the answer, judge yourself, and defeat yokai as you move through the deck.

Live site:

https://schmidtenoah.github.io/Anki-Webgame/

## What It Does

- Loads Anki `.apkg` decks directly in the browser.
- Extracts cards from the Anki SQLite collection.
- Displays question and answer HTML.
- Turns each card into a battle encounter.
- Plays lightweight synthesized sound effects with the Web Audio API.
- Supports light and dark theme switching.
- Deploys as a static Vite app on GitHub Pages.

## Privacy And Security

Yokai Dungeon is local-first. Deck files are processed in the user's browser and are not uploaded to a server by this app.

Security measures in place:

- No backend server, database, API, or account system.
- No network upload path for user decks.
- No `fetch`, WebSocket, beacon, or similar code path for sending card data out.
- Anki card HTML is sanitized with DOMPurify before rendering.
- Dangerous card tags such as `script`, `iframe`, `object`, `embed`, `svg`, `video`, and `audio` are blocked.
- Only `.apkg` files are accepted through the upload UI.
- File size and extracted content limits are enforced to reduce browser-freeze risk from oversized decks.
- Deck media is served through temporary browser object URLs and cleaned up when a new deck is loaded.
- `npm audit` currently reports `0 vulnerabilities`.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- sql.js
- JSZip
- DOMPurify
- fzstd

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## GitHub Pages Deployment

This repo is configured for GitHub Pages deployment through GitHub Actions.

The Vite base path is set to:

```ts
base: "/Anki-Webgame/"
```

The deployment workflow builds the app and publishes the `dist` folder to GitHub Pages.

## License

MIT
