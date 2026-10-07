import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DOMAIN_LABELS, STATUS_LABELS, chronologicalPlanets, systems, universe } from "@/content";
import { planetPath, systemPath } from "@/lib/routes";
import { formatRange } from "@/lib/time";

export const metadata: Metadata = {
  title: "Mission index",
  description: "Every employer and project as plain text: the complete record behind the 3D universe.",
};

export default function MissionsPage() {
  const p = universe.profile;
  return (
    <main className="missions" data-testid="missions-index">
      <header className="missions-head">
        <Image src={p.photo.src} alt={p.photo.alt} width={72} height={96} className="pilot-photo" priority />
        <div>
          <p className="record-code text-accent">MISSION INDEX · TEXT MODE</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{p.name}</h1>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{p.headline}</p>
          <p className="mt-2 max-w-2xl text-sm text-muted">{p.summary[0]}</p>
          <p className="mt-2 text-sm">
            <Link href="/" className="text-accent underline">
              Open the 3D universe
            </Link>
            <span className="text-muted"> · </span>
            <Link href="/pilot" className="text-accent underline">
              Pilot record
            </Link>
          </p>
        </div>
      </header>
      {[...systems].reverse().map((s) => (
        <section key={s.slug} className="missions-system" aria-labelledby={`sys-${s.slug}`}>
          <h2 id={`sys-${s.slug}`} className="font-display text-xl font-semibold text-ink">
            <Link href={systemPath(s.slug)} className="hover:underline">
              {s.name}
            </Link>{" "}
            <span className="font-mono text-xs uppercase tracking-widest text-muted">{s.kind === "dim" ? "dim star" : "star system"}</span>
          </h2>
          <p className="font-mono text-xs text-muted">{s.roles.map((r) => `${r.title} · ${formatRange(r.start, r.end)}`).join(" → ")}</p>
          <p className="mt-2 text-sm text-muted">{s.summary}</p>
          <ol className="missions-list">
            {chronologicalPlanets(s).map((pl) => (
              <li key={pl.slug} className="missions-item">
                <h3 className="font-display text-base font-semibold text-ink">
                  <Link href={planetPath(s.slug, pl.slug)} className="hover:underline">
                    {pl.codename} · {pl.name}
                  </Link>
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {formatRange(pl.start, pl.end)} · {STATUS_LABELS[pl.status]} · {DOMAIN_LABELS[pl.domain]}
                  {pl.clientLabel ? ` · for ${pl.clientLabel}` : ""}
                </p>
                <p className="mt-1 text-sm text-muted">{pl.summary}</p>
                {pl.tech.length > 0 && <p className="mt-1 text-xs text-muted">{pl.tech.join(" · ")}</p>}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
