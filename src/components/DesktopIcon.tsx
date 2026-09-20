import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useCoarsePointer } from "../utils/useCoarsePointer";

interface DesktopIconProps {
  label: string;
  /** Rendered at 48x48; fill the box with `className="h-full w-full"`. */
  icon: ReactNode;
  onOpen: () => void;
}

const OUTLINE =
  "1px 1px 0 rgba(0,0,0,.9), -1px -1px 0 rgba(0,0,0,.9), 1px -1px 0 rgba(0,0,0,.9), -1px 1px 0 rgba(0,0,0,.9)";

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
      className="flex w-[104px] flex-col items-center gap-1 p-0.5 outline-none focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-white"
    >
      <div className={cn("h-12 w-12", selected && "brightness-[.55]")}>{icon}</div>
      <span
        className={cn("font-chicago px-1 text-center text-[13px] leading-tight", selected ? "bg-black text-white" : "text-white")}
        style={{ textShadow: selected ? "none" : OUTLINE }}
      >
        {label}
      </span>
    </button>
  );
}
