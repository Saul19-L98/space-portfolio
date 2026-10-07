import { describe, expect, it } from "vitest";
import { addMonths, formatDuration, formatMonth, formatRange, parseDate, timelineFraction, UNIVERSE_END, UNIVERSE_START } from "@/lib/time";
import { fitDistance, poseFor } from "@/lib/camera";
import { parseRoute, parentPath, planetPath } from "@/lib/routes";

describe("time helpers", () => {
  it("parses month and day precision", () => {
    expect(parseDate("2026-06")).toBe(Date.UTC(2026, 5, 1));
    expect(parseDate("2026-06-23")).toBe(Date.UTC(2026, 5, 23));
    expect(() => parseDate("nope")).toThrow();
  });
  it("formats ranges and durations", () => {
    expect(formatMonth(Date.UTC(2026, 5, 1))).toBe("Jun 2026");
    expect(formatRange("2026-06")).toBe("Jun 2026 – Present");
    expect(formatRange("2025-08", "2026-09")).toBe("Aug 2025 – Sep 2026");
    expect(formatRange("2025-09-17", "2025-09-18")).toBe("Sep 2025");
    expect(formatDuration("2026-06-12", "2026-06-23")).toBe("11 days");
    expect(formatDuration("2025-12-10", "2026-06-24")).toBe("6 months");
  });
  it("adds months and computes timeline fractions", () => {
    expect(addMonths("2023-11", 3)).toBe("2024-02");
    expect(timelineFraction(UNIVERSE_START)).toBe(0);
    expect(timelineFraction(UNIVERSE_END)).toBe(1);
  });
});

describe("camera math", () => {
  it("fits a sphere into the narrower field of view", () => {
    const d = fitDistance(10, 45, 16 / 9);
    expect(d).toBeCloseTo(10 / Math.sin((45 * Math.PI) / 360), 5);
    expect(fitDistance(10, 45, 0.5)).toBeGreaterThan(d);
    const pose = poseFor([1, 2, 3], 5, 0, 30, 45, 1);
    expect(pose.target).toEqual([1, 2, 3]);
    expect(pose.position[1]).toBeGreaterThan(2);
  });
});

describe("routes", () => {
  it("parses and builds paths", () => {
    expect(parseRoute("/")).toEqual({ view: "galaxy", systemSlug: null, planetSlug: null });
    expect(parseRoute("/system/tdw-group")).toEqual({ view: "system", systemSlug: "tdw-group", planetSlug: null });
    expect(parseRoute("/system/tdw-group/incident-rcas").view).toBe("planet");
    expect(parseRoute("/pilot").view).toBe("pilot");
    expect(planetPath("a", "b")).toBe("/system/a/b");
    expect(parentPath(parseRoute("/system/a/b"))).toBe("/system/a");
    expect(parentPath(parseRoute("/system/a"))).toBe("/");
  });
});
