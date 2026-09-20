import { useEffect, useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import { SystemProvider } from "./context/SystemContext";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { profile } from "./data/portfolioData";
import { useBootAssets } from "./utils/useBootAssets";

export default function App() {
  const [booted, setBooted] = useState(false);
  const assets = useBootAssets();

  useEffect(() => {
    document.title = `${profile.name} — Portfolio`;
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* inert: nothing on the desktop can be clicked or tabbed to until the boot screen is done */}
      <div className="h-full w-full" inert={!booted}>
        <SystemProvider customWallpaperSrc={assets.wallpaperSrc}>
          <WindowManagerProvider>
            <Desktop />
          </WindowManagerProvider>
        </SystemProvider>
      </div>
      {!booted && <BootScreen assets={assets} onDone={() => setBooted(true)} />}
    </div>
  );
}
