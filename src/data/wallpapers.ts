import type { CSSProperties } from "react";
import { desktop } from "./portfolioData";

type Bitmap = string[];

const BITMAPS: Record<string, Bitmap> = {
  linen: ["10101010", "00000000", "10101010", "00000000"],
  checker: ["10", "01"],
  arcs: [
    "00111100",
    "01000010",
    "10000001",
    "10000001",
    "10000001",
    "10000001",
    "01000010",
    "00111100",
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

const customFiles = import.meta.glob("../assets/wallpaper.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const customWallpaperFile: string | undefined = Object.values(customFiles)[0];

export const wallpapers: Wallpaper[] = [
  ...(customWallpaperFile ? [{ id: "custom", name: "My Wallpaper", style: {} as CSSProperties }] : []),
  { id: "amber", name: "Amber Linen", style: tile(BITMAPS.linen, "#9a5b16", "#e8d5b5", 4) },
  { id: "paper", name: "Warm Paper", style: tile(BITMAPS.checker, "#d2c4a8", "#f1e8d6", 7) },
  { id: "olive", name: "Soft Olive", style: tile(BITMAPS.dots, "#69734b", "#c9cdb2", 5) },
  { id: "terracotta", name: "Terracotta", style: tile(BITMAPS.arcs, "#8d4935", "#d7aa8c", 3) },
];

export const defaultWallpaperId = customWallpaperFile ? "custom" : desktop.defaultPattern;

function pattern(id: string): Wallpaper {
  const patterns = wallpapers.filter((w) => w.id !== "custom");
  return patterns.find((w) => w.id === id) ?? patterns.find((w) => w.id === desktop.defaultPattern) ?? patterns[0];
}

export function wallpaperStyle(id: string, customSrc?: string): CSSProperties {
  if (id === "custom") {
    return customSrc
      ? { backgroundColor: "#f1e8d6", backgroundImage: `url("${customSrc}")`, backgroundSize: "cover", backgroundPosition: "center" }
      : pattern(desktop.defaultPattern).style;
  }
  return pattern(id).style;
}
