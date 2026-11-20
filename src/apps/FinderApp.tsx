import { useState } from "react";
import IconGrid from "../components/IconGrid";
import { getDir, root, type FsNode } from "../data/fileSystem";
import { useOpenApp } from "./appDefs";

export default function FinderApp() {
  const openApp = useOpenApp();
  const [path, setPath] = useState<string[]>([]);
  const dir = getDir(path);

  function open(node: FsNode) {
    if (node.type === "dir") setPath([...path, node.name]);
    else openApp(node.app, node.payload);
  }

  return (
    <div className="flex h-full flex-col text-[14px]">
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-black bg-[#efefef] px-2 py-1">
        <button
          type="button"
          disabled={path.length === 0}
          onClick={() => setPath(path.slice(0, -1))}
          className="border-2 border-black bg-[#dfdfdf] px-2 shadow-[1px_1px_0_#000] enabled:hover:bg-black enabled:hover:text-white disabled:border-black/30 disabled:text-black/30 disabled:shadow-none"
        >
          ◂ Back
        </button>
        <p className="font-chicago min-w-0 flex-1 truncate">
          {[root.name, ...path].join(" ▸ ")}
        </p>
      </div>
      <p className="shrink-0 border-b border-black/30 px-3 py-1 text-[12px] text-black/60">
        {dir.children.length} items · 640K available
      </p>
      <div className="flex-1 overflow-auto p-3">
        <IconGrid
          key={path.join("/")}
          items={dir.children.map((n) => ({
            key: n.name,
            label: n.name,
            icon: n.type === "dir" ? "folder" : n.icon,
            onOpen: () => open(n),
          }))}
        />
      </div>
    </div>
  );
}
