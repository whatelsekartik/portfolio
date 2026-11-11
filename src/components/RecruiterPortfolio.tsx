import { useEffect } from "react";
import { education, experience, profile, projects, resume, skillGroups, socials } from "../data/portfolioData";
import { projectCaseStudies } from "../data/projectCaseStudies";
import "./RecruiterPortfolio.css";

interface RecruiterPortfolioProps {
  onReturnToDesktop: () => void;
}

export default function RecruiterPortfolio({ onReturnToDesktop }: RecruiterPortfolioProps) {
  useEffect(() => {
    document.title = `${profile.name} — Developer Portfolio`;
  }, []);

  return (
    <main className="recruiter-view">
      <a className="rv-skip-link" href="#main-content">Skip to content</a>

      <header className="rv-topbar">
        <a className="rv-wordmark" href="#top" aria-label={`${profile.name}, home`}>
          KG<span>.</span>
        </a>
        <nav className="rv-nav" aria-label="Main navigation">
          <a href="#projects">Work</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="rv-mode-link" type="button" onClick={onReturnToDesktop}>
          <span className="rv-mode-full">Interactive desktop ↗</span>
          <span className="rv-mode-short">Desktop ↗</span>
        </button>
      </header>

      <div id="main-content">
        <section className="rv-hero rv-shell" id="top" aria-labelledby="rv-hero-title">
          <div className="rv-hero-copy">
            <p className="rv-eyebrow"><span className="rv-status-dot" /> {profile.title} <span className="rv-eyebrow-separator">/</span> {profile.location}</p>
            <h1 id="rv-hero-title">Kartik<br /><span>Gaikwad.</span></h1>
            <p className="rv-lead">{profile.quickIntro}</p>
            <p className="rv-tagline">{profile.tagline}</p>
            <div className="rv-hero-actions">
              <a className="rv-button rv-button-primary" href="#projects">Explore selected work <span aria-hidden="true">↓</span></a>
              <a className="rv-button rv-button-secondary" href={resume.pdfUrl} download={resume.downloadName}>Download résumé <span aria-hidden="true">↗</span></a>
            </div>
            <div className="rv-social-row" aria-label="Contact links">
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={`mailto:${socials.email}`}>Email ↗</a>
            </div>
          </div>
          <aside className="rv-hero-aside" aria-label="Profile summary">
            <span className="rv-aside-index">PROFILE / 01</span>
            <p>{resume.summary}</p>
            <div className="rv-aside-rule" />
            <span className="rv-aside-label">CURRENT FOCUS</span>
            <ul>
              {profile.interests.slice(0, 4).map((interest) => <li key={interest}>{interest}</li>)}
            </ul>
            <span className="rv-aside-foot">PUNE, INDIA · {new Date().getFullYear()}</span>
          </aside>
          <a className="rv-scroll-cue" href="#projects" aria-label="Scroll to selected work"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section className="rv-section rv-shell" id="projects" aria-labelledby="rv-projects-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">01 / Selected work</p><h2 id="rv-projects-title">Built with intent<span>.</span></h2></div>
            <p className="rv-section-intro">A selection of software, product and hardware explorations. Each entry links to the live experience and its source where available.</p>
          </div>
          <div className="rv-project-grid">
            {projects.map((project, index) => {
              const study = projectCaseStudies[project.id];
              return (
                <article className="rv-project-card" key={project.id}>
                  <div className="rv-project-topline">
                    <span>0{index + 1} / {project.year}</span>
                    <span className={`rv-project-stage rv-stage-${study.stageTone}`}>{study.stageLabel}</span>
                  </div>
                  <h3>{project.name}<span>.</span></h3>
                  <p className="rv-project-tagline">{project.tagline}</p>
                  <p className="rv-project-description">{project.description}</p>
                  <div className="rv-contribution">
                    <span>MY CONTRIBUTION</span>
                    <p>{study.contribution}</p>
                  </div>
                  <ul className="rv-tags" aria-label={`${project.name} technologies and topics`}>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <details className="rv-project-details">
                    <summary>Implementation notes &amp; current status</summary>
                    <p>{study.stageNote}</p>
                  </details>
                  <div className="rv-project-links">
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live project ↗</a>}
                    {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Source code ↗</a>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rv-section rv-shell" id="experience" aria-labelledby="rv-experience-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">02 / Experience</p><h2 id="rv-experience-title">Learning by building<span>.</span></h2></div>
            <p className="rv-section-intro">A practical record of the roles and independent work behind the projects.</p>
          </div>
          <div className="rv-experience-list">
            {experience.map((item, index) => (
              <article className="rv-experience-item" key={`${item.org}-${item.role}`}>
                <span className="rv-experience-number">0{index + 1}</span>
                <div className="rv-experience-main">
                  <div className="rv-experience-title-row"><h3>{item.role}</h3><span>{item.period}</span></div>
                  <p className="rv-experience-org">{item.org} <span>/</span> {item.kind}</p>
                  <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rv-section rv-shell" id="skills" aria-labelledby="rv-skills-title">
          <div className="rv-section-heading">
            <div><p className="rv-eyebrow">03 / Toolkit</p><h2 id="rv-skills-title">Tools I work with<span>.</span></h2></div>
            <p className="rv-section-intro">A working toolkit across frontend development, software, and hands-on computing. Skill levels are intentionally not presented as self-scored bars.</p>
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
            <div><p className="rv-eyebrow">04 / Education</p><h2 id="rv-education-title">The academic track<span>.</span></h2></div>
            <p className="rv-section-intro">Formal study alongside independent exploration in software and electronics.</p>
          </div>
          <div className="rv-education-grid">
            <div className="rv-education-current">
              <p className="rv-small-label">CURRENTLY PURSUING</p>
              {education.current.map((item, index) => (
                <article className="rv-education-entry" key={item.degree + item.program}>
                  <span>0{index + 1}</span>
                  <div><h3>{item.degree} · {item.program}</h3>{item.institution && <p>{item.institution}</p>}<small>{item.status}</small></div>
                </article>
              ))}
            </div>
            <div className="rv-education-previous">
              <p className="rv-small-label">PREVIOUS EDUCATION</p>
              {education.schools.map((school) => (
                <article className="rv-education-entry" key={school.school}>
                  <span>↳</span>
                  <div><h3>{school.degree}</h3><p>{school.school} · {school.period}</p>{school.details.map((detail) => <small key={detail}>{detail}</small>)}</div>
                </article>
              ))}
            </div>
          </div>
          <div className="rv-academic-notes">
            <p className="rv-small-label">SELECTED ACADEMIC HIGHLIGHTS</p>
            <ul>{education.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
          </div>
        </section>

        <section className="rv-contact-band" id="contact" aria-labelledby="rv-contact-title">
          <div className="rv-shell rv-contact-inner">
            <div><p className="rv-eyebrow">05 / Get in touch</p><h2 id="rv-contact-title">Have something<br />worth building?</h2><p>For opportunities, collaborations, or a conversation about a project.</p></div>
            <div className="rv-contact-actions">
              <a className="rv-button rv-button-light" href={`mailto:${socials.email}`}>Start a conversation ↗</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={resume.pdfUrl} download={resume.downloadName}>Download résumé ↗</a>
            </div>
          </div>
        </section>
      </div>

      <footer className="rv-footer rv-shell">
        <a className="rv-wordmark" href="#top">KG<span>.</span></a>
        <p>Designed and built by {profile.name}.</p>
        <button type="button" onClick={onReturnToDesktop}>Explore the interactive desktop ↗</button>
      </footer>
    </main>
  );
}
