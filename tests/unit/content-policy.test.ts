import { describe, expect, it } from "vitest";
import { universe } from "@/content";
import { findViolation } from "@/content/policy";

/** Collects every rendered string from the universe, skipping `sources` (never rendered). */
function renderedStrings(value: unknown, path: string, out: { path: string; text: string }[]) {
  if (typeof value === "string") {
    out.push({ path, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => renderedStrings(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "sources") continue;
      renderedStrings(v, `${path}.${k}`, out);
    }
  }
}

describe("public-content policy", () => {
  const strings: { path: string; text: string }[] = [];
  renderedStrings(universe, "universe", strings);

  it("collects a meaningful amount of content", () => {
    expect(strings.length).toBeGreaterThan(400);
  });

  it("never renders a forbidden client, colleague, hostname, identifier or banned technology", () => {
    const violations = strings
      .map((s) => ({ ...s, hit: findViolation(s.text) }))
      .filter((s) => s.hit);
    expect(violations, JSON.stringify(violations.slice(0, 10), null, 2)).toEqual([]);
  });

  it("detects violations in a control sample", () => {
    expect(findViolation("Built on Semantic Kernel in 2025")).toBe("semantic kernel");
    expect(findViolation("account 123456789012")).toBe("aws account id");
    expect(findViolation("host 10.0.2.6 is down")).toBe("ipv4 address");
    expect(findViolation("we ran Kubernetes")).toBe("kubernetes");
    expect(findViolation("over three weeks of work")).toBeNull();
    expect(findViolation("JavaScript and TypeScript")).toBeNull();
    expect(findViolation("talks about the data lake")).toBeNull();
  });
});
