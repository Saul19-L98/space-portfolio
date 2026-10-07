import type { Planet, System } from "@/content/schema";
import { addMonths } from "@/lib/time";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

/**
 * Dim systems have no documented projects. Each CV bullet becomes a gas giant
 * carrying a partial record, so the whole universe renders through one code path.
 */
export function hydrateDimSystem(system: System): System {
  if (system.kind !== "dim" || !system.bullets?.length) return system;
  const role = system.roles[0];
  const planets: Planet[] = system.bullets.map((b, i) => ({
    slug: `${system.slug}-giant-${i + 1}`,
    name: b.title,
    codename: `${system.slug.slice(0, 3).toUpperCase()}-G${NUMERALS[i] ?? i + 1}`,
    start: addMonths(role.start, i * 3),
    end: role.end,
    status: "done",
    domain: "web",
    size: "large",
    fragmentary: true,
    summary: b.text,
    problem: "No mission log survives for this period; only the CV record.",
    role: b.text,
    outcome: [],
    metrics: [],
    tech: b.tech ?? [],
    timeline: [
      { date: role.start, title: `Joined as ${role.title}` },
      ...(role.end ? [{ date: role.end, title: "Mission complete" }] : []),
    ],
  }));
  return { ...system, planets };
}
