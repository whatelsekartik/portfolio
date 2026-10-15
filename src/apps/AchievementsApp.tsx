import { useMemo, useState } from "react";
import { achievementRecords, projects } from "../data/portfolioData";
import ScrollReveal from "../components/ScrollReveal";

type Filter = "all" | "academics" | "projects";
type AcademicCard = {
  id: string;
  title: string;
  kind: "academic";
  category: string;
  metric: string;
  metricLabel: string;
  note: string;
  period: string;
};
type ProjectCard = {
  id: string;
  title: string;
  kind: "project";
  category: "Projects";
  metric: string;
  metricLabel: string;
  note: string;
  period: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
};
type AchievementCard = AcademicCard | ProjectCard;

const academics: AcademicCard[] = achievementRecords.map((item) => ({
  id: item.id,
  title: item.title,
  kind: "academic",
  category: item.category,
  metric: item.result,
  metricLabel: item.resultLabel,
  note: item.note,
  period: item.period,
}));

const builds: ProjectCard[] = projects.map((project) => ({
  id: project.id,
  title: project.name,
  kind: "project",
  category: "Projects",
  metric: project.year,
  metricLabel: "project",
  note: project.tagline,
  period: project.year,
  description: project.description,
  tags: project.tags,
  link: project.link,
  repo: project.repo,
}));

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "academics", label: "Academic record" },
  { id: "projects", label: "Projects & prototypes" },
];

export default function AchievementsApp() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>("mht-cet");
  const cards = useMemo<AchievementCard[]>(() => {
    const all = [...academics, ...builds];
    if (filter === "academics") return all.filter((item) => item.kind === "academic");
    if (filter === "projects") return all.filter((item) => item.kind === "project");
    return all;
  }, [filter]);

  return (
    <div className="achievement-app flex min-h-full flex-col gap-4 p-3 sm:p-4">
      <ScrollReveal>
        <header className="achievement-hero relative overflow-hidden border border-[#29271f] bg-[#29271f] p-4 text-[#fffaf0] sm:p-5">
          <div className="achievement-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="achievement-orbit orbit-one pointer-events-none" aria-hidden="true" />
          <div className="achievement-orbit orbit-two pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="editorial-meta text-[#e7ad5a]">Personal archive / 2026</span>
              <span className="achievement-live"><span /> FIELD NOTES</span>
            </div>
            <h1 className="editorial-title mt-4 max-w-[12ch] text-[clamp(2.5rem,7vw,4.15rem)]">
              PROOF<br />OF <span className="text-[#e7ad5a]">WORK.</span>
            </h1>
            <p className="mt-3 max-w-[26rem] text-[14px] leading-relaxed text-[#e7dfcf]">
              Scores earned, ideas made tangible, and a record that keeps growing.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="achievement-stat">
                <span className="editorial-meta">MHT CET</span>
                <strong>98.98</strong>
                <small>percentile</small>
              </div>
              <div className="achievement-stat">
                <span className="editorial-meta">JEE MAIN · MATHS</span>
                <strong>96.5</strong>
                <small>percentile</small>
              </div>
            </div>
          </div>
          <span className="achievement-cross cross-a" aria-hidden="true">✳</span>
          <span className="achievement-cross cross-b" aria-hidden="true">+</span>
          <div className="achievement-index editorial-meta" aria-hidden="true">KG<br />/ ARCHIVE<br />001—010</div>
        </header>
      </ScrollReveal>

      <section aria-label="Achievement filters">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-[#d8c9ad] pb-2">
          <div>
            <p className="editorial-meta text-[#89551e]">Browse the record</p>
            <h2 className="mt-1 font-display text-[21px] leading-tight text-[#29271f]">A few things that add up.</h2>
          </div>
          <span className="editorial-meta text-[#756951]">{String(cards.length).padStart(2, "0")} entries</span>
        </div>
        <div className="achievement-filters" role="tablist" aria-label="Achievement category">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => {
                setFilter(item.id);
                setExpanded(null);
              }}
              className={filter === item.id ? "is-active" : ""}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="achievement-list flex flex-col gap-2 pb-3">
        {cards.map((item, index) => {
          const isOpen = expanded === item.id;
          return (
            <ScrollReveal key={item.id}>
              <article className={`achievement-card ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="achievement-card-head"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="achievement-number editorial-meta">{String(index + 1).padStart(2, "0")}</span>
                  <span className="achievement-card-main">
                    <span className="achievement-category editorial-meta">{item.category} · {item.period}</span>
                    <span className="achievement-card-title">{item.title}</span>
                    <span className="achievement-card-note">{item.note}</span>
                  </span>
                  <span className="achievement-metric">
                    <strong>{item.metric}</strong>
                    <small>{item.metricLabel}</small>
                  </span>
                  <span className="achievement-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="achievement-expanded">
                    {item.kind === "academic" ? (
                      <p>{item.note}</p>
                    ) : (
                      <>
                        <p>{item.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => <span className="achievement-tag" key={tag}>{tag}</span>)}
                        </div>
                      </>
                    )}
                    {(item.kind === "project" && (item.link || item.repo)) && (
                      <div className="mt-4 flex flex-wrap gap-4 border-t border-[#d8c9ad] pt-3">
                        {item.link && <a href={item.link} target="_blank" rel="noreferrer">Explore project ↗</a>}
                        {item.repo && <a href={item.repo} target="_blank" rel="noreferrer">Read the code ↗</a>}
                      </div>
                    )}
                  </div>
                )}
              </article>
            </ScrollReveal>
          );
        })}
      </div>

      <footer className="achievement-footer flex items-start gap-3 border-t border-dashed border-[#d8c9ad] pt-3">
        <span className="achievement-footer-star" aria-hidden="true">✳</span>
        <div>
          <p className="editorial-meta text-[#89551e]">Still in progress</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#514c40]">
            This archive is meant to grow with real work: new builds, competitions, collaborations, and milestones worth keeping.
          </p>
        </div>
      </footer>
    </div>
  );
}
