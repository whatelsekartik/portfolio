export type CaseStageTone = "amber" | "olive" | "terracotta" | "ink";
export type EvidenceState = "built" | "configured" | "verify" | "design";

export interface CaseStudyScreenshot {
  title: string;
  caption: string;
  src: string;
  alt: string;
  sourceKind: "repository evidence" | "live deployment capture";
}

export interface CaseStudyNode {
  label: string;
  detail: string;
  state: EvidenceState;
}

export interface CaseStudyEvidence {
  state: EvidenceState;
  title: string;
  detail: string;
}

export interface CaseStudyTradeoff {
  title: string;
  detail: string;
}

export interface ProjectCaseStudy {
  stageLabel: string;
  stageTone: CaseStageTone;
  stageNote: string;
  problem: string;
  approach: string;
  contribution: string;
  architectureTitle: string;
  architecture: CaseStudyNode[];
  screenshots: CaseStudyScreenshot[];
  evidence: CaseStudyEvidence[];
  tradeoffs: CaseStudyTradeoff[];
  challenges: string[];
  nextSteps: string[];
}

const liveCapture = (url: string) =>
  `https://image.thum.io/get/width/1280/crop/820/noanimate/${url}`;

export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  "campus-plus": {
    stageLabel: "Application built · cloud setup pending",
    stageTone: "amber",
    stageNote:
      "The repository documents passing code and database checks against a local test harness. A production Supabase project, OAuth configuration, and a live security run are still explicit deployment tasks; those are not claimed as verified here.",
    problem:
      "Campus communication often scatters useful information across chats, notices, groups and informal marketplaces. Campus+ explores one calmer place for those workflows while keeping student identity and permissions carefully scoped.",
    approach:
      "A text-first PCCOE campus layer built around Next.js App Router and Supabase. Reads are server-side and RLS-scoped; writes validate input, re-check permission, then call database RPCs where available. The product intentionally excludes AI, photo/file uploads, ads, presence dots and algorithmic feeds.",
    contribution:
      "I worked across the product structure, app routes and components, server actions, data modules, migration-backed permissions, moderation flows, and the verification/operator scripts documented in the repository.",
    architectureTitle: "Request and trust boundaries",
    architecture: [
      { label: "Next.js App Router", detail: "Pages, layouts and responsive app shell", state: "built" },
      { label: "Server actions + data reads", detail: "Validate → authorize → mutate; RLS-scoped reads", state: "built" },
      { label: "Supabase Postgres", detail: "RLS, RPCs, audit records and Google OAuth", state: "configured" },
      { label: "Private Realtime", detail: "Conversation broadcasts; no presence channel", state: "built" },
    ],
    screenshots: [
      {
        title: "Home feed",
        caption: "Repository browser evidence · dark theme",
        src: "https://raw.githubusercontent.com/sitemango/setup/main/docs/contrast-evidence/dark-home.png",
        alt: "Campus+ home feed screenshot from the repository's browser verification evidence",
        sourceKind: "repository evidence",
      },
      {
        title: "Marketplace",
        caption: "Repository browser evidence · marketplace surface",
        src: "https://raw.githubusercontent.com/sitemango/setup/main/docs/contrast-evidence/dark-market.png",
        alt: "Campus+ marketplace screenshot from repository browser evidence",
        sourceKind: "repository evidence",
      },
      {
        title: "Direct messaging",
        caption: "Repository browser evidence · chat",
        src: "https://raw.githubusercontent.com/sitemango/setup/main/docs/contrast-evidence/dark-chat.png",
        alt: "Campus+ chat page screenshot from repository browser evidence",
        sourceKind: "repository evidence",
      },
      {
        title: "Staff tools",
        caption: "Repository browser evidence · administration",
        src: "https://raw.githubusercontent.com/sitemango/setup/main/docs/contrast-evidence/dark-admin.png",
        alt: "Campus+ admin tools screenshot from repository browser evidence",
        sourceKind: "repository evidence",
      },
    ],
    evidence: [
      { state: "built", title: "Application surface", detail: "The implementation report lists 58 page routes, route handlers, responsive states and staff areas." },
      { state: "built", title: "Automated verification", detail: "The report dated 13 Oct 2026 records 193 Vitest tests passing, 24 migrations across 10 database suites, and 54 database audit assertions passing." },
      { state: "verify", title: "Live service configuration", detail: "A live Supabase project is not configured in the inspected checkout. Google OAuth, production environment variables and a live security probe remain deployment steps." },
    ],
    tradeoffs: [
      { title: "Database-enforced permissions", detail: "Mirroring authorization in server actions and Postgres RLS/RPCs adds implementation work, but a hidden UI button is never the security boundary." },
      { title: "Text-first, no AI or uploads", detail: "This narrows the media experience but reduces infrastructure and privacy surface area, keeping the product focused on practical student workflows." },
      { title: "One main backend service", detail: "Next.js plus Supabase avoids extra queues and caches, while making deployment correctness depend on careful Supabase configuration." },
    ],
    challenges: [
      "Keeping role checks consistent across pages, server actions and database permissions.",
      "Making reads return explicit empty/unavailable states rather than fake records or raw database errors.",
      "Designing anonymous Random conversations, reporting and moderation without exposing participant identity unnecessarily.",
    ],
    nextSteps: [
      "Create/configure the production Supabase project, migrations, institutional Google OAuth and the first admin role.",
      "Run the security probe and deployment checklist against the live service.",
      "Complete physical-device checks; the repository's browser evidence is headless Chromium rather than a Safari/Firefox pass.",
    ],
  },

  "civic-issue": {
    stageLabel: "Working demo · production verification pending",
    stageTone: "olive",
    stageNote:
      "The README calls SQLite the verified local/demo path. A PostgreSQL schema/configuration path exists, but the project explicitly requires provider-specific integration checks before production use.",
    problem:
      "A civic report needs more than a form: it needs location context, a transparent status history, accountable assignment, sensible priority and SLA handling, and a way for residents to confirm whether a resolution worked.",
    approach:
      "CivicIssue models a report from submission through review, verification, assignment, work, resolution and feedback. Domain rules are separated into status, priority, SLA, permission and validation modules; staff queues are scoped to departments and changes leave an audit trail.",
    contribution:
      "I built the application structure and worked through the data model, report lifecycle, priority/SLA rules, role-scoped workflows and resident-facing reporting experience represented in the repository.",
    architectureTitle: "Report lifecycle and data path",
    architecture: [
      { label: "Citizen / staff UI", detail: "Next.js App Router · role-specific surfaces", state: "built" },
      { label: "Domain + server rules", detail: "Validation, status machine, priority, SLA and permissions", state: "built" },
      { label: "Drizzle ORM", detail: "Relational schema and server-side queries", state: "built" },
      { label: "SQLite demo / PostgreSQL path", detail: "Local seeded demo verified; PostgreSQL needs integration checks", state: "verify" },
    ],
    screenshots: [
      {
        title: "CivicIssue public dashboard",
        caption: "Live deployment capture · current public landing page",
        src: liveCapture("https://civicissue-one.vercel.app/"),
        alt: "Screenshot capture of the deployed CivicIssue public dashboard",
        sourceKind: "live deployment capture",
      },
    ],
    evidence: [
      { state: "built", title: "Core workflow", detail: "The repository documents reporting, location privacy, issue history, comments, follows, confirmations, notifications, feedback, abuse reports and moderation records." },
      { state: "built", title: "Local demo dataset", detail: "The README documents a seeded Pune demonstration dataset with departments, categories, demo users and 900 reports across statuses and priorities." },
      { state: "verify", title: "Production persistence", detail: "SQLite is the verified local path. PostgreSQL and durable storage need provider-specific integration and deployment checks." },
      { state: "configured", title: "Optional services", detail: "AI suggestions, email delivery and S3-compatible storage are provider-configurable; deterministic local heuristics are available when AI is not configured." },
    ],
    tradeoffs: [
      { title: "Explicit issue state machine", detail: "More states and validation make the workflow more demanding to implement, but prevent reports from jumping between arbitrary statuses." },
      { title: "SQLite for the demo", detail: "A portable local database makes the demo easy to run. A production deployment must validate PostgreSQL behavior and configure durable file storage." },
      { title: "AI is advisory", detail: "Classification and priority suggestions should support staff decisions, not silently become the authority for a civic outcome." },
    ],
    challenges: [
      "Separating citizen-selected severity from system-computed priority and explaining priority/SLA decisions.",
      "Enforcing department scope and worker assignment in server-side rules, not only in the interface.",
      "Protecting exact locations and uploaded files while still giving staff enough context to resolve a report.",
    ],
    nextSteps: [
      "Run lint, typecheck, unit and end-to-end checks for the chosen deployment configuration.",
      "Exercise PostgreSQL queries, authentication, uploads and email on a staging deployment before calling those integrations production-ready.",
      "Test public location masking and staff permission boundaries with non-demo accounts.",
    ],
  },

  sitemango: {
    stageLabel: "Live frontend · form delivery needs a smoke test",
    stageTone: "terracotta",
    stageNote:
      "The deployed site and vanilla frontend are in place. The repository currently contains a Google Apps Script endpoint configured in the form code, but the browser uses no-cors and cannot read the response; a real enquiry still needs to be confirmed in the destination Sheet.",
    problem:
      "Small businesses need more than a static brochure: the website should express a clear point of view, make services easy to understand, and provide a practical way for potential customers to enquire.",
    approach:
      "A single-page HTML/CSS/JavaScript experience with scroll-snapped sections, an orbital project gallery, a command palette, theme persistence, touch-friendly interactions and reduced-motion handling. It avoids a framework, build step and heavy WebGL dependency.",
    contribution:
      "I built the web studio's interactive site and motion system, connected the contact flow to the Apps Script/Sheets pathway, and documented how to test and maintain the enquiry integration.",
    architectureTitle: "Static frontend and enquiry handoff",
    architecture: [
      { label: "HTML + CSS + vanilla JS", detail: "Responsive sections, motion, gallery and command palette", state: "built" },
      { label: "GitHub Pages", detail: "Static deployment with no build step", state: "built" },
      { label: "Google Apps Script", detail: "doPost handler receives enquiry submissions", state: "configured" },
      { label: "Google Sheets", detail: "Response rows are the intended destination; verify a live submission", state: "verify" },
    ],
    screenshots: [
      {
        title: "SiteMango live experience",
        caption: "Live deployment capture · main site",
        src: liveCapture("https://sitemango.github.io/home/"),
        alt: "Screenshot capture of the live SiteMango agency website",
        sourceKind: "live deployment capture",
      },
    ],
    evidence: [
      { state: "built", title: "Interactive front end", detail: "The README documents native scroll-snap, orbital work gallery, command palette, theme switch, cursor effects, responsive touch interactions and reduced-motion support." },
      { state: "configured", title: "Enquiry endpoint", detail: "The current main.js contains a configured Google Apps Script URL; Code.gs contains the doPost handler for writing enquiry data." },
      { state: "verify", title: "End-to-end delivery", detail: "Because the request is sent using no-cors, frontend code cannot inspect the server response. Confirm a test enquiry appears in the Sheet before claiming delivery is proven." },
    ],
    tradeoffs: [
      { title: "Vanilla stack, custom interaction", detail: "No framework or build pipeline keeps deployment light and portable, but the custom animation code needs deliberate performance, touch and accessibility work." },
      { title: "Scroll-snap editorial layout", detail: "Full-screen sections create a cinematic story, but scrolling and navigation must remain usable on small or short screens." },
      { title: "Apps Script as the backend", detail: "It keeps the contact flow simple and avoids hosting a separate API, while no-cors limits the frontend's ability to report definitive server-side success." },
    ],
    challenges: [
      "Balancing cursor-driven motion, orbit physics and scroll-linked effects with touch devices and reduced-motion preferences.",
      "Keeping the page deployable as static files without introducing a bundler or a heavy 3D runtime.",
      "Showing a truthful form confirmation despite the browser not being able to read the no-cors response.",
    ],
    nextSteps: [
      "Send a test enquiry from the public site and verify the exact row in the Google Sheet.",
      "Check that every section, command palette action and project link is usable with touch and keyboard only.",
      "Review performance and accessibility with reduced motion enabled and on a lower-powered phone.",
    ],
  },

  ecoswitch: {
    stageLabel: "Interactive design prototype · hardware results pending",
    stageTone: "ink",
    stageNote:
      "The repository is a detailed interactive research/design page with a three-zone controller model. Its own evidence legend says there are no measured results yet; the experiment result object is empty and pin numbers are intentionally unfilled pending a built prototype.",
    problem:
      "A classroom may consume energy while a zone is empty, but motion-only sensors can miss a person who is sitting still. Cameras would raise privacy concerns and are not part of this concept.",
    approach:
      "EcoSwitch explores combining PIR motion sensing with 24 GHz mmWave presence detection per zone. The intended logic turns a zone on when either sensor detects presence, then uses state/grace/manual/degraded handling so one zone can be controlled without necessarily switching the entire room.",
    contribution:
      "I developed the interactive system explanation, zone/sensor visualizations, scenario calculator and experiment-planning interface for a proposed ESP32-S3-based classroom controller.",
    architectureTitle: "Intended hardware signal path — not yet physically verified",
    architecture: [
      { label: "PIR + 24 GHz mmWave", detail: "Complementary motion and presence signals per zone", state: "design" },
      { label: "ESP32-S3 controller", detail: "Fuse signals, timers and per-zone state machine", state: "design" },
      { label: "Safe switching stage", detail: "Driver/relay design and electrical validation required", state: "verify" },
      { label: "Zone loads", detail: "Independent light/fan control is the target behavior", state: "design" },
    ],
    screenshots: [
      {
        title: "EcoSwitch schematic page",
        caption: "Live deployment capture · published schematic view",
        src: liveCapture("https://aminotkartik.github.io/schematic/"),
        alt: "Screenshot capture of the published EcoSwitch schematic page",
        sourceKind: "live deployment capture",
      },
    ],
    evidence: [
      { state: "built", title: "Interactive design surface", detail: "The HTML includes sensor illustrations, three-zone status controls, tunable parameters, an energy-loss calculator and an experiment matrix." },
      { state: "design", title: "Hardware path", detail: "The page describes an ESP32-S3, PIR and 24 GHz mmWave approach, but the inspected repository does not establish a completed physical assembly or verified firmware pinout." },
      { state: "verify", title: "Measured results", detail: "The page explicitly says nothing is categorized as measured yet; the results structure is empty. Energy savings shown are scenario estimates based on assumptions, not experimental outcomes." },
    ],
    tradeoffs: [
      { title: "Camera-free occupancy sensing", detail: "Avoiding cameras improves privacy, but combining sensor types still requires careful placement and calibration to avoid missed presence or false triggers." },
      { title: "Independent zone control", detail: "Switching only an empty zone could save energy, but it adds sensor, state-machine and electrical-design complexity compared with one room-wide switch." },
      { title: "Scenario model before field data", detail: "A calculator makes assumptions visible early; those estimates must stay separate from measured energy savings until controlled trials are complete." },
    ],
    challenges: [
      "PIR detects changes in infrared motion while mmWave behavior depends on module choice, placement and calibration; their blind spots are different.",
      "The controller needs explicit grace, manual-override and degraded-sensor behavior so a signal fault does not silently become a confident occupancy claim.",
      "Switching classroom loads requires a reviewed, appropriately isolated driver/relay design and bench checks; the page itself is not proof of safe installed hardware.",
    ],
    nextSteps: [
      "Confirm the exact mmWave module and validate its range/behavior against the manufacturer datasheet.",
      "Build and document the hardware, then complete the final pinout and firmware state machine.",
      "Run a controlled zone-by-zone experiment, log false positives/missed presence and standby power, and replace scenario assumptions with measured results.",
    ],
  },
};
