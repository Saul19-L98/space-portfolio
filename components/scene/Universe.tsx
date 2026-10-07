"use client";

import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { systems } from "@/content";
import { useStore } from "@/lib/store";
import { CameraDirector } from "./CameraDirector";
import { Effects } from "./Effects";
import { LabelProjector } from "./LabelProjector";
import { RendererConfig } from "./RendererConfig";
import { SceneReady } from "./SceneReady";
import { Ship } from "./Ship";
import { SolarSystem } from "./SolarSystem";
import { Starfield } from "./Starfield";
import { TimeDriver } from "./TimeDriver";

export default function Universe() {
  const quality = useStore((s) => s.quality);
  const setEnv = useStore((s) => s.setEnv);
  return (
    <Canvas
      dpr={quality === "high" ? [1, 2] : 1}
      gl={{ antialias: quality !== "low", powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 45, near: 0.1, far: 6000, position: [0, 220, 620] }}
      frameloop="always"
      shadows={false}
      onPointerMissed={() => useStore.getState().setHover(null)}
      style={{ position: "absolute", inset: 0 }}
    >
      <RendererConfig />
      <color attach="background" args={["#03050c"]} />
      <hemisphereLight args={["#9fb7ff", "#1a1208", 0.9]} />
      <directionalLight position={[40, 60, 80]} intensity={1.4} />
      <Starfield />
      {systems.map((s) => (
        <SolarSystem key={s.slug} system={s} />
      ))}
      <Ship />
      <TimeDriver />
      <CameraDirector />
      <LabelProjector />
      <Effects />
      <SceneReady />
      <AdaptiveDpr pixelated />
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setEnv({ quality: quality === "high" ? "medium" : "low" })}
        onFallback={() => setEnv({ quality: "low" })}
      />
    </Canvas>
  );
}
