import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useWindowManager } from "../context/WindowManagerContext";
import { getDir, normName, resolvePath, slugName } from "../data/fileSystem";
import { education, experience, profile, projects, readmeText, skillGroups, socials } from "../data/portfolioData";
import type { AppId } from "../types";
import { useOpenApp } from "./appDefs";

type Kind = "in" | "out" | "err";
interface Line {
  id: number;
  kind: Kind;
  text: string;
  prompt?: string;
}

const THEMES = {
  green: { color: "#62f27a", dim: "#2f8a41" },
  amber: { color: "#ffb84a", dim: "#a06a14" },
  white: { color: "#e8e8e8", dim: "#8a8a8a" },
} as const;
type ThemeName = keyof typeof THEMES;

const COMMANDS = [
  "help", "about", "whoami", "skills", "projects", "experience", "education", "contact", "resume",
  "ls", "cd", "pwd", "cat", "open", "github", "linkedin", "neofetch", "theme", "date", "echo",
  "history", "clear", "exit",
];

/** Names that `open` understands, mapped to the window they open. */
const OPEN_ALIASES: Record<string, AppId> = {
  about: "about", aboutme: "about",
  readme: "readme", "readme.txt": "readme",
  resume: "resume", "resume.pdf": "resume", cv: "resume",
  projects: "projects", myprojects: "projects",
  skills: "skills", "skills.exe": "skills",
  education: "education", "education.htm": "education",
  experience: "experience", "experience.dsk": "experience",
  contact: "contact", contactme: "contact",
  trash: "trash", finder: "finder", computer: "finder", mycomputer: "finder",
  guestbook: "guestbook", terminal: "terminal", "terminal.exe": "terminal",
};

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noreferrer" className="underline">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const bar = (level: number) => "█".repeat(level) + "░".repeat(10 - level);
const pad = (s: string, n: number) => s.padEnd(n, " ");

