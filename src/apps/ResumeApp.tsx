import { useState } from "react";
import { education, experience, profile, resume, skillGroups } from "../data/portfolioData";
import { useCoarsePointer } from "../utils/useCoarsePointer";
import { cn } from "../utils/cn";

const btn =
  "border-2 border-black bg-[#dfdfdf] px-2 py-0.5 text-[13px] shadow-[1px_1px_0_#000] hover:bg-black hover:text-white";

/**
 * Resume.pdf: shows the real PDF from /public/resume.pdf in an embedded viewer.
 * Phones can't show PDFs inline, so they start on a text version of the same CV.
 */
export default function ResumeApp() {
  const coarse = useCoarsePointer();
  const canEmbedPdf = typeof navigator !== "undefined" && navigator.pdfViewerEnabled !== false;
  const [mode, setMode] = useState<"pdf" | "text">(coarse || !canEmbedPdf ? "text" : "pdf");

  return (
    <div className="flex h-full flex-col text-[14px]">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b-2 border-black bg-[#dfdfdf] px-2 py-1.5">
        <a href={resume.pdfUrl} download={resume.downloadName} className={btn}>
          Download
        </a>
        <a href={resume.pdfUrl} target="_blank" rel="noreferrer" className={btn}>
          Open in tab ↗
        </a>
        <button type="button" onClick={() => setMode(mode === "pdf" ? "text" : "pdf")} className={btn}>
          {mode === "pdf" ? "Text version" : "PDF version"}
        </button>
        <span className="font-chicago ml-auto truncate text-[12px] text-black/60">{resume.downloadName}</span>
      </div>

      <div className={cn("flex-1 overflow-auto bg-[#6b6b6b]", mode === "text" && "p-3")}>
        {mode === "pdf" ? (
          <iframe
            title="Resume PDF"
            src={`${resume.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
            className="block h-full w-full border-0 bg-white"
          />
        ) : (
          <article className="mx-auto max-w-[520px] border border-black bg-white p-5 text-[14px] leading-snug shadow-[3px_3px_0_rgba(0,0,0,.5)] select-text">
            <h1 className="font-chicago text-[20px] leading-tight">{profile.name}</h1>
            <p className="mb-2 text-black/60">{profile.title}</p>
            <p className="mb-3">{resume.summary}</p>

            <h2 className="font-chicago mb-1 border-b-2 border-black/30 text-[14px]">Experience</h2>
            <div className="mb-3 flex flex-col gap-2">
              {experience.map((e) => (
                <div key={`${e.org}-${e.role}`}>
                  <p className="flex flex-wrap justify-between gap-x-2">
                    <span className="font-bold">{e.role}, {e.org}</span>
                    <span className="text-black/55">{e.period}</span>
                  </p>
                  <ul className="ml-4 list-disc">
                    {e.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="font-chicago mb-1 border-b-2 border-black/30 text-[14px]">Education</h2>
            <div className="mb-3 flex flex-col gap-1">
              {education.current.map((item) => (
                <p key={item.degree + item.program} className="flex flex-wrap justify-between gap-x-2">
                  <span>
                    <span className="font-bold">{item.degree} in {item.program}</span>
                    {item.institution ? `, ${item.institution}` : ""}
                  </span>
                  <span className="text-black/55">In progress</span>
                </p>
              ))}
              {education.schools.map((school) => (
                <p key={school.school} className="flex flex-wrap justify-between gap-x-2">
                  <span>{school.degree}, {school.school}</span>
                  <span className="text-black/55">{school.period}</span>
                </p>
              ))}
            </div>

            <h2 className="font-chicago mb-1 border-b-2 border-black/30 text-[14px]">Academic highlights</h2>
            <ul className="mb-3 ml-4 list-disc">
              {education.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
            </ul>

            <h2 className="font-chicago mb-1 border-b-2 border-black/30 text-[14px]">Skills</h2>
            {skillGroups.map((group) => (
              <p key={group.name}>
                <span className="font-bold">{group.name}:</span> {group.items.map((item) => item.name).join(", ")}
              </p>
            ))}
          </article>
        )}
      </div>
    </div>
  );
}
