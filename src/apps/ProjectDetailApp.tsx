import { FileIcon } from "../components/Icons";
import { projects } from "../data/portfolioData";
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
        <header className="relative overflow-hidden border border-[#29271f] bg-[#29271f] p-4 text-[#fffaf0]">
          <div className="relative z-10 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#756951] bg-[#f1e8d6] p-1">
              <FileIcon kind={project.kind} className="h-10 w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="editorial-meta text-[#e7ad5a]">
                Project {String(projectIndex + 1).padStart(2, "0")} / {project.year}
              </p>
              <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.4rem)] leading-[1.02] tracking-[-0.055em]">
                {project.name}<span className="text-[#e7ad5a]">.</span>
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[#e7dfcf]">{project.tagline}</p>
            </div>
          </div>
          <span className="pointer-events-none absolute -right-3 -bottom-10 font-display text-[120px] leading-none text-white/[0.06]" aria-hidden="true">0{projectIndex + 1}</span>
        </header>
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <h2 className="editorial-meta mb-2 text-[#89551e]">The idea</h2>
          <p className="text-[15px] leading-[1.7] text-[#29271f]">{project.description}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <h2 className="editorial-meta mb-2 text-[#89551e]">Tools & themes</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[13px] text-[#514c40]">{tag}</span>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {(project.link || project.repo) && (
        <div className="mt-auto flex flex-wrap gap-2 border-t border-dashed border-[#d8c9ad] pt-4">
          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className={linkClass}>Visit site <span aria-hidden="true">↗</span></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>View code <span aria-hidden="true">↗</span></a>}
        </div>
      )}
    </div>
  );
}
