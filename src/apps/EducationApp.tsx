import { education } from "../data/portfolioData";
import ScrollReveal from "../components/ScrollReveal";

const browserButton =
  "flex h-6 items-center justify-center border border-[#a99a7f] bg-[#fffaf0] px-2 text-[13px] text-[#514c40]";

export default function EducationApp() {
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
          <p className="text-[12px] font-semibold uppercase tracking-[0.17em] text-[#89551e]">Education · the next chapter</p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-[-0.04em] text-[#29271f]">
            Learning in progress<span className="text-[#a96520]">.</span>
          </h1>
          <p className="mt-2 max-w-[38rem] text-[15px] leading-relaxed text-[#514c40]">
            Building a strong foundation in information technology while studying applied AI and data science in parallel.
          </p>
        </ScrollReveal>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3 border-b border-[#d8c9ad] pb-2">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.13em] text-[#514c40]">Currently pursuing</h2>
            <span className="text-[12px] text-[#756951]">02 programmes</span>
          </div>
          <div className="flex flex-col gap-3">
            {education.current.map((item, index) => (
              <ScrollReveal key={item.degree + item.program}>
                <article className="relative overflow-hidden border border-[#d8c9ad] bg-[#fff7e8] p-4 shadow-[2px_2px_0_rgba(41,39,31,0.06)]">
                  <span className="absolute inset-y-0 left-0 w-1 bg-[#a96520]" aria-hidden="true" />
                  <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#89551e]">
                        {index === 0 ? "01 / Undergraduate" : "02 / Applied learning"}
                      </p>
                      <h3 className="mt-1 text-[20px] font-bold leading-tight tracking-[-0.025em] text-[#29271f]">
                        {item.degree} in {item.program}
                      </h3>
                      {item.institution && (
                        <p className="mt-2 text-[14px] leading-relaxed text-[#514c40]">{item.institution}</p>
                      )}
                    </div>
                    <span className="shrink-0 border border-[#c7b48d] bg-[#f1e8d6] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#514c40]">
                      In progress
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="border-b border-[#d8c9ad] pb-2 text-[13px] font-bold uppercase tracking-[0.13em] text-[#514c40]">
            Earlier education
          </h2>
          <div className="mt-3">
            {education.schools.map((school) => (
              <ScrollReveal key={school.school}>
                <article className="border border-[#dfd2bb] bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[18px] font-bold text-[#29271f]">{school.degree}</h3>
                    <span className="text-[13px] font-medium text-[#756951]">{school.period}</span>
                  </div>
                  <p className="mt-1 text-[14px] text-[#514c40]">{school.school}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.details.map((detail) => (
                      <span key={detail} className="border border-[#e0d3bc] bg-[#f8f1e4] px-2 py-1 text-[13px] text-[#514c40]">
                        {detail}
                      </span>
                    ))}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mt-7 pb-2">
          <h2 className="border-b border-[#d8c9ad] pb-2 text-[13px] font-bold uppercase tracking-[0.13em] text-[#514c40]">
            Earlier achievements
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {education.achievements.map((achievement, index) => (
              <ScrollReveal key={achievement}>
                <div className="flex items-start gap-3 border-b border-dashed border-[#dfd2bb] py-2">
                  <span className="mt-0.5 font-mono text-[13px] text-[#a96520]">0{index + 1}</span>
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
