// Shrinks src/assets/wallpaper.(png|jpg|jpeg|webp) into a web-friendly WebP.
//   npm run optimize-wallpaper
// The original is kept as src/assets/wallpaper-original.<ext> (ignored by git).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("src/assets");
const exts = ["png", "jpg", "jpeg", "webp"];
const found = exts.map((e) => path.join(dir, `wallpaper.${e}`)).find((f) => fs.existsSync(f));

if (!found) {
  console.error("No wallpaper found. Save your image as src/assets/wallpaper.png (or .jpg/.jpeg/.webp) first.");
  process.exit(1);
}

const ext = path.extname(found).slice(1);
const backup = path.join(dir, `wallpaper-original.${ext}`);
const out = path.join(dir, "wallpaper.webp");
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2) + " MB";

// Keep the untouched original next to it (never overwrite an existing backup).
const source = fs.existsSync(backup) ? backup : found;
if (source === found) fs.renameSync(found, backup);
else if (found !== out) fs.rmSync(found);

const before = fs.statSync(backup).size;
const info = await sharp(backup)
  .rotate()
  .resize({ width: 2560, height: 1440, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(out + ".tmp");
fs.renameSync(out + ".tmp", out);

console.log(`wallpaper: ${mb(before)} -> ${mb(info.size)} (${info.width}x${info.height}, WebP)`);
console.log(`original kept at ${path.relative(process.cwd(), backup)}`);
