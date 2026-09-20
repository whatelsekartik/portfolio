import { lazy, Suspense } from "react";
import type { WindowInstance } from "../types";
import AboutApp from "./AboutApp";
import { readmeText } from "../data/portfolioData";

// Only About opens on load, so every other app is split into its own chunk
// and downloaded the first time it's opened.
const TerminalApp = lazy(() => import("./TerminalApp"));
const FinderApp = lazy(() => import("./FinderApp"));
const TextFileApp = lazy(() => import("./TextFileApp"));
const ProjectsApp = lazy(() => import("./ProjectsApp"));
const ProjectDetailApp = lazy(() => import("./ProjectDetailApp"));
const SkillsApp = lazy(() => import("./SkillsApp"));
const EducationApp = lazy(() => import("./EducationApp"));
const ExperienceApp = lazy(() => import("./ExperienceApp"));
const TrashApp = lazy(() => import("./TrashApp"));
const ContactApp = lazy(() => import("./ContactApp"));
const ResumeApp = lazy(() => import("./ResumeApp"));
const GuestbookApp = lazy(() => import("./GuestbookApp"));

function content(win: WindowInstance) {
  switch (win.appId) {
    case "about":
      return <AboutApp />;
    case "terminal":
      return <TerminalApp windowId={win.id} />;
    case "finder":
      return <FinderApp />;
    case "readme":
      return <TextFileApp text={readmeText()} />;
    case "textfile":
      return <TextFileApp text={String(win.payload?.text ?? "")} />;
    case "projects":
      return <ProjectsApp />;
    case "project-detail":
      return <ProjectDetailApp payload={win.payload} />;
    case "skills":
      return <SkillsApp />;
    case "education":
      return <EducationApp />;
    case "experience":
      return <ExperienceApp />;
    case "trash":
      return <TrashApp />;
    case "contact":
      return <ContactApp />;
    case "resume":
      return <ResumeApp />;
    case "guestbook":
      return <GuestbookApp />;
    default:
      return <div className="p-4">Nothing here yet.</div>;
  }
}

export function renderAppContent(win: WindowInstance) {
  return (
    <Suspense fallback={<div className="p-4 text-[14px] text-black/60">Loading…</div>}>{content(win)}</Suspense>
  );
}
