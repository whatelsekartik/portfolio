import { education } from "../data/portfolioData";

const btn = "border-2 border-black bg-[#dfdfdf] px-2 text-[13px] text-black/35 shadow-[1px_1px_0_rgba(0,0,0,.5)]";

/** The globe icon opens a little retro web browser showing education as a web page. */
export default function EducationApp() {
  return (
    <div className="flex h-full flex-col text-[14px]">
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-black bg-[#dfdfdf] px-2 py-1.5">
        <span className={btn}>◂</span>
        <span className={btn}>▸</span>
        <span className={btn}>⌂</span>
        <div className="flex min-w-0 flex-1 items-center gap-2 border-2 border-black bg-white px-2">
          <span className="text-black/50">Location:</span>
          <span className="truncate">about:education</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white px-5 py-4 select-text" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: 16 }}>
        <h1 className="text-[28px] leading-tight font-bold">Education</h1>
        <hr className="my-2 border-t-2 border-black/60" />

        {education.schools.map((s) => (
          <div key={s.school} className="mb-4">
            <h2 className="text-[20px] font-bold">{s.school}</h2>
            <p className="italic">
              {s.degree} · {s.period}
            </p>
            <ul className="ml-6 list-disc">
              {s.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2 className="mt-5 text-[20px] font-bold">Certifications</h2>
        <hr className="my-1 border-t border-black/50" />
        <ul className="ml-6 list-disc">
          {education.certifications.map((c) => (
            <li key={c.name}>
              <span className="font-bold">{c.name}</span> — {c.issuer}, {c.year}
            </li>
          ))}
        </ul>

        <h2 className="mt-5 text-[20px] font-bold">Achievements</h2>
        <hr className="my-1 border-t border-black/50" />
        <ul className="ml-6 list-disc">
          {education.achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <p className="shrink-0 border-t-2 border-black bg-[#efefef] px-3 py-0.5 text-[12px] text-black/60">Document: Done</p>
    </div>
  );
}
