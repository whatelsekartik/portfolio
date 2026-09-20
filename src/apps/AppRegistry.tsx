import type { WindowInstance } from "../types";
import AboutApp from "./AboutApp";
import TerminalApp from "./TerminalApp";
import FinderApp from "./FinderApp";
import TextFileApp from "./TextFileApp";
import ProjectsApp from "./ProjectsApp";
import ProjectDetailApp from "./ProjectDetailApp";
import SkillsApp from "./SkillsApp";
import EducationApp from "./EducationApp";
import ExperienceApp from "./ExperienceApp";
import TrashApp from "./TrashApp";
import ContactApp from "./ContactApp";
import ResumeApp from "./ResumeApp";
import GuestbookApp from "./GuestbookApp";
import { readmeText } from "../data/portfolioData";

export function renderAppContent(win: WindowInstance) {
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
