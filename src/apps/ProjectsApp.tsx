import { projects } from "../data/portfolioData";
import ScrollReveal from "../components/ScrollReveal";
import { useOpenApp } from "./appDefs";

export default function ProjectsApp() {
  const openApp = useOpenApp();

  return (
    <div className="h-full overflow-auto p-4 text-[15px]">
      <header className="mb-5 border-b border-[#d8c9ad] pb-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#89551e]">Selected work · 2025–26</p>
        <h1 className="mt-1 text-[27px] font-bold leading-tight tracking-[-0.04em] text-[#29271f]">
          Things I’m building<span className="text-[#a96520]">.</span>
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#514c40]">
          A few projects and experiments across software, product ideas, and hardware.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {projects.map((project, index) => (
          <ScrollReveal key={project.id}>
            <button
              type="button"
              onClick={() => openApp("project-detail", { id: project.id })}
              className="group w-full cursor-pointer border border-[#d8c9ad] bg-[#fffaf0] p-3 text-left transition-colors hover:border-[#a96520] hover:bg-[#fff7e8]"
            >
              <div className="flex items-start gap-3">
                <span className="pt-0.5 font-mono text-[13px] text-[#a96520]">0{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h2 className="text-[18px] font-bold leading-tight tracking-[-0.02em] text-[#29271f]">{project.name}</h2>
                    <span className="text-[12px] text-[#756951]">{project.year}</span>
                  </div>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#514c40]">{project.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="border border-[#e0d3bc] bg-[#f8f1e4] px-2 py-0.5 text-[12px] text-[#625b4c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-0.5 text-[18px] text-[#a96520] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
