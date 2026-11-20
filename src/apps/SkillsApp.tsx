import { useEffect, useState } from "react";
import { IconSkills } from "../components/Icons";
import { skillGroups } from "../data/portfolioData";
import { cn } from "../utils/cn";

/** Skills.exe "launches" with a short progress bar, then shows skills as level meters. */
export default function SkillsApp() {
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState(0);
  const ready = progress >= 100;

  useEffect(() => {
    if (progress >= 100) return;
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 8)), 55);
    return () => clearTimeout(t);
  }, [progress]);

  if (!ready) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-[14px]">
        <IconSkills className="h-12 w-12" />
        <p className="font-chicago">Opening Skills.exe…</p>
        <div className="h-4 w-56 border-2 border-black bg-white p-[1px]">
          <div className="h-full bg-black" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  const group = skillGroups[tab];
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex h-full flex-col text-[14px]">
      <div role="tablist" className="flex shrink-0 gap-1 border-b-2 border-black bg-[#dfdfdf] px-2 pt-2">
        {skillGroups.map((g, i) => (
          <button
            key={g.name}
            role="tab"
            type="button"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={cn(
              "font-chicago -mb-[2px] border-2 border-b-0 border-black px-3 py-0.5",
              tab === i ? "bg-white" : "bg-[#c4c4c4] hover:bg-[#d4d4d4]"
            )}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="flex-1 overflow-auto p-4">
        <ul className="flex flex-col gap-3">
          {group.items.map((s) => (
            <li key={s.name} className="grid grid-cols-[minmax(90px,140px)_1fr_auto] items-center gap-3">
              <span>{s.name}</span>
              <div
                className="flex h-4 gap-[2px] border-2 border-black bg-white p-[1px]"
                role="img"
                aria-label={`${s.level} out of 10`}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={cn("h-full flex-1", i < s.level ? "bg-black" : "bg-transparent")} />
                ))}
              </div>
              <span className="w-8 text-right text-[12px] text-black/55">{s.level}/10</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="shrink-0 border-t-2 border-black bg-[#efefef] px-3 py-1 text-[12px] text-black/60">
        {total} skills loaded · always learning more
      </p>
    </div>
  );
}
