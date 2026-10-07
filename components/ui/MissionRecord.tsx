import Link from "next/link";
import type { Planet, System } from "@/content/schema";
import { DOMAIN_COLORS, DOMAIN_LABELS, STATUS_LABELS } from "@/content";
import { planetPath } from "@/lib/routes";
import { formatDuration, formatRange } from "@/lib/time";
import { TechChips } from "./TechChips";
import { Telemetry } from "./Telemetry";
import { Timeline } from "./Timeline";

export function MissionRecord({ system, planet }: { system: System; planet: Planet }) {
  const color = DOMAIN_COLORS[planet.domain];
  const hasImages = planet.timeline.some((t) => t.image);
  return (
    <article className="record" data-testid="mission-record">
      <header className="record-head">
        <p className="record-code" style={{ color }}>
          {planet.codename} · {DOMAIN_LABELS[planet.domain].toUpperCase()}
          {planet.flagship && " · FLAGSHIP"}
        </p>
        <h2 id="record-title" className="record-title" tabIndex={-1} data-panel-focus>
          {planet.name}
        </h2>
        <p className="record-meta">
          <span className={`status status-${planet.status}`}>{STATUS_LABELS[planet.status]}</span>
          <span>{formatRange(planet.start, planet.end)}</span>
          <span>· {formatDuration(planet.start, planet.end)}</span>
          {planet.clientLabel && <span>· for {planet.clientLabel}</span>}
        </p>
        {planet.fragmentary && (
          <p className="record-badge" data-testid="partial-record">
            PARTIAL RECORD — reconstructed from the CV. No mission logs survive from {system.name}.
          </p>
        )}
      </header>

      <p className="record-summary">{planet.summary}</p>

      {!planet.fragmentary && (
        <>
          <section className="record-section">
            <h3>Problem</h3>
            <p>{planet.problem}</p>
          </section>
          <section className="record-section">
            <h3>What I did</h3>
            <p>{planet.role}</p>
          </section>
        </>
      )}

      {planet.outcome.length > 0 && (
        <section className="record-section">
          <h3>Outcome</h3>
          <ul className="record-list">
            {planet.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      {planet.metrics.length > 0 && (
        <section className="record-section">
          <h3>Mission metrics</h3>
          <dl className="metrics">
            {planet.metrics.map((m) => (
              <div key={m.label} className="metric">
                <dt>{m.label}</dt>
                <dd style={{ color }}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="record-section">
        <h3>Technologies</h3>
        <TechChips items={planet.tech} color={color} />
      </section>

      {planet.moons && planet.moons.length > 0 && (
        <section className="record-section">
          <h3>Moons</h3>
          <ul className="moons">
            {planet.moons.map((m) => (
              <li key={m.slug} className="moon">
                <p className="moon-name">
                  {m.name}
                  {m.start && <span className="moon-date"> · {formatRange(m.start, m.end ?? m.start)}</span>}
                </p>
                <p className="moon-text">{m.summary}</p>
                {m.tech && m.tech.length > 0 && <p className="moon-tech">{m.tech.join(" · ")}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="record-section">
        <h3>{hasImages ? "Mission log & imagery" : "Mission log"}</h3>
        <Telemetry planet={planet} />
        <Timeline planet={planet} />
      </section>

      <footer className="record-foot">
        <Link href={`/system/${system.slug}`} className="text-accent underline" scroll={false}>
          All {system.name} missions
        </Link>
        <span className="text-muted"> · </span>
        <Link href={planetPath(system.slug, planet.slug)} className="text-muted underline" scroll={false}>
          Permalink
        </Link>
      </footer>
    </article>
  );
}
