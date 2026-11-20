import { lazy, Suspense, useEffect, useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import { SystemProvider } from "./context/SystemContext";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { profile } from "./data/portfolioData";
import { useBootAssets } from "./utils/useBootAssets";
import { ToastProvider } from "./context/ToastContext";

const RecruiterPortfolio = lazy(() => import("./components/RecruiterPortfolio"));

export default function App() {
  const [booted, setBooted] = useState(false);
  const [recruiterView, setRecruiterView] = useState(
    () => new URLSearchParams(window.location.search).get("view") === "recruiter"
  );
  const assets = useBootAssets();

  useEffect(() => {
    document.title = recruiterView
      ? `${profile.name} — Developer Portfolio`
      : `${profile.name} — Portfolio`;
  }, [recruiterView]);

  // The desktop uses a fixed viewport and deliberately locks page scrolling.
  // Recruiter mode is a conventional document, so restore normal page flow.
  useEffect(() => {
    document.documentElement.classList.toggle("recruiter-mode", recruiterView);
    document.body.classList.toggle("recruiter-mode", recruiterView);
    if (recruiterView) window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove("recruiter-mode");
      document.body.classList.remove("recruiter-mode");
    };
  }, [recruiterView]);

  // Keep the view mode in the URL so recruiter mode can be shared directly
  // and browser Back/Forward restores the previous experience.
  useEffect(() => {
    function syncViewFromUrl() {
      setRecruiterView(new URLSearchParams(window.location.search).get("view") === "recruiter");
    }
    window.addEventListener("popstate", syncViewFromUrl);
    return () => window.removeEventListener("popstate", syncViewFromUrl);
  }, []);

  function changeView(next: "desktop" | "recruiter") {
    const url = new URL(window.location.href);
    if (next === "recruiter") url.searchParams.set("view", "recruiter");
    else url.searchParams.delete("view");
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setRecruiterView(next === "recruiter");
  }

  return (
    <ToastProvider>
      {recruiterView ? (
        <div className="min-h-screen w-full">
          <Suspense fallback={<div className="min-h-screen bg-[#f6f4ee]" aria-label="Loading portfolio" />}>
            <RecruiterPortfolio onReturnToDesktop={() => changeView("desktop")} />
          </Suspense>
        </div>
      ) : (
        <div className="app-viewport w-screen overflow-hidden">
          {/* inert: nothing on the desktop can be clicked or tabbed to until the boot screen is done */}
          <div className="h-full w-full" inert={!booted}>
            <SystemProvider customWallpaperSrc={assets.wallpaperSrc}>
              <WindowManagerProvider>
                <Desktop onOpenRecruiterView={() => changeView("recruiter")} />
              </WindowManagerProvider>
            </SystemProvider>
          </div>
          {!booted && <BootScreen assets={assets} onDone={() => setBooted(true)} />}
        </div>
      )}
    </ToastProvider>
  );
}
