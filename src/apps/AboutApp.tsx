import { profile } from "../data/portfolioData";
import CharacterPortrait from "../components/CharacterPortrait";
import ScrollReveal from "../components/ScrollReveal";

const chip =
  "border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[12px] font-medium text-[#514c40]";

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-4 p-4 text-[15px] leading-relaxed">
      <ScrollReveal>
        <section className="relative grid min-h-[194px] grid-cols-[minmax(0,1fr)_112px] overflow-hidden border border-[#29271f] bg-[#29271f] text-[#fffaf0]">
          <div className="relative z-10 flex min-w-0 flex-col items-start justify-center p-4 pr-1">
            <p className="editorial-meta mb-3 text-[#e7ad5a]">Student developer · Pune</p>
            <h1 className="editorial-title text-[clamp(2.25rem,5vw,3rem)]">
              KARTIK<br />GAIKWAD<span className="text-[#e7ad5a]">.</span>
            </h1>
            <p className="mt-3 max-w-[14rem] text-[13px] leading-snug text-[#e7dfcf]">{profile.title}</p>
          </div>
          <div className="relative flex min-h-full items-end justify-center overflow-hidden bg-[#dca45e]">
            <span className="absolute top-3 right-3 h-3 w-3 rounded-full border-2 border-[#29271f]" aria-hidden="true" />
            <CharacterPortrait className="relative z-10 h-[178px] w-[108px] max-w-none" />
            <span className="absolute right-0 bottom-0 left-0 h-8 bg-[#a96520]" aria-hidden="true" />
          </div>
          <span className="pointer-events-none absolute top-2 left-2 h-2 w-2 bg-[#dca45e]" aria-hidden="true" />
        </section>
      </ScrollReveal>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 bg-[#a96520]" aria-hidden="true" />
        <p className="editorial-meta text-[#89551e]">A little about how I think</p>
      </div>
      <p className="border-l-[3px] border-[#a96520] bg-[#fff7e8] px-3 py-2 text-[15px] leading-relaxed text-[#29271f]">
        {profile.quickIntro}
      </p>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <div className="flex flex-col gap-2">
          {profile.bio.map((paragraph, index) => (
            <p key={index} className="text-[14px] leading-relaxed text-[#514c40]">{paragraph}</p>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <p className="editorial-meta mb-2 text-[#89551e]">Things I gravitate towards</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => <span key={interest} className={chip}>{interest}</span>)}
        </div>
      </ScrollReveal>

      <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
        <p className="editorial-meta mb-2 text-[#89551e]">How I work</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.personality.map((trait) => <span key={trait} className={chip}>{trait}</span>)}
        </div>
      </ScrollReveal>
    </div>
  );
}
