import type { Metadata } from "next";
import { PanelShell } from "@/components/ui/PanelShell";
import { PilotProfile } from "@/components/ui/PilotProfile";
import { universe } from "@/content";

const description = `${universe.profile.name} — ${universe.profile.headline}. ${universe.profile.summary[0]}`;

export const metadata: Metadata = {
  title: "Pilot record",
  description,
  openGraph: { title: `Pilot record — ${universe.profile.name}`, description, url: "/pilot/", images: [{ url: "/og.png", width: 1200, height: 630 }] },
};

export default function PilotPage() {
  return (
    <PanelShell side="right" closeHref="/" closeLabel="Galaxy" testId="pilot-panel" labelledBy="pilot-title">
      <PilotProfile />
    </PanelShell>
  );
}
