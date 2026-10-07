"use client";

import { Stars } from "@react-three/drei";
import { useStore } from "@/lib/store";

export function Starfield() {
  const quality = useStore((s) => s.quality);
  const reducedMotion = useStore((s) => s.reducedMotion);
  return (
    <Stars
      radius={1400}
      depth={400}
      count={quality === "low" ? 1500 : 4500}
      factor={5}
      saturation={0.25}
      fade
      speed={reducedMotion ? 0 : 0.35}
    />
  );
}
