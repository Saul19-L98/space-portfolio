import type { Quality } from "./store";

export function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem("motion") === "reduce") return true;
    if (window.localStorage.getItem("motion") === "full") return false;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function detectTouch(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ?? false;
}

export function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const q = new URLSearchParams(window.location.search).get("quality");
  if (q === "high" || q === "medium" || q === "low") return q;
  if (navigator.webdriver) return "low";
  const cores = navigator.hardwareConcurrency ?? 8;
  if (detectTouch() || cores <= 4) return "medium";
  return "high";
}

export function readSeedParam(): number | null {
  if (typeof window === "undefined") return null;
  const s = new URLSearchParams(window.location.search).get("seed");
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n >>> 0 : null;
}

export function supportsWebGL2(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
