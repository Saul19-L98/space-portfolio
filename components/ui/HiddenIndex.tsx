import Link from "next/link";
import { chronologicalPlanets, systems, universe } from "@/content";
import { pilotPath, planetPath, systemPath } from "@/lib/routes";

/** Screen-reader and crawler index of the whole universe; visually hidden. */
export function HiddenIndex() {
  return (
    <nav className="sr-only" aria-label="Site index">
      <h1>
        {universe.profile.name} — {universe.profile.headline}
      </h1>
      <p>{universe.profile.summary[0]}</p>
      <Link href={pilotPath()}>Pilot profile</Link>
      <ul>
        {systems.map((s) => (
          <li key={s.slug}>
            <Link href={systemPath(s.slug)}>{s.name}</Link>
            <ul>
              {chronologicalPlanets(s).map((p) => (
                <li key={p.slug}>
                  <Link href={planetPath(s.slug, p.slug)}>
                    {p.codename}: {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
