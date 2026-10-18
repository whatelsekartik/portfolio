import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useCoarsePointer } from "../utils/useCoarsePointer";

interface DesktopIconProps {
  label: string;
  /** Rendered at 48x48; fill the box with `className="h-full w-full"`. */
  icon: ReactNode;
  onOpen: () => void;
}

export default function DesktopIcon({ label, icon, onOpen }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const coarse = useCoarsePointer();

  return (
    <button
      type="button"
      aria-label={`Open ${label}`}
      aria-pressed={selected}
      onClick={() => (coarse ? onOpen() : setSelected(true))}
      onDoubleClick={onOpen}
      onBlur={() => setSelected(false)}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="group touch-manipulation flex w-[104px] min-w-0 flex-col items-center gap-1 p-0.5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520] max-sm:w-[88px]"
    >
      <div className={cn("h-12 w-12 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5", selected && "brightness-[.55]")}>
        {icon}
      </div>
      <span
        className={cn(
          "font-body inline-block max-w-[98px] rounded-[3px] border border-[#d5c6ab]/80 bg-[#fffaf0]/95 px-1.5 py-0.5 text-center text-[12px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#29271f] shadow-[0_1px_2px_rgba(41,39,31,0.12)] [overflow-wrap:anywhere] transition-colors duration-150 max-sm:max-w-[82px] max-sm:text-[11px]",
          selected
            ? "border-[#a96520] bg-[#a96520] text-white shadow-none"
            : "group-hover:border-[#a96520]/70 group-hover:bg-[#fff7e8]"
        )}
      >
        {label}
      </span>
    </button>
  );
}
