import Image from "next/image";
import Link from "next/link";
import { universe } from "@/content";
import { missionsPath } from "@/lib/routes";

export function PilotProfile() {
  const p = universe.profile;
  return (
    <article className="record" data-testid="pilot-profile">
      <header className="record-head flex items-start gap-4">
        <Image src={p.photo.src} alt={p.photo.alt} width={96} height={128} className="pilot-photo" priority />
        <div>
          <p className="record-code text-accent">PILOT RECORD</p>
          <h2 id="pilot-title" className="record-title" tabIndex={-1} data-panel-focus>
            {p.name}
          </h2>
          <p className="record-meta">
            <span className="text-ink">{p.headline}</span>
          </p>
          <p className="record-meta">
            <span>{p.location}</span>
            <span>· {p.timezone}</span>
          </p>
        </div>
      </header>
      <dl className="metrics">
        {p.stats.map((s) => (
          <div key={s.label} className="metric">
            <dt>{s.label}</dt>
            <dd className="text-accent">{s.value}</dd>
          </div>
        ))}
      </dl>
      <section className="record-section">
        {p.summary.map((para) => (
          <p key={para.slice(0, 32)} className="record-para">
            {para}
          </p>
        ))}
      </section>
      <section className="record-section">
        <h3>Systems aboard</h3>
        <dl className="skills">
          {p.skills.map((g) => (
            <div key={g.group}>
              <dt>{g.group}</dt>
              <dd>{g.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="record-section">
        <h3>Certifications</h3>
        <ul className="record-list">
          {p.certifications.map((c) => (
            <li key={c.name}>
              <a href={c.url} target="_blank" rel="noreferrer noopener" className="underline">
                {c.name}
              </a>{" "}
              <span className="text-muted">· {c.issuer} · {c.period}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="record-section">
        <h3>Education & languages</h3>
        <p className="record-para">
          {p.education.degree} — {p.education.school}, {p.education.year}.
        </p>
        <p className="record-para">{p.languages.join(" · ")}</p>
      </section>
      <section className="record-section">
        <h3>Comms</h3>
        <ul className="record-list">
          <li>
            <a href={p.links.github} target="_blank" rel="noreferrer noopener" className="underline">
              GitHub
            </a>
          </li>
          <li>
            <a href={p.links.linkedin} target="_blank" rel="noreferrer noopener" className="underline">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${p.links.email}`} className="underline">
              {p.links.email}
            </a>
          </li>
          {p.links.twitter && (
            <li>
              <a href={p.links.twitter} target="_blank" rel="noreferrer noopener" className="underline">
                X / Twitter
              </a>
            </li>
          )}
          <li>
            <Link href={missionsPath()} className="underline" scroll={false}>
              Full mission index (text)
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
