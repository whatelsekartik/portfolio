import { achievementRecords, education } from "../data/portfolioData";
import { useOpenApp } from "./appDefs";
import ScrollReveal from "../components/ScrollReveal";

const browserButton =
  "flex h-6 items-center justify-center border border-[#a99a7f] bg-[#fffaf0] px-2 text-[13px] text-[#514c40]";

export default function EducationApp() {
  const openApp = useOpenApp();
  const entranceResults = achievementRecords.filter((item) => item.id === "mht-cet" || item.id === "jee-maths");
  const additionalAchievements = education.achievements.filter((item) => !item.startsWith("JEE Main Mathematics:") && !item.startsWith("MHT CET:"));

  return (
    <div className="flex h-full flex-col text-[15px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-[#cabb9e] bg-[#f4ead7] px-2 py-1.5">
        <span className={browserButton} aria-hidden="true">←</span>
        <span className={browserButton} aria-hidden="true">→</span>
        <span className={browserButton} aria-hidden="true">⌂</span>
        <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#cabb9e] bg-white px-2 py-1">
          <span className="text-[#756951]">Location:</span>
          <span className="truncate">about:education</span>
        </div>
      </div>

      <main className="flex-1 overflow-auto bg-[#fffaf0] px-5 py-5 select-text">
        <ScrollReveal>
          <p className="editorial-meta text-[#89551e]">Education / the next chapter</p>
          <h1 className="editorial-title mt-3 text-[clamp(2.25rem,5vw,3.15rem)] text-[#29271f]">
            TWO TRACKS.<br /><span className="text-[#a96520]">ONE DIRECTION.</span>
          </h1>
          <p className="mt-3 max-w-[38rem] text-[15px] leading-relaxed text-[#514c40]">
            Studying information technology while exploring applied AI and data science in parallel.
          </p>
        </ScrollReveal>

        <section className="education-score-section mt-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b border-[#d8c9ad] pb-2">
            <div>
              <p className="editorial-meta text-[#89551e]">Entrance results / 2026</p>
              <h2 className="font-display mt-1 text-[21px] leading-tight text-[#29271f]">The numbers that opened doors.</h2>
            </div>
            <button
              type="button"
              onClick={() => openApp("achievements")}
              className="text-[12px] font-semibold text-[#89551e] underline-offset-4 hover:underline"
            >
              Full achievement archive ↗
            </button>
          </div>
          <div className="education-score-grid">
            {entranceResults.map((item, index) => (
              <article key={item.id} className={`education-score-card ${index === 0 ? "score-amber" : "score-ink"}`}>
                <span className="editorial-meta">{item.title}</span>
                <strong>{item.result}</strong>
                <span className="education-score-label">{item.resultLabel}</span>
                <span className="education-score-period">{item.period} · EXAM RESULT</span>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between gap-3 border-b border-[#d8c9ad] pb-2">
            <h2 className="editorial-meta text-[#514c40]">Currently pursuing</h2>
            <span className="editorial-meta text-[#756951]">02 programmes</span>
          </div>
          <div className="flex flex-col gap-3">
            {education.current.map((item, index) => {
              const dark = index === 0;
              return (
                <ScrollReveal key={item.degree + item.program}>
                  <article className={`relative isolate overflow-hidden border p-4 ${dark ? "border-[#29271f] bg-[#29271f] text-[#fffaf0]" : "border-[#dca45e] bg-[#dca45e] text-[#29271f]"}`}>
                    <span className="editorial-title pointer-events-none absolute right-2 bottom-[-23px] z-[-1] text-[104px] leading-none opacity-[0.075]" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <div className="relative flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className={`editorial-meta ${dark ? "text-[#e7ad5a]" : "text-[#5f3715]"}`}>
                          {index === 0 ? "01 / Undergraduate" : "02 / Applied learning"}
                        </p>
                        <h3 className="font-display mt-2 max-w-[27rem] text-[clamp(1.45rem,3vw,1.9rem)] leading-[1.08]">
                          {item.degree} in {item.program}
                        </h3>
                        {item.institution && (
                          <p className={`mt-3 text-[14px] leading-relaxed ${dark ? "text-[#e7dfcf]" : "text-[#4c3018]"}`}>
                            {item.institution}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${dark ? "border-[#756951] text-[#f1e8d6]" : "border-[#89551e] text-[#4c3018]"}`}>
                        In progress
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between gap-3 border-b border-[#d8c9ad] pb-2">
            <h2 className="editorial-meta text-[#514c40]">Earlier education</h2>
            <span className="editorial-meta text-[#756951]">2026</span>
          </div>
          {education.schools.map((school) => (
            <ScrollReveal key={school.school}>
              <article className="border-l-[3px] border-[#66704a] bg-[#f6efdf] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-[19px] leading-tight text-[#29271f]">{school.degree}</h3>
                  <span className="editorial-meta text-[#756951]">{school.period}</span>
                </div>
                <p className="mt-1 text-[14px] text-[#514c40]">{school.school}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {school.details.map((detail) => (
                    <span key={detail} className="border border-[#d8c9ad] bg-[#fffaf0] px-2 py-1 text-[13px] text-[#514c40]">{detail}</span>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </section>

        <section className="mt-8 pb-2">
          <h2 className="editorial-meta border-b border-[#d8c9ad] pb-2 text-[#514c40]">Additional academic highlights</h2>
          <div className="mt-3 flex flex-col">
            {additionalAchievements.map((achievement, index) => (
              <ScrollReveal key={achievement}>
                <div className="flex items-start gap-3 border-b border-dashed border-[#dfd2bb] py-3">
                  <span className="editorial-meta mt-0.5 text-[#a96520]">0{index + 1}</span>
                  <p className="text-[14px] leading-relaxed text-[#29271f]">{achievement}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>

      <p className="shrink-0 border-t border-[#cabb9e] bg-[#f4ead7] px-3 py-1 text-[12px] text-[#625b4c]">
        Document: Done
      </p>
    </div>
  );
}
