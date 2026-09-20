import { useEffect, useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import { SystemProvider } from "./context/SystemContext";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { profile } from "./data/portfolioData";

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    document.title = `${profile.name} — Portfolio`;
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SystemProvider>
        <WindowManagerProvider>
          <Desktop />
        </WindowManagerProvider>
      </SystemProvider>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
    </div>
  );
}
