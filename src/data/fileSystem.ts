import type { AppId } from "../types";
import type { IconKind } from "../components/Icons";
import { education, experience, profile, projects, readmeText, skillGroups } from "./portfolioData";

// A tiny virtual disk. The Finder ("My Computer") browses it with icons and
// the Terminal browses it with ls / cd / cat / open, so both stay in sync.

export interface FsFile {
  type: "file";
  name: string;
  icon: IconKind;
  app: AppId;
  payload?: Record<string, unknown>;
  /** Text printed by `cat` in the Terminal. */
  content?: string;
}

export interface FsDir {
  type: "dir";
  name: string;
  children: FsNode[];
}

export type FsNode = FsFile | FsDir;

function file(name: string, icon: IconKind, app: AppId, extra: Partial<FsFile> = {}): FsFile {
  return { type: "file", name, icon, app, ...extra };
}

function textFile(name: string, text: string): FsFile {
  return file(name, "text", "textfile", { payload: { title: name, text }, content: text });
}

function dir(name: string, children: FsNode[]): FsDir {
  return { type: "dir", name, children };
}

const skillsText = (g: (typeof skillGroups)[number]) =>
  [g.name, "-".repeat(g.name.length), ...g.items.map((i) => `${i.name.padEnd(16)} ${"#".repeat(i.level)}${".".repeat(10 - i.level)}`)].join("\n");

export const root: FsDir = dir("Macintosh HD", [
  file("About Me", "about", "about", {
    content: [profile.name, profile.title, "", ...profile.bio].join("\n"),
  }),
  file("README.txt", "readme", "readme", { content: readmeText() }),
  file("Resume.pdf", "pdf", "resume"),
  file("Contact Me", "phone", "contact"),
  file("Guestbook", "guestbook", "guestbook"),
  dir(
    "Projects",
    projects.map((p) =>
      file(p.name, p.kind, "project-detail", {
        payload: { id: p.id },
        content: `${p.name} (${p.year})\n${p.tagline}\n\n${p.description}\n\nTags: ${p.tags.join(", ")}`,
      })
    )
  ),
  dir("Skills", [
    file("Skills.exe", "skills", "skills"),
    ...skillGroups.map((g) => textFile(`${g.name}.txt`, skillsText(g))),
  ]),
  dir("Education", [
    file("Education.htm", "globe", "education"),
    ...education.schools.map((s) =>
      textFile(`${s.school}.txt`, [s.school, s.degree, s.period, "", ...s.details].join("\n"))
    ),
  ]),
  dir("Experience", [
    file("Experience.dsk", "floppy", "experience"),
    ...experience.map((e) =>
      textFile(`${e.org}.txt`, [`${e.role} — ${e.org}`, `${e.kind} · ${e.period}`, "", ...e.points.map((p) => `* ${p}`)].join("\n"))
    ),
  ]),
]);

// ---------------------------------------------------------------------------
// Path helpers (used by the Terminal)
// ---------------------------------------------------------------------------

/** Lets "About Me", "about-me" and "about_me" all refer to the same thing. */
export const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]/g, "");

/** The way names are printed by `ls`: no spaces, so they're easy to type. */
export const slugName = (s: string) => s.replace(/\s+/g, "-");

export function getDir(path: string[]): FsDir {
  let cur: FsDir = root;
  for (const seg of path) {
    const next = cur.children.find((c): c is FsDir => c.type === "dir" && c.name === seg);
    if (!next) break;
    cur = next;
  }
  return cur;
}

export interface Resolved {
  node: FsNode;
  /** For a directory: its own path. For a file: the path of its parent. */
  dirPath: string[];
}

export function resolvePath(cwd: string[], input: string): Resolved | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "~" || trimmed === "/") return { node: root, dirPath: [] };
  const absolute = trimmed.startsWith("/") || trimmed.startsWith("~");
  const segments = trimmed.split("/").filter((s) => s && s !== "~");
  let path = absolute ? [] : [...cwd];
  let node: FsNode = getDir(path);

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg === ".") continue;
    if (seg === "..") {
      path = path.slice(0, -1);
      node = getDir(path);
      continue;
    }
    if (node.type !== "dir") return null;
    const child: FsNode | undefined = node.children.find((c) => normName(c.name) === normName(seg));
    if (!child) return null;
    if (child.type === "dir") {
      path = [...path, child.name];
      node = child;
    } else {
      if (i !== segments.length - 1) return null;
      return { node: child, dirPath: path };
    }
  }
  return { node, dirPath: path };
}
