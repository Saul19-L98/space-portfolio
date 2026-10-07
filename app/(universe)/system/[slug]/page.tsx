import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelShell } from "@/components/ui/PanelShell";
import { SystemPanel } from "@/components/ui/SystemPanel";
import { allSystemParams, getSystem } from "@/content";
import { formatRange } from "@/lib/time";

export const dynamicParams = false;

export function generateStaticParams() {
  return allSystemParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) return {};
  const role = system.roles[system.roles.length - 1];
  return {
    title: `${system.name} — ${role.title}`,
    description: `${formatRange(system.roles[0].start, role.end)}. ${system.summary}`,
    openGraph: {
      title: system.name,
      description: system.summary,
      url: `/system/${system.slug}/`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function SystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();
  return (
    <PanelShell side="left" closeHref="/" closeLabel="Galaxy" testId="system-panel-shell" labelledBy="system-title">
      <SystemPanel system={system} />
    </PanelShell>
  );
}
