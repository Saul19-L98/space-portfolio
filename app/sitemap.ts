import type { MetadataRoute } from "next";
import { allPlanetParams, allSystemParams } from "@/content";
import { SITE_URL } from "@/lib/site";

// Required for `output: "export"`: rendered once at build time.
export const dynamic = "force-static";

const base = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/pilot/`, priority: 0.9 },
    { url: `${base}/missions/`, priority: 0.8 },
    ...allSystemParams().map((s) => ({ url: `${base}/system/${s.slug}/`, priority: 0.7 })),
    ...allPlanetParams().map((p) => ({ url: `${base}/system/${p.slug}/${p.planet}/`, priority: 0.6 })),
  ];
}
