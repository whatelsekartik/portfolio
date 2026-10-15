import { projects } from "../data/portfolioData";
import ScrollReveal from "../components/ScrollReveal";
import { useOpenApp } from "./appDefs";

export default function ProjectsApp() {
  const openApp = useOpenApp();

  return (
    <div className="h-full overflow-auto p-4 text-[15px]">
      <ScrollReveal>
        <header className="relative mb-5 overflow-hidden border border-[#29271f] bg-[#29271f] p-4 text-[#fffaf0]">
          <span className="editorial-meta text-[#e7ad5a]">Selected work / 2025—26</span>
          <h1 className="editorial-title mt-3 text-[clamp(2.2rem,5vw,3rem)]">
            MADE TO<br />BE USED<span className="text-[#e7ad5a]">.</span>
          </h1>
          <p className="mt-3 max-w-[21rem] text-[14px] leading-relaxed text-[#e7dfcf]">
            Software, product ideas, and small experiments that connect the screen to the real world.
          </p>
          <span className="absolute top-4 right-4 h-3 w-3 border-2 border-[#e7ad5a]" aria-hidden="true" />
        </header>
      </ScrollReveal>

      <div className="mb-3 flex items-center justify-between border-b border-[#d8c9ad] pb-2">
        <span className="editorial-meta text-[#514c40]">Project index</span>
        <span className="editorial-meta text-[#756951]">{String(projects.length).padStart(2, "0")} entries</span>
      </div>

      <div className="flex flex-col gap-3 pb-2">
        {projects.map((project, index) => {
          const featured = index === 0;
          return (
            <ScrollReveal key={project.id}>
              <button
                type="button"
                onClick={() => openApp("project-detail", { id: project.id })}
                className={`group w-full cursor-pointer border p-3 text-left transition-colors ${featured ? "border-[#29271f] bg-[#f1e8d6] hover:bg-[#ead8b9]" : "border-[#d8c9ad] bg-[#fffaf0] hover:border-[#a96520] hover:bg-[#fff7e8]"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`editorial-meta pt-1 ${featured ? "text-[#a96520]" : "text-[#756951]"}`}>0{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h2 className="font-display text-[21px] leading-tight tracking-[-0.04em] text-[#29271f]">{project.name}</h2>
                      <span className="editorial-meta text-[#756951]">{project.year}</span>
                    </div>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#514c40]">{project.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="border border-[#d8c9ad] bg-[#fffaf0] px-2 py-1 text-[11px] text-[#625b4c]">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="mt-0.5 text-[20px] text-[#a96520] transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                </div>
              </button>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
