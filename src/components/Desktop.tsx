import { memo, useEffect, useRef, useState } from "react";
import MenuBar from "./MenuBar";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import WelcomeCard from "./WelcomeCard";
import { FileIcon, IconTrash } from "./Icons";
import { useWindowManager } from "../context/WindowManagerContext";
import { useSystem } from "../context/SystemContext";
import { APPS, readAppRoute, useOpenApp, writeAppRoute } from "../apps/appDefs";
import { renderAppContent } from "../apps/AppRegistry";
import { wallpaperStyle } from "../data/wallpapers";
import { useCoarsePointer } from "../utils/useCoarsePointer";
import type { AppId, WindowInstance } from "../types";
const DESKTOP_APPS: AppId[] = ["finder", "projects", "resume", "contact", "about", "readme", "contributions", "skills", "experience", "education", "achievements", "terminal"];
const MOBILE_APPS: AppId[] = ["finder", "projects", "resume", "contact"];
const WELCOME_KEY = "mac-portfolio-welcome-seen-v1";
const DOCK_APPS: AppId[] = ["projects", "contributions", "achievements", "education", "skills", "terminal"];
const WindowBody = memo(function WindowBody({ win }: { win: WindowInstance }) { return renderAppContent(win); },
  (a, b) => a.win.id === b.win.id && a.win.appId === b.win.appId && a.win.payload === b.win.payload);

export default function Desktop({ onOpenRecruiterView, ready }: { onOpenRecruiterView: () => void; ready: boolean }) {
  const { windows, activeWindowId, closeWindow, minimizeWindow } = useWindowManager();
  const { wallpaperId, customWallpaperSrc, trashEmpty, isShutDown } = useSystem();
  const openApp = useOpenApp(), coarse = useCoarsePointer();
  // Capture the initial route before workspace synchronization can rewrite the hash.
  const initialRoute = useRef(readAppRoute());
  const [showWelcome, setShowWelcome] = useState(() => {
    if (readAppRoute() || windows.length > 0) return false;
    try { return localStorage.getItem(WELCOME_KEY) !== "1"; } catch { return true; }
  });
  function dismissWelcome() {
    setShowWelcome(false);
    try { localStorage.setItem(WELCOME_KEY, "1"); } catch { /* Browsing without storage still works. */ }
  }
  // A share URL takes precedence over a saved workspace; otherwise the window manager restores the desktop.
  useEffect(() => {
    const route = initialRoute.current;
    if (route) { openApp(route.appId, route.payload, { history: "none" }); return; }
    if (!showWelcome && window.innerWidth >= 640 && windows.length === 0) {
      const timer = window.setTimeout(() => openApp("about", undefined, { history: "replace" }), 150);
      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    function onPopState() {
      const route = readAppRoute();
      if (route) { openApp(route.appId, route.payload, { history: "none" }); return; }
      windows.forEach(win => closeWindow(win.id));
    }
    window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState);
  }, [windows, closeWindow, openApp]);
  useEffect(() => {
    const active = windows.find(win => win.id === activeWindowId && !win.isMinimized);
    if (initialRoute.current) {
      const route = initialRoute.current;
      if (!active || active.appId !== route.appId || JSON.stringify(active.payload ?? {}) !== JSON.stringify(route.payload ?? {})) return;
      initialRoute.current = null;
    }
    if (active) writeAppRoute(active.appId, active.payload, "replace");
    else if (window.location.hash.startsWith("#/")) window.history.replaceState({}, "", window.location.pathname + window.location.search);
  }, [windows, activeWindowId]);
  useEffect(() => {
    function onShortcut(e: KeyboardEvent) {
      const target = e.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || Boolean(target.closest("input, textarea, select, [contenteditable='true']")));
      if (editing || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || !activeWindowId) return;
      const key = e.key.toLowerCase();
      if (key === "w") { e.preventDefault(); closeWindow(activeWindowId); }
      else if (key === "m") { e.preventDefault(); minimizeWindow(activeWindowId); }
    }
    window.addEventListener("keydown", onShortcut); return () => window.removeEventListener("keydown", onShortcut);
  }, [activeWindowId, closeWindow, minimizeWindow]);
  const style = wallpaperStyle(wallpaperId, customWallpaperSrc);
  return <main className="fixed inset-0 overflow-hidden" style={style} aria-label="Interactive portfolio desktop">
    <div className="desktop-atmosphere" aria-hidden="true" /><MenuBar onOpenRecruiterView={onOpenRecruiterView} onOpenWelcome={() => setShowWelcome(true)} />
    <div role="group" aria-label="Desktop applications" className="desktop-icon-grid absolute top-8 right-2 bottom-24 flex flex-col flex-wrap-reverse content-start gap-x-0 gap-y-0 max-sm:right-1 max-sm:left-1 max-sm:bottom-20 max-sm:grid max-sm:grid-cols-3 max-sm:gap-y-2 max-sm:content-start max-sm:justify-items-center max-sm:overflow-y-auto max-sm:overflow-x-hidden max-sm:overscroll-contain">
      {DESKTOP_APPS.map(id => <div key={id} className={MOBILE_APPS.includes(id) ? "" : "max-sm:hidden"}><DesktopIcon label={APPS[id].label} icon={<FileIcon kind={APPS[id].icon} className="h-full w-full" />} onOpen={() => openApp(id)} /></div>)}
    </div>
    <div className="absolute right-2 bottom-6 max-sm:hidden"><DesktopIcon label="Trash" icon={<IconTrash className="h-full w-full" full={!trashEmpty} />} onOpen={() => openApp("trash")} /></div>
    <nav className="desktop-dock" aria-label="Quick launch">
      {DOCK_APPS.map(id => {
        const running = windows.some(win => win.appId === id && !win.isMinimized);
        return <button key={id} type="button" className="desktop-dock-item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]" onClick={() => openApp(id)} aria-label={"Open " + APPS[id].label} title={APPS[id].label}>
          <FileIcon kind={APPS[id].icon} className="h-10 w-10" /><span className="dock-tooltip">{APPS[id].label}</span><span className={"dock-running " + (running ? "is-running" : "")} aria-hidden="true" />
        </button>;
      })}
    </nav>
    {windows.map(win => <Window key={win.id} win={win}><WindowBody win={win} /></Window>)}
    <div className="pointer-events-none absolute bottom-2 left-3 rounded border border-[#8c8068] bg-[#fffaf0]/95 px-2 py-1 text-[13px] font-medium text-[#29271f] max-sm:bottom-[64px] max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:whitespace-nowrap max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px]">
      {coarse ? "More apps in My Computer · Restore from Windows" : "Double-click an icon to open it · drag to snap · ⌘/Ctrl+W close · ⌘/Ctrl+M minimize"}
    </div>
    {ready && showWelcome && <WelcomeCard onClose={dismissWelcome} onOpenApp={(id) => { dismissWelcome(); openApp(id); }} onOpenQuick={() => { dismissWelcome(); onOpenRecruiterView(); }} />}
    {isShutDown && <button type="button" onClick={() => window.location.reload()} className="fixed inset-0 z-[100000] flex cursor-pointer items-center justify-center bg-black p-8 text-center focus-visible:outline-2 focus-visible:outline-offset-[-8px] focus-visible:outline-[#dca45e]">
      <span className="font-chicago max-w-md text-[18px] leading-relaxed text-white">It is now safe to switch off your Macintosh.<br /><span className="text-[13px] text-white/50">(Click anywhere to restart.)</span></span>
    </button>}
  </main>;
}
