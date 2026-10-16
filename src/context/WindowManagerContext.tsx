import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { OpenWindowOptions, WindowInstance } from "../types";

interface WindowManagerValue {
  windows: WindowInstance[];
  openWindow: (options: OpenWindowOptions) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateRect: (id: string, rect: Partial<WindowInstance["rect"]>) => void;
  activeWindowId: string | null;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

const DEFAULT_W = 460;
const DEFAULT_H = 340;
const MENU_BAR = 24;
const SMALL_SCREEN = 640;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi));

function keyOf(appId: string, payload?: Record<string, unknown>) {
  return `${appId}:${JSON.stringify(payload ?? {})}`;
}

function maximizedRect() {
  return {
    x: 8,
    y: MENU_BAR + 8,
    width: Math.max(1, window.innerWidth - 16),
    height: Math.max(1, window.innerHeight - MENU_BAR - 16),
  };
}

/** Keep every window inside the viewport. On phones, windows use the available screen. */
function fitRect(requested: Partial<WindowInstance["rect"]>, cascadeIndex: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw < SMALL_SCREEN) {
    return {
      x: 4,
      y: MENU_BAR + 6,
      width: Math.max(1, vw - 8),
      height: Math.max(1, vh - MENU_BAR - 14),
    };
  }

  const maxWidth = Math.max(1, vw - 16);
  const maxHeight = Math.max(1, vh - MENU_BAR - 16);
  const width = Math.min(requested.width ?? DEFAULT_W, maxWidth);
  const height = Math.min(requested.height ?? DEFAULT_H, maxHeight);
  const offset = (cascadeIndex % 8) * 24;
  const minY = MENU_BAR + 8;
  const x = clamp(requested.x ?? 90 + offset, 8, Math.max(8, vw - width - 8));
  const y = clamp(requested.y ?? 50 + offset, minY, Math.max(minY, vh - height - 8));
  return { x, y, width, height };
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  // The ref is the source of truth so several calls in one tick (e.g. opening
  // a window and then focusing it) always see each other's changes.
  const windowsRef = useRef<WindowInstance[]>([]);
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const zCounter = useRef(10);
  const idCounter = useRef(0);

  const commit = useCallback((next: WindowInstance[]) => {
    windowsRef.current = next;
    setWindows(next);
  }, []);

  // Re-fit open windows after viewport changes, orientation changes, or zooming
  // the browser. Preserve a maximized window's restore bounds on small screens.
  useEffect(() => {
    function onResize() {
      const smallScreen = window.innerWidth < SMALL_SCREEN;
      commit(
        windowsRef.current.map((win, index) => ({
          ...win,
          rect: win.isMaximized ? maximizedRect() : fitRect(win.rect, index),
          prevRect: win.prevRect && !smallScreen ? fitRect(win.prevRect, index) : win.prevRect,
        }))
      );
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [commit]);

  const focusWindow = useCallback(
    (id: string) => {
      zCounter.current += 1;
      const z = zCounter.current;
      commit(windowsRef.current.map((w) => (w.id === id ? { ...w, zIndex: z } : w)));
      setActiveWindowId(id);
    },
    [commit]
  );

  const openWindow = useCallback(
    (options: OpenWindowOptions) => {
      const list = windowsRef.current;
      const singleton = options.singleton !== false;
      const existing = singleton
        ? list.find((w) => keyOf(w.appId, w.payload) === keyOf(options.appId, options.payload))
        : undefined;

      zCounter.current += 1;
      const z = zCounter.current;

      if (existing) {
        commit(list.map((w) => (w.id === existing.id ? { ...w, isMinimized: false, zIndex: z } : w)));
        setActiveWindowId(existing.id);
        return existing.id;
      }

      idCounter.current += 1;
      const id = `win-${idCounter.current}`;
      const newWindow: WindowInstance = {
        id,
        appId: options.appId,
        title: options.title,
        payload: options.payload,
        rect: fitRect(options.rect ?? {}, list.length),
        zIndex: z,
        isMinimized: false,
        isMaximized: false,
        minWidth: options.minWidth ?? 260,
        minHeight: options.minHeight ?? 180,
      };
      commit([...list, newWindow]);
      setActiveWindowId(id);
      return id;
    },
    [commit]
  );

  const closeWindow = useCallback(
    (id: string) => {
      const next = windowsRef.current.filter((w) => w.id !== id);
      commit(next);
      setActiveWindowId((cur) => {
        if (cur !== id) return cur;
        const top = [...next].sort((a, b) => b.zIndex - a.zIndex)[0];
        return top ? top.id : null;
      });
    },
    [commit]
  );

  const minimizeWindow = useCallback(
    (id: string) => {
      const win = windowsRef.current.find((w) => w.id === id);
      if (!win) return;
      const isMinimized = !win.isMinimized;
      commit(windowsRef.current.map((w) => (w.id === id ? { ...w, isMinimized } : w)));
      if (isMinimized && activeWindowId === id) {
        const next = windowsRef.current
          .filter((w) => w.id !== id && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(next?.id ?? null);
      }
    },
    [activeWindowId, commit]
  );

  const toggleMaximizeWindow = useCallback(
    (id: string) => {
      commit(
        windowsRef.current.map((w) => {
          if (w.id !== id) return w;
          if (w.isMaximized && w.prevRect) {
            return { ...w, isMaximized: false, rect: fitRect(w.prevRect, 0), prevRect: undefined };
          }
          return { ...w, isMaximized: true, isMinimized: false, prevRect: w.rect, rect: maximizedRect() };
        })
      );
    },
    [commit]
  );

  const updateRect = useCallback(
    (id: string, rect: Partial<WindowInstance["rect"]>) => {
      commit(
        windowsRef.current.map((w) =>
          w.id === id ? { ...w, rect: fitRect({ ...w.rect, ...rect }, 0) } : w
        )
      );
    },
    [commit]
  );

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        toggleMaximizeWindow,
        updateRect,
        activeWindowId,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}
