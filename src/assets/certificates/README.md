# Certificate images

Drop certificate scans or screenshots into this folder. The Achievements app discovers these files automatically during the next Vite build.

Supported file types: `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif`.

Suggested names:

- `certificate1.jpeg`
- `certificate2.jpeg`
- `certificate3.jpeg`

Numeric names are sorted naturally. You do not need to edit a file list when you add another image.

## Optional display details

For a custom certificate title, issuer, date, or verification URL, add an entry keyed by the exact filename in `CERTIFICATE_DETAILS` near the top of `src/apps/AchievementsApp.tsx`. When no metadata is supplied, the filename is used to derive a readable title.

Keep the images optimized for the web. Do not commit private verification codes or other sensitive information visible on a certificate.
