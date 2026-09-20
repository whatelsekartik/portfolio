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

export default function MenuBar() {
  const { windows, activeWindowId, closeWindow } = useWindowManager();
  const { wallpaperId, setWallpaperId, shutDown } = useSystem();
  const openApp = useOpenApp();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const now = useClock();

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
        { label: "About This Macintosh", action: () => openApp("about") },
        DIVIDER,
        { label: "Terminal.exe", action: () => openApp("terminal") },
        { label: "README.txt", action: () => openApp("readme") },
        { label: "Resume.pdf", action: () => openApp("resume") },
        { label: "Contact Me", action: () => openApp("contact") },
        { label: "Guestbook", action: () => openApp("guestbook") },
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
        ...wallpapers.map((w) => ({
          label: `${w.id === wallpaperId ? "✓ " : "\u00a0\u00a0 "}${w.name}`,
          action: () => setWallpaperId(w.id),
        })),
        DIVIDER,
        { label: "Restart", action: () => window.location.reload() },
        { label: "Shut Down", action: shutDown },
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
                className="absolute top-[22px] left-0 min-w-[200px] border-2 border-black bg-white py-0.5 shadow-[3px_3px_0_rgba(0,0,0,0.45)]"
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
        <span>{now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
        <span>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </div>
      <div className="pr-2 sm:hidden">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
    </div>
  );
}
