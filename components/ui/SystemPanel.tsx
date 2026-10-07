import Link from "next/link";
import type { System } from "@/content/schema";
import { DOMAIN_COLORS, STATUS_LABELS, chronologicalPlanets } from "@/content";
import { planetPath } from "@/lib/routes";
import { formatRange } from "@/lib/time";

export function SystemPanel({ system }: { system: System }) {
  const planets = chronologicalPlanets(system);
  return (
    <article className="record" data-testid="system-panel">
      <header className="record-head">
        <p className="record-code text-accent">{system.kind === "dim" ? "DIM STAR" : "STAR SYSTEM"} · {system.location.toUpperCase()}</p>
        <h2 id="system-title" className="record-title" tabIndex={-1} data-panel-focus>
          {system.name}
        </h2>
        <ul className="record-meta flex-col items-start gap-0.5">
          {system.roles.map((r) => (
            <li key={r.title}>
              <span className="text-ink">{r.title}</span> <span>· {formatRange(r.start, r.end)}</span>
            </li>
          ))}
        </ul>
      </header>
      <p className="record-summary">{system.summary}</p>
      <section className="record-section">
        <h3>{system.kind === "dim" ? `Gas giants (${planets.length})` : `Missions (${planets.length})`}</h3>
        <ol className="mission-list">
          {planets.map((p) => (
            <li key={p.slug}>
              <Link href={planetPath(system.slug, p.slug)} className="mission-link" scroll={false} data-testid={`mission-link-${p.slug}`}>
                <span className="mission-dot" style={{ background: DOMAIN_COLORS[p.domain] }} aria-hidden />
                <span className="mission-code">{p.codename}</span>
                <span className="mission-name">{p.name}</span>
                <span className="mission-when">
                  {formatRange(p.start, p.end)} · {STATUS_LABELS[p.status]}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
