import type { MetadataRoute } from "next";
import { allPlanetParams, allSystemParams } from "@/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/pilot`, priority: 0.9 },
    { url: `${base}/missions`, priority: 0.8 },
    ...allSystemParams().map((s) => ({ url: `${base}/system/${s.slug}`, priority: 0.7 })),
    ...allPlanetParams().map((p) => ({ url: `${base}/system/${p.slug}/${p.planet}`, priority: 0.6 })),
  ];
}
