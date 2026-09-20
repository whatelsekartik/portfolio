import { useCallback } from "react";
import type { AppId } from "../types";
import type { IconKind } from "../components/Icons";
import { useWindowManager } from "../context/WindowManagerContext";
import { profile, projects } from "../data/portfolioData";

export interface AppDef {
  /** Name shown under the desktop icon and in menus. */
  label: string;
  icon: IconKind;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  title?: (payload?: Record<string, unknown>) => string;
}

export const APPS: Record<AppId, AppDef> = {
  about: { label: "About Me", icon: "about", width: 480, height: 560, title: () => `About ${profile.name}` },
  terminal: { label: "Terminal.exe", icon: "terminal", width: 580, height: 400, minWidth: 320 },
  finder: { label: "My Computer", icon: "computer", width: 520, height: 380, title: () => "Macintosh HD" },
  readme: { label: "README.txt", icon: "readme", width: 500, height: 520 },
  projects: { label: "My Projects", icon: "folder", width: 480, height: 360, title: () => "My Projects" },
  "project-detail": {
    label: "Project",
    icon: "code",
    width: 440,
    height: 390,
    title: (p) => projects.find((x) => x.id === p?.id)?.name ?? "Project",
  },
  skills: { label: "Skills.exe", icon: "skills", width: 500, height: 400 },
  education: { label: "Education", icon: "globe", width: 540, height: 450, minWidth: 320 },
  experience: { label: "Experience", icon: "floppy", width: 600, height: 400, minWidth: 320 },
  trash: { label: "Trash", icon: "trash", width: 420, height: 390 },
  contact: { label: "Contact Me", icon: "phone", width: 430, height: 610 },
  resume: { label: "Resume.pdf", icon: "pdf", width: 580, height: 540, minWidth: 320 },
  guestbook: { label: "Guestbook", icon: "guestbook", width: 430, height: 400 },
  textfile: {
    label: "Text file",
    icon: "text",
    width: 440,
    height: 340,
    title: (p) => String(p?.title ?? "Untitled"),
  },
};

export function appTitle(id: AppId, payload?: Record<string, unknown>): string {
  const def = APPS[id];
  return def.title ? def.title(payload) : def.label;
}

/** Returns a function that opens (or brings forward) an app window. */
export function useOpenApp() {
  const { openWindow } = useWindowManager();
  return useCallback(
    (id: AppId, payload?: Record<string, unknown>) => {
      const def = APPS[id];
      openWindow({
        appId: id,
        title: appTitle(id, payload),
        payload,
        rect: { width: def.width, height: def.height },
        minWidth: def.minWidth,
        minHeight: def.minHeight,
      });
    },
    [openWindow]
  );
}
