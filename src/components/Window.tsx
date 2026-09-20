import { useCallback, useRef, type ReactNode } from "react";
import { useWindowManager } from "../context/WindowManagerContext";
import type { WindowInstance } from "../types";
import { cn } from "../utils/cn";

interface WindowProps {
  win: WindowInstance;
  children: ReactNode;
}

const TITLE_H = 24;

export default function Window({ win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximizeWindow, updateRect, activeWindowId } =
    useWindowManager();
  const isActive = activeWindowId === win.id;
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      focusWindow(win.id);
      if ((e.target as Element).closest("button")) return;
      if (win.isMaximized) return;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.rect.x, origY: win.rect.y };
    },
    [focusWindow, win.id, win.isMaximized, win.rect.x, win.rect.y]
  );

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(-win.rect.width + 80, Math.min(dragRef.current.origX + dx, window.innerWidth - 60));
      const newY = Math.max(24, Math.min(dragRef.current.origY + dy, window.innerHeight - 40));
      updateRect(win.id, { x: newX, y: newY });
    },
    [updateRect, win.id, win.rect.width]
  );

  const onTitlePointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      focusWindow(win.id);
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: win.rect.width, origH: win.rect.height };
    },
    [focusWindow, win.id, win.rect.height, win.rect.width]
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeRef.current) return;
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      updateRect(win.id, {
        width: Math.max(win.minWidth, resizeRef.current.origW + dx),
        height: Math.max(win.minHeight, resizeRef.current.origH + dy),
      });
    },
    [updateRect, win.id, win.minWidth, win.minHeight]
  );

  const onResizePointerUp = useCallback((e: React.PointerEvent) => {
    resizeRef.current = null;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const shaded = win.isMinimized;

  return (
    <div
      role="dialog"
      aria-label={win.title}
      className="absolute flex flex-col border-2 border-black bg-[#dfdfdf] shadow-[4px_4px_0_rgba(0,0,0,0.4)]"
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.width,
        height: shaded ? TITLE_H + 4 : win.rect.height,
        zIndex: win.zIndex,
      }}
      onPointerDownCapture={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex h-6 shrink-0 touch-none items-center gap-1.5 px-1.5 select-none",
          !shaded && "border-b-2 border-black",
          isActive ? "scanline-title" : "bg-[#dfdfdf]"
        )}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={(e) => {
          if (!(e.target as Element).closest("button")) minimizeWindow(win.id);
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => closeWindow(win.id)}
          className={cn(
            "h-3.5 w-3.5 shrink-0 border border-black bg-[#dfdfdf] active:bg-black",
            !isActive && "invisible"
          )}
        />
        <div
          className={cn(
            "font-chicago mx-auto max-w-full min-w-0 flex-1 truncate px-2 text-center text-[14px] leading-none",
            isActive ? "bg-[#dfdfdf]" : "text-[#7a7a7a]"
          )}
        >
          {win.title}
        </div>
        <button
          type="button"
          aria-label={win.isMaximized ? "Restore size" : "Zoom"}
          onClick={() => toggleMaximizeWindow(win.id)}
          className={cn("flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-black bg-[#dfdfdf]", !isActive && "invisible")}
        >
          <span className="block h-1.5 w-1.5 border border-black" />
        </button>
        <button
          type="button"
          aria-label={shaded ? "Unroll window" : "Roll up window"}
          onClick={() => minimizeWindow(win.id)}
          className={cn("flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-black bg-[#dfdfdf]", !isActive && "invisible")}
        >
          <span className="block h-[2px] w-2 bg-black" />
        </button>
      </div>

      {/* Content */}
      {!shaded && <div className="mac-scroll relative flex-1 overflow-auto bg-white">{children}</div>}

      {/* Resize handle */}
      {!shaded && !win.isMaximized && (
        <div
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize touch-none"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #000 0 1px, transparent 1px 3px)" }}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        />
      )}
    </div>
  );
}
