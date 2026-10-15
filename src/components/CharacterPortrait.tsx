import type { SVGProps } from "react";

type CharacterPortraitProps = SVGProps<SVGSVGElement>;

/**
 * A warm, low-key adaptation of the SVG character from the motion redesign.
 * The shapes stay visible even when animation is disabled or unsupported.
 */
export default function CharacterPortrait({ className, ...props }: CharacterPortraitProps) {
  return (
    <svg
      viewBox="70 25 205 370"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustrated character wearing a cap"
      {...props}
    >
      <ellipse className="character-shadow" cx="170" cy="355" rx="76" ry="20" />
      <g className="character-body">
        <path className="character-torso" d="M130 312 Q170 290 210 312 L232 388 L108 388 Z" />
        <rect className="character-neck" x="156" y="116" width="28" height="18" rx="7" />
        <g className="character-head">
          <path className="character-cap-top" d="M106 82 Q170 30 234 82 L234 116 L106 116 Z" />
          <path className="character-cap-brim" d="M106 116 Q170 102 234 116" />
          <circle className="character-head-outline" cx="170" cy="136" r="66" />
          <circle className="character-skin" cx="104" cy="144" r="18" />
          <circle className="character-skin" cx="236" cy="144" r="18" />
          <circle className="character-eye-white" cx="146" cy="136" r="18" />
          <circle className="character-eye-white" cx="194" cy="136" r="18" />
          <circle className="character-eye" cx="146" cy="140" r="8" />
          <circle className="character-eye" cx="194" cy="140" r="8" />
          <rect className="character-brow" x="122" y="104" width="46" height="10" rx="5" />
          <rect className="character-brow" x="172" y="104" width="46" height="10" rx="5" />
          <path className="character-nose" d="M170 142 Q160 164 170 170 Q180 164 170 142" />
          <rect className="character-mouth-frame" x="126" y="182" width="88" height="34" rx="17" />
          <path className="character-mouth-line" d="M138 199 H202" />
        </g>
        <path className="character-arm character-arm-left" d="M130 324 Q106 274 98 214" />
        <path className="character-arm character-arm-right" d="M210 324 Q244 278 246 222" />
      </g>
    </svg>
  );
}
