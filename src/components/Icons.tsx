import type { ReactNode } from "react";

// Chunky pixel-art SVG icons on a 32x32 grid, drawn to evoke System 7 icon art
// (black outlines, flat fills, a few splashes of color). Render them at 32px,
// 48px or 64px so every art-pixel lands on whole screen pixels.

interface IconProps {
  className?: string;
}

const K = "#000";
const W = "#fff";

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Filled rectangle with a 1-unit black outline drawn inside its bounds. */
function B({ x, y, w, h, f = W }: { x: number; y: number; w: number; h: number; f?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={f} />
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} fill="none" stroke={K} strokeWidth={1} />
    </>
  );
}

/** Plain filled rectangle. */
function R({ x, y, w, h, f = K }: { x: number; y: number; w: number; h: number; f?: string }) {
  return <rect x={x} y={y} width={w} height={h} fill={f} />;
}

/** Single pixels from a list of [x, y]. */
function Px({ pts, f = K }: { pts: [number, number][]; f?: string }) {
  return (
    <>
      {pts.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={f} />
      ))}
    </>
  );
}

/** A tiny bitmap glyph, one string per row ("X" = pixel). */
function Glyph({ x, y, rows, f = W }: { x: number; y: number; rows: string[]; f?: string }) {
  const pts: [number, number][] = [];
  rows.forEach((row, r) => [...row].forEach((c, i) => c === "X" && pts.push([x + i, y + r])));
  return <Px pts={pts} f={f} />;
}

/** Window frame with the classic striped title bar. */
function WindowFrame({ f = W, bar = true }: { f?: string; bar?: boolean }) {
  return (
    <>
      <B x={3} y={5} w={26} h={22} f={f} />
      {bar && (
        <>
          <R x={4} y={6} w={24} h={5} f={W} />
          <R x={6} y={7} w={20} h={1} />
          <R x={6} y={9} w={20} h={1} />
          <R x={4} y={11} w={24} h={1} />
        </>
      )}
    </>
  );
}

export function IconComputer({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={7} y={3} w={18} h={22} f="#e6dfc8" />
      <B x={10} y={6} w={12} h={10} f="#9fe0e0" />
      <R x={11} y={7} w={4} h={1} f={W} />
      <R x={10} y={19} w={7} h={1} />
      <R x={20} y={19} w={2} h={1} />
      <B x={5} y={25} w={22} h={4} f="#e6dfc8" />
    </Svg>
  );
}

export function IconHappyMac({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={6} y={3} w={20} h={22} f="#e6dfc8" />
      <B x={9} y={6} w={14} h={13} f={W} />
      <R x={12} y={9} w={1} h={3} />
      <R x={19} y={9} w={1} h={3} />
      <R x={16} y={10} w={1} h={4} />
      <R x={15} y={14} w={2} h={1} />
      <Px pts={[[12, 16], [19, 16]]} />
      <R x={13} y={17} w={6} h={1} />
      <R x={11} y={22} w={10} h={1} />
      <B x={5} y={25} w={22} h={4} f="#e6dfc8" />
    </Svg>
  );
}

export function IconFolder({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={3} y={7} w={12} h={6} f="#ffe9a8" />
      <B x={3} y={10} w={26} h={17} f="#ffd966" />
      <R x={4} y={11} w={24} h={1} f="#fff2c2" />
    </Svg>
  );
}

export function IconDocument({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 3H21L26 8V29H7Z" fill={W} />
      <path d="M7.5 3.5H20.5L25.5 8.5V28.5H7.5Z" fill="none" stroke={K} strokeWidth={1} />
      <path d="M20.5 3.5V8.5H25.5" fill="#ddd" stroke={K} strokeWidth={1} />
      <R x={10} y={13} w={12} h={1} />
      <R x={10} y={17} w={12} h={1} />
      <R x={10} y={21} w={12} h={1} />
      <R x={10} y={25} w={7} h={1} />
    </Svg>
  );
}

