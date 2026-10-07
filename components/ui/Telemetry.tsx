import type { Planet } from "@/content/schema";
import { DOMAIN_COLORS } from "@/content";
import { Rng, hashString } from "@/lib/prng";
import { parseDate } from "@/lib/time";

const W = 640;
const H = 150;
const PAD_L = 14;
const PAD_R = 14;
const TOP = 34;
const BOTTOM = 112;

/**
 * Deterministic "mission telemetry" strip rendered as inline SVG: an activity
 * curve shaped by the mission's dated events, with tick marks per event.
 */
export function Telemetry({ planet }: { planet: Planet }) {
  const rng = new Rng(hashString(`telemetry:${planet.slug}`));
  const start = parseDate(planet.start);
  const end = planet.end ? parseDate(planet.end) : Math.max(start + 86_400_000 * 30, Date.UTC(2026, 9, 7));
  const span = Math.max(end - start, 86_400_000);
  const color = DOMAIN_COLORS[planet.domain];
  const n = 64;
  const events = planet.timeline.map((t) => (parseDate(t.date) - start) / span).filter((f) => f >= 0 && f <= 1);

  const pts: [number, number][] = [];
  let v = 0.25 + rng.float() * 0.2;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    let bump = 0;
    for (const e of events) bump += Math.exp(-Math.pow((f - e) / 0.045, 2)) * 0.55;
    v = v * 0.82 + (0.18 + rng.float() * 0.25) * 0.18;
    const y = Math.min(1, v + bump);
    pts.push([PAD_L + f * (W - PAD_L - PAD_R), BOTTOM - y * (BOTTOM - TOP)]);
  }
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${BOTTOM} L${pts[0][0].toFixed(1)},${BOTTOM} Z`;
  const gridY = [0.25, 0.5, 0.75].map((g) => BOTTOM - g * (BOTTOM - TOP));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mission telemetry for ${planet.name}`} className="telemetry">
      <defs>
        <linearGradient id={`tg-${planet.slug}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx="10" fill="rgba(255,255,255,0.025)" stroke="rgba(143,163,199,0.18)" />
      <text x={PAD_L} y="20" className="telemetry-label" fill={color}>
        {planet.codename} · TELEMETRY
      </text>
      <text x={W - PAD_R} y="20" textAnchor="end" className="telemetry-label" fill="#8fa3c7">
        {planet.timeline.length} EVENTS · {planet.tech.length} SYSTEMS
      </text>
      {gridY.map((y) => (
        <line key={y} x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="rgba(143,163,199,0.12)" strokeDasharray="2 6" />
      ))}
      <path d={area} fill={`url(#tg-${planet.slug})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      {events.map((e, i) => {
        const x = PAD_L + e * (W - PAD_L - PAD_R);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={TOP - 6} y2={BOTTOM + 8} stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <circle cx={x} cy={BOTTOM + 8} r="2.6" fill={color} />
          </g>
        );
      })}
      <line x1={PAD_L} x2={W - PAD_R} y1={BOTTOM + 8} y2={BOTTOM + 8} stroke="rgba(143,163,199,0.35)" />
      <text x={PAD_L} y={H - 12} className="telemetry-label" fill="#8fa3c7">
        {planet.start}
      </text>
      <text x={W - PAD_R} y={H - 12} textAnchor="end" className="telemetry-label" fill="#8fa3c7">
        {planet.end ?? "PRESENT"}
      </text>
    </svg>
  );
}
