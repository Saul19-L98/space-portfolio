import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionRecord } from "@/components/ui/MissionRecord";
import { PanelShell } from "@/components/ui/PanelShell";
import { allPlanetParams, getPlanet } from "@/content";
import { systemPath } from "@/lib/routes";
import { formatRange } from "@/lib/time";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPlanetParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; planet: string }> }): Promise<Metadata> {
  const { slug, planet } = await params;
  const hit = getPlanet(slug, planet);
  if (!hit) return {};
  const title = `${hit.planet.name} — ${hit.planet.codename}`;
  const description = `${formatRange(hit.planet.start, hit.planet.end)} · ${hit.system.name}. ${hit.planet.summary}`;
  return {
    title,
    description,
    openGraph: { title, description, url: `/system/${slug}/${planet}`, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default async function PlanetPage({ params }: { params: Promise<{ slug: string; planet: string }> }) {
  const { slug, planet } = await params;
  const hit = getPlanet(slug, planet);
  if (!hit) notFound();
  return (
    <PanelShell side="right" closeHref={systemPath(slug)} closeLabel={hit.system.name} testId="mission-panel" labelledBy="record-title">
      <MissionRecord system={hit.system} planet={hit.planet} />
    </PanelShell>
  );
}
