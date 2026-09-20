import { backend } from "../data/portfolioData";

/** The Google Apps Script web app URL. Empty = no backend configured. */
export const BACKEND_URL: string = backend.endpoint || import.meta.env.VITE_BACKEND_URL || "";

/**
 * Apps Script can't answer CORS preflight requests, so POSTs are sent as a plain
 * form-encoded body (a "simple" request) and every response is JSON.
 */
export async function backendGet<T>(): Promise<T> {
  const res = await fetch(BACKEND_URL, { cache: "no-store", signal: AbortSignal.timeout(20_000) });
  return (await res.json()) as T;
}

export async function backendPost<T>(params: Record<string, string>): Promise<T> {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(30_000),
  });
  return (await res.json()) as T;
}
