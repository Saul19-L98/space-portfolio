import type { Domain, Planet } from "@/content/schema";
import { ATMOSPHERE, EMISSIVE, PALETTES, RING_PALETTES } from "./palettes";
import { Rng, hashString } from "./prng";

export type Archetype = "rocky" | "terran" | "desert" | "ice" | "lava" | "gas" | "ringed";
export const ARCHETYPES: Archetype[] = ["rocky", "terran", "desert", "ice", "lava", "gas", "ringed"];

export interface RingDesign {
  inner: number;
  outer: number;
  tilt: number;
  palette: [string, string];
}

export interface PlanetDesign {
  archetype: Archetype;
  palette: [string, string, string, string];
  noiseScale: number;
  octaves: number;
  distort: number;
  bandFreq: number;
  bandWarp: number;
  iceCap: number;
  oceanLevel: number;
  emissive: number;
  emissiveColor: string;
  atmoColor: string;
  atmoPower: number;
  clouds: boolean;
  cloudCover: number;
  ring?: RingDesign;
  /** Radians per second of self-rotation. */
  spin: number;
  /** Seed offset fed to the noise so two planets never share terrain. */
  seedOffset: [number, number, number];
  bodyRadius: number;
}

/** Domain-biased archetype weights, so a system reads coherently while staying random. */
const DOMAIN_WEIGHTS: Record<Domain, Partial<Record<Archetype, number>>> = {
  data: { terran: 3, rocky: 2, ice: 2, desert: 1 },
  genai: { lava: 3, gas: 2, ringed: 1, ice: 1 },
  cloud: { gas: 3, ringed: 2, ice: 1, terran: 1 },
  cv: { rocky: 3, desert: 2, ice: 1 },
  web: { terran: 3, desert: 2, rocky: 1 },
  ops: { rocky: 2, ice: 2, ringed: 1, lava: 1 },
};

function weightedPick(rng: Rng, weights: Partial<Record<Archetype, number>>): Archetype {
  const entries = Object.entries(weights) as [Archetype, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng.float() * total;
  for (const [a, w] of entries) {
    r -= w;
    if (r <= 0) return a;
  }
  return entries[entries.length - 1][0];
}

const SIZE_RADIUS: Record<Planet["size"], number> = { small: 0.45, medium: 0.65, large: 0.9 };

/** Body radius is content-derived and seed-independent, so shuffling never changes layout. */
export function bodyRadiusFor(planet: Planet): number {
  const base = SIZE_RADIUS[planet.size];
  const moons = planet.moons?.length ?? 0;
  return base + 0.04 * Math.min(moons, 5) + (planet.flagship ? 0.15 : 0);
}

export function planetSeed(slug: string, universeSeed: number): number {
  return hashString(`${universeSeed >>> 0}:${slug}`);
}

export function designFor(planet: Planet, universeSeed: number): PlanetDesign {
  const rng = new Rng(planetSeed(planet.slug, universeSeed));
  const archetype: Archetype = planet.fragmentary
    ? rng.bool(0.6) ? "gas" : "ringed"
    : weightedPick(rng, DOMAIN_WEIGHTS[planet.domain]);

  const palette = [...rng.pick(PALETTES[archetype])] as [string, string, string, string];
  const atmoColor = rng.pick(ATMOSPHERE[archetype]);
  const isGas = archetype === "gas" || archetype === "ringed";

  const design: PlanetDesign = {
    archetype,
    palette,
    noiseScale: isGas ? rng.range(1.2, 2.2) : rng.range(1.6, 3.4),
    octaves: isGas ? 4 : 5,
    distort: rng.range(0.15, 0.6),
    bandFreq: rng.range(6, 14),
    bandWarp: rng.range(0.15, 0.6),
    iceCap: archetype === "ice" ? rng.range(0.35, 0.55) : archetype === "terran" ? rng.range(0.78, 0.92) : 1.5,
    oceanLevel: archetype === "terran" ? rng.range(0.42, 0.6) : 0,
    emissive: archetype === "lava" ? rng.range(2.2, 3.6) : 0,
    emissiveColor: rng.pick(EMISSIVE),
    atmoColor,
    atmoPower: isGas ? rng.range(2.2, 3.2) : rng.range(2.8, 4.2),
    clouds: archetype === "terran" || (archetype === "ice" && rng.bool(0.4)),
    cloudCover: rng.range(0.45, 0.62),
    spin: rng.range(0.03, 0.12) * (rng.bool(0.85) ? 1 : -1),
    seedOffset: [rng.range(-100, 100), rng.range(-100, 100), rng.range(-100, 100)],
    bodyRadius: bodyRadiusFor(planet),
  };

  if (archetype === "ringed" || (archetype === "gas" && rng.bool(0.25))) {
    design.ring = {
      inner: rng.range(1.35, 1.6),
      outer: rng.range(2.0, 2.6),
      tilt: rng.range(-0.5, 0.5),
      palette: rng.pick(RING_PALETTES),
    };
  }
  return design;
}

/** Numeric archetype id for the shader uniform. */
export function archetypeId(a: Archetype): number {
  return ARCHETYPES.indexOf(a);
}
