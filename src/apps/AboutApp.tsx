import { profile } from "../data/portfolioData";
import CharacterPortrait from "../components/CharacterPortrait";
import ScrollReveal from "../components/ScrollReveal";

const chip =
  "border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[13px] text-[#514c40]";

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-3 p-4 text-[15px] leading-relaxed">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-[76px] shrink-0 items-end justify-center overflow-hidden border border-[#d8c9ad] bg-[#f5ead6] px-1 pt-1">
          <CharacterPortrait className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#89551e]">
            Student developer
          </p>
          <h1 className="font-chicago text-[23px] font-bold leading-tight tracking-[-0.035em] text-[#29271f]">
            {profile.name}
          </h1>
          <p className="mt-1 text-[14px] text-[#514c40]">{profile.title}</p>
          <p className="text-[13px] text-[#756951]">{profile.location}</p>
        </div>
      </div>

      <p className="border-l-4 border-[#a96520] bg-[#fff7e8] px-3 py-2 text-[15px] leading-relaxed text-[#29271f]">
        {profile.quickIntro}
      </p>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <div className="flex flex-col gap-2">
          {profile.bio.map((paragraph, index) => (
            <p key={index} className="text-[14px] leading-relaxed text-[#514c40]">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#514c40]">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <span key={interest} className={chip}>{interest}</span>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#514c40]">How I work</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.personality.map((trait) => (
            <span key={trait} className={chip}>{trait}</span>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
