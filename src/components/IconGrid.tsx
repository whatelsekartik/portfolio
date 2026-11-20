import { useState } from "react";
import { FileIcon, type IconKind } from "./Icons";
import { cn } from "../utils/cn";
import { useCoarsePointer } from "../utils/useCoarsePointer";

export interface GridItem {
  key: string;
  label: string;
  icon: IconKind;
  onOpen: () => void;
}

/** Icon view used inside windows (My Computer, My Projects). */
export default function IconGrid({ items }: { items: GridItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const coarse = useCoarsePointer();

  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,104px),1fr))] gap-x-3 gap-y-4"
      onClick={() => setSelected(null)}
    >
      {items.map((it) => {
        const isSel = selected === it.key;
        return (
          <button
            key={it.key}
            type="button"
            aria-label={`Open ${it.label}`}
            aria-pressed={isSel}
            onClick={(e) => {
              e.stopPropagation();
              if (coarse) it.onOpen();
              else setSelected(it.key);
            }}
            onDoubleClick={it.onOpen}
            onKeyDown={(e) => e.key === "Enter" && it.onOpen()}
            className="flex w-full min-w-0 flex-col items-center gap-1 rounded-sm p-1 text-center outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a96520]"
          >
            <FileIcon kind={it.icon} className={cn("h-8 w-8 shrink-0", isSel && "brightness-[.55]")} />
            <span className="font-chicago w-full min-w-0 px-1 text-[12px] leading-[1.35] [overflow-wrap:anywhere]">
              <span className={cn(isSel && "bg-black text-white")}>{it.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
