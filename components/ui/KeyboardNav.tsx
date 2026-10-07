"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { chronologicalPlanets, systems } from "@/content";
import { parentPath, pilotPath, planetPath } from "@/lib/routes";
import { useStore } from "@/lib/store";

export function KeyboardNav() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const s = useStore.getState();
      const system = systems.find((x) => x.slug === s.systemSlug);
      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft": {
          if (!system) return;
          e.preventDefault();
          const list = chronologicalPlanets(system);
          const current = s.hover?.kind === "planet" ? list.findIndex((p) => p.slug === s.hover?.planet) : list.findIndex((p) => p.slug === s.planetSlug);
          const next = (current + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
          s.setFocusIndex(next);
          s.setHover({ kind: "planet", system: system.slug, planet: list[next].slug });
          break;
        }
        case "Enter": {
          if (s.hover?.kind === "planet" && s.hover.system && s.hover.planet) router.push(planetPath(s.hover.system, s.hover.planet), { scroll: false });
          else if (s.hover?.kind === "system" && s.hover.system) router.push(`/system/${s.hover.system}`, { scroll: false });
          else if (s.hover?.kind === "ship") router.push(pilotPath(), { scroll: false });
          break;
        }
        case "Escape": {
          if (s.helpOpen) {
            s.setHelpOpen(false);
            return;
          }
          if (s.view !== "galaxy") router.push(parentPath({ view: s.view, systemSlug: s.systemSlug, planetSlug: s.planetSlug }), { scroll: false });
          else s.setHover(null);
          break;
        }
        case " ": {
          e.preventDefault();
          s.togglePlay();
          break;
        }
        case "[":
          s.cycleSpeed(-1);
          break;
        case "]":
          s.cycleSpeed(1);
          break;
        case "s":
        case "S":
          s.shuffle();
          break;
        case "p":
        case "P":
          router.push(pilotPath(), { scroll: false });
          break;
        case "r":
        case "R":
          s.resetView();
          break;
        case "?":
          s.setHelpOpen(!s.helpOpen);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
