import { useState } from "react";
import { experience } from "../data/portfolioData";
import { cn } from "../utils/cn";

/** The floppy disk opens a Finder-style list view; click a row's triangle to expand it. */
export default function ExperienceApp() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex h-full flex-col text-[14px]">
      <div className="shrink-0 border-b-2 border-black bg-[#efefef] px-3 py-1 text-[12px] text-black/60">
        {experience.length} items · click a triangle to see details
      </div>
      <div className="grid shrink-0 grid-cols-[1fr_110px_120px] border-b-2 border-black bg-[#dfdfdf] font-chicago text-[13px] max-sm:grid-cols-[1fr_100px]">
        <span className="border-r border-black/40 px-3 py-0.5">Name</span>
        <span className="border-r border-black/40 px-2 py-0.5 max-sm:border-r-0">Kind</span>
        <span className="px-2 py-0.5 max-sm:hidden">Date</span>
      </div>

      <ul className="flex-1 overflow-auto">
        {experience.map((e, i) => {
          const isOpen = open === i;
          return (
            <li key={`${e.org}-${e.role}`} className="border-b border-black/20">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "grid w-full grid-cols-[1fr_110px_120px] items-baseline text-left max-sm:grid-cols-[1fr_100px]",
                  isOpen ? "bg-black text-white" : "hover:bg-[#f0f0f0]"
                )}
              >
                <span className="truncate px-3 py-1">
                  <span className="mr-2 inline-block w-3">{isOpen ? "▾" : "▸"}</span>
                  {e.role} · {e.org}
                </span>
                <span className="truncate px-2">{e.kind}</span>
                <span className="truncate px-2 max-sm:hidden">{e.period}</span>
              </button>
              {isOpen && (
                <div className="bg-[#fafafa] py-2 pr-4 pl-10">
                  <p className="mb-1 text-[12px] text-black/55 sm:hidden">{e.period}</p>
                  <ul className="list-disc pl-4">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
