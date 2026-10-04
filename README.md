# All Hands presentation editor

A React/Vite editor and animated web presentation, with local disk saves and an offline ZIP viewer.

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/edit`. `npm run dev` prepares the offline viewer before starting Vite. `/present` opens the live deck; `/story` opens the scroll view.

## Save locally

The local development and preview servers autosave edits after a short pause to **`.local/presentation.json` in this project**. “Save to Local File” immediately writes the whole presentation there. Restarting the server or clearing browser storage does not remove that disk copy. The editor also keeps an IndexedDB recovery copy; the disk file takes priority when reopening. If a disk write failed, pending edits in browser backup are recovered when that disk file has not been changed since; the editor then retries saving them. If the local server is unavailable, the browser recovery copy still opens. Local save failures appear in the toolbar.

“Export JSON” downloads a separate editable copy to your Downloads folder. “Import” validates a JSON presentation before replacing the current deck. Speaker notes and all uploaded images are included in saves. Toolbar undo/redo is available during the current editing session. Reset requires confirmation and can be undone. Browser text undo works inside inputs; the toolbar undo groups nearby edits.

On a hosted static website, “Save to Local File” uses the browser's file picker when supported, or downloads JSON. Browser autosave is a recovery copy; it cannot silently write files to your computer. The local disk API is served only by Vite's local development/preview server.

## Share a live web presentation

1. Click **Export Web ZIP**.
2. Attach the downloaded ZIP to an email or share it through your file service.
3. The recipient **extracts the ZIP**, then double-clicks **Open Presentation.html**.

The HTML contains the live app, styling, bundled images and deck data. Slides, navigation, timer, notes, Story and Movie mode work offline without installing anything or starting a server. The ZIP also contains `presentation.json` with embedded images for continued editing, plus instructions. External quiz links require internet. External images must allow downloading; upload those images from your computer if export reports a fetch error. Email attachment limits depend on your provider.

This exports a web presentation; it does not create a `.pptx` file or send email automatically.

## Presenting

- Arrow keys / Space / Page Up / Page Down navigate; Home / End jump to the first/last slide.
- The slide selector jumps directly to a slide. Activity, group and content slides include all visible sections; “Full slide” controls whether a section shares the preceding page.
- Movie mode lists visible groups from the current deck, including custom groups.
- F toggles fullscreen; B blanks the screen; N opens speaker notes; Escape closes notes/blank screen.
- The clock shows the local time and elapsed session time.
- Timer slides support 1/3/5/10-minute rounds, custom duration, pause/resume, restart and +30 seconds. Timing uses a deadline so returning from a background tab catches up correctly.

## Build and verification

```sh
npm run build
npm run preview
npm test
npm run verify
```

The build prepares `public/portable-template.html`, then copies it into `dist/`. Both are generated, ignored files. Keep the template when deploying `dist/` to a static host so ZIP export is available. Run `npm run build` before `npm run verify`. The browser regression script tests the production preview server with an isolated temporary data directory, checks typing, disk save/reload, import validation, undo/redo, mobile layout, and opens the exported HTML offline. It also covers multiple sections, more than six mixed objects, hidden objects, business details, custom Movie groups, embedded section images, network failure and recovery after a failed disk save. Set `AHM_VERIFY_DEV=1` to check the development server instead. It uses installed Google Chrome on macOS, Playwright Chromium elsewhere, or `CHROME_PATH` when provided. Run `npx playwright install chromium` if Chromium is missing.

Local user data lives in ignored `.local/`, and is never committed. `AHM_DATA_ROOT` can redirect the local save directory, including for isolated regression tests.
