import { createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode } from "react";
export type ToastTone="success"|"error"|"info";
export interface ToastInput{title:string;description?:string;tone?:ToastTone;duration?:number;}
interface ToastRecord extends ToastInput{id:number;tone:ToastTone;duration:number;}
interface ToastContextValue{showToast:(toast:ToastInput)=>void;}
const ToastContext=createContext<ToastContextValue|null>(null);
function ToastCard({toast,onDismiss}:{toast:ToastRecord;onDismiss:(id:number)=>void}){
  useEffect(()=>{const timer=window.setTimeout(()=>onDismiss(toast.id),toast.duration);return()=>window.clearTimeout(timer);},[toast.id,toast.duration,onDismiss]);
  const symbol=toast.tone==="success"?"✓":toast.tone==="error"?"!":"i";
  return <div className={`toast-card toast-card--${toast.tone}`} role={toast.tone==="error"?"alert":"status"}>
    <span className="toast-card-mark" aria-hidden="true">{symbol}</span>
    <div className="min-w-0 flex-1"><p className="toast-card-title">{toast.title}</p>{toast.description&&<p className="toast-card-description">{toast.description}</p>}</div>
    <button type="button" className="toast-card-close" onClick={()=>onDismiss(toast.id)} aria-label="Dismiss notification">×</button>
  </div>;
}
export function ToastProvider({children}:{children:ReactNode}){
  const [toasts,setToasts]=useState<ToastRecord[]>([]),nextId=useRef(0);
  const showToast=useCallback((toast:ToastInput)=>{
    const id=++nextId.current;
    setToasts(current=>[...current.slice(-3),{...toast,id,tone:toast.tone??"info",duration:toast.duration??3600}]);
  },[]);
  const dismiss=useCallback((id:number)=>setToasts(current=>current.filter(toast=>toast.id!==id)),[]);
  return <ToastContext.Provider value={{showToast}}>{children}
    <div className="toast-viewport" aria-label="Notifications" aria-live="polite" aria-relevant="additions removals">
      {toasts.map(toast=><ToastCard key={toast.id} toast={toast} onDismiss={dismiss}/>)}
    </div>
  </ToastContext.Provider>;
}
export function useToast(){const value=useContext(ToastContext);if(!value)throw new Error("useToast must be used within ToastProvider");return value;}
