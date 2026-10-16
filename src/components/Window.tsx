import { useCallback, useRef, type ReactNode } from "react";
import { useWindowManager } from "../context/WindowManagerContext";
import type { WindowInstance } from "../types";
import { cn } from "../utils/cn";

interface WindowProps {
  win: WindowInstance;
  children: ReactNode;
}

const TITLE_H = 24;
const MENU_BAR_H = 24;
const MOBILE_BREAKPOINT = 640;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi));

export default function Window({ win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximizeWindow, updateRect, activeWindowId } =
    useWindowManager();
  const isActive = activeWindowId === win.id;
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      focusWindow(win.id);
      if ((e.target as Element).closest("button")) return;
      if (win.isMaximized || window.innerWidth < MOBILE_BREAKPOINT) return;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.rect.x, origY: win.rect.y };
    },
    [focusWindow, win.id, win.isMaximized, win.rect.x, win.rect.y]
  );

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const maxX = Math.max(8, window.innerWidth - win.rect.width - 8);
      const maxY = Math.max(MENU_BAR_H + 8, window.innerHeight - TITLE_H - 8);
      const x = clamp(drag.origX + e.clientX - drag.startX, 8, maxX);
      const y = clamp(drag.origY + e.clientY - drag.startY, MENU_BAR_H + 8, maxY);
      updateRect(win.id, { x, y });
    },
    [updateRect, win.id, win.rect.width]
  );

  const onTitlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      dragRef.current = null;
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      if (!drag || win.isMaximized || window.innerWidth < MOBILE_BREAKPOINT) return;
      const moved = Math.abs(e.clientX - drag.startX) > 3 || Math.abs(e.clientY - drag.startY) > 3;
      if (!moved) return;

      // Apply the last pointer position before snapping so fast releases are not lost.
      const maxX = Math.max(8, window.innerWidth - win.rect.width - 8);
      const maxY = Math.max(MENU_BAR_H + 8, window.innerHeight - TITLE_H - 8);
      const x = clamp(drag.origX + e.clientX - drag.startX, 8, maxX);
      const y = clamp(drag.origY + e.clientY - drag.startY, MENU_BAR_H + 8, maxY);
      updateRect(win.id, { x, y });

      if (y <= MENU_BAR_H + 12) {
        toggleMaximizeWindow(win.id);
        return;
      }

      const snapHeight = Math.max(1, window.innerHeight - MENU_BAR_H - 16);
      const halfWidth = Math.max(1, Math.floor((window.innerWidth - 24) / 2));
      if (x <= 12) {
        updateRect(win.id, { x: 8, y: MENU_BAR_H + 8, width: halfWidth, height: snapHeight });
      } else if (x + win.rect.width >= window.innerWidth - 12) {
        const rightX = 16 + halfWidth;
        updateRect(win.id, {
          x: rightX,
          y: MENU_BAR_H + 8,
          width: Math.max(1, window.innerWidth - rightX - 8),
          height: snapHeight,
        });
      }
    },
    [toggleMaximizeWindow, updateRect, win.id, win.isMaximized, win.rect.width]
  );

  const onTitlePointerCancel = useCallback((e: React.PointerEvent) => {
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
      if (window.innerWidth < MOBILE_BREAKPOINT || win.isMaximized) return;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: win.rect.x,
        origY: win.rect.y,
        origW: win.rect.width,
        origH: win.rect.height,
      };
    },
    [focusWindow, win.id, win.isMaximized, win.rect.height, win.rect.width, win.rect.x, win.rect.y]
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const resize = resizeRef.current;
      if (!resize) return;
      const maxWidth = Math.max(1, window.innerWidth - resize.origX - 8);
      const maxHeight = Math.max(1, window.innerHeight - resize.origY - 8);
      const minWidth = Math.min(win.minWidth, maxWidth);
      const minHeight = Math.min(win.minHeight, maxHeight);
      updateRect(win.id, {
        width: clamp(resize.origW + e.clientX - resize.startX, minWidth, maxWidth),
        height: clamp(resize.origH + e.clientY - resize.startY, minHeight, maxHeight),
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

  const onResizePointerCancel = useCallback((e: React.PointerEvent) => {
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
      aria-labelledby={`window-title-${win.id}`}
      tabIndex={-1}
      data-window-id={win.id}
      className={cn(
        "absolute flex min-w-0 flex-col border-2 border-[#302d25] bg-[#f0e6d3] shadow-[4px_4px_0_rgba(41,39,31,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]",
        window.innerWidth < MOBILE_BREAKPOINT && "shadow-none"
      )}
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.width,
        height: shaded ? TITLE_H + 4 : win.rect.height,
        zIndex: win.zIndex,
      }}
      onPointerDownCapture={() => focusWindow(win.id)}
    >
      <div
        className={cn(
          "flex h-6 shrink-0 touch-none items-center gap-1.5 px-1.5 select-none",
          !shaded && "border-b-2 border-black",
          isActive ? "scanline-title" : "bg-[#f0e6d3]"
        )}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerCancel}
        onDoubleClick={(e) => {
          if (!(e.target as Element).closest("button")) minimizeWindow(win.id);
        }}
      >
        <button
          type="button"
          aria-label={`Close ${win.title}`}
          title="Close window"
          onClick={() => closeWindow(win.id)}
          className={cn(
            "h-3.5 w-3.5 shrink-0 border border-[#302d25] bg-[#fffaf0] active:bg-[#a96520] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]",
            !isActive && "invisible"
          )}
        />
        <div
          id={`window-title-${win.id}`}
          className={cn(
            "font-chicago mx-auto max-w-full min-w-0 flex-1 truncate px-2 text-center text-[14px] leading-none",
            isActive ? "bg-[#f0e6d3] text-[#29271f]" : "text-[#514c40]"
          )}
        >
          {win.title}
        </div>
        <button
          type="button"
          aria-label={win.isMaximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
          title={win.isMaximized ? "Restore window" : "Maximize window"}
          onClick={() => toggleMaximizeWindow(win.id)}
          className={cn(
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-[#302d25] bg-[#fffaf0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520] max-sm:hidden",
            !isActive && "invisible"
          )}
        >
          <span className="block h-1.5 w-1.5 border border-black" />
        </button>
        <button
          type="button"
          aria-label={shaded ? `Unroll ${win.title}` : `Roll up ${win.title}`}
          title={shaded ? "Unroll window" : "Roll up window"}
          onClick={() => minimizeWindow(win.id)}
          className={cn(
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-black bg-[#dfdfdf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]",
            !isActive && "invisible"
          )}
        >
          <span className="block h-[2px] w-2 bg-black" />
        </button>
      </div>

      {!shaded && <div className="mac-scroll relative min-h-0 min-w-0 flex-1 overflow-auto bg-[#fffaf0]">{children}</div>}

      {!shaded && !win.isMaximized && window.innerWidth >= MOBILE_BREAKPOINT && (
        <div
          role="group"
          tabIndex={0}
          aria-label={`Resize ${win.title} window`}
          aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"
          title="Resize with arrow keys"
          className="absolute right-0 bottom-0 h-5 w-5 cursor-nwse-resize touch-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a96520]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #756951 0 1px, transparent 1px 3px)" }}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerCancel}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 40 : 10;
            let width = win.rect.width;
            let height = win.rect.height;
            if (e.key === "ArrowLeft") width -= step;
            else if (e.key === "ArrowRight") width += step;
            else if (e.key === "ArrowUp") height -= step;
            else if (e.key === "ArrowDown") height += step;
            else return;

            e.preventDefault();
            focusWindow(win.id);
            const maxWidth = Math.max(1, window.innerWidth - win.rect.x - 8);
            const maxHeight = Math.max(1, window.innerHeight - win.rect.y - 8);
            updateRect(win.id, {
              width: clamp(width, Math.min(win.minWidth, maxWidth), maxWidth),
              height: clamp(height, Math.min(win.minHeight, maxHeight), maxHeight),
            });
          }}
        />
      )}
    </div>
  );
}