export function IconReadme({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 3H21L26 8V29H7Z" fill={W} />
      <path d="M7.5 3.5H20.5L25.5 8.5V28.5H7.5Z" fill="none" stroke={K} strokeWidth={1} />
      <path d="M20.5 3.5V8.5H25.5" fill="#ddd" stroke={K} strokeWidth={1} />
      <R x={10} y={11} w={8} h={2} />
      <R x={10} y={15} w={12} h={1} />
      <R x={10} y={18} w={9} h={1} />
      <R x={10} y={21} w={5} h={1} />
      <circle cx={21.5} cy={23.5} r={4.5} fill="#3b6fd8" stroke={K} strokeWidth={1} />
      <R x={21} y={20} w={1} h={1} f={W} />
      <R x={21} y={22} w={1} h={4} f={W} />
    </Svg>
  );
}

export function IconAbout({ className }: IconProps) {
  return (
    <Svg className={className}>
      {/* trench coat */}
      <B x={5} y={22} w={22} h={8} f="#a8946a" />
      <path d="M10.5 22.5L16 28L21.5 22.5Z" fill="#e8dcb4" stroke={K} strokeWidth={1} />
      <R x={15} y={24} w={2} h={5} f="#b03030" />
      {/* face */}
      <B x={10} y={13} w={12} h={9} f="#ffdcb0" />
      <R x={11} y={16} w={4} h={3} />
      <R x={17} y={16} w={4} h={3} />
      <R x={15} y={16} w={2} h={1} />
      <R x={14} y={20} w={4} h={1} f="#a05030" />
      {/* hat */}
      <B x={11} y={4} w={10} h={7} f="#4a4a4a" />
      <R x={12} y={8} w={8} h={1} f="#c14f4f" />
      <B x={5} y={10} w={22} h={3} f="#4a4a4a" />
    </Svg>
  );
}

export function IconTerminal({ className }: IconProps) {
  return (
    <Svg className={className}>
      <WindowFrame f="#151515" />
      <Glyph x={7} y={15} f="#6cf06c" rows={["X.", ".X", "..X", ".X", "X."]} />
      <R x={13} y={19} w={6} h={1} f="#6cf06c" />
      <R x={22} y={15} w={1} h={1} f="#6cf06c" />
    </Svg>
  );
}

export function IconSkills({ className }: IconProps) {
  return (
    <Svg className={className}>
      <WindowFrame />
      <R x={12} y={13} w={8} h={2} f="#2b3a8f" />
      <R x={11} y={15} w={3} h={3} f="#2b3a8f" />
      <R x={18} y={15} w={3} h={3} f="#2b3a8f" />
      <R x={17} y={18} w={3} h={2} f="#2b3a8f" />
      <R x={15} y={20} w={3} h={2} f="#2b3a8f" />
      <R x={15} y={23} w={3} h={2} f="#2b3a8f" />
    </Svg>
  );
}

export function IconGlobe({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx={16} cy={16} r={12.5} fill="#4a9be0" stroke={K} strokeWidth={1} />
      <path d="M8 10L13 8L16 11L14 15L10 14Z" fill="#5cbf5c" />
      <path d="M17 17L22 15L24 20L20 25L17 22Z" fill="#5cbf5c" />
      <path d="M22 9L25 11L23 13Z" fill="#5cbf5c" />
      <ellipse cx={16} cy={16} rx={5.5} ry={12.5} fill="none" stroke={K} strokeWidth={1} />
      <R x={4} y={16} w={24} h={1} />
      <R x={9} y={9} w={14} h={1} />
      <R x={9} y={23} w={14} h={1} />
    </Svg>
  );
}

export function IconFloppy({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 4H25L28 7V28H4Z" fill="#2f3fa0" />
      <path d="M4.5 4.5H24.5L27.5 7.5V27.5H4.5Z" fill="none" stroke={K} strokeWidth={1} />
      <B x={9} y={4} w={14} h={9} f="#c8c8c8" />
      <R x={17} y={6} w={3} h={5} />
      <B x={7} y={16} w={18} h={12} f={W} />
      <R x={9} y={19} w={14} h={1} f="#6a6a6a" />
      <R x={9} y={22} w={14} h={1} f="#6a6a6a" />
      <R x={9} y={25} w={8} h={1} f="#6a6a6a" />
    </Svg>
  );
}

