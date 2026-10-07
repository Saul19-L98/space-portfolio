"use client";

import { useFrame } from "@react-three/fiber";
import { DAY_MS } from "@/lib/time";
import { useStore } from "@/lib/store";

/** Advances the universe clock while playing. Runs before every body update. */
export function TimeDriver() {
  useFrame((_, delta) => {
    const s = useStore.getState();
    if (!s.playing) return;
    const dt = Math.min(delta, 0.1);
    useStore.setState({ date: s.date + dt * s.speed * DAY_MS });
  }, -4);
  return null;
}
