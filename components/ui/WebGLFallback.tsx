import Link from "next/link";
import { universe } from "@/content";
import { missionsPath } from "@/lib/routes";

export function WebGLFallback() {
  return (
    <div className="fallback" data-testid="webgl-fallback">
      <div className="hud-panel max-w-md p-6 text-center">
        <p className="record-code text-accent">NAVIGATION COMPUTER OFFLINE</p>
        <h1 className="font-display text-xl font-semibold text-ink">{universe.profile.name}</h1>
        <p className="mt-2 text-sm text-muted">
          This browser cannot render WebGL, so the 3D universe is unavailable. The complete mission index is still here.
        </p>
        <Link href={missionsPath()} className="hud-btn mt-4 inline-block">
          Open the mission index
        </Link>
      </div>
    </div>
  );
}
