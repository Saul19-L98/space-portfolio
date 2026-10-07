import { describe, expect, it } from "vitest";
import { getSystem } from "@/content";
import { angleAt, buildSystemLayout, positionAt, presenceAt } from "@/lib/orbit";
import { DAY_MS, parseDate } from "@/lib/time";

describe("orbit layout", () => {
  const tdw = getSystem("tdw-group")!;
  const layout = buildSystemLayout(tdw);

  it("ranks planets chronologically with monotonic, well-separated radii", () => {
    const starts = layout.orbits.map((o) => o.startMs);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
    for (let i = 1; i < layout.orbits.length; i++) {
      const prev = layout.orbits[i - 1];
      const cur = layout.orbits[i];
      expect(cur.radius).toBeGreaterThan(prev.radius);
      expect(cur.radius - cur.bodyRadius - (prev.radius + prev.bodyRadius)).toBeGreaterThan(1.0);
    }
    expect(layout.outerRadius).toBeGreaterThan(layout.orbits.at(-1)!.radius);
  });

  it("has Kepler-ish periods growing with radius", () => {
    for (let i = 1; i < layout.orbits.length; i++) {
      expect(layout.orbits[i].periodDays).toBeGreaterThan(layout.orbits[i - 1].periodDays);
    }
    expect(layout.orbits[0].periodDays).toBeCloseTo(110, 5);
  });

  it("maps dates to angles with a full turn per period", () => {
    const o = layout.orbits[3];
    expect(angleAt(o, o.startMs)).toBeCloseTo(o.phase);
    expect(angleAt(o, o.startMs + o.periodDays * DAY_MS)).toBeCloseTo(o.phase + 2 * Math.PI);
    const p = positionAt(o, o.startMs);
    expect(Math.hypot(p[0], p[1], p[2])).toBeCloseTo(o.radius);
  });

  it("ignites planets after their start date", () => {
    const start = parseDate("2026-06-12");
    expect(presenceAt(start, start - DAY_MS)).toBe(0);
    expect(presenceAt(start, start + 12 * DAY_MS)).toBeGreaterThan(0.3);
    expect(presenceAt(start, start + 40 * DAY_MS)).toBe(1);
  });

  it("lays out dim systems too", () => {
    const dim = buildSystemLayout(getSystem("orbitweb")!);
    expect(dim.orbits).toHaveLength(2);
    expect(dim.starRadius).toBeLessThan(layout.starRadius);
  });
});