export default function TerminalApp({ windowId }: { windowId: string }) {
  const openApp = useOpenApp();
  const { closeWindow } = useWindowManager();
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, kind: "out", text: "Terminal.exe — portfolio shell 1.0" },
    { id: 1, kind: "out", text: 'Type "help" to see what I can do. Try "projects" or "neofetch".' },
  ]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeName>("green");
  const nextId = useRef(2);
  const bootTime = useRef(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptFor = (path: string[]) => `${profile.handle}@macintosh:~${path.length ? "/" + path.join("/") : ""}$`;
  const t = THEMES[theme];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function push(kind: Kind, texts: string[], prompt?: string) {
    setLines((prev) => [
      ...prev,
      ...texts.map((text) => ({ id: nextId.current++, kind, text, prompt })),
    ]);
  }

  function neofetch(): string[] {
    const art = [
      "   .-------.   ",
      "   | .---. |   ",
      "   | | : | |   ",
      "   | '---' |   ",
      "   | ===== |   ",
      "   '-------'   ",
      "                ",
    ];
    const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
    const mins = Math.max(1, Math.round((Date.now() - bootTime.current) / 60000));
    const info = [
      `${profile.handle}@macintosh`,
      "-".repeat(profile.handle.length + 10),
      "OS: System 7.everscroll",
      `Host: ${profile.name}`,
      `Role: ${profile.title}`,
      `Projects: ${projects.length}   Skills: ${total}`,
      `Uptime: ${mins} min`,
      `Screen: ${window.innerWidth}x${window.innerHeight}`,
    ];
    return info.map((row, i) => `${art[i] ?? "                "}${row}`);
  }

  function run(raw: string) {
    const line = raw.trim();
    push("in", [raw], promptFor(cwd));
    if (!line) return;
    setHistory((h) => [...h, line]);
    setHistIdx(null);

    const [cmdRaw, ...args] = line.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const arg = args.join(" ");

    switch (cmd) {
      case "help":
        push("out", [
          "Commands:",
          "  about            who I am",
          "  whoami           one-line intro",
          "  skills           skill levels",
          "  projects         things I've built",
          "  experience       where I've worked",
          "  education        where I've studied",
          "  contact          how to reach me",
          "  resume           open Resume.pdf",
          "  ls [dir]         list files       cd <dir>   change folder",
          "  cat <file>       print a file     pwd        where am I",
          "  open <name>      open a window (open readme, open skills...)",
          "  github, linkedin open the profile in a new tab",
          "  neofetch         system info",
          "  theme <name>     green | amber | white",
          "  date, echo, history, clear, exit",
          "Tip: press Tab to complete names, ↑ for previous commands.",
        ]);
        break;

      case "whoami":
        push("out", [`${profile.name} — ${profile.title}`, profile.tagline]);
        break;

      case "about":
        push("out", [profile.name, profile.title, "", ...profile.bio, "", `Interests: ${profile.interests.join(", ")}`, `Personality: ${profile.personality.join(", ")}`]);
        break;

      case "skills":
        push(
          "out",
          skillGroups.flatMap((g) => [g.name, ...g.items.map((i) => `  ${pad(i.name, 16)} ${bar(i.level)}  ${i.level}/10`), ""]).slice(0, -1)
        );
        break;

      case "projects":
        push("out", projects.flatMap((p) => [`${p.name} (${p.year}) — ${p.tagline}`, ...(p.link ? [`  ${p.link}`] : []), ...(p.repo ? [`  ${p.repo}`] : [])]));
        break;

      case "experience":
        push("out", experience.map((e) => `${pad(e.period, 16)} ${e.role}, ${e.org} [${e.kind}]`));
        break;

      case "education":
        push("out", [
          ...education.schools.map((s) => `${pad(s.period, 12)} ${s.degree}, ${s.school}`),
          ...education.certifications.map((c) => `${pad(c.year, 12)} ${c.name} (${c.issuer})`),
        ]);
        break;

      case "contact":
        push("out", [
          `Email      ${socials.email}`,
          `Phone      ${socials.phone}`,
          `GitHub     ${socials.github}`,
          `LinkedIn   ${socials.linkedin}`,
          `Instagram  ${socials.instagram}`,
        ]);
        break;

      case "resume":
        push("out", ["Opening Resume.pdf…"]);
        openApp("resume");
        break;

      case "github":
      case "linkedin":
        push("out", [`Opening ${socials[cmd]}…`]);
        window.open(socials[cmd], "_blank", "noopener,noreferrer");
        break;

      case "pwd":
        push("out", [`/${cwd.join("/")}`]);
        break;

      case "ls": {
        const target = arg ? resolvePath(cwd, arg) : { node: getDir(cwd), dirPath: cwd };
        if (!target) return push("err", [`ls: ${arg}: no such file or folder`]);
        if (target.node.type === "file") return push("out", [slugName(target.node.name)]);
        const names = target.node.children.map((c) => slugName(c.name) + (c.type === "dir" ? "/" : ""));
        push("out", [names.join("   ") || "(empty)"]);
        break;
      }

      case "cd": {
        if (!arg) return setCwd([]);
        const target = resolvePath(cwd, arg);
        if (!target) return push("err", [`cd: ${arg}: no such folder`]);
        if (target.node.type === "file") return push("err", [`cd: ${arg}: not a folder`]);
        setCwd(target.dirPath);
        break;
      }

      case "cat": {
        if (!arg) return push("err", ["cat: which file? Try: cat README.txt"]);
        const target = resolvePath(cwd, arg);
        if (!target) return push("err", [`cat: ${arg}: no such file`]);
        if (target.node.type === "dir") return push("err", [`cat: ${arg}: is a folder (try ls)`]);
        const f = target.node;
        if (f.app === "readme") return push("out", readmeText().split("\n"));
        if (f.content) return push("out", f.content.split("\n"));
        push("err", [`cat: ${slugName(f.name)}: not a text file — try: open ${slugName(f.name)}`]);
        break;
      }

      case "open": {
        if (!arg) return push("err", ["open: what? Try: open readme, open projects, open skills"]);
        const alias = OPEN_ALIASES[normName(arg)];
        if (alias) {
          push("out", [`Opening ${arg}…`]);
          openApp(alias);
          break;
        }
        const target = resolvePath(cwd, arg);
        if (!target) return push("err", [`open: ${arg}: not found`]);
        if (target.node.type === "dir") {
          push("out", ["Opening My Computer…"]);
          openApp("finder");
        } else {
          push("out", [`Opening ${target.node.name}…`]);
          openApp(target.node.app, target.node.payload);
        }
        break;
      }

      case "neofetch":
        push("out", neofetch());
        break;

      case "theme": {
        const name = arg.toLowerCase() as ThemeName;
        if (!(name in THEMES)) return push("err", ["theme: choose green, amber or white"]);
        setTheme(name);
        push("out", [`Theme set to ${name}.`]);
        break;
      }

      case "date":
        push("out", [new Date().toString()]);
        break;

      case "echo":
        push("out", [arg]);
        break;

      case "history":
        push("out", history.length ? history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`) : ["(nothing yet)"]);
        break;

      case "clear":
        setLines([]);
        break;

      case "exit":
        closeWindow(windowId);
        break;

      case "sudo":
        push("err", [`${profile.handle} is not in the sudoers file. This incident will be reported.`]);
        break;

      case "rm":
        push("err", [/-rf?\s+\/|-fr\s+\//.test(line) ? "Nice try. The Trash is watching." : "rm: permission denied (this is a portfolio, not a sandbox)"]);
        break;

      case "hi":
      case "hello":
        push("out", [`Hello, visitor! I'm ${profile.name}. Type "help" to look around.`]);
        break;

      default:
        push("err", [`sh: command not found: ${cmdRaw}. Type "help" for a list.`]);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(input);
    setInput("");
  }

  function complete() {
    const parts = input.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    let candidates: string[];
    if (parts.length <= 1) {
      candidates = COMMANDS;
    } else {
      const slashAt = last.lastIndexOf("/");
      const base = slashAt >= 0 ? last.slice(0, slashAt + 1) : "";
      const dirNode = base ? resolvePath(cwd, base) : { node: getDir(cwd), dirPath: cwd };
      if (!dirNode || dirNode.node.type !== "dir") return;
      candidates = dirNode.node.children.map((c) => base + slugName(c.name) + (c.type === "dir" ? "/" : ""));
    }
    const matches = candidates.filter((c) => c.toLowerCase().startsWith(last.toLowerCase()));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setInput(parts.join(" ") + (matches[0].endsWith("/") ? "" : " "));
    } else if (matches.length > 1) {
      push("in", [input], promptFor(cwd));
      push("out", [matches.join("   ")]);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div
      className="relative h-full bg-[#0b0d0b]"
      style={{ color: t.color, fontFamily: '"VT323", "Courier New", monospace', fontSize: 19, lineHeight: 1.2 }}
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div ref={scrollRef} className="mac-scroll-dark h-full overflow-y-auto p-3 select-text" style={{ textShadow: `0 0 5px ${t.color}55` }}>
        {lines.map((l) => (
          <div key={l.id} className="break-words whitespace-pre-wrap" style={l.kind === "err" ? { color: "#ff8a7a" } : undefined}>
            {l.kind === "in" ? (
              <>
                <span style={{ color: t.dim }}>{l.prompt} </span>
                {l.text}
              </>
            ) : (
              <Linkified text={l.text} />
            )}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex items-baseline gap-2">
          <label htmlFor="term-input" className="shrink-0" style={{ color: t.dim }}>
            {promptFor(cwd)}
          </label>
          <input
            id="term-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input"
            className="min-w-0 flex-1 bg-transparent outline-none"
            style={{ caretColor: t.color, font: "inherit", color: "inherit", textShadow: "inherit" }}
          />
        </form>
      </div>
      {/* CRT scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,.22) 0, rgba(0,0,0,.22) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.35) 100%)",
        }}
      />
    </div>
  );
}
