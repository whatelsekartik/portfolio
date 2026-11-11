import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AppId, OpenWindowOptions, Rect, WindowInstance } from "../types";
interface WindowManagerValue {
  windows: WindowInstance[]; openWindow: (options: OpenWindowOptions) => string;
  closeWindow: (id: string) => void; focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void; toggleMaximizeWindow: (id: string) => void;
  updateRect: (id: string, rect: Partial<WindowInstance["rect"]>) => void;
  activeWindowId: string | null;
}
interface WorkspaceSnapshot { windows: WindowInstance[]; activeWindowId: string | null; }
const WindowManagerContext = createContext<WindowManagerValue | null>(null);
const DEFAULT_W=460, DEFAULT_H=340, MENU_BAR=24, SMALL_SCREEN=640;
const WORKSPACE_KEY="mac-portfolio-workspace-v1", MAX_RESTORED_WINDOWS=14;
const VALID_APP_IDS:AppId[]=["about","terminal","finder","readme","projects","project-detail","skills","education","achievements","experience","trash","contact","resume","guestbook","contributions","textfile"];
const clamp=(n:number,lo:number,hi:number)=>Math.max(lo,Math.min(n,hi));
function keyOf(appId:string,payload?:Record<string,unknown>){return `${appId}:${JSON.stringify(payload??{})}`;}
function maximizedRect():Rect{return{x:8,y:MENU_BAR+8,width:Math.max(1,window.innerWidth-16),height:Math.max(1,window.innerHeight-MENU_BAR-16)};}
function fitRect(requested:Partial<Rect>,cascadeIndex:number):Rect{
  const vw=window.innerWidth,vh=window.innerHeight;
  if(vw<SMALL_SCREEN)return{x:4,y:MENU_BAR+6,width:Math.max(1,vw-8),height:Math.max(1,vh-MENU_BAR-14)};
  const maxWidth=Math.max(1,vw-16),maxHeight=Math.max(1,vh-MENU_BAR-16);
  const width=Math.min(requested.width??DEFAULT_W,maxWidth),height=Math.min(requested.height??DEFAULT_H,maxHeight);
  const offset=(cascadeIndex%8)*24,minY=MENU_BAR+8;
  return{x:clamp(requested.x??90+offset,8,Math.max(8,vw-width-8)),y:clamp(requested.y??50+offset,minY,Math.max(minY,vh-height-8)),width,height};
}
function isRecord(value:unknown):value is Record<string,unknown>{return Boolean(value)&&typeof value==="object"&&!Array.isArray(value);}
function isRect(value:unknown):value is Rect{return isRecord(value)&&["x","y","width","height"].every(key=>typeof value[key]==="number"&&Number.isFinite(value[key]));}
function isSavedWindow(value:unknown):value is WindowInstance{
  if(!isRecord(value))return false;
  return typeof value.id==="string"&&/^win-\d+$/.test(value.id)&&typeof value.appId==="string"&&VALID_APP_IDS.includes(value.appId as AppId)&&
    typeof value.title==="string"&&isRect(value.rect)&&(value.prevRect===undefined||isRect(value.prevRect))&&
    typeof value.zIndex==="number"&&Number.isFinite(value.zIndex)&&typeof value.isMinimized==="boolean"&&typeof value.isMaximized==="boolean"&&
    typeof value.minWidth==="number"&&Number.isFinite(value.minWidth)&&typeof value.minHeight==="number"&&Number.isFinite(value.minHeight)&&
    (value.payload===undefined||isRecord(value.payload));
}
function loadWorkspace():WorkspaceSnapshot{
  if(typeof window==="undefined")return{windows:[],activeWindowId:null};
  try{
    const parsed:unknown=JSON.parse(localStorage.getItem(WORKSPACE_KEY)??"null");
    if(!isRecord(parsed)||parsed.version!==1||!Array.isArray(parsed.windows))return{windows:[],activeWindowId:null};
    const windows=parsed.windows.filter(isSavedWindow).slice(-MAX_RESTORED_WINDOWS).map((win,index)=>({
      ...win,rect:win.isMaximized?maximizedRect():fitRect(win.rect,index),prevRect:win.prevRect?fitRect(win.prevRect,index):undefined,
    }));
    const requested=typeof parsed.activeWindowId==="string"?parsed.activeWindowId:null;
    const active=windows.find(win=>win.id===requested&&!win.isMinimized)??[...windows].filter(win=>!win.isMinimized).sort((a,b)=>b.zIndex-a.zIndex)[0];
    return{windows,activeWindowId:active?.id??null};
  }catch{return{windows:[],activeWindowId:null};}
}
export function WindowManagerProvider({children}:{children:ReactNode}){
  const [initial]=useState<WorkspaceSnapshot>(loadWorkspace);
  const windowsRef=useRef<WindowInstance[]>(initial.windows);
  const [windows,setWindows]=useState<WindowInstance[]>(initial.windows);
  const [activeWindowId,setActiveWindowId]=useState<string|null>(initial.activeWindowId);
  const zCounter=useRef(Math.max(10,...initial.windows.map(win=>win.zIndex)));
  const idCounter=useRef(Math.max(0,...initial.windows.map(win=>Number(win.id.replace(/^win-/,""))||0)));
  const commit=useCallback((next:WindowInstance[])=>{windowsRef.current=next;setWindows(next);},[]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      try{localStorage.setItem(WORKSPACE_KEY,JSON.stringify({version:1,windows,activeWindowId}));}
      catch{/* Storage may be disabled or full; this session still works. */}
    },220);
    return()=>window.clearTimeout(timer);
  },[windows,activeWindowId]);
  useEffect(()=>{
    function onResize(){
      const small=window.innerWidth<SMALL_SCREEN;
      commit(windowsRef.current.map((win,index)=>({...win,rect:win.isMaximized?maximizedRect():fitRect(win.rect,index),prevRect:win.prevRect&&!small?fitRect(win.prevRect,index):win.prevRect})));
    }
    window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);
  },[commit]);
  const focusWindow=useCallback((id:string)=>{
    if(!windowsRef.current.some(win=>win.id===id))return;
    const z=++zCounter.current;commit(windowsRef.current.map(win=>win.id===id?{...win,zIndex:z}:win));setActiveWindowId(id);
  },[commit]);
  const openWindow=useCallback((options:OpenWindowOptions)=>{
    const list=windowsRef.current;
    const existing=options.singleton!==false?list.find(win=>keyOf(win.appId,win.payload)===keyOf(options.appId,options.payload)):undefined;
    const z=++zCounter.current;
    if(existing){commit(list.map(win=>win.id===existing.id?{...win,isMinimized:false,zIndex:z}:win));setActiveWindowId(existing.id);return existing.id;}
    const id=`win-${++idCounter.current}`;
    const next:WindowInstance={id,appId:options.appId,title:options.title,payload:options.payload,rect:fitRect(options.rect??{},list.length),zIndex:z,isMinimized:false,isMaximized:false,minWidth:options.minWidth??260,minHeight:options.minHeight??180};
    commit([...list,next]);setActiveWindowId(id);return id;
  },[commit]);
  const closeWindow=useCallback((id:string)=>{
    const next=windowsRef.current.filter(win=>win.id!==id);commit(next);
    setActiveWindowId(current=>current!==id?current:[...next].filter(win=>!win.isMinimized).sort((a,b)=>b.zIndex-a.zIndex)[0]?.id??null);
  },[commit]);
  const minimizeWindow=useCallback((id:string)=>{
    const win=windowsRef.current.find(item=>item.id===id);if(!win)return;
    const isMinimized=!win.isMinimized;commit(windowsRef.current.map(item=>item.id===id?{...item,isMinimized}:item));
    if(isMinimized&&activeWindowId===id){
      const next=windowsRef.current.filter(item=>item.id!==id&&!item.isMinimized).sort((a,b)=>b.zIndex-a.zIndex)[0];setActiveWindowId(next?.id??null);
    }else if(!isMinimized)focusWindow(id);
  },[activeWindowId,commit,focusWindow]);
  const toggleMaximizeWindow=useCallback((id:string)=>{
    commit(windowsRef.current.map(win=>{
      if(win.id!==id)return win;
      if(win.isMaximized&&win.prevRect)return{...win,isMaximized:false,rect:fitRect(win.prevRect,0),prevRect:undefined};
      return{...win,isMaximized:true,isMinimized:false,prevRect:win.rect,rect:maximizedRect()};
    }));
  },[commit]);
  const updateRect=useCallback((id:string,rect:Partial<WindowInstance["rect"]>)=>{
    commit(windowsRef.current.map(win=>win.id===id?{...win,rect:fitRect({...win.rect,...rect},0)}:win));
  },[commit]);
  return <WindowManagerContext.Provider value={{windows,openWindow,closeWindow,focusWindow,minimizeWindow,toggleMaximizeWindow,updateRect,activeWindowId}}>{children}</WindowManagerContext.Provider>;
}
export function useWindowManager(){const ctx=useContext(WindowManagerContext);if(!ctx)throw new Error("useWindowManager must be used within WindowManagerProvider");return ctx;}
