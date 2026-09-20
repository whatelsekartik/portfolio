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
      className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-x-2 gap-y-3"
      onClick={() => setSelected(null)}
    >
      {items.map((it) => {
        const isSel = selected === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (coarse) it.onOpen();
              else setSelected(it.key);
            }}
            onDoubleClick={it.onOpen}
            onKeyDown={(e) => e.key === "Enter" && it.onOpen()}
            className="flex flex-col items-center gap-1 p-1 text-center outline-none focus-visible:outline-1 focus-visible:outline-dotted"
          >
            <FileIcon kind={it.icon} className={cn("h-8 w-8", isSel && "brightness-[.55]")} />
            <span
              className={cn(
                "font-chicago px-1 text-[13px] leading-tight break-words",
                isSel && "bg-black text-white"
              )}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
