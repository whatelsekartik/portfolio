import { useCallback } from "react";
import type { AppId } from "../types";
import type { IconKind } from "../components/Icons";
import { useWindowManager } from "../context/WindowManagerContext";
import { profile, projects } from "../data/portfolioData";
export interface AppDef{label:string;icon:IconKind;width:number;height:number;minWidth?:number;minHeight?:number;title?:(payload?:Record<string,unknown>)=>string;}
export interface AppNavigationOptions{history?:"push"|"replace"|"none";}
export interface AppRoute{appId:AppId;payload?:Record<string,unknown>;}
export const APPS:Record<AppId,AppDef>={
  about:{label:"About Me",icon:"about",width:480,height:560,title:()=>`About ${profile.name}`},
  terminal:{label:"Terminal.exe",icon:"terminal",width:580,height:400,minWidth:320},
  finder:{label:"My Computer",icon:"computer",width:520,height:380,title:()=>"Macintosh HD"},
  readme:{label:"README.txt",icon:"readme",width:500,height:520},
  projects:{label:"My Projects",icon:"folder",width:480,height:360,title:()=>"My Projects"},
  "project-detail":{label:"Project",icon:"code",width:440,height:390,title:p=>projects.find(x=>x.id===p?.id)?.name??"Project"},
  contributions:{label:"Proof of Work",icon:"globe",width:680,height:720,minWidth:320,minHeight:380,title:()=>"Proof of Work — GitHub"},
  skills:{label:"Skills.exe",icon:"skills",width:500,height:400},
  education:{label:"Education",icon:"globe",width:540,height:450,minWidth:320},
  achievements:{label:"Achievements",icon:"award",width:560,height:620,minWidth:320,minHeight:360},
  experience:{label:"Experience",icon:"floppy",width:600,height:400,minWidth:320},
  trash:{label:"Trash",icon:"trash",width:420,height:390},
  contact:{label:"Contact Me",icon:"phone",width:430,height:610},
  resume:{label:"Resume.pdf",icon:"pdf",width:580,height:540,minWidth:320},
  guestbook:{label:"Guestbook",icon:"guestbook",width:430,height:400},
  textfile:{label:"Text file",icon:"text",width:440,height:340,title:p=>String(p?.title??"Untitled")},
};
const ROUTABLE_APP_IDS:AppId[]=["about","terminal","finder","readme","projects","skills","education","achievements","experience","trash","contact","resume","guestbook","contributions"];
export function appTitle(id:AppId,payload?:Record<string,unknown>){const def=APPS[id];return def.title?def.title(payload):def.label;}
/** Hash routes remain compatible with GitHub Pages and static hosts without rewrite rules. */
export function appRouteFor(id:AppId,payload?:Record<string,unknown>){
  if(id==="project-detail"&&typeof payload?.id==="string")return `#/projects/${encodeURIComponent(payload.id)}`;
  return `#/app/${id==="project-detail"?"projects":id}`;
}
export function readAppRoute():AppRoute|null{
  if(typeof window==="undefined"||!window.location.hash.startsWith("#/"))return null;
  const parts=window.location.hash.slice(2).split("/").filter(Boolean).map(part=>{try{return decodeURIComponent(part);}catch{return part;}});
  if(parts[0]==="projects"){
    const project=parts[1]?projects.find(item=>item.id===parts[1]):undefined;
    return project?{appId:"project-detail",payload:{id:project.id}}:{appId:"projects"};
  }
  const id=parts[0]==="app"?parts[1]:parts[0];
  return id&&ROUTABLE_APP_IDS.includes(id as AppId)?{appId:id as AppId}:null;
}
export function writeAppRoute(id:AppId,payload?:Record<string,unknown>,mode:"push"|"replace"|"none"="replace"){
  if(typeof window==="undefined"||mode==="none")return;
  const route=appRouteFor(id,payload);if(window.location.hash===route)return;
  const url=`${window.location.pathname}${window.location.search}${route}`;
  if(mode==="push")window.history.pushState({portfolioRoute:route},"",url);else window.history.replaceState({portfolioRoute:route},"",url);
}
export function useOpenApp(){
  const {openWindow}=useWindowManager();
  return useCallback((id:AppId,payload?:Record<string,unknown>,navigation:AppNavigationOptions={})=>{
    const def=APPS[id];
    const windowId=openWindow({appId:id,title:appTitle(id,payload),payload,rect:{width:def.width,height:def.height},minWidth:def.minWidth,minHeight:def.minHeight});
    writeAppRoute(id,payload,navigation.history??"push");return windowId;
  },[openWindow]);
}
