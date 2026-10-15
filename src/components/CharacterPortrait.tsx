import type { SVGProps } from "react";

type CharacterPortraitProps = SVGProps<SVGSVGElement>;

/**
 * A restrained editorial illustration: a developer at a laptop, drawn with
 * simple geometric shapes rather than exaggerated facial proportions.
 */
export default function CharacterPortrait({ className, ...props }: CharacterPortraitProps) {
  return (
    <svg
      viewBox="0 0 240 280"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a developer working at a laptop"
      {...props}
    >
      <circle className="character-sun" cx="121" cy="112" r="88" />
      <circle className="character-orbit" cx="121" cy="112" r="99" />
      <path className="character-spark" d="M35 86v12m-6-6h12M194 45v10m-5-5h10M202 129v8m-4-4h8" />

      <ellipse className="character-shadow" cx="120" cy="239" rx="74" ry="8" />
      <path className="character-chair" d="M70 142V203Q70 215 82 215H158Q170 215 170 203V151" />

      <g className="character-body">
        <path className="character-torso" d="M85 126Q120 109 155 126L180 222H60Z" />
        <path className="character-collar" d="M104 124L120 143L136 124" />
        <path className="character-pocket" d="M99 165H141V184Q120 191 99 184Z" />

        <path className="character-arm character-arm-left" d="M88 139Q70 154 74 185L87 198" />
        <path className="character-arm character-arm-right" d="M152 139Q170 154 166 185L153 198" />
        <circle className="character-hand" cx="88" cy="199" r="7" />
        <circle className="character-hand" cx="152" cy="199" r="7" />

        <rect className="character-neck" x="111" y="108" width="18" height="24" rx="7" />
        <g className="character-head">
          <path className="character-ear" d="M89 82Q80 79 82 92Q84 102 94 99" />
          <path className="character-ear" d="M151 82Q160 79 158 92Q156 102 146 99" />
          <path className="character-face" d="M90 72Q92 49 120 48Q148 49 150 72L146 93Q139 113 120 116Q101 113 94 93Z" />
          <path className="character-hair" d="M89 78Q85 56 102 46Q124 33 143 49Q153 57 152 77Q139 67 120 68Q101 68 89 78Z" />
          <path className="character-cap-top" d="M88 65Q119 39 151 64L151 75Q120 65 89 77Z" />
          <path className="character-cap-brim" d="M87 75Q120 65 153 76" />
          <path className="character-cap-mark" d="M115 57l5-4 5 4" />
          <path className="character-brow" d="M101 83Q107 79 113 83M128 83Q134 79 140 83" />
          <ellipse className="character-eye" cx="107" cy="89" rx="2.2" ry="2.8" />
          <ellipse className="character-eye" cx="134" cy="89" rx="2.2" ry="2.8" />
          <path className="character-nose" d="M120 89l-3 12 5 1" />
          <path className="character-mouth-line" d="M111 105Q120 111 129 105" />
          <path className="character-cheek" d="M96 99q4 3 8 0M136 99q4 3 8 0" />
        </g>
      </g>

      <g className="character-laptop">
        <rect className="character-laptop-screen" x="82" y="158" width="76" height="54" rx="3" />
        <rect className="character-laptop-display" x="87" y="163" width="66" height="44" rx="1" />
        <path className="character-screen-mark" d="M103 181l5-5-5-5M113 181l5-10M123 181h18" />
        <path className="character-laptop-base" d="M82 213H158L169 222H71Z" />
        <path className="character-laptop-trackpad" d="M111 216H129L132 219H108Z" />
      </g>

      <path className="character-desk" d="M24 224H216" />
      <path className="character-desk-leg" d="M54 225V244M186 225V244" />
      <circle className="character-dot" cx="193" cy="185" r="3" />
      <path className="character-plant" d="M196 223V202M196 211Q181 207 184 196Q196 197 196 211M196 216Q208 211 209 201Q198 203 196 216" />
    </svg>
  );
}