export function IconTrash({ className, full }: IconProps & { full?: boolean }) {
  return (
    <Svg className={className}>
      {full && (
        <>
          <path d="M10 8L12 3L15 6L17 2L20 6L22 4L23 8Z" fill="#f2f2f2" stroke={K} strokeWidth={1} />
          <R x={13} y={5} w={2} h={1} f="#999" />
        </>
      )}
      <path d="M8 10H24L22 29H10Z" fill={W} />
      <path d="M8.5 10.5H23.5L21.6 28.5H10.4Z" fill="none" stroke={K} strokeWidth={1} />
      <B x={6} y={7} w={20} h={3} />
      {!full && <B x={12} y={4} w={8} h={3} />}
      <R x={12} y={13} w={1} h={13} />
      <R x={16} y={13} w={1} h={13} />
      <R x={20} y={13} w={1} h={13} />
    </Svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={3} y={9} w={5} h={7} f="#c14f4f" />
      <B x={24} y={9} w={5} h={7} f="#c14f4f" />
      <B x={6} y={7} w={20} h={5} f="#c14f4f" />
      <path d="M6 16H26L29 28H3Z" fill="#c14f4f" />
      <path d="M6.5 16.5H25.5L28.4 27.5H3.6Z" fill="none" stroke={K} strokeWidth={1} />
      <circle cx={16} cy={22} r={5} fill={W} stroke={K} strokeWidth={1} />
      <R x={15} y={21} w={2} h={2} />
      <Px pts={[[16, 18], [19, 20], [19, 24], [16, 26], [13, 24], [13, 20]]} />
    </Svg>
  );
}

export function IconPdf({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={6} y={4} w={20} h={25} f="#c8a06a" />
      <B x={12} y={2} w={8} h={5} f="#b8b8b8" />
      <B x={9} y={8} w={14} h={19} f={W} />
      <R x={10} y={9} w={12} h={7} f="#d94141" />
      <Glyph x={11} y={10} rows={["XXX", "X.X", "XXX", "X..", "X.."]} />
      <Glyph x={15} y={10} rows={["XX.", "X.X", "X.X", "X.X", "XX."]} />
      <Glyph x={19} y={10} rows={["XXX", "X..", "XX.", "X..", "X.."]} />
      <R x={11} y={19} w={10} h={1} f="#8a8a8a" />
      <R x={11} y={22} w={10} h={1} f="#8a8a8a" />
      <R x={11} y={25} w={6} h={1} f="#8a8a8a" />
    </Svg>
  );
}

export function IconWeb({ className }: IconProps) {
  return (
    <Svg className={className}>
      <WindowFrame />
      <R x={6} y={13} w={20} h={3} f="#e6e6e6" />
      <R x={7} y={14} w={10} h={1} f="#999" />
      <R x={6} y={18} w={8} h={7} f="#4a9be0" />
      <R x={16} y={18} w={10} h={1} />
      <R x={16} y={21} w={10} h={1} />
      <R x={16} y={24} w={6} h={1} />
    </Svg>
  );
}

export function IconGame({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={3} y={9} w={26} h={15} f="#9a9aa8" />
      <R x={7} y={15} w={7} h={2} />
      <R x={9.5} y={12.5} w={2} h={7} />
      <circle cx={21.5} cy={14.5} r={2} fill="#d94141" stroke={K} strokeWidth={1} />
      <circle cx={25} cy={18} r={2} fill="#3b6fd8" stroke={K} strokeWidth={1} />
      <R x={14} y={20} w={4} h={1} />
    </Svg>
  );
}

