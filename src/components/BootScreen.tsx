import { useEffect, useState } from "react";
import { IconHappyMac } from "./Icons";
import { profile } from "../data/portfolioData";

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1700);
    const doneTimer = setTimeout(onDone, 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      className={`fixed inset-0 z-[99999] flex cursor-pointer flex-col items-center justify-center gap-5 bg-[#d8d8d8] transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <IconHappyMac className="h-24 w-24" />
      <p className="font-chicago text-[20px] text-black">Welcome to Macintosh</p>
      <div className="h-3 w-56 border-2 border-black bg-white p-[1px]">
        <div className="h-full bg-black" style={{ animation: "boot-progress 1.6s steps(16) forwards" }} />
      </div>
      <p className="font-chicago text-[13px] text-black/55">{profile.name} · click to skip</p>
    </div>
  );
}
