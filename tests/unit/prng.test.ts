import { describe, expect, it } from "vitest";
import { Rng, hashString, mulberry32, nextSeed } from "@/lib/prng";

describe("prng", () => {
  it("hashes deterministically and distinctly", () => {
    expect(hashString("abc")).toBe(hashString("abc"));
    expect(hashString("abc")).not.toBe(hashString("abd"));
    expect(hashString("")).toBe(0x811c9dc5);
  });
  it("produces repeatable sequences in [0,1)", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("Rng helpers stay in bounds", () => {
    const r = new Rng("seed");
    for (let i = 0; i < 200; i++) {
      const n = r.int(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
      const f = r.range(-2, 2);
      expect(Math.abs(f)).toBeLessThanOrEqual(2);
    }
    expect(["a", "b"]).toContain(r.pick(["a", "b"]));
  });
  it("nextSeed walks the uint32 space", () => {
    const s = nextSeed(1);
    expect(s).not.toBe(1);
    expect(s).toBeLessThanOrEqual(0xffffffff);
    expect(nextSeed(1)).toBe(s);
  });
});
