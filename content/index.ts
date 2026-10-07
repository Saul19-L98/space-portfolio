import type { Planet, System, Universe } from "./schema";
import { profile } from "./profile";
import { independentContractor } from "./systems/independent-contractor";
import { orbitweb } from "./systems/orbitweb";
import { aracariStudios } from "./systems/aracari-studios";
import { tdwGroup } from "./systems/tdw-group";
import { hydrateDimSystem } from "@/lib/dim-systems";
import { parseDate } from "@/lib/time";

export const universe: Universe = {
  profile,
  systems: [independentContractor, orbitweb, aracariStudios, tdwGroup].map(hydrateDimSystem),
  defaultSeed: 0x5a1f0b3d,
};

export const systems: System[] = universe.systems;

export function getSystem(slug: string): System | undefined {
  return systems.find((s) => s.slug === slug);
}

export function getPlanet(systemSlug: string, planetSlug: string): { system: System; planet: Planet } | undefined {
  const system = getSystem(systemSlug);
  const planet = system?.planets.find((p) => p.slug === planetSlug);
  return system && planet ? { system, planet } : undefined;
}

/** Planets of a system in chronological order (orbit order). */
export function chronologicalPlanets(system: System): Planet[] {
  return [...system.planets].sort((a, b) => parseDate(a.start) - parseDate(b.start) || a.slug.localeCompare(b.slug));
}

export function allPlanetParams(): { slug: string; planet: string }[] {
  return systems.flatMap((s) => s.planets.map((p) => ({ slug: s.slug, planet: p.slug })));
}

export function allSystemParams(): { slug: string }[] {
  return systems.map((s) => ({ slug: s.slug }));
}

/** 0..1 richness used for star size and brightness. */
export function systemRichness(system: System): number {
  if (system.kind === "dim") return 0.18;
  return Math.min(1, 0.5 + system.planets.length / 40);
}

export const DOMAIN_LABELS: Record<Planet["domain"], string> = {
  genai: "GenAI & agents",
  data: "Data acquisition",
  cloud: "Cloud & IaC",
  cv: "Computer vision",
  web: "Product & web",
  ops: "Operations & security",
};

export const STATUS_LABELS: Record<Planet["status"], string> = {
  live: "Live",
  done: "Complete",
  prototype: "Prototype",
  ongoing: "Ongoing",
  superseded: "Superseded",
};

export const DOMAIN_COLORS: Record<Planet["domain"], string> = {
  genai: "#ff9f6b",
  data: "#7cc4ff",
  cloud: "#b69bff",
  cv: "#6bffb8",
  web: "#ffd46b",
  ops: "#ff6b9e",
};
