import IconGrid from "../components/IconGrid";
import { projects } from "../data/portfolioData";
import { useOpenApp } from "./appDefs";

export default function ProjectsApp() {
  const openApp = useOpenApp();

  return (
    <div className="h-full p-3 text-[14px]">
      <p className="mb-3 border-b-2 border-black/20 pb-2 text-[12px] text-black/60">
        {projects.length} items — double-click to open
      </p>
      <IconGrid
        items={projects.map((p) => ({
          key: p.id,
          label: p.name,
          icon: p.kind,
          onOpen: () => openApp("project-detail", { id: p.id }),
        }))}
      />
    </div>
  );
}
