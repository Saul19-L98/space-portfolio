import type { YearMonth } from "@/content/schema";

export const DAY_MS = 86_400_000;
export const UNIVERSE_START = Date.UTC(2021, 0, 1);
export const UNIVERSE_END = Date.UTC(2026, 11, 31);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses 'YYYY-MM' (first day of month) or 'YYYY-MM-DD' into a UTC timestamp. */
export function parseDate(d: string): number {
  const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(d);
  if (!m) throw new Error(`Invalid date: ${d}`);
  const [, y, mo, day] = m;
  return Date.UTC(Number(y), Number(mo) - 1, day ? Number(day) : 1);
}

export function isValidDate(d: string): boolean {
  try {
    const t = parseDate(d);
    return Number.isFinite(t);
  } catch {
    return false;
  }
}

export function formatMonth(ms: number): string {
  const d = new Date(ms);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDay(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** 'Jun 2026 – Present' or 'Aug 2025 – Sep 2026'. */
export function formatRange(start: string, end?: string): string {
  const a = formatMonth(parseDate(start));
  if (!end) return `${a} – Present`;
  const b = formatMonth(parseDate(end));
  return a === b ? a : `${a} – ${b}`;
}

/** Human duration between two dates, e.g. '11 days', '3 months', '1.5 years'. */
export function formatDuration(start: string, end?: string, now = Date.now()): string {
  const a = parseDate(start);
  const b = end ? parseDate(end) : now;
  const days = Math.max(1, Math.round((b - a) / DAY_MS));
  if (days < 45) return `${days} day${days === 1 ? "" : "s"}`;
  const months = Math.round(days / 30.44);
  if (months < 18) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.round((days / 365.25) * 10) / 10;
  return `${years} years`;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Adds n months to 'YYYY-MM' and returns 'YYYY-MM'. */
export function addMonths(ym: string, n: number): YearMonth {
  const t = parseDate(ym);
  const d = new Date(t);
  d.setUTCMonth(d.getUTCMonth() + n);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` as YearMonth;
}

/** Fraction of the universe timeline for a timestamp, clamped to [0, 1]. */
export function timelineFraction(ms: number): number {
  return clamp((ms - UNIVERSE_START) / (UNIVERSE_END - UNIVERSE_START), 0, 1);
}
