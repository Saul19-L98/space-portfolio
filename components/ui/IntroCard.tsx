import Link from "next/link";
import { systems, universe } from "@/content";
import { pilotPath, systemPath } from "@/lib/routes";
import { formatRange } from "@/lib/time";

/** Home overlay: who this is and where to fly. Server-rendered for crawlers. */
export function IntroCard() {
  const p = universe.profile;
  return (
    <section className="intro" data-testid="intro-card" aria-labelledby="intro-title">
      <p className="record-code text-accent">GALAXY MAP · {systems.length} STAR SYSTEMS</p>
      <h1 id="intro-title" className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {p.name}
      </h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{p.headline}</p>
      <p className="mt-3 hidden text-sm text-muted sm:block">{p.summary[0]}</p>
      <ol className="mt-4 flex flex-col gap-1.5">
        {[...systems].reverse().map((s) => (
          <li key={s.slug}>
            <Link href={systemPath(s.slug)} className="intro-link" scroll={false} data-testid={`intro-system-${s.slug}`}>
              <span className={`intro-star ${s.kind}`} aria-hidden />
              <span className="intro-name">{s.name}</span>
              <span className="intro-when">
                {formatRange(s.roles[0].start, s.roles[s.roles.length - 1].end)}
                {s.kind === "dim" ? " · dim star" : ` · ${s.planets.length} missions`}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link href={pilotPath()} className="hud-btn mt-4 inline-block" scroll={false} data-testid="intro-pilot">
        Board the ship → pilot record
      </Link>
    </section>
  );
}
