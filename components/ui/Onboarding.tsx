"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

function alreadyOnboarded(): boolean {
  try {
    return window.localStorage.getItem("onboarded") === "1";
  } catch {
    return false;
  }
}

function markOnboarded() {
  try {
    window.localStorage.setItem("onboarded", "1");
  } catch {
    /* ignore */
  }
}

export function Onboarding() {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const sceneReady = useStore((s) => s.sceneReady);
  const view = useStore((s) => s.view);

  // Read the persisted flag once on the client; null means "not checked yet".
  useEffect(() => {
    const id = window.setTimeout(() => setDismissed(alreadyOnboarded()), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Leaving the galaxy counts as having learned the controls.
  useEffect(() => {
    if (view !== "galaxy") markOnboarded();
  }, [view]);

  if (dismissed !== false || !sceneReady || view !== "galaxy") return null;
  const dismiss = () => {
    markOnboarded();
    setDismissed(true);
  };
  return (
    <div className="pointer-events-auto fixed right-3 top-20 z-20 max-w-xs sm:right-5 sm:top-24" data-testid="onboarding">
      <div className="hud-panel p-4 text-sm text-muted">
        <p className="font-display text-ink">Welcome aboard.</p>
        <p className="mt-1">
          Each star is an employer, each planet a project. <span className="text-ink">Drag</span> to orbit, <span className="text-ink">scroll</span> to zoom,{" "}
          <span className="text-ink">click a star</span> to fly in, <span className="text-ink">hover a planet</span> for its mission record.
        </p>
        <button type="button" className="hud-btn mt-3" onClick={dismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
