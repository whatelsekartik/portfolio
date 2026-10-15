// ---------------------------------------------------------------------------
// PORTFOLIO CONTENT — one source of truth for the desktop's windows.
// Keep descriptions factual and add verified project URLs when available.
// ---------------------------------------------------------------------------
export const profile = {
  name: "Kartik Gaikwad",
  handle: "kartik",
  title: "Student Developer & Builder",
  tagline: "Small experiments, useful software, and ideas that make it out of the notes app.",
  location: "Pune, India",
  photo: "",
  quickIntro: "Hey, I'm Kartik — a student developer interested in thoughtful web experiences, practical software, and the hardware side of computing.",
  bio: [
    "I like turning ideas into things people can actually use: clean web interfaces, small tools, campus-focused products, and experiments with electronics.",
    "This portfolio is a little digital workspace rather than a conventional landing page. Open a file, browse a project, or use the terminal — the details are meant to be explored.",
  ],
  interests: ["Frontend craft", "Product building", "Open source", "ESP32 & electronics", "Retro computing"],
  personality: ["Curious by default", "Learn by building", "Detail-oriented", "Always iterating"],
};

export const socials = {
  email: "",
  phone: "",
  github: "https://github.com/whatelsekartik",
  linkedin: "",
  instagram: "",
};

export type ProjectKind = "web" | "game" | "chip" | "code";
export interface Project {
  id: string; name: string; year: string; tagline: string; description: string;
  tags: string[]; link?: string; repo?: string; kind: ProjectKind;
}
export const projects: Project[] = [
  {
    id: "campus-plus", name: "Campus+", year: "2026",
    tagline: "A text-first operating layer for campus life.",
    description: "A campus platform in active development, bringing everyday student workflows into one calm, searchable place: communities, posts, direct messages, events, official notices, lost and found, housing, rides, project teams, and a student marketplace with moderator review. Its product direction prioritizes clear information, lightweight coordination, and institutional identity over unnecessary AI features.",
    tags: ["Next.js", "Supabase", "Campus platform"], kind: "code",
  },
  {
    id: "sitemango", name: "SiteMango", year: "2025—26",
    tagline: "A small web studio for growing local businesses.",
    description: "A web-development initiative focused on fast, clean, conversion-minded websites for local businesses. The work emphasizes responsive pages, clear service presentation, useful contact and lead-capture flows, and a practical handoff that small teams can maintain.",
    tags: ["Web design", "HTML · CSS · JavaScript", "Small business"],
    repo: "https://github.com/whatelsekartik/SiteMango",
    kind: "web",
  },
  {
    id: "ecoswitch", name: "EcoSwitch", year: "2026",
    tagline: "Camera-free, zone-level classroom energy management.",
    description: "A low-cost classroom energy-management prototype pairing PIR motion sensing with 24 GHz mmWave presence detection on an ESP32-S3. The hybrid, three-zone approach is designed to distinguish brief motion from continued occupancy, enabling smarter switching while avoiding cameras.",
    tags: ["ESP32-S3", "PIR + 24 GHz mmWave", "Energy efficiency", "Embedded systems"],
    repo: "https://github.com/aminotkartik/ecoswitch",
    kind: "chip",
  },
  {
    id: "civic-issue", name: "Civic Issue", year: "2026",
    tagline: "Report it. Track it. Resolve it.",
    description: "A civic reporting and resolution platform for residents and municipal teams. Residents can submit location-aware reports, follow updates, support existing issues, and give resolution feedback; authorities can verify, assign, and close reports through department-scoped queues and an auditable timeline. It includes map-based workflows and privacy-conscious public location handling.",
    tags: ["Next.js", "Drizzle ORM", "OpenStreetMap", "Civic tech"],
    link: "https://civicissue-one.vercel.app",
    repo: "https://github.com/whatelsekartik/civicissue",
    kind: "web",
  },
];

export interface SkillGroup { name: string; items: { name: string; level: number }[]; }
export const skillGroups: SkillGroup[] = [
  { name: "Languages", items: [
    { name: "HTML & CSS", level: 9 }, { name: "JavaScript", level: 8 },
    { name: "Python", level: 7 }, { name: "C / C++", level: 6 }, { name: "TypeScript", level: 5 },
  ]},
  { name: "Web", items: [
    { name: "React", level: 7 }, { name: "Next.js", level: 6 },
    { name: "Tailwind CSS", level: 8 }, { name: "Node.js", level: 6 }, { name: "Supabase", level: 6 },
  ]},
  { name: "Tools", items: [
    { name: "Git & GitHub", level: 8 }, { name: "VS Code", level: 8 },
    { name: "Figma", level: 5 }, { name: "Command line", level: 6 },
  ]},
  { name: "Hardware", items: [
    { name: "ESP32", level: 6 }, { name: "Raspberry Pi", level: 6 },
    { name: "Arduino", level: 6 }, { name: "Prototyping", level: 6 },
  ]},
];

