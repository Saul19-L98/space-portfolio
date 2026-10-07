import type { Planet, System } from "@/content/schema";
import { bodyRadiusFor } from "./planet-design";
import { Rng } from "./prng";
import { DAY_MS, parseDate } from "./time";

export interface MoonOrbit {
  slug: string;
  radius: number;
  periodDays: number;
  phase: number;
  inclination: number;
  bodyRadius: number;
}

export interface OrbitSpec {
  slug: string;
  rank: number;
  radius: number;
  periodDays: number;
  phase: number;
  inclination: number;
  bodyRadius: number;
  startMs: number;
  endMs?: number;
  moons: MoonOrbit[];
}

export interface SystemLayout {
  starRadius: number;
  orbits: OrbitSpec[];
  outerRadius: number;
}

export const STAR_RADIUS = { rich: 3.2, dim: 1.5 } as const;

export function moonOrbitRadius(bodyRadius: number, index: number): number {
  return bodyRadius * (1.6 + 0.45 * index);
}

/**
 * Orbit layout is seeded by slug only (never by the universe seed), so shuffling
 * the visuals never moves a body. Radii are chronological by project start.
 */
export function buildSystemLayout(system: System): SystemLayout {
  const starRadius = STAR_RADIUS[system.kind];
  const planets = [...system.planets].sort(
    (a, b) => parseDate(a.start) - parseDate(b.start) || a.slug.localeCompare(b.slug),
  );
  const gapBase = system.kind === "dim" ? 2.4 : 1.2;
  const orbits: OrbitSpec[] = [];
  let previousEdge = starRadius * 2.2;
  let r0 = 0;
  planets.forEach((planet: Planet, rank) => {
    const rng = new Rng(`orbit:${planet.slug}`);
    const bodyRadius = bodyRadiusFor(planet);
    const moonCount = planet.moons?.length ?? 0;
    // Moons are allowed to swing into the gaps; spacing only accounts for the body.
    const extent = bodyRadius + 0.25 + (moonCount ? 0.2 : 0);
    const gap = gapBase;
    const radius = previousEdge + gap + extent;
    previousEdge = radius + extent;
    if (rank === 0) r0 = radius;
    const periodDays = 110 * Math.pow(radius / r0, 1.3);
    const moons: MoonOrbit[] = (planet.moons ?? []).map((m, j) => ({
      slug: m.slug,
      radius: moonOrbitRadius(bodyRadius, j),
      periodDays: rng.range(12, 45),
      phase: rng.range(0, Math.PI * 2),
      inclination: rng.gauss() * 0.12,
      bodyRadius: Math.min(0.26, Math.max(0.12, bodyRadius * rng.range(0.16, 0.24))),
    }));
    orbits.push({
      slug: planet.slug,
      rank,
      radius,
      periodDays,
      phase: rng.range(0, Math.PI * 2),
      inclination: (rng.gauss() * 2.5 * Math.PI) / 180,
      bodyRadius,
      startMs: parseDate(planet.start),
      endMs: planet.end ? parseDate(planet.end) : undefined,
      moons,
    });
  });
  return { starRadius, orbits, outerRadius: previousEdge };
}

export function angleAt(orbit: { phase: number; periodDays: number; startMs?: number }, dateMs: number, epochMs = orbit.startMs ?? 0): number {
  return orbit.phase + (2 * Math.PI * (dateMs - epochMs)) / (orbit.periodDays * DAY_MS);
}

/** Position on the orbit at a date, relative to the orbit centre. */
export function positionAt(
  orbit: { radius: number; inclination: number; phase: number; periodDays: number; startMs?: number },
  dateMs: number,
  out: [number, number, number] = [0, 0, 0],
  epochMs?: number,
): [number, number, number] {
  const theta = angleAt(orbit, dateMs, epochMs);
  const x = orbit.radius * Math.cos(theta);
  const z = orbit.radius * Math.sin(theta);
  out[0] = x;
  out[1] = z * Math.sin(orbit.inclination);
  out[2] = z * Math.cos(orbit.inclination);
  return out;
}

const IGNITION_DAYS = 25;

/** 0 before the project starts, ramping to 1 over the first weeks. */
export function presenceAt(startMs: number, dateMs: number): number {
  const t = (dateMs - startMs) / (IGNITION_DAYS * DAY_MS);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}
