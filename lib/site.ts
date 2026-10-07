/**
 * Deployment-shape helpers. The site can run at a domain root (Vercel, `next start`)
 * or under a path prefix such as GitHub Pages' `/space-portfolio`. Both values are
 * baked in at build time from environment variables; defaults suit local work.
 */

/** Path prefix the app is served under, e.g. "/space-portfolio". Empty at the root. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Absolute site URL including the base path, used for metadata, sitemap and robots. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000${BASE_PATH}`).replace(/\/$/, "");

/** Prefixes a root-relative public asset path with the base path (next/image and <img> do not do this). */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