export function IconChip({ className }: IconProps) {
  return (
    <Svg className={className}>
      {[11, 14, 17, 20].map((n) => (
        <g key={n}>
          <R x={n} y={4} w={2} h={5} f="#a8a8a8" />
          <R x={n} y={23} w={2} h={5} f="#a8a8a8" />
          <R x={4} y={n} w={5} h={2} f="#a8a8a8" />
          <R x={23} y={n} w={5} h={2} f="#a8a8a8" />
        </g>
      ))}
      <B x={8} y={8} w={16} h={16} f="#2e2e2e" />
      <R x={10} y={10} w={2} h={2} f="#9a9a9a" />
      <R x={13} y={15} w={6} h={1} f="#6cf06c" />
      <R x={13} y={18} w={4} h={1} f="#6cf06c" />
    </Svg>
  );
}

export function IconCode({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 3H21L26 8V29H4Z" fill={W} />
      <path d="M4.5 3.5H20.5L25.5 8.5V28.5H4.5Z" fill="none" stroke={K} strokeWidth={1} />
      <path d="M20.5 3.5V8.5H25.5" fill="#ddd" stroke={K} strokeWidth={1} />
      <Px pts={[[12, 14], [11, 15], [10, 16], [9, 17], [10, 18], [11, 19], [12, 20]]} f="#2b3a8f" />
      <Px pts={[[17, 14], [18, 15], [19, 16], [20, 17], [19, 18], [18, 19], [17, 20]]} f="#2b3a8f" />
      <R x={14} y={13} w={1} h={9} f="#c14f4f" />
    </Svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={3} y={8} w={26} h={17} />
      <path d="M4 9L16 19L28 9" fill="none" stroke={K} strokeWidth={1} />
      <R x={4} y={9} w={24} h={1} f="#ff8ba7" />
    </Svg>
  );
}

export function IconGuestbook({ className }: IconProps) {
  return (
    <Svg className={className}>
      <B x={5} y={4} w={22} h={24} />
      <B x={5} y={4} w={6} h={24} f="#c14f4f" />
      <R x={14} y={10} w={10} h={1} />
      <R x={14} y={14} w={10} h={1} />
      <R x={14} y={18} w={10} h={1} />
    </Svg>
  );
}

export function IconApple({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        d="M20.5 5.2c-1.3.1-2.9 1-3.8 2.1-.8 1-1.5 2.5-1.2 4 1.4.1 2.9-.8 3.8-1.9.9-1 1.5-2.5 1.2-4.2z"
        fill="currentColor"
      />
      <path
        d="M23.9 24.6c-.7 1.5-1 2.2-1.9 3.5-1.2 1.8-2.9 4-5 4-1.9 0-2.4-1.2-4.9-1.2-2.5 0-3.1 1.2-5 1.2-2.1 0-3.7-2-5-3.8-3.4-4.9-3.8-10.6-1.7-13.7 1.5-2.2 3.9-3.5 6.1-3.5 2.3 0 3.7 1.2 5.6 1.2 1.8 0 2.9-1.2 5.6-1.2 2 0 4.1 1.1 5.6 3-4.9 2.7-4.1 9.7.6 10.5z"
        fill="currentColor"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lookup by name — used by the file system, Finder, Terminal and the desktop.
// ---------------------------------------------------------------------------

export const ICONS = {
  about: IconAbout,
  terminal: IconTerminal,
  computer: IconComputer,
  readme: IconReadme,
  folder: IconFolder,
  skills: IconSkills,
  globe: IconGlobe,
  floppy: IconFloppy,
  trash: IconTrash,
  phone: IconPhone,
  pdf: IconPdf,
  web: IconWeb,
  game: IconGame,
  chip: IconChip,
  code: IconCode,
  text: IconDocument,
  mail: IconMail,
  guestbook: IconGuestbook,
} as const;

export type IconKind = keyof typeof ICONS;

export function FileIcon({ kind, className }: { kind: IconKind; className?: string }) {
  const Cmp = ICONS[kind];
  return <Cmp className={className} />;
}
