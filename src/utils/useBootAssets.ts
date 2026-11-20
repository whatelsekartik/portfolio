import { useCallback, useEffect, useRef, useState } from "react";
import { customWallpaperFile } from "../data/wallpapers";

/**
 * After this long on a very slow connection the boot screen offers a
 * "Continue without wallpaper" button. Set to Infinity to always make visitors wait.
 */
export const SKIP_AFTER_MS = 15_000;

export interface BootAssets {
  /** True when a custom wallpaper has to be downloaded first. */
  hasWallpaper: boolean;
  /** 0..1 while downloading, or null when the server didn't say how big the file is. */
  progress: number | null;
  /** Wallpaper (as an object URL) and fonts are ready, or loading was skipped/failed. */
  ready: boolean;
  wallpaperSrc?: string;
  canSkip: boolean;
  skip: () => void;
}

async function downloadWithProgress(
  url: string,
  signal: AbortSignal,
  onProgress: (p: number | null) => void
): Promise<Blob> {
  const res = await fetch(url, { signal });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  const total = Number(res.headers.get("Content-Length")) || 0;
  const type = res.headers.get("Content-Type") || "image/*";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress(total ? Math.min(loaded / total, 1) : null);
  }
  return new Blob(chunks as unknown as BlobPart[], { type });
}

/** The fonts are small, but waiting for them avoids a flash of the wrong typeface. */
function loadFonts(): Promise<unknown> {
  const fonts = document.fonts;
  if (!fonts) return Promise.resolve();
  return Promise.race([
    Promise.all([fonts.load('16px "Pixelify Sans"'), fonts.load('700 16px "Pixelify Sans"'), fonts.load('19px "VT323"')]),
    new Promise((resolve) => setTimeout(resolve, 4000)),
  ]).catch(() => undefined);
}

export function useBootAssets(): BootAssets {
  const hasWallpaper = Boolean(customWallpaperFile);
  const [progress, setProgress] = useState<number | null>(hasWallpaper ? 0 : 1);
  const [wallpaperSrc, setWallpaperSrc] = useState<string>();
  const [wallpaperSettled, setWallpaperSettled] = useState(!hasWallpaper);
  const [fontsSettled, setFontsSettled] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadFonts().then(() => !cancelled && setFontsSettled(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!customWallpaperFile) return;
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const blob = await downloadWithProgress(customWallpaperFile, controller.signal, setProgress);
        const objectUrl = URL.createObjectURL(blob);
        // Decode it now so the desktop appears fully painted, not drawing in line by line.
        const img = new Image();
        img.src = objectUrl;
        await img.decode();
        if (controller.signal.aborted) return;
        setWallpaperSrc(objectUrl);
        setProgress(1);
      } catch {
        // Aborted (skip / dev remount) or failed: the desktop falls back to a pattern.
        if (controller.signal.aborted && abortRef.current === controller) return;
      }
      if (!controller.signal.aborted) setWallpaperSettled(true);
    })();

    const t = SKIP_AFTER_MS === Infinity ? undefined : setTimeout(() => setCanSkip(true), SKIP_AFTER_MS);
    return () => {
      controller.abort();
      if (t) clearTimeout(t);
    };
  }, []);

  const skip = useCallback(() => {
    abortRef.current?.abort();
    setWallpaperSettled(true);
  }, []);

  return {
    hasWallpaper,
    progress,
    ready: wallpaperSettled && fontsSettled,
    wallpaperSrc,
    canSkip,
    skip,
  };
}
