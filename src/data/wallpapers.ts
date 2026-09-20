import type { CSSProperties } from "react";
import { desktop } from "./portfolioData";

// ---------------------------------------------------------------------------
// Desktop patterns. Each one is a tiny 1-bit bitmap (like the originals in the
// "Desktop Patterns" control panel) tiled across the screen and drawn with
// crisp, unsmoothed pixels. Add your own by adding a bitmap + two colors.
// ---------------------------------------------------------------------------

type Bitmap = string[];

const BITMAPS: Record<string, Bitmap> = {
  lattice: [
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00011000",
    "00100100",
    "01000010",
    "10000001",
  ],
  checker: ["10", "01"],
  bricks: [
    "11111111",
    "10000000",
    "10000000",
    "10000000",
    "11111111",
    "00001000",
    "00001000",
    "00001000",
  ],
  dots: ["1000", "0000", "0010", "0000"],
};

function tile(bitmap: Bitmap, fg: string, bg: string, scale = 2): CSSProperties {
  const h = bitmap.length;
  const w = bitmap[0].length;
  let rects = "";
  bitmap.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === "1") rects += `<rect x='${x}' y='${y}' width='1' height='1'/>`;
    })
  );
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' shape-rendering='crispEdges'>` +
    `<rect width='${w}' height='${h}' fill='${bg}'/><g fill='${fg}'>${rects}</g></svg>`;
  return {
    backgroundColor: bg,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${w * scale}px ${h * scale}px`,
    imageRendering: "pixelated",
  };
}

export interface Wallpaper {
  id: string;
  name: string;
  style: CSSProperties;
}

// Your own wallpaper: save an image as src/assets/wallpaper.png (or .jpg/.jpeg/.webp)
// and it is picked up automatically. If no file exists this stays undefined.
// The file is downloaded during the boot screen (see utils/useBootAssets.ts), so
// visitors only reach the desktop once it's ready.
const customFiles = import.meta.glob("../assets/wallpaper.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const customWallpaperFile: string | undefined = Object.values(customFiles)[0];

export const wallpapers: Wallpaper[] = [
  ...(customWallpaperFile ? [{ id: "custom", name: "My Wallpaper", style: {} as CSSProperties }] : []),
  { id: "blue", name: "Blue Lattice", style: tile(BITMAPS.lattice, "#5361c2", "#7b88d8") },
  { id: "gray", name: "Gray Checker", style: tile(BITMAPS.checker, "#5a5a5a", "#b8b8b8") },
  { id: "teal", name: "Teal Dots", style: tile(BITMAPS.dots, "#1f6f6f", "#3b9a9a", 3) },
  { id: "bricks", name: "Bricks", style: tile(BITMAPS.bricks, "#5a2e22", "#b5694f") },
];

/** Your own wallpaper if you added one, otherwise the pattern set in portfolioData.ts. */
export const defaultWallpaperId = customWallpaperFile ? "custom" : desktop.defaultPattern;

function pattern(id: string): Wallpaper {
  const patterns = wallpapers.filter((w) => w.id !== "custom");
  return patterns.find((w) => w.id === id) ?? patterns.find((w) => w.id === desktop.defaultPattern) ?? patterns[0];
}

/** `customSrc` is the already-downloaded wallpaper (an object URL), if there is one. */
export function wallpaperStyle(id: string, customSrc?: string): CSSProperties {
  if (id === "custom") {
    return customSrc
      ? {
          backgroundColor: "#000",
          backgroundImage: `url("${customSrc}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : pattern(desktop.defaultPattern).style;
  }
  return pattern(id).style;
}
