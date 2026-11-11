import { profile, projects } from "../data/portfolioData";
import { projectCaseStudies } from "../data/projectCaseStudies";
import CharacterPortrait from "../components/CharacterPortrait";
import ScrollReveal from "../components/ScrollReveal";
import { useOpenApp } from "./appDefs";
const chip="border border-[#d8c9ad] bg-[#fff7e8] px-2 py-1 text-[12px] font-medium text-[#514c40]";
const CURRENT_PROJECT_IDS=["campus-plus","sitemango","ecoswitch"];
export default function AboutApp(){
  const openApp=useOpenApp();
  const currentProjects=projects.filter(project=>CURRENT_PROJECT_IDS.includes(project.id));
  return <div className="flex flex-col gap-4 p-4 text-[15px] leading-relaxed">
    <ScrollReveal><section className="relative grid min-h-[210px] grid-cols-[minmax(0,1fr)_140px] overflow-hidden border border-[#29271f] bg-[#29271f] text-[#fffaf0]">
      <div className="relative z-10 flex min-w-0 flex-col items-start justify-center p-4 pr-1">
        <p className="editorial-meta mb-3 text-[#e7ad5a]">Student developer · Pune</p>
        <h1 className="editorial-title text-[clamp(1.9rem,4.5vw,2.7rem)]">KARTIK<br/>GAIKWAD<span className="text-[#e7ad5a]">.</span></h1>
        <p className="mt-3 max-w-[14rem] text-[13px] leading-snug text-[#e7dfcf]">{profile.title}</p>
      </div>
      <div className="relative flex min-h-full items-end justify-center overflow-hidden bg-[#dca45e]">
        <span className="absolute top-3 right-3 h-3 w-3 rounded-full border-2 border-[#29271f]" aria-hidden="true"/>
        <span className="absolute top-7 left-3 h-2 w-2 bg-[#fffaf0]" aria-hidden="true"/>
        <CharacterPortrait className="relative z-10 mb-1 h-[202px] w-[150px] max-w-none"/>
        <span className="absolute right-0 bottom-0 left-0 h-1.5 bg-[#a96520]" aria-hidden="true"/>
      </div><span className="pointer-events-none absolute top-2 left-2 h-2 w-2 bg-[#dca45e]" aria-hidden="true"/>
    </section></ScrollReveal>
    <div className="flex items-center gap-2"><span className="h-2 w-2 bg-[#a96520]" aria-hidden="true"/><p className="editorial-meta text-[#89551e]">A little about how I think</p></div>
    <p className="border-l-[3px] border-[#a96520] bg-[#fff7e8] px-3 py-2 text-[15px] leading-relaxed text-[#29271f]">{profile.quickIntro}</p>
    <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3"><div className="flex flex-col gap-2">{profile.bio.map((paragraph,index)=><p key={index} className="text-[14px] leading-relaxed text-[#514c40]">{paragraph}</p>)}</div></ScrollReveal>
    <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div><p className="editorial-meta text-[#89551e]">Current workbench</p><h2 className="font-display mt-1 text-[23px] leading-tight tracking-[-0.05em] text-[#29271f]">Currently building</h2></div>
        <span className="editorial-meta text-[#756951]">{String(currentProjects.length).padStart(2,"0")} threads</span>
      </div>
      <div className="flex flex-col gap-2">{currentProjects.map(project=>{
        const study=projectCaseStudies[project.id];if(!study)return null;
        return <button key={project.id} type="button" onClick={()=>openApp("project-detail",{id:project.id})}
          className="current-build-card group border border-[#d8c9ad] bg-[#fffaf0] p-3 text-left transition-colors hover:border-[#a96520] hover:bg-[#fff7e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a96520]"
          aria-label={`Open ${project.name} case study`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-display text-[17px] text-[#29271f]">{project.name}</span><span className={`case-stage case-stage--compact case-stage--${study.stageTone}`}>{study.stageLabel}</span></div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#514c40]">{study.stageNote}</p>
          <p className="mt-2 border-t border-dashed border-[#e2d6c0] pt-2 text-[11px] leading-relaxed text-[#756951]"><span className="font-semibold text-[#89551e]">Next:</span> {study.nextSteps[0]??"See the case study for current details."}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#89551e]">Open case study <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></span>
        </button>;
      })}</div>
    </ScrollReveal>
    <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3"><p className="editorial-meta mb-2 text-[#89551e]">Things I gravitate towards</p><div className="flex flex-wrap gap-1.5">{profile.interests.map(interest=><span key={interest} className={chip}>{interest}</span>)}</div></ScrollReveal>
    <ScrollReveal className="border-t border-dashed border-[#d8c9ad] pt-3"><p className="editorial-meta mb-2 text-[#89551e]">How I work</p><div className="flex flex-wrap gap-1.5">{profile.personality.map(trait=><span key={trait} className={chip}>{trait}</span>)}</div></ScrollReveal>
  </div>;
}
