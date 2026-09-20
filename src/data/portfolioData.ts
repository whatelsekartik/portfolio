// ---------------------------------------------------------------------------
// PORTFOLIO CONTENT — edit everything in this file to make the site your own.
// Every window on the desktop (About, Terminal, Skills.exe, Education, ...)
// reads from here. Everything below is placeholder text.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Your Name",
  /** Used in the Terminal prompt: handle@macintosh */
  handle: "yourname",
  title: "Web Developer & Electronics Tinkerer",
  tagline: "Building websites, games and gadgets — one tiny window at a time.",
  location: "Your City, Country",
  /** Optional. Put a photo in /public and set e.g. "/me.jpg" — shown in the About window. */
  photo: "",
  quickIntro:
    "Hi! I'm Your Name. I build websites, tinker with electronics, and make small games for fun.",
  bio: [
    "Write two or three short paragraphs about yourself here: what you build, what got you started, and what you're looking for next.",
    "This portfolio is styled after the classic Macintosh System 7 desktop. Double-click the icons to open windows, drag them around, and poke at everything — there's a working terminal, too.",
  ],
  interests: ["Web design", "Retro computing", "Arduino & ESP32", "Game dev", "Open source"],
  personality: ["Curious", "Detail-obsessed", "Night-owl coder", "Coffee-powered"],
};

export const socials = {
  email: "you@example.com",
  phone: "+00 00000 00000",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  instagram: "https://instagram.com/yourusername",
};

// ---------------------------------------------------------------------------
// Projects
// kind decides the icon: "web" | "game" | "chip" | "code"
// ---------------------------------------------------------------------------

export type ProjectKind = "web" | "game" | "chip" | "code";

export interface Project {
  id: string;
  name: string;
  year: string;
  tagline: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  kind: ProjectKind;
}

export const projects: Project[] = [
  {
    id: "sitemango",
    name: "SiteMango",
    year: "2024",
    tagline: "Websites built for small businesses and clients.",
    description:
      "Describe SiteMango here: who it's for, what you build, and what makes it different. Mention the stack you use and a result or two you're proud of.",
    tags: ["React", "Tailwind", "Client work"],
    link: "https://example.com",
    kind: "web",
  },
  {
    id: "pixel-game",
    name: "Pixel Game",
    year: "2023",
    tagline: "A small browser game.",
    description:
      "Describe your game: the idea, how it plays, and what you learned while building it. Link to a playable version if you have one.",
    tags: ["JavaScript", "Canvas", "Game dev"],
    link: "https://example.com",
    repo: "https://github.com/yourusername/pixel-game",
    kind: "game",
  },
  {
    id: "circuit-project",
    name: "Circuit Project",
    year: "2023",
    tagline: "An electronics build.",
    description:
      "Describe the hardware project: what it does, the parts you used (Arduino, ESP32, sensors...) and the trickiest bug you fixed. Photos and schematics make these shine.",
    tags: ["Arduino", "C++", "Electronics"],
    kind: "chip",
  },
  {
    id: "open-source",
    name: "Open Source Tool",
    year: "2022",
    tagline: "A project from GitHub.",
    description:
      "Describe a repository you're proud of. What problem does it solve, and who uses it?",
    tags: ["TypeScript", "Node.js", "GitHub"],
    repo: "https://github.com/yourusername/open-source-tool",
    kind: "code",
  },
];

// ---------------------------------------------------------------------------
// Skills.exe — level is 1-10
// ---------------------------------------------------------------------------

