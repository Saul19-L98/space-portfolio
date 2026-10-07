import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { allPlanetParams, chronologicalPlanets, getPlanet, getSystem, systems, universe } from "@/content";
import { isValidDate, parseDate } from "@/lib/time";

describe("universe content", () => {
  it("has four employer systems with the expected shape", () => {
    expect(systems.map((s) => s.slug)).toEqual(["independent-contractor", "orbitweb", "aracari-studios", "tdw-group"]);
    expect(getSystem("tdw-group")?.planets).toHaveLength(24);
    const giants = systems.filter((s) => s.kind === "dim").flatMap((s) => s.planets);
    expect(giants).toHaveLength(8);
    expect(giants.every((g) => g.fragmentary)).toBe(true);
  });

  it("has unique slugs and codenames", () => {
    const slugs = allPlanetParams().map((p) => `${p.slug}/${p.planet}`);
    expect(new Set(slugs).size).toBe(slugs.length);
    const codenames = systems.flatMap((s) => s.planets.map((p) => p.codename));
    expect(new Set(codenames).size).toBe(codenames.length);
    for (const s of systems) {
      for (const p of s.planets) {
        const moonSlugs = (p.moons ?? []).map((m) => m.slug);
        expect(new Set(moonSlugs).size).toBe(moonSlugs.length);
      }
    }
  });

  it("has valid, ordered dates", () => {
    for (const s of systems) {
      for (const r of s.roles) {
        expect(isValidDate(r.start)).toBe(true);
        if (r.end) expect(parseDate(r.end)).toBeGreaterThanOrEqual(parseDate(r.start));
      }
      const systemStart = Math.min(...s.roles.map((r) => parseDate(r.start)));
      for (const p of s.planets) {
        expect(isValidDate(p.start), `${p.slug}.start`).toBe(true);
        expect(parseDate(p.start), `${p.slug} starts inside its system`).toBeGreaterThanOrEqual(systemStart);
        if (p.end) expect(parseDate(p.end), `${p.slug} end >= start`).toBeGreaterThanOrEqual(parseDate(p.start));
        expect(p.timeline.length, `${p.slug} timeline`).toBeGreaterThan(0);
        const dates = p.timeline.map((t) => parseDate(t.date));
        expect([...dates].sort((a, b) => a - b), `${p.slug} timeline sorted`).toEqual(dates);
        for (const t of p.timeline) expect(isValidDate(t.date), `${p.slug} ${t.title}`).toBe(true);
        for (const m of p.moons ?? []) {
          if (m.start) expect(isValidDate(m.start)).toBe(true);
          if (m.start && m.end) expect(parseDate(m.end)).toBeGreaterThanOrEqual(parseDate(m.start));
        }
      }
    }
  });

  it("orders planets chronologically", () => {
    const tdw = getSystem("tdw-group")!;
    const starts = chronologicalPlanets(tdw).map((p) => parseDate(p.start));
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });

  it("references only images that exist under public/", () => {
    for (const s of systems) {
      for (const p of s.planets) {
        for (const t of p.timeline) {
          if (t.image) {
            const file = path.join(process.cwd(), "public", t.image.src);
            expect(existsSync(file), `${p.slug}: ${t.image.src}`).toBe(true);
            expect(t.image.alt.length).toBeGreaterThan(10);
          }
        }
      }
    }
    expect(existsSync(path.join(process.cwd(), "public", universe.profile.photo.src))).toBe(true);
  });

  it("resolves planets by route params", () => {
    expect(getPlanet("tdw-group", "event-driven-platform")?.planet.codename).toBe("TDW-16");
    expect(getPlanet("tdw-group", "nope")).toBeUndefined();
  });
});
