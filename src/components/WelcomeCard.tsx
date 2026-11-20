import { useEffect, useRef } from "react";
import { FileIcon } from "./Icons";
import type { AppId } from "../types";

interface WelcomeCardProps {
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onOpenQuick: () => void;
}

const shortcuts: { id: AppId; label: string; description: string; icon: "folder" | "pdf" | "phone" }[] = [
  { id: "projects", label: "Projects", description: "See what I've built", icon: "folder" },
  { id: "resume", label: "Résumé", description: "Experience & skills", icon: "pdf" },
  { id: "contact", label: "Contact", description: "Say hello", icon: "phone" },
];

/** A non-modal first-run guide; the desktop remains usable behind it. */
export default function WelcomeCard({ onClose, onOpenApp, onOpenQuick }: WelcomeCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => { cardRef.current?.focus(); }, []);

  return (
    <section ref={cardRef} role="dialog" aria-labelledby="welcome-title" tabIndex={-1}
      className="welcome-card" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className="welcome-titlebar">
        <span className="welcome-titlebar-lines" aria-hidden="true" />
        <span>Welcome to the desktop</span>
        <button type="button" onClick={onClose} aria-label="Close welcome guide">×</button>
      </div>
      <div className="welcome-body">
        <div className="welcome-intro">
          <span className="welcome-kicker">A PERSONAL WORKSPACE <span aria-hidden="true">✳</span></span>
          <h1 id="welcome-title">Hey, I'm Kartik<span>.</span></h1>
          <p>Make yourself at home. Pick a place to start, or close this and explore the desktop your way.</p>
        </div>
        <p className="welcome-section-label">START HERE <span>01 — 03</span></p>
        <div className="welcome-shortcuts">
          {shortcuts.map((shortcut, index) => (
            <button type="button" key={shortcut.id} onClick={() => onOpenApp(shortcut.id)}>
              <span className="welcome-shortcut-icon"><FileIcon kind={shortcut.icon} className="h-8 w-8" /></span>
              <span className="welcome-shortcut-copy"><strong>{shortcut.label}</strong><small>{shortcut.description}</small></span>
              <span className="welcome-shortcut-arrow" aria-hidden="true">{String(index + 1).padStart(2, "0")} ↗</span>
            </button>
          ))}
        </div>
        <div className="welcome-views">
          <p className="welcome-section-label">CHOOSE YOUR VIEW <span>TWO WAYS IN</span></p>
          <div className="welcome-view-list">
            <div><strong>Interactive desktop <span>YOU'RE HERE</span></strong><p>Explore the portfolio like a little computer.</p></div>
            <button type="button" onClick={onOpenQuick}><strong>Quick portfolio <span>↗</span></strong><small>A straightforward, scrollable overview.</small></button>
          </div>
        </div>
        <div className="welcome-footer"><span>YOUR VISIT, YOUR WAY.</span><button type="button" onClick={onClose}>Explore the desktop →</button></div>
      </div>
    </section>
  );
}
