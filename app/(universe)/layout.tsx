import { SceneHost } from "@/components/scene/SceneHost";
import { Hud } from "@/components/ui/Hud";
import { KeyboardNav } from "@/components/ui/KeyboardNav";
import { Onboarding } from "@/components/ui/Onboarding";
import { RouteSync } from "@/components/ui/RouteSync";

/** Everything inside this group shares the one persistent canvas. */
export default function UniverseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SceneHost />
      <RouteSync />
      <Hud />
      <KeyboardNav />
      <Onboarding />
      <main className="relative z-30 min-h-full pointer-events-none">{children}</main>
    </>
  );
}
