import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Adds a small reveal only when IntersectionObserver and motion preferences
 * allow it. Without support, the content stays visible as a static fallback.
 */
export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = element.closest(".overflow-auto, .mac-scroll");
    element.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.classList.remove("reveal-pending");
          element.classList.add("reveal-visible");
          observer.unobserve(element);
        }
      },
      { root, threshold: 0.08, rootMargin: "0px 0px -12px 0px" }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      element.classList.remove("reveal-pending", "reveal-visible");
    };
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
