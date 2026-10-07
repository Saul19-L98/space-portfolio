import { describe, expect, it } from "vitest";
import { getSystem } from "@/content";
import { ARCHETYPES, bodyRadiusFor, designFor } from "@/lib/planet-design";

describe("planet design", () => {
  const tdw = getSystem("tdw-group")!;
  const dim = getSystem("aracari-studios")!;

  it("is deterministic for a slug + seed and changes with the seed", () => {
    const p = tdw.planets[0];
    expect(designFor(p, 1)).toEqual(designFor(p, 1));
    const a = designFor(p, 1);
    const b = designFor(p, 2);
    expect(a.palette.join() + a.archetype + a.noiseScale).not.toBe(b.palette.join() + b.archetype + b.noiseScale);
  });

  it("keeps body radius independent of the seed", () => {
    for (const p of tdw.planets) {
      expect(designFor(p, 1).bodyRadius).toBe(designFor(p, 99).bodyRadius);
      expect(designFor(p, 1).bodyRadius).toBe(bodyRadiusFor(p));
    }
  });

  it("uses valid archetypes and gas giants for fragmentary planets", () => {
    for (const p of tdw.planets) expect(ARCHETYPES).toContain(designFor(p, 7).archetype);
    for (const p of dim.planets) expect(["gas", "ringed"]).toContain(designFor(p, 7).archetype);
  });

  it("gives the rich system some variety", () => {
    const kinds = new Set(tdw.planets.map((p) => designFor(p, 0x5a1f0b3d).archetype));
    expect(kinds.size).toBeGreaterThanOrEqual(4);
  });
});