export interface ExperienceEntry { role: string; org: string; kind: string; period: string; points: string[]; }
export const experience: ExperienceEntry[] = [
  {
    role: "Builder & Developer", org: "Independent projects", kind: "Projects", period: "Ongoing",
    points: [
      "Designing and implementing small web products from an idea through to a working prototype.",
      "Exploring product structure, maintainable frontend code, and practical backend workflows.",
    ],
  },
  {
    role: "Founder-in-progress", org: "SiteMango", kind: "Web development", period: "Ongoing",
    points: [
      "Developing a straightforward web offering for local businesses, with a focus on clarity and useful contact paths.",
      "Working through the details that make small sites dependable: responsive layouts, forms, deployment, and handoff.",
    ],
  },
  {
    role: "Student", org: "Science & computing", kind: "Education", period: "Current",
    points: [
      "Balancing formal study with independent projects in software and electronics.",
      "Using projects to connect fundamentals with real interfaces and working systems.",
    ],
  },
];

export const education = {
  current: [
    {
      degree: "B.Tech",
      program: "Information Technology",
      institution: "Pimpri Chinchwad College of Engineering (PCCOE)",
      status: "Currently pursuing",
    },
    {
      degree: "BS",
      program: "Applied AI & Data Science",
      institution: "",
      status: "Currently pursuing",
    },
  ],
  schools: [{
    school: "Maharashtra State Board",
    degree: "Higher Secondary Certificate · Science",
    period: "2026",
    details: ["Class XII · 82% overall", "Mathematics · 91/100"],
  }],
  certifications: [],
  achievements: [
    "Class X board examination: 93%.",
    "SOF International Mathematics Olympiad: 92nd percentile; International Rank 791.",
  ],
};

export const resume = {
  pdfUrl: `${import.meta.env.BASE_URL}resume.pdf`,
  downloadName: "Kartik-Gaikwad-Resume.pdf",
  summary: "Student developer exploring frontend engineering, product building, and electronics. Interested in creating useful software with clear interfaces and thoughtful details.",
};

export interface TrashItem { name: string; kind: string; story: string; }
export const trashItems: TrashItem[] = [
  { name: "portfolio_v1_FINAL_FINAL", kind: "Old design", story: "The version that was definitely final. Until the next version existed." },
  { name: "todo_app_09", kind: "Abandoned code", story: "A reminder that building a tool is sometimes easier than deciding which tool to build." },
  { name: "unread_notes.txt", kind: "Research", story: "Forty tabs, three notebooks, and one useful idea hiding at the bottom." },
  { name: "mystery_wire.ino", kind: "Electronics", story: "A tiny reminder to label wires, check polarity, and keep the wiring diagram." },
  { name: "perfect-gradient.css", kind: "Old design", story: "Sometimes the most useful design decision is removing one more effect." },
];

export function readmeText(): string {
  return [
    "README.txt", "==========",
    `Hey, I'm ${profile.name} — ${profile.title.toLowerCase()}.`, "",
    profile.tagline, "",
    "This portfolio works like a tiny desktop. Files and apps open in their own windows:", "",
    "  About Me ...... what I'm curious about",
    "  My Projects ... things I've been building",
    "  Skills.exe .... a snapshot of my toolkit",
    "  Experience .... the work behind the projects",
    "  Education ..... the formal side of learning",
    "  Resume.pdf .... the downloadable résumé",
    "  Contact Me .... ways to get in touch",
    "  Terminal.exe .. a keyboard-friendly route through the portfolio", "",
    "Tips:",
    "  - Double-click icons to open them (tap on a phone).",
    "  - Drag title bars to move windows.",
    "  - Use Special > Desktop Pattern to change the background.",
    "  - Open Terminal.exe and type help.", "",
    `— ${profile.name}`,
  ].join("\n");
}

export const desktop = {
  /** Built-in warm patterns: "amber" | "paper" | "olive" | "terracotta". */
  defaultPattern: "paper",
};

export const backend = { endpoint: "" };
export const ai = { name: "Kartik's Terminal" };
