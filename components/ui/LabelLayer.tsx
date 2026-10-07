"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DOMAIN_COLORS, systems, universe } from "@/content";
import type { Planet, System } from "@/content/schema";
import { labelElements, moonId, planetId } from "@/lib/registry";
import { pilotPath, planetPath, systemPath } from "@/lib/routes";
import { useStore, type HoverTarget } from "@/lib/store";
import { HoverCard } from "./HoverCard";

interface ChipSpec {
  id: string;
  testId: string;
  label: string;
  sub?: string;
  color: string;
  href: string;
  target: HoverTarget;
  system?: System;
  planet?: Planet;
  moonSlug?: string;
}

export function LabelLayer() {
  const systemSlug = useStore((s) => s.systemSlug);
  const planetSlug = useStore((s) => s.planetSlug);

  const chips = useMemo<ChipSpec[]>(() => {
    const out: ChipSpec[] = [];
    out.push({
      id: "ship",
      testId: "ship-label",
      label: universe.profile.name,
      sub: "PILOT",
      color: "#7cc4ff",
      href: pilotPath(),
      target: { kind: "ship" },
    });
    for (const system of systems) {
      out.push({
        id: system.slug,
        testId: `system-label-${system.slug}`,
        label: system.name,
        sub: system.kind === "dim" ? "DIM STAR" : `${system.planets.length} MISSIONS`,
        color: system.kind === "dim" ? "#8fa3c7" : "#ffd79a",
        href: systemPath(system.slug),
        target: { kind: "system", system: system.slug },
        system,
      });
      for (const planet of system.planets) {
        out.push({
          id: planetId(system.slug, planet.slug),
          testId: `planet-label-${planet.slug}`,
          label: planet.name,
          sub: planet.codename,
          color: DOMAIN_COLORS[planet.domain],
          href: planetPath(system.slug, planet.slug),
          target: { kind: "planet", system: system.slug, planet: planet.slug },
          system,
          planet,
        });
      }
    }
    if (systemSlug && planetSlug) {
      const system = systems.find((s) => s.slug === systemSlug);
      const planet = system?.planets.find((p) => p.slug === planetSlug);
      if (system && planet) {
        for (const moon of planet.moons ?? []) {
          out.push({
            id: moonId(system.slug, planet.slug, moon.slug),
            testId: `moon-label-${moon.slug}`,
            label: moon.name,
            sub: "MOON",
            color: "#c9d4e8",
            href: planetPath(system.slug, planet.slug),
            target: { kind: "moon", system: system.slug, planet: planet.slug, moon: moon.slug },
            system,
            planet,
            moonSlug: moon.slug,
          });
        }
      }
    }
    return out;
  }, [systemSlug, planetSlug]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" data-testid="label-layer">
      {chips.map((c) => (
        <Chip key={c.id} spec={c} />
      ))}
    </div>
  );
}

function sameTarget(a: HoverTarget | null, b: HoverTarget): boolean {
  return !!a && a.kind === b.kind && a.system === b.system && a.planet === b.planet && a.moon === b.moon;
}

function Chip({ spec }: { spec: ChipSpec }) {
  const router = useRouter();
  const hovered = useStore((s) => sameTarget(s.hover, spec.target));
  const setHover = useStore((s) => s.setHover);
  const ref = useCallback(
    (el: HTMLButtonElement | null) => {
      if (el) labelElements.set(spec.id, el);
      else labelElements.delete(spec.id);
    },
    [spec.id],
  );
  const activate = () => {
    const s = useStore.getState();
    if (s.touch && !hovered) {
      setHover(spec.target);
      return;
    }
    if (spec.target.kind === "moon") {
      setHover(spec.target);
      return;
    }
    router.push(spec.href, { scroll: false });
  };
  return (
    <button
      ref={ref}
      type="button"
      className={`label-chip ${hovered ? "is-hovered" : ""} ${spec.target.kind === "ship" ? "is-ship" : ""}`}
      data-testid={spec.testId}
      data-visible="0"
      data-kind={spec.target.kind}
      data-flagship={spec.planet?.flagship ? "1" : "0"}
      style={{ opacity: 0 }}
      aria-label={`${spec.label}${spec.sub ? `, ${spec.sub}` : ""}`}
      onMouseEnter={() => setHover(spec.target)}
      onMouseLeave={() => setHover(null)}
      onFocus={() => setHover(spec.target)}
      onBlur={() => setHover(null)}
      onClick={activate}
    >
      <span className="label-dot" style={{ background: spec.color, boxShadow: `0 0 8px ${spec.color}` }} aria-hidden />
      <span className="label-name">{spec.label}</span>
      {spec.sub && <span className="label-sub">{spec.sub}</span>}
      {hovered && <HoverCard spec={spec} />}
    </button>
  );
}

export type { ChipSpec };
