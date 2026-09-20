import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultWallpaperId, wallpapers } from "../data/wallpapers";

interface SystemValue {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  trashEmpty: boolean;
  emptyTrash: () => void;
  isShutDown: boolean;
  shutDown: () => void;
}

const SystemContext = createContext<SystemValue | null>(null);
const WALLPAPER_KEY = "mac-portfolio-wallpaper";

function loadWallpaper(): string {
  try {
    const saved = localStorage.getItem(WALLPAPER_KEY);
    if (saved && wallpapers.some((w) => w.id === saved)) return saved;
  } catch {
    /* storage can be unavailable (private mode) */
  }
  return defaultWallpaperId;
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [wallpaperId, setWallpaperId] = useState(loadWallpaper);
  const [trashEmpty, setTrashEmpty] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(WALLPAPER_KEY, wallpaperId);
    } catch {
      /* ignore */
    }
  }, [wallpaperId]);

  const emptyTrash = useCallback(() => setTrashEmpty(true), []);
  const shutDown = useCallback(() => setIsShutDown(true), []);

  const value = useMemo(
    () => ({ wallpaperId, setWallpaperId, trashEmpty, emptyTrash, isShutDown, shutDown }),
    [wallpaperId, trashEmpty, emptyTrash, isShutDown, shutDown]
  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used within SystemProvider");
  return ctx;
}
