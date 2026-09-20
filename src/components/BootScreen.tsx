import { useEffect, useState } from "react";
import { IconHappyMac } from "./Icons";
import { profile } from "../data/portfolioData";
import type { BootAssets } from "../utils/useBootAssets";

const MIN_SHOW_MS = 1800;

export default function BootScreen({ assets, onDone }: { assets: BootAssets; onDone: () => void }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [fading, setFading] = useState(false);
  const ready = assets.ready && minElapsed;

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_SHOW_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setFading(true);
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [ready, onDone]);

  const downloading = assets.hasWallpaper && !assets.ready;
  const pct = assets.progress === null ? null : Math.round(assets.progress * 100);

  return (
    <div
      onClick={() => ready && onDone()}
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-5 bg-[#d8d8d8] transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      } ${ready ? "cursor-pointer" : "cursor-progress"}`}
    >
      <IconHappyMac className="h-24 w-24" />
      <p className="font-chicago text-[20px] text-black">Welcome to Macintosh</p>

      <div className="h-3 w-56 overflow-hidden border-2 border-black bg-white p-[1px]">
        {assets.hasWallpaper ? (
          pct === null ? (
            <div className="boot-indeterminate h-full w-full" />
          ) : (
            <div className="h-full bg-black" style={{ width: `${pct}%` }} />
          )
        ) : (
          <div className="h-full bg-black" style={{ animation: "boot-progress 1.6s steps(16) forwards" }} />
        )}
      </div>

      <p className="font-chicago text-[13px] text-black/60">
        {downloading
          ? pct === null
            ? "Loading your desktop…"
            : `Loading your desktop… ${pct}%`
          : ready
            ? `${profile.name} · click to continue`
            : profile.name}
      </p>

      {downloading && assets.canSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            assets.skip();
          }}
          className="font-chicago border-2 border-black bg-[#dfdfdf] px-3 py-1 text-[13px] shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:bg-black hover:text-white"
        >
          Continue without wallpaper
        </button>
      )}
    </div>
  );
}
