export type AppId =
  | "about"
  | "terminal"
  | "finder"
  | "readme"
  | "projects"
  | "project-detail"
  | "skills"
  | "education"
  | "experience"
  | "trash"
  | "contact"
  | "resume"
  | "guestbook"
  | "textfile";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  payload?: Record<string, unknown>;
  rect: Rect;
  prevRect?: Rect;
  zIndex: number;
  /** "Minimized" in this app means window-shaded: only the title bar stays visible. */
  isMinimized: boolean;
  isMaximized: boolean;
  minWidth: number;
  minHeight: number;
}

export interface OpenWindowOptions {
  appId: AppId;
  title: string;
  payload?: Record<string, unknown>;
  rect?: Partial<Rect>;
  singleton?: boolean;
  minWidth?: number;
  minHeight?: number;
}
