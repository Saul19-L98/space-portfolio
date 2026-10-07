"use client";

import { STATUS_LABELS, universe } from "@/content";
import { formatRange } from "@/lib/time";
import type { ChipSpec } from "./LabelLayer";

export function HoverCard({ spec }: { spec: ChipSpec }) {
  const { planet, system } = spec;
  let body: React.ReactNode;
  if (spec.target.kind === "ship") {
    body = (
      <>
        <p className="hc-title">{universe.profile.name}</p>
        <p className="hc-sub">{universe.profile.headline}</p>
        <p className="hc-text">Open the pilot&apos;s record — profile, skills, certifications.</p>
      </>
    );
  } else if (spec.target.kind === "moon" && planet) {
    const moon = planet.moons?.find((m) => m.slug === spec.moonSlug);
    body = moon ? (
      <>
        <p className="hc-title">{moon.name}</p>
        {(moon.start || moon.end) && <p className="hc-sub">{moon.start ? formatRange(moon.start, moon.end ?? moon.start) : ""}</p>}
        <p className="hc-text">{moon.summary}</p>
      </>
    ) : null;
  } else if (spec.target.kind === "planet" && planet && system) {
    body = (
      <>
        <p className="hc-title">{planet.name}</p>
        <p className="hc-sub">
          {planet.codename} · {formatRange(planet.start, planet.end)} · {STATUS_LABELS[planet.status]}
          {planet.fragmentary && " · partial record"}
        </p>
        <p className="hc-text">{planet.summary}</p>
        {planet.tech.length > 0 && <p className="hc-meta">{planet.tech.slice(0, 5).join(" · ")}{planet.tech.length > 5 ? ` · +${planet.tech.length - 5}` : ""}</p>}
      </>
    );
  } else if (system) {
    body = (
      <>
        <p className="hc-title">{system.name}</p>
        <p className="hc-sub">
          {system.roles.map((r) => `${r.title} · ${formatRange(r.start, r.end)}`).join(" → ")}
        </p>
        <p className="hc-text">
          {system.kind === "dim"
            ? `Dim star: no mission logs survive, only the CV record. ${system.planets.length} gas giants carry it.`
            : `${system.planets.length} missions. Click to fly in.`}
        </p>
      </>
    );
  }
  return (
    <span className="hover-card" role="tooltip" data-testid="hover-card">
      {body}
    </span>
  );
}
