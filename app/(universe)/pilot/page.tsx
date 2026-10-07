import type { Metadata } from "next";
import { PanelShell } from "@/components/ui/PanelShell";
import { PilotProfile } from "@/components/ui/PilotProfile";
import { universe } from "@/content";

export const metadata: Metadata = {
  title: "Pilot record",
  description: `${universe.profile.name} — ${universe.profile.headline}. ${universe.profile.summary[0]}`,
};

export default function PilotPage() {
  return (
    <PanelShell side="right" closeHref="/" closeLabel="Galaxy" testId="pilot-panel" labelledBy="pilot-title">
      <PilotProfile />
    </PanelShell>
  );
}
