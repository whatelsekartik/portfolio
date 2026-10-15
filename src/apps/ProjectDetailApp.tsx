import { FileIcon } from "../components/Icons";
import { projects, socials } from "../data/portfolioData";
import ScrollReveal from "../components/ScrollReveal";

const linkClass =
  "inline-flex items-center gap-2 border border-[#a99a7f] bg-[#fff7e8] px-3 py-2 text-[13px] font-semibold text-[#514c40] transition-colors hover:border-[#a96520] hover:bg-[#f1e8d6]";

export default function ProjectDetailApp({ payload }: { payload?: Record<string, unknown> }) {
  const id = payload?.id as string | undefined;
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const projectIndex = projects.findIndex((item) => item.id === project.id);

  return (
    <div className="flex min-h-full flex-col gap-5 p-4 text-[15px] leading-relaxed">
      <ScrollReveal>
        <header className="flex items-start gap-3 border-b border-dashed border-[#d8c9ad] pb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#d8c9ad] bg-[#f5ead6] p-1">
            <FileIcon kind={project.kind} className="h-12 w-12" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#89551e]">
              Project {String(projectIndex + 1).padStart(2, "0")} · {project.year}
            </p>
            <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-[-0.04em] text-[#29271f]">
              {project.name}<span className="text-[#a96520]">.</span>
            </h1>
            <p className="mt-1 text-[14px] leading-relaxed text-[#514c40]">{project.tagline}</p>
          </div>
        </header>
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#756951]">Overview</h2>
          <p className="text-[15px] leading-[1.7] text-[#29271f]">{project.description}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#756951]">Tools & themes</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[13px] text-[#514c40]">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-dashed border-[#d8c9ad] pt-4">
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className={linkClass}>
            Visit site <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
            View code <span aria-hidden="true">↗</span>
          </a>
        )}
        {!project.link && !project.repo && socials.github && (
          <a href={socials.github} target="_blank" rel="noreferrer" className={linkClass}>
            More on GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
