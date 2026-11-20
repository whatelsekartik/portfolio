import { useState } from "react";
import { FileIcon } from "../components/Icons";
import ScrollReveal from "../components/ScrollReveal";
import { projects } from "../data/portfolioData";
import { projectCaseStudies, type CaseStudyScreenshot, type EvidenceState } from "../data/projectCaseStudies";

const linkClass =
  "inline-flex items-center gap-2 border border-[#a99a7f] bg-[#fff7e8] px-3 py-2 text-[13px] font-semibold text-[#514c40] transition-colors hover:border-[#a96520] hover:bg-[#f1e8d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]";

const stateLabels: Record<EvidenceState, string> = {
  built: "Implemented",
  configured: "Configured in code",
  verify: "Needs verification",
  design: "Design / target",
};

function ScreenshotCard({
  shot,
  openUrl,
}: {
  shot: CaseStudyScreenshot;
  openUrl: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="case-shot min-w-0">
      <a
        href={openUrl}
        target="_blank"
        rel="noreferrer"
        className="case-shot-frame group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]"
        aria-label={`Open ${shot.title} live source in a new tab`}
      >
        {!failed ? (
          <img
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="case-shot-image"
          />
        ) : (
          <div className="case-shot-fallback">
            <span className="editorial-meta">Preview not available</span>
            <strong>{shot.title}</strong>
            <span>Open the linked project to inspect the current interface.</span>
          </div>
        )}
        <span className="case-shot-open" aria-hidden="true">↗</span>
      </a>
      <figcaption>
        <strong>{shot.title}</strong>
        <span>{shot.caption}</span>
        <small>{shot.sourceKind === "repository evidence" ? "Saved browser evidence" : "Captured from live deployment"}</small>
      </figcaption>
    </figure>
  );
}

export default function ProjectDetailApp({ payload }: { payload?: Record<string, unknown> }) {
  const id = payload?.id as string | undefined;
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const projectIndex = projects.findIndex((item) => item.id === project.id);
  const study = projectCaseStudies[project.id];

  return (
    <div className="case-study-root flex min-h-full min-w-0 flex-col gap-5 p-4 text-[15px] leading-relaxed sm:p-5">
      <ScrollReveal>
        <header className="case-study-hero relative overflow-hidden border border-[#29271f] bg-[#29271f] p-4 text-[#fffaf0] sm:p-5">
          <div className="relative z-10 flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#756951] bg-[#f1e8d6] p-1">
              <FileIcon kind={project.kind} className="h-10 w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="editorial-meta text-[#e7ad5a]">
                Project {String(projectIndex + 1).padStart(2, "0")} / {project.year}
              </p>
              <h1 className="font-display mt-2 break-words text-[clamp(1.8rem,4vw,2.4rem)] leading-[1.02] tracking-[-0.055em]">
                {project.name}<span className="text-[#e7ad5a]">.</span>
              </h1>
              <p className="mt-2 break-words text-[14px] leading-relaxed text-[#e7dfcf]">{project.tagline}</p>
              <span className={`case-stage case-stage--${study.stageTone}`}>{study.stageLabel}</span>
            </div>
          </div>
          <span className="pointer-events-none absolute -right-3 -bottom-10 font-display text-[120px] leading-none text-white/[0.06]" aria-hidden="true">
            0{projectIndex + 1}
          </span>
        </header>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <h2 className="editorial-meta mb-2 text-[#89551e]">The problem</h2>
          <p className="text-[15px] leading-[1.7] text-[#29271f]">{study.problem}</p>
          <h2 className="editorial-meta mb-2 mt-5 text-[#89551e]">The approach</h2>
          <p className="text-[15px] leading-[1.7] text-[#29271f]">{study.approach}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-contribution">
          <p className="editorial-meta mb-2 text-[#89551e]">My contribution</p>
          <p className="text-[14px] leading-[1.7] text-[#29271f]">{study.contribution}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="editorial-meta text-[#89551e]">Architecture</h2>
              <p className="mt-1 text-[13px] text-[#625b4c]">{study.architectureTitle}</p>
            </div>
            <span className="case-diagram-key"><span /> implemented <span className="case-key-config" /> configured / validate <span className="case-key-design" /> design</span>
          </div>
          <div className="case-architecture-flow" aria-label={study.architectureTitle}>
            {study.architecture.map((node, index) => (
              <div className="case-architecture-item" key={node.label}>
                {index > 0 && <span className="case-architecture-arrow" aria-hidden="true">→</span>}
                <div className={`case-architecture-node case-node--${node.state}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{node.label}</strong>
                  <p>{node.detail}</p>
                  <small>{stateLabels[node.state]}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <div className="mb-3">
            <h2 className="editorial-meta text-[#89551e]">Visual evidence</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#625b4c]">
              Repository screenshots are saved browser evidence; live captures show the current deployed page and may change over time.
            </p>
          </div>
          <div className="case-shot-grid">
            {study.screenshots.map((shot) => (
              <ScreenshotCard key={shot.title} shot={shot} openUrl={project.link ?? project.repo ?? "#"} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <h2 className="editorial-meta mb-3 text-[#89551e]">What is actually implemented?</h2>
          <div className="case-evidence-list">
            {study.evidence.map((item) => (
              <article className="case-evidence-item" key={item.title}>
                <span className={`case-evidence-dot case-dot--${item.state}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3>{item.title}</h3>
                    <span className={`case-evidence-badge case-badge--${item.state}`}>{stateLabels[item.state]}</span>
                  </div>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={`case-stage-note case-note--${study.stageTone}`}>
            <span className="editorial-meta">Status note</span>
            <p>{study.stageNote}</p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <h2 className="editorial-meta mb-3 text-[#89551e]">Engineering trade-offs</h2>
          <div className="case-tradeoff-grid">
            {study.tradeoffs.map((item, index) => (
              <article className="case-tradeoff" key={item.title}>
                <span className="editorial-meta">DECISION {String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <h2 className="editorial-meta mb-3 text-[#89551e]">Challenges worked through</h2>
          <ul className="case-bullet-list">
            {study.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="case-study-section">
          <h2 className="editorial-meta mb-3 text-[#89551e]">Next steps</h2>
          <ol className="case-next-list">
            {study.nextSteps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </ScrollReveal>

      <section className="mt-auto border-t border-dashed border-[#d8c9ad] pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="editorial-meta text-[#89551e]">Explore the project</h2>
          <span className="editorial-meta text-[#756951]">{project.tags.length} areas / tools</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[12px] text-[#514c40]">{tag}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className={linkClass}>
              Visit live project <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
              Inspect source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
