"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { universe } from "@/content";
import { detectQuality, detectReducedMotion, detectTouch, readSeedParam } from "@/lib/env";
import { parseRoute } from "@/lib/routes";
import { useStore } from "@/lib/store";

/** URL → store (selection) and store → router (navigation requests from the scene). */
export function RouteSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const r = parseRoute(pathname);
    useStore.getState().select(r.view, r.systemSlug, r.planetSlug);
  }, [pathname]);

  useEffect(() => {
    return useStore.subscribe(
      (s) => s.pendingPath,
      (path) => {
        if (!path) return;
        useStore.getState().consumeNavigate();
        router.push(path, { scroll: false });
      },
    );
  }, [router]);

  useEffect(() => {
    const s = useStore.getState();
    s.setEnv({ reducedMotion: detectReducedMotion(), touch: detectTouch(), quality: detectQuality() });
    const seed = readSeedParam();
    s.setSeed(seed ?? universe.defaultSeed);
    s.setDate(Math.min(Date.now(), Date.UTC(2026, 11, 31)));
    if (detectReducedMotion()) s.pause();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => s.setEnv({ reducedMotion: detectReducedMotion() });
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return null;
}
