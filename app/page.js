import Image from 'next/image';
import AnimatedSection from '../components/AnimatedSection';
import ProjectCarousel from '../components/ProjectCarousel';
import { featuredProjects, stats, strengths, timeline } from '../data/portfolio';

export default function Home() {
  return (
    <main className="page">
      <div className="background-grid" />
      <header className="topbar">
        <a href="#home" className="brand">KG</a>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#mobile-apps">Mobile Apps</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <AnimatedSection id="home" className="hero hero-section">
        <div className="hero-copy">
          <p className="eyebrow">General personal brand · Premium motion · Student developer</p>
          <h1>
            Kartik Gaikwad builds <span>clear, modern, tech-forward</span> digital experiences.
          </h1>
          <p className="lead">
            I’m a student developer blending strong academic performance with early project-building
            curiosity, now refocusing on sharper fundamentals, better presentation, and stronger
            public work.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="button-primary">Explore work</a>
            <a href="mailto:kartikgaikwad250@gmail.com" className="button-secondary">Email me</a>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="aura aura-one" />
          <div className="aura aura-two" />
          <div className="avatar-panel">
            <div className="avatar-frame">
              <Image src="/avatar-tech.svg" alt="Abstract tech-forward avatar" width={640} height={640} priority />
            </div>
            <div className="signal-card">
              <span className="eyebrow">Core strengths</span>
              <ul>
                {strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section className="marquee-band" aria-label="Highlights">
        <div className="marquee-track">
          <span>SOF IMO 92 percentile</span>
          <span>JEE Math 96.5 percentile</span>
          <span>Voice-driven calculator</span>
          <span>Interactive web builds</span>
          <span>MIT App Inventor projects</span>
          <span>Modern personal brand</span>
          <span>SOF IMO 92 percentile</span>
          <span>JEE Math 96.5 percentile</span>
        </div>
      </section>

      <AnimatedSection id="about" className="content-section split-section">
        <div>
          <p className="eyebrow">About</p>
          <h2>Professional by design, modern by feel.</h2>
        </div>
        <div className="panel-grid">
          <article className="glass-panel">
            <h3>Academic credibility</h3>
            <p>
              Strong performance in Olympiad mathematics, JEE Mathematics, and board exams gives
              my profile a disciplined, analytical edge.
            </p>
          </article>
          <article className="glass-panel">
            <h3>Technical foundation</h3>
            <p>
              My learning path includes HTML, C++, Assembly Language Programming, Data Structures,
              and practical experimentation through self-built projects.
            </p>
          </article>
          <article className="glass-panel">
            <h3>Current direction</h3>
            <p>
              I’m actively upgrading my presentation, portfolio quality, and project storytelling to
              reflect where I’m headed as a builder.
            </p>
          </article>
        </div>
      </AnimatedSection>

      <AnimatedSection id="projects" className="content-section">
        <ProjectCarousel projects={featuredProjects} />
      </AnimatedSection>

      <AnimatedSection id="journey" className="content-section timeline-section">
        <div className="section-headline">
          <p className="eyebrow">Journey</p>
          <h2>Section-by-section transitions meet a focused story arc.</h2>
        </div>
        <div className="timeline-grid">
          {timeline.map((item) => (
            <article key={item.phase} className="timeline-card">
              <span>{item.period}</span>
              <h3>{item.phase}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="mobile-apps" className="content-section">
        <div className="section-headline">
          <p className="eyebrow">Mobile apps</p>
          <h2>Early app experimentation still matters.</h2>
        </div>
        <div className="mobile-app-card">
          <div>
            <h3>MIT App Inventor work</h3>
            <p>
              Alongside the featured voice-driven calculator, there are roughly 10 additional mobile
              app experiments from earlier exploration.
            </p>
          </div>
          <div className="placeholder-note">
            Additional MIT App Inventor projects being migrated—stay tuned!
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="content-section contact-section">
        <div className="contact-card">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Open to conversations, collaborations, and new opportunities.</h2>
            <p>
              If you want to discuss projects, admissions, internships, or just connect, feel free
              to reach out.
            </p>
          </div>
          <div className="contact-links">
            <a href="mailto:kartikgaikwad250@gmail.com">kartikgaikwad250@gmail.com ↗</a>
            <a href="https://github.com/kartik-009-k?tab=repositories" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/in/kartik-gaikwad-3079a1286/" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
