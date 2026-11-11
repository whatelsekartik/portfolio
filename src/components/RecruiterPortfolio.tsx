import { useEffect } from "react";
import { education, profile, projects, resume, skillGroups, socials } from "../data/portfolioData";
import { projectCaseStudies } from "../data/projectCaseStudies";
import "./RecruiterPortfolio.css";

interface RecruiterPortfolioProps {
  onReturnToDesktop: () => void;
}

const projectSummaries: Record<string, string> = {
  "campus-plus": "A campus platform for posts, communities, direct messages, events, notices and a student marketplace. Built with Next.js and Supabase. The application work is in place; production OAuth and deployment checks remain.",
  sitemango: "A small web studio focused on websites for local businesses. The site uses plain HTML, CSS and JavaScript. The enquiry flow is connected to Apps Script and Sheets, but still needs a live submission check.",
  ecoswitch: "A classroom energy-control concept using PIR and 24 GHz mmWave sensors with an ESP32-S3. The current work is an interactive design; the hardware prototype and measured results are still pending.",
  "civic-issue": "A reporting workflow for residents and municipal teams, from submitting an issue to assigning and tracking its resolution. The local demo is working; production database and service integrations still need validation.",
};

export default function RecruiterPortfolio({ onReturnToDesktop }: RecruiterPortfolioProps) {
  useEffect(() => {
    document.title = `${profile.name} — Portfolio`;
  }, []);

  return (
    <main className="recruiter-view">
      <a className="rv-skip-link" href="#main-content">Skip to content</a>

      <header className="rv-topbar">
        <a className="rv-wordmark" href="#top" aria-label={`${profile.name}, home`}>KG<span>.</span></a>
        <nav className="rv-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="rv-mode-link" type="button" onClick={onReturnToDesktop}>Desktop version ↗</button>
      </header>

      <div id="main-content">
        <section className="rv-hero rv-shell" id="top" aria-labelledby="rv-hero-title">
          <div className="rv-hero-copy">
            <p className="rv-eyebrow">Student developer <span>·</span> Pune, India</p>
            <h1 id="rv-hero-title">Kartik<br /><span>Gaikwad.</span></h1>
            <p className="rv-lead">I spend most of my time building web projects, working through product ideas and occasionally getting into electronics.</p>
            <div className="rv-hero-actions">
              <a className="rv-button rv-button-primary" href="#work">View my work <span aria-hidden="true">↓</span></a>
              <a className="rv-button rv-button-secondary" href={resume.pdfUrl} download={resume.downloadName}>Download résumé <span aria-hidden="true">↗</span></a>
            </div>
            <div className="rv-social-row" aria-label="Contact links">
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={`mailto:${socials.email}`}>Email ↗</a>
            </div>
          </div>
          <aside className="rv-hero-aside">
            <p className="rv-aside-heading">A few things I work on</p>
            <ul>
              {projects.map((project) => (
                <li key={project.id}><a href={`#project-${project.id}`}>{project.name}<span>↗</span></a></li>
              ))}
            </ul>
            <p className="rv-aside-note">Frontend, product work and practical experiments.</p>
          </aside>
        </section>

        <section className="rv-section rv-shell" id="work" aria-labelledby="rv-work-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">Selected projects</p><h2 id="rv-work-title">Things I've worked on<span>.</span></h2></div>
            <p className="rv-section-intro">A mix of software projects, a small web studio and an electronics concept. The status notes are included so it's clear what is built and what still needs work.</p>
          </div>

          <div className="rv-project-list">
            {projects.map((project) => {
              const study = projectCaseStudies[project.id];
              return (
                <article className="rv-project" id={`project-${project.id}`} key={project.id}>
                  <div className="rv-project-main">
                    <p className="rv-project-type">{project.kind === "chip" ? "Hardware concept" : project.kind === "web" ? "Web project" : "Software project"} <span>·</span> {project.year}</p>
                    <h3>{project.name}</h3>
                    <p className="rv-project-tagline">{project.tagline}</p>
                    <p className="rv-project-description">{projectSummaries[project.id] ?? project.description}</p>
                    <p className="rv-contribution">{study.contribution}</p>
                    <ul className="rv-tags" aria-label={`${project.name} technologies`}>
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                  <aside className="rv-project-meta">
                    <p className="rv-project-status">{study.stageLabel}</p>
                    <details className="rv-project-details">
                      <summary>More on the current state</summary>
                      <p>{study.stageNote}</p>
                    </details>
                    <div className="rv-project-links">
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer">Open project ↗</a>}
                      {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">View source ↗</a>}
                    </div>
                  </aside>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rv-section rv-shell" id="about" aria-labelledby="rv-about-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">About</p><h2 id="rv-about-title">A little context<span>.</span></h2></div>
          </div>
          <div className="rv-about-copy">
            <p>I'm studying Information Technology at PCCOE. Most of my experience so far comes from independent projects rather than formal industry roles.</p>
            <p>I like working across the whole shape of a project: figuring out what it should do, building the interface, connecting the data and checking the details that make it usable.</p>
          </div>
        </section>

        <section className="rv-section rv-shell" id="toolkit" aria-labelledby="rv-toolkit-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">Toolkit</p><h2 id="rv-toolkit-title">Technologies I use<span>.</span></h2></div>
            <p className="rv-section-intro">A practical list, grouped by where I use them. No percentage bars or self-rated proficiency scores.</p>
          </div>
          <div className="rv-skill-grid">
            {skillGroups.map((group) => (
              <article className="rv-skill-group" key={group.name}>
                <h3>{group.name}</h3>
                <ul>{group.items.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rv-section rv-shell" id="education" aria-labelledby="rv-education-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">Education</p><h2 id="rv-education-title">What I'm studying<span>.</span></h2></div>
          </div>
          <div className="rv-education-grid">
            <div className="rv-education-column">
              <h3>Current</h3>
              {education.current.map((item) => (
                <article className="rv-education-entry" key={item.degree + item.program}>
                  <div><h4>{item.degree} · {item.program}</h4>{item.institution && <p>{item.institution}</p>}<small>{item.status}</small></div>
                </article>
              ))}
            </div>
            <div className="rv-education-column">
              <h3>Previous</h3>
              {education.schools.map((school) => (
                <article className="rv-education-entry" key={school.school}>
                  <div><h4>{school.degree}</h4><p>{school.school} · {school.period}</p>{school.details.map((detail) => <small key={detail}>{detail}</small>)}</div>
                </article>
              ))}
            </div>
          </div>
          <div className="rv-academic-notes">
            <h3>Academic highlights</h3>
            <ul>{education.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
          </div>
        </section>

        <section className="rv-contact" id="contact" aria-labelledby="rv-contact-title">
          <div className="rv-shell rv-contact-inner">
            <div><p className="rv-eyebrow">Contact</p><h2 id="rv-contact-title">Get in touch.</h2><p>For opportunities, project enquiries or a conversation.</p></div>
            <div className="rv-contact-actions">
              <a className="rv-button rv-button-primary" href={`mailto:${socials.email}`}>Email me ↗</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
        </section>
      </div>

      <footer className="rv-footer rv-shell">
        <a className="rv-wordmark" href="#top">KG<span>.</span></a>
        <p>{profile.name} · Pune, India</p>
        <button type="button" onClick={onReturnToDesktop}>Back to the desktop version ↗</button>
      </footer>
    </main>
  );
}
