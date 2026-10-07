"use client";

import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useStore } from "@/lib/store";

export function Effects() {
  const quality = useStore((s) => s.quality);
  if (quality === "low") return null;
  return (
    <EffectComposer multisampling={quality === "high" ? 4 : 0} enableNormalPass={false}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={0.9} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