export interface SkillGroup {
  name: string;
  items: { name: string; level: number }[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    items: [
      { name: "HTML & CSS", level: 9 },
      { name: "JavaScript", level: 9 },
      { name: "TypeScript", level: 8 },
      { name: "Python", level: 7 },
      { name: "C / C++", level: 6 },
    ],
  },
  {
    name: "Web",
    items: [
      { name: "React", level: 8 },
      { name: "Next.js", level: 7 },
      { name: "Tailwind CSS", level: 9 },
      { name: "Node.js", level: 7 },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git & GitHub", level: 8 },
      { name: "VS Code", level: 9 },
      { name: "Figma", level: 6 },
      { name: "Docker", level: 5 },
    ],
  },
  {
    name: "Hardware",
    items: [
      { name: "Arduino", level: 7 },
      { name: "ESP32", level: 6 },
      { name: "Raspberry Pi", level: 6 },
      { name: "Soldering", level: 7 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Experience — kind: "Client Work" | "Internship" | "Freelance" | "Competition" | ...
// ---------------------------------------------------------------------------

export interface ExperienceEntry {
  role: string;
  org: string;
  kind: string;
  period: string;
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "Founder & Developer",
    org: "SiteMango",
    kind: "Client Work",
    period: "2023 – Present",
    points: [
      "Placeholder: designed and built websites for clients from first sketch to launch.",
      "Placeholder: handled hosting, domains, and ongoing updates.",
    ],
  },
  {
    role: "Web Development Intern",
    org: "Company Name",
    kind: "Internship",
    period: "Summer 2023",
    points: ["Placeholder: what you shipped.", "Placeholder: what you learned."],
  },
  {
    role: "Freelance Developer",
    org: "Various clients",
    kind: "Freelance",
    period: "2022 – 2023",
    points: ["Placeholder: small sites and fixes for people who needed them."],
  },
  {
    role: "Finalist",
    org: "Hackathon / Competition Name",
    kind: "Competition",
    period: "2022",
    points: ["Placeholder: what you built in 24 hours and how it went."],
  },
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export const education = {
  schools: [
    {
      school: "College / University Name",
      degree: "B.Tech / B.Sc. in Your Course",
      period: "2021 – 2025",
      details: ["Placeholder: major subjects, GPA, or notable coursework."],
    },
    {
      school: "School Name",
      degree: "Higher Secondary (Science)",
      period: "2019 – 2021",
      details: ["Placeholder: board, stream, or result."],
    },
  ],
  certifications: [
    { name: "Certification Name", issuer: "Issuer", year: "2024" },
    { name: "Another Certificate", issuer: "Issuer", year: "2023" },
  ],
  achievements: [
    "Placeholder: an award, scholarship, rank, or competition result.",
    "Placeholder: something you organized or led.",
  ],
};

// ---------------------------------------------------------------------------
// Résumé — put your real CV at /public/resume.pdf (replace the placeholder).
// ---------------------------------------------------------------------------

export const resume = {
  pdfUrl: `${import.meta.env.BASE_URL}resume.pdf`,
  downloadName: "Your-Name-Resume.pdf",
  summary:
    "Placeholder summary of your background: two or three sentences about your experience, your focus, and what you want to do next.",
};

// ---------------------------------------------------------------------------
// Trash — the easter egg. Abandoned ideas, old designs, funny moments.
// ---------------------------------------------------------------------------

export interface TrashItem {
  name: string;
  kind: string;
  story: string;
}

export const trashItems: TrashItem[] = [
  {
    name: "portfolio_v1_FINAL.html",
    kind: "Old design",
    story: "The first portfolio. Comic Sans. A marquee tag. It was 2019 and I regret nothing (some things).",
  },
  {
    name: "todo_app_7.zip",
    kind: "Abandoned code",
    story: "The seventh to-do app. The to-do list for finishing it was longer than the app.",
  },
  {
    name: "flappy_clone.exe",
    kind: "Failed idea",
    story: "A game where the pipes were always exactly 2px too close together. Unwinnable by design (accidentally).",
  },
  {
    name: "smoke_test.ino",
    kind: "Electronics",
    story: "The first circuit that worked was preceded by a circuit that smelled. Lesson learned: check polarity.",
  },
  {
    name: "bad_css_ideas.zip",
    kind: "Old design",
    story: "Includes: a neon gradient on everything, and a button that ran away from the cursor.",
  },
  {
    name: "internet_explorer.app",
    kind: "Legacy",
    story: "Kept for testing. Never opened.",
  },
];

// ---------------------------------------------------------------------------
// README.txt contents
// ---------------------------------------------------------------------------

export function readmeText(): string {
  return [
    `README.txt`,
    `==========`,
    ``,
    `Hello, and welcome! I'm ${profile.name} — ${profile.title.toLowerCase()}.`,
    ``,
    `This website is a tiny Macintosh desktop. Everything you'd`,
    `find on a portfolio is here, just filed the old-fashioned way:`,
    ``,
    `  About Me ...... who I am`,
    `  My Projects ... things I've built`,
    `  Skills.exe .... what I know (it runs, honestly)`,
    `  Experience .... where I've worked`,
    `  Education ..... where I've studied`,
    `  Resume.pdf .... the downloadable CV`,
    `  Contact Me .... how to reach me`,
    `  Terminal.exe .. the same portfolio, for keyboard people`,
    ``,
    `Tips:`,
    `  - Double-click icons to open them (tap once on a phone).`,
    `  - Drag title bars to move windows; click the box on the`,
    `    right of a title bar to roll a window up like a shade.`,
    `  - Special > Desktop Pattern changes the wallpaper.`,
    `  - Open the Terminal and type "help".`,
    `  - Don't open the Trash. (Open the Trash.)`,
    ``,
    `— ${profile.name}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------

export const desktop = {
  /**
   * Default pattern when you have no custom wallpaper: "blue" | "gray" | "teal" | "bricks".
   * To use your own image instead, save it as src/assets/wallpaper.png (see that folder).
   */
  defaultPattern: "blue",
};

// ---------------------------------------------------------------------------
// Guestbook — visitor messages are stored in a Google Sheet.
// Setup steps are in README.md ("Guestbook backend"). Paste the web app URL
// (it ends in /exec) below. Leave it empty to keep messages on the visitor's
// own device only.
// ---------------------------------------------------------------------------

export const guestbook = {
  endpoint: "",
};
