"use client";

import Link from "next/link";
import { useEffect } from "react";
import { systems, universe } from "@/content";
import { missionsPath, pilotPath, systemPath } from "@/lib/routes";
import { useStore } from "@/lib/store";
import { TimeScrubber } from "./TimeScrubber";

export function Hud() {
  const view = useStore((s) => s.view);
  const systemSlug = useStore((s) => s.systemSlug);
  const planetSlug = useStore((s) => s.planetSlug);
  const shuffle = useStore((s) => s.shuffle);
  const resetView = useStore((s) => s.resetView);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const setEnv = useStore((s) => s.setEnv);
  const helpOpen = useStore((s) => s.helpOpen);
  const setHelpOpen = useStore((s) => s.setHelpOpen);
  const seed = useStore((s) => s.seed);

  const system = systems.find((s) => s.slug === systemSlug);
  const planet = system?.planets.find((p) => p.slug === planetSlug);

  const toggleMotion = () => {
    const next = !reducedMotion;
    setEnv({ reducedMotion: next });
    try {
      window.localStorage.setItem("motion", next ? "reduce" : "full");
    } catch {
      /* ignore */
    }
  };

  // Keep ?seed= in the URL so a shuffled universe can be shared.
  const seedShared = seed !== universe.defaultSeed;
  useEffect(() => {
    if (!seedShared) return;
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(seed));
    window.history.replaceState(window.history.state, "", url);
  }, [seed, seedShared]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-3 sm:p-5">
        <div className="pointer-events-auto flex flex-col gap-2">
          <Link href="/" className="hud-brand" aria-label="Back to the galaxy">
            <span className="font-display text-sm font-semibold tracking-wide text-ink sm:text-base">{universe.profile.name}</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:block">{universe.profile.headline}</span>
          </Link>
          <nav aria-label="Breadcrumb" className="hud-crumbs font-mono text-[11px] uppercase tracking-[0.2em]" data-testid="breadcrumb">
            <Link href="/" className={view === "galaxy" ? "is-current" : ""}>
              Galaxy
            </Link>
            {system && (
              <>
                <span className="sep">/</span>
                <Link href={systemPath(system.slug)} className={view === "system" ? "is-current" : ""}>
                  {system.name}
                </Link>
              </>
            )}
            {planet && (
              <>
                <span className="sep">/</span>
                <span className="is-current">{planet.codename}</span>
              </>
            )}
            {view === "pilot" && (
              <>
                <span className="sep">/</span>
                <span className="is-current">Pilot</span>
              </>
            )}
          </nav>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2" data-testid="hud-controls">
          <Link href={pilotPath()} className="hud-btn" data-testid="hud-pilot">
            Pilot
          </Link>
          <button type="button" className="hud-btn" onClick={shuffle} title="Re-roll every planet's look (positions stay)" data-testid="hud-shuffle">
            Shuffle{seedShared ? " ✦" : ""}
          </button>
          <button type="button" className="hud-btn" onClick={resetView} title="Re-frame the current view" data-testid="hud-reset">
            Re-frame
          </button>
          <button type="button" className="hud-btn" onClick={toggleMotion} aria-pressed={reducedMotion} title="Toggle reduced motion" data-testid="hud-motion">
            Motion: {reducedMotion ? "reduced" : "full"}
          </button>
          <button type="button" className="hud-btn" onClick={() => setHelpOpen(!helpOpen)} aria-expanded={helpOpen} title="Controls" data-testid="hud-help">
            ?
          </button>
        </div>
      </header>

      <TimeScrubber />

      {helpOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={() => setHelpOpen(false)} role="presentation">
          <div className="hud-panel max-w-md p-5" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()} data-testid="help-dialog">
            <h2 id="help-title" className="font-display text-lg font-semibold">
              Flight controls
            </h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs text-muted">
              <dt className="text-ink">Drag</dt>
              <dd>Orbit the camera</dd>
              <dt className="text-ink">Scroll / pinch</dt>
              <dd>Zoom</dd>
              <dt className="text-ink">Click a star</dt>
              <dd>Fly into that system</dd>
              <dt className="text-ink">Hover / click a planet</dt>
              <dd>Preview, then open its mission record</dd>
              <dt className="text-ink">← →</dt>
              <dd>Cycle planets · Enter opens · Esc goes back</dd>
              <dt className="text-ink">Space</dt>
              <dd>Play / pause the clock · [ ] change speed</dd>
              <dt className="text-ink">S · P · R</dt>
              <dd>Shuffle looks · Pilot record · Re-frame</dd>
            </dl>
            <p className="mt-4 text-xs text-muted">
              No WebGL? The complete mission index is at{" "}
              <Link href={missionsPath()} className="text-accent underline">
                /missions
              </Link>
              .
            </p>
            <button type="button" className="hud-btn mt-4" onClick={() => setHelpOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
