export type View = "galaxy" | "system" | "planet" | "pilot";

export interface RouteState {
  view: View;
  systemSlug: string | null;
  planetSlug: string | null;
}

export const galaxyPath = () => "/";
export const pilotPath = () => "/pilot";
export const systemPath = (system: string) => `/system/${system}`;
export const planetPath = (system: string, planet: string) => `/system/${system}/${planet}`;
export const missionsPath = () => "/missions";

export function parseRoute(pathname: string): RouteState {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "pilot") return { view: "pilot", systemSlug: null, planetSlug: null };
  if (parts[0] === "system" && parts[1]) {
    if (parts[2]) return { view: "planet", systemSlug: parts[1], planetSlug: parts[2] };
    return { view: "system", systemSlug: parts[1], planetSlug: null };
  }
  return { view: "galaxy", systemSlug: null, planetSlug: null };
}

export function parentPath(state: RouteState): string {
  if (state.view === "planet" && state.systemSlug) return systemPath(state.systemSlug);
  return galaxyPath();
}
