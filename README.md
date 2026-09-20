# Retro Macintosh Portfolio

A portfolio that looks like a classic Macintosh (System 7) desktop.
React 19 + Vite + Tailwind 4, no backend.

```bash
npm install
npm run dev        # local dev server
npm run build      # outputs the static site to dist/
```

## Make it yours

Everything on the desktop reads from **one file: `src/data/portfolioData.ts`**.
It is all placeholder text right now:

| Icon | What opens | Edit in `portfolioData.ts` |
| --- | --- | --- |
| About Me | Intro, interests, personality | `profile` |
| Terminal.exe | Working CLI (`help`, `ls`, `cat`, `open`, `neofetch`, `theme`...) | reads everything below |
| My Computer | File explorer with Projects / Skills / Education / Experience folders | built from the data |
| README.txt | Text-file intro | `readmeText()` |
| My Projects | Project icons, each with a detail window | `projects` (`kind`: web, game, chip, code) |
| Skills.exe | Launches with a progress bar, then level meters | `skillGroups` (levels 1-10) |
| Education | Retro web-browser page | `education` |
| Experience | Finder-style list view with expandable rows | `experience` |
| Trash | Easter egg: deleted projects and failed ideas | `trashItems` |
| Contact Me | Contact card + mail form | `socials` |
| Guestbook (My Computer, Apple menu) | Visitor messages saved to a Google Sheet | `guestbook.endpoint` |
| Resume.pdf | Embedded PDF viewer with download | put your CV at `public/resume.pdf` |

### Your real resume
Replace `public/resume.pdf` with your own file (keep the name), and set
`resume.downloadName` in `portfolioData.ts`. Phones can't show PDFs inline, so
they get a text version generated from your data plus the Download button.

### Wallpaper
Pick a built-in pattern from **Special** in the menu bar, or set the default with
`desktop.defaultPattern`. To use your own image, save it as
**`src/assets/wallpaper.png`** (`.jpg`, `.jpeg` and `.webp` also work). It is picked up
automatically, becomes the default desktop, and shows up as "My Wallpaper" in the
Special menu. Use 1920x1080 or larger, ideally under 2 MB.
New patterns are a few lines in `src/data/wallpapers.ts`.

### Icons
All icons are hand-drawn pixel art in `src/components/Icons.tsx` (32x32 grid).

## Guestbook backend (Google Sheets)

The site is static, so visitor messages go to a Google Sheet through a tiny Google Apps
Script web app (free, no server to run).

1. Create a new Google Sheet (name it anything).
2. **Extensions > Apps Script**. Delete the sample code and paste in
   `backend/google-apps-script.gs`. Save.
3. **Deploy > New deployment > Select type: Web app.** Set *Execute as*: **Me** and
   *Who has access*: **Anyone**. Click Deploy and approve the permissions (Google shows an
   "unverified app" warning for your own script; choose Advanced > Continue).
4. Copy the **Web app URL** (ends in `/exec`) and paste it into `guestbook.endpoint` in
   `src/data/portfolioData.ts`.
5. Rebuild/redeploy. Messages appear in an **Entries** tab (created automatically).

Moderation: set a row's *Status* cell from `visible` to `hidden` and it disappears from the site.
If you later edit the script, use **Deploy > Manage deployments > Edit > New version** so the
change goes live at the same URL.
The site limits message length, adds a 30-second cooldown per visitor, and includes a
hidden bot trap; the script also stores text as plain text so nothing can run as a formula.
The URL is public by nature (it's in your site's code), so treat it like a public form.
Until you set `endpoint`, the guestbook works but only saves on the visitor's own device.

## Deploy to GitHub Pages

This is a static site, so GitHub Pages works.

1. Push the project to a GitHub repo (branch `main`).
2. Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Push again (or run the workflow from the Actions tab). `.github/workflows/deploy.yml`
   builds the site and publishes it at `https://<username>.github.io/<repo-name>/`.

Asset paths are relative (`base: "./"` in `vite.config.ts`), so no other setup is needed for
a project page, a `<username>.github.io` repo, or a custom domain.

## Notes
- Windows drag by the title bar, resize from the bottom-right corner, roll up with the
  right-hand box (or double-click the title bar).
- On touch devices a single tap opens icons and windows open full-screen.
- Fonts (Pixelify Sans, VT323) are bundled, so nothing loads from Google Fonts.
