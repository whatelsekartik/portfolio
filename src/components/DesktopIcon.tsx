import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useCoarsePointer } from "../utils/useCoarsePointer";

interface DesktopIconProps {
  label: string;
  /** Rendered at 48x48; fill the box with `className="h-full w-full"`. */
  icon: ReactNode;
  onOpen: () => void;
}

const OUTLINE = "0 1px 1px rgba(255,250,240,.9)";

export default function DesktopIcon({ label, icon, onOpen }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const coarse = useCoarsePointer();

  return (
    <button
      type="button"
      onClick={() => (coarse ? onOpen() : setSelected(true))}
      onDoubleClick={onOpen}
      onBlur={() => setSelected(false)}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="flex w-[104px] flex-col items-center gap-1 p-0.5 outline-none focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-[#a96520]"
    >
      <div className={cn("h-12 w-12", selected && "brightness-[.55]")}>{icon}</div>
      <span
        className={cn("font-chicago max-w-[100px] rounded-sm border border-[#d5c6ab] bg-[#fffaf0] px-1.5 py-0.5 text-center text-[14px] font-semibold leading-tight text-[#29271f] shadow-sm",
        selected && "border-[#a96520] bg-[#a96520] text-white")}
        style={{ textShadow: selected ? "none" : OUTLINE }}
      >
        {label}
      </span>
    </button>
  );
}
