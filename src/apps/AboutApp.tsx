import { IconAbout } from "../components/Icons";
import { profile } from "../data/portfolioData";

const chip = "border border-black bg-[#f2f2f2] px-1.5 py-0.5 text-[13px]";

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-3 p-4 text-[14px] leading-snug">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-[#f2f2f2]">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover grayscale contrast-125" />
          ) : (
            <IconAbout className="h-16 w-16" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-chicago text-[19px] leading-tight">{profile.name}</p>
          <p className="text-black/75">{profile.title}</p>
          <p className="text-black/55">{profile.location}</p>
        </div>
      </div>

      <p className="border-2 border-black bg-[#fffdea] p-2">{profile.quickIntro}</p>

      <div className="border-t-2 border-dashed border-black/30 pt-3">
        {profile.bio.map((p, i) => (
          <p key={i} className="mb-2">
            {p}
          </p>
        ))}
      </div>

      <div className="border-t-2 border-dashed border-black/30 pt-3">
        <p className="font-chicago mb-1.5 text-[14px]">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((s) => (
            <span key={s} className={chip}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-dashed border-black/30 pt-3">
        <p className="font-chicago mb-1.5 text-[14px]">Personality</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.personality.map((s) => (
            <span key={s} className={chip}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
