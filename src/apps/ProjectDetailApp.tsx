import { FileIcon } from "../components/Icons";
import { projects } from "../data/portfolioData";

const btn =
  "border-2 border-black bg-[#dfdfdf] px-3 py-1 text-[13px] shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:bg-black hover:text-white";

export default function ProjectDetailApp({ payload }: { payload?: Record<string, unknown> }) {
  const id = payload?.id as string | undefined;
  const project = projects.find((p) => p.id === id) ?? projects[0];

  return (
    <div className="flex min-h-full flex-col gap-3 p-4 text-[14px] leading-snug">
      <div className="flex items-center gap-3 border-b-2 border-dashed border-black/30 pb-3">
        <FileIcon kind={project.kind} className="h-12 w-12 shrink-0" />
        <div>
          <p className="font-chicago text-[17px]">{project.name}</p>
          <p className="text-black/60">
            {project.tagline} ({project.year})
          </p>
        </div>
      </div>

      <p>{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="border border-black bg-[#f2f2f2] px-1.5 py-0.5 text-[13px]">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-2 border-t-2 border-dashed border-black/30 pt-3">
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className={btn}>
            Visit site ↗
          </a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" className={btn}>
            View code ↗
          </a>
        )}
      </div>
    </div>
  );
}
