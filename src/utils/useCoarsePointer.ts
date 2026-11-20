import { useState } from "react";

/** True on touch-first devices, where a single tap should open things. */
export function useCoarsePointer() {
  const [coarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches
  );
  return coarse;
}
