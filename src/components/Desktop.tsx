import { memo, useEffect } from "react";
import MenuBar from "./MenuBar";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import { FileIcon, IconTrash } from "./Icons";
import { useWindowManager } from "../context/WindowManagerContext";
import { useSystem } from "../context/SystemContext";
import { APPS, useOpenApp } from "../apps/appDefs";
import { renderAppContent } from "../apps/AppRegistry";
import { wallpaperStyle } from "../data/wallpapers";
import { useCoarsePointer } from "../utils/useCoarsePointer";
import type { AppId, WindowInstance } from "../types";

// Order on the desktop: top-right first, then down (and wrapping left on short screens).
const DESKTOP_APPS: AppId[] = [
  "finder",
  "about",
  "readme",
  "projects",
  "skills",
  "experience",
  "education",
  "terminal",
  "contact",
  "resume",
];

// Window contents only re-render when their own window changes, so dragging or
// resizing one window doesn't re-render every open app (e.g. the Terminal).
const WindowBody = memo(
  function WindowBody({ win }: { win: WindowInstance }) {
    return renderAppContent(win);
  },
  (a, b) => a.win.id === b.win.id && a.win.appId === b.win.appId && a.win.payload === b.win.payload
);

export default function Desktop() {
  const { windows } = useWindowManager();
  const { wallpaperId, customWallpaperSrc, trashEmpty, isShutDown } = useSystem();
  const openApp = useOpenApp();
  const coarse = useCoarsePointer();

  // Greet visitors with the About window (skipped on phones, where it would fill the screen).
  useEffect(() => {
    if (window.innerWidth < 640) return;
    const t = setTimeout(() => openApp("about"), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = wallpaperStyle(wallpaperId, customWallpaperSrc);

  return (
    <div className="fixed inset-0 overflow-hidden" style={style}>
      <MenuBar />

      {/* Desktop icons */}
      <div className="absolute top-8 right-2 bottom-24 flex flex-col flex-wrap-reverse content-start gap-x-0 gap-y-0 max-sm:right-1 max-sm:left-1 max-sm:grid max-sm:grid-cols-4 max-sm:content-start max-sm:justify-items-center">
        {DESKTOP_APPS.map((id) => (
          <DesktopIcon
            key={id}
            label={APPS[id].label}
            icon={<FileIcon kind={APPS[id].icon} className="h-full w-full" />}
            onOpen={() => openApp(id)}
          />
        ))}
      </div>

      <div className="absolute right-2 bottom-6">
        <DesktopIcon
          label="Trash"
          icon={<IconTrash className="h-full w-full" full={!trashEmpty} />}
          onOpen={() => openApp("trash")}
        />
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} win={win}>
          <WindowBody win={win} />
        </Window>
      ))}

      <div
        className="font-chicago pointer-events-none absolute bottom-2 left-3 text-[13px] text-white"
        style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000" }}
      >
        {coarse ? "Tap an icon to open it" : "Double-click an icon to open it · drag title bars to move windows"}
      </div>

      {isShutDown && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="fixed inset-0 z-[100000] flex cursor-pointer items-center justify-center bg-black p-8 text-center"
        >
          <span className="font-chicago max-w-md text-[18px] leading-relaxed text-white">
            It is now safe to switch off your Macintosh.
            <br />
            <span className="text-[13px] text-white/50">(Click anywhere to restart.)</span>
          </span>
        </button>
      )}
    </div>
  );
}
