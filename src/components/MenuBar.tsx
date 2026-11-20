import { useEffect, useRef, useState } from "react";
import { IconApple } from "./Icons";
import { useWindowManager } from "../context/WindowManagerContext";
import { useSystem } from "../context/SystemContext";
import { useOpenApp } from "../apps/appDefs";
import { wallpapers } from "../data/wallpapers";
import { cn } from "../utils/cn";

interface MenuItem {
  label: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface MenuDef {
  label: string;
  items: MenuItem[];
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);
  return now;
}

const DIVIDER: MenuItem = { divider: true, label: "" };

function ShortcutGuideDialog({open,onClose}:{open:boolean;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const dialog=ref.current;if(!dialog)return;
    if(open&&!dialog.open)dialog.showModal();else if(!open&&dialog.open)dialog.close();
  },[open]);
  const rows=[
    ["⌘ / Ctrl + W","Close the active window"],
    ["⌘ / Ctrl + M","Roll up or restore the active window"],
    ["F1","Open this shortcut guide"],
    ["Tab","Complete terminal commands or file names"],
    ["↑ / ↓","Browse terminal command history"],
    ["Ctrl + L","Clear terminal output"],
    ["Drag title bar","Move a window; drag near an edge to snap"],
    ["Resize handle","Focus the bottom-right handle and use arrow keys"],
    ["Double-click title bar","Roll up or restore a window"],
  ];
  return <dialog ref={ref} className="shortcut-guide" aria-labelledby="shortcut-guide-title" onClose={onClose} onCancel={onClose}
    onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <div className="shortcut-guide-inner">
      <div className="flex items-start justify-between gap-4 border-b border-[#d8c9ad] pb-3">
        <div><p className="editorial-meta text-[#89551e]">System help / navigation</p>
          <h2 id="shortcut-guide-title" className="font-display mt-1 text-[26px] tracking-[-0.05em] text-[#29271f]">Keyboard shortcuts</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-[#625b4c]">A quick guide to getting around this little desktop.</p>
        </div>
        <button type="button" onClick={onClose} className="shortcut-guide-close" aria-label="Close keyboard shortcuts">×</button>
      </div>
      <dl className="shortcut-guide-list">{rows.map(([keys,description])=><div key={keys} className="shortcut-guide-row"><dt><kbd>{keys}</kbd></dt><dd>{description}</dd></div>)}</dl>
      <p className="mt-3 border-t border-dashed border-[#d8c9ad] pt-3 text-[10px] text-[#756951]">On touch screens, tap an icon to open it. Dragging and hover effects are desktop-only.</p>
    </div>
  </dialog>;
}


export default function MenuBar({ onOpenRecruiterView }: { onOpenRecruiterView: () => void }) {
  const { windows, activeWindowId, closeWindow } = useWindowManager();
  const { wallpaperId, setWallpaperId, shutDown, customWallpaperSrc } = useSystem();
  const openApp = useOpenApp();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const now = useClock();

  useEffect(() => {
    function onHelpKey(e: KeyboardEvent) { if (e.key === "F1") { e.preventDefault(); setShortcutsOpen(true); } }
    window.addEventListener("keydown", onHelpKey);
    return () => window.removeEventListener("keydown", onHelpKey);
  }, []);

  useEffect(() => {
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenIndex(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const menus: MenuDef[] = [
    {
      label: "",
      items: [
        { label: "Recruiter View ↗", action: onOpenRecruiterView },
        DIVIDER,
        { label: "About This Macintosh", action: () => openApp("about") },
        DIVIDER,
        { label: "Terminal.exe", action: () => openApp("terminal") },
        { label: "README.txt", action: () => openApp("readme") },
        { label: "Resume.pdf", action: () => openApp("resume") },
        { label: "Achievements", action: () => openApp("achievements") },
        { label: "Contact Me", action: () => openApp("contact") },
        { label: "Guestbook", action: () => openApp("guestbook") },
        DIVIDER,
        { label: "Restart", action: () => window.location.reload() },
        { label: "Shut Down", action: shutDown },
      ],
    },
    {
      label: "File",
      items: [
        { label: "Open My Computer", action: () => openApp("finder") },
        { label: "Open Resume.pdf", action: () => openApp("resume") },
        DIVIDER,
        {
          label: "Close Window",
          disabled: !activeWindowId || !windows.some((w) => w.id === activeWindowId),
          action: () => activeWindowId && closeWindow(activeWindowId),
        },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo", disabled: true },
        DIVIDER,
        { label: "Cut", disabled: true },
        { label: "Copy", disabled: true },
        { label: "Paste", disabled: true },
      ],
    },
    {
      label: "View",
      items: [
        { label: "by Icon", disabled: true },
        { label: "by Name", disabled: true },
        { label: "by Date", disabled: true },
      ],
    },
    {
      label: "Special",
      items: [
        { label: "Empty Trash…", action: () => openApp("trash") },
        DIVIDER,
        ...wallpapers
          .filter((w) => w.id !== "custom" || customWallpaperSrc)
          .map((w) => ({
            label: `${w.id === wallpaperId ? "✓ " : "\u00a0\u00a0 "}${w.name}`,
            action: () => setWallpaperId(w.id),
          })),
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Keyboard Shortcuts…", action: () => setShortcutsOpen(true) },
        { label: "Open Terminal.exe", action: () => openApp("terminal") },
      ],
    },
  ];

  return (
    <div
      ref={rootRef}
      className="font-chicago fixed top-0 left-0 z-[9999] flex h-6 w-full items-center justify-between border-b-2 border-black bg-white px-1 text-[14px]"
    >
      <div className="flex h-full items-center">
        {menus.map((menu, i) => (
          <div key={i} className="relative h-full">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openIndex === i}
              aria-label={menu.label || "Apple menu"}
              className={cn("flex h-full items-center px-2.5", openIndex === i && "bg-black text-white")}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              onPointerEnter={() => openIndex !== null && setOpenIndex(i)}
            >
              {menu.label || <IconApple className="h-4 w-4" />}
            </button>
            {openIndex === i && (
              <div
                role="menu"
                className="menu-dropdown absolute top-[22px] left-0 min-w-[200px] border-2 border-black bg-white py-0.5 shadow-[3px_3px_0_rgba(0,0,0,0.45)]"
              >
                {menu.items.map((item, j) =>
                  item.divider ? (
                    <div key={j} className="my-0.5 border-t-2 border-dotted border-black/50" />
                  ) : (
                    <button
                      key={j}
                      type="button"
                      role="menuitem"
                      disabled={item.disabled}
                      onClick={() => {
                        item.action?.();
                        setOpenIndex(null);
                      }}
                      className={cn(
                        "block w-full px-4 py-0.5 text-left whitespace-nowrap",
                        item.disabled ? "text-black/35" : "hover:bg-black hover:text-white"
                      )}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pr-2 max-sm:hidden">
        <button type="button" onClick={onOpenRecruiterView} className="rounded border border-black/35 px-2 py-0 text-[11px] hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]">Recruiter view ↗</button>
        <span>{now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
        <span>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </div>
      <div className="flex items-center gap-2 pr-2 sm:hidden"><button type="button" onClick={onOpenRecruiterView} className="rounded border border-black/35 px-1.5 text-[10px]">CV ↗</button><span>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></div>
      <ShortcutGuideDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
