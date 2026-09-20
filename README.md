# Retro Macintosh Portfolio

A portfolio that looks like a classic Macintosh (System 7) desktop.
React 19 + Vite + Tailwind 4. It is a static site (works on GitHub Pages); the guestbook
and the AI assistant use one small Google Apps Script backend.

```bash
npm install
npm run dev                 # local dev server
npm run build               # static site in dist/
npm run optimize-wallpaper  # shrink src/assets/wallpaper.* (see Wallpaper)
```

## Make it yours

Everything on the desktop reads from **one file: `src/data/portfolioData.ts`**.
It is all placeholder text right now:

| Icon | What opens | Edit in `portfolioData.ts` |
| --- | --- | --- |
| About Me | Intro, interests, personality | `profile` |
| Terminal.exe | Working CLI **plus an AI assistant** (`ask`, `chat`) | reads everything below |
| My Computer | File explorer with Projects / Skills / Education / Experience folders | built from the data |
| README.txt | Text-file intro | `readmeText()` |
| My Projects | Project icons, each with a detail window | `projects` (`kind`: web, game, chip, code) |
| Skills.exe | Launches with a progress bar, then level meters | `skillGroups` (levels 1-10) |
| Education | Retro web-browser page | `education` |
| Experience | Finder-style list view with expandable rows | `experience` |
| Trash | Easter egg: deleted projects and failed ideas | `trashItems` |
| Contact Me | Contact card + mail form | `socials` |
| Resume.pdf | Embedded PDF viewer with download | put your CV at `public/resume.pdf` |
| Guestbook (My Computer, Apple menu) | Visitor messages saved to a Google Sheet | `backend.endpoint` |

### Your real resume
Replace `public/resume.pdf` with your own file (keep the name) and set
`resume.downloadName`. Phones can't show PDFs inline, so they get a text version generated
from your data plus a Download button. Keep the PDF small (a few hundred KB).

### Wallpaper
Save your image as **`src/assets/wallpaper.png`** (`.jpg`, `.jpeg`, `.webp` also work). It is
picked up automatically and becomes the default desktop ("My Wallpaper" in the Special menu).

- **Loading gate:** while it downloads, visitors see the "Welcome to Macintosh" boot screen
  with a real progress bar, and nothing on the desktop can be clicked or tabbed to. If the
  download fails, the desktop falls back to a pattern. After 15 seconds a "Continue without
  wallpaper" button appears for very slow connections; set `SKIP_AFTER_MS` to `Infinity` in
  `src/utils/useBootAssets.ts` to remove it.
- **Make it small:** run `npm run optimize-wallpaper`. It converts the image to WebP (max
  2560x1440, quality 82) and keeps your original as `wallpaper-original.*`, which git ignores.
  A 7 MB wallpaper usually drops to a few hundred KB. Without a custom image, pick a built-in
  pattern from the Special menu or set `desktop.defaultPattern`.

## The backend (Google Sheet + AI assistant)

One Google Apps Script web app handles both features, and it is free.

1. Create a new Google Sheet.
2. **Extensions > Apps Script.** Delete the sample code, paste in `backend/google-apps-script.gs`, save.
3. *(For the AI assistant)* **Project Settings (gear icon) > Script properties > Add script
   property:** name `GROQ_API_KEY`, value = your key from https://console.groq.com/keys.
4. **Deploy > New deployment > Web app.** *Execute as*: **Me**, *Who has access*: **Anyone**.
   Deploy and approve the permissions (Google shows an "unverified app" warning for your own
   script: Advanced > Continue). The AI needs the "connect to an external service" permission.
5. Copy the **Web app URL** (ends in `/exec`) into `backend.endpoint` in `src/data/portfolioData.ts`.
6. Rebuild/redeploy the site.

If you edit the script later, use **Deploy > Manage deployments > Edit > New version** so the
change goes live at the same URL.

### Sheet columns
The script creates everything itself the first time it runs, so you don't need to set up
columns by hand. The **Entries** tab has four:

| A: Timestamp | B: Name | C: Message | D: Status |
| --- | --- | --- | --- |
| filled automatically | visitor's name | visitor's message | `visible` (set to `hidden` to remove it from the site) |

Don't insert columns before D. Extra columns to the right (e.g. `Notes`) are ignored. If you
set `LOG_CHATS = true` at the top of the script, a second **Chats** tab records
`Timestamp | Question | Reply` for every AI conversation. It's off by default; if you turn it
on, tell visitors their questions are saved.

### AI assistant (Groq)
In **Terminal.exe**: `ask <question>` for a single question, or `chat` to talk until you type
`exit`. It answers from the facts in `portfolioData.ts` (built by `src/data/aiContext.ts`), so
update that file and the assistant stays in sync. Change the name it uses with `ai.name`.

**Why the key is not in GitHub Secrets:** a static site (GitHub Pages) has no server, so any
key put into the build, including one from GitHub Secrets, ends up in the downloaded
JavaScript where anyone can read it and use your quota. Instead the key lives in the Apps
Script's private *Script properties*; the browser talks to the script and the script talks to
Groq. GitHub Secrets is the right tool for deploy-time credentials, not secrets a browser needs
at run time. Never put the key in `portfolioData.ts`, a `.env` file that gets built, or the repo.

Abuse protection is built into the script: at most 15 AI requests a minute and 300 a day across
all visitors (`MAX_CHATS_PER_MINUTE`, `MAX_CHATS_PER_DAY`), short replies, trimmed history, and a
fixed system prompt that keeps it on topic. The model is `openai/gpt-oss-20b` (`GROQ_MODEL` at the
top of the script). Groq retires models from time to time (it shut down the Llama 3.1 8B and 3.3
70B ones in August 2026), so if the assistant starts failing, check https://console.groq.com/docs/models
and update that one line.

## Deploy to GitHub Pages

1. Push the project to a GitHub repo (branch `main`).
2. Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Push again (or run the workflow from the Actions tab). `.github/workflows/deploy.yml`
   builds the site and publishes it at `https://<username>.github.io/<repo-name>/`.

Asset paths are relative (`base: "./"`), so the same build works for a project page, a
`<username>.github.io` repo, or a custom domain. No secrets are needed for the build.

## Performance notes
- Each app window is its own small chunk, downloaded the first time it opens; the first load
  is only the desktop, About window and fonts (~80 KB gzipped of JavaScript).
- Dragging or resizing a window doesn't re-render the other open windows.
- The guestbook shows the last messages it saw instantly and refreshes them in the background
  (Apps Script can take a second or two to answer).
- Fonts are bundled (no Google Fonts request) and the boot screen waits for them, so text never flashes.
- Biggest wins are in your assets: optimize the wallpaper and keep `resume.pdf` small.

## Notes
- Windows drag by the title bar, resize from the bottom-right corner, roll up with the
  right-hand box (or double-click the title bar).
- On touch devices a single tap opens icons and windows open full-screen.
- Add a link-preview image by adding an `og:image` tag in `index.html` (there's a comment showing where).
