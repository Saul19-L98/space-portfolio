"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supportsWebGL2 } from "@/lib/env";
import { useStore } from "@/lib/store";
import { LabelLayer } from "@/components/ui/LabelLayer";
import { WebGLFallback } from "@/components/ui/WebGLFallback";

const Universe = dynamic(() => import("./Universe"), { ssr: false });

/** Mounts the one persistent canvas plus the DOM label layer that floats over it. */
export function SceneHost() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const sceneReady = useStore((s) => s.sceneReady);
  const cameraMode = useStore((s) => s.cameraMode);
  const quality = useStore((s) => s.quality);
  useEffect(() => {
    setWebgl(supportsWebGL2());
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-bg"
      data-testid="universe-root"
      data-scene-ready={sceneReady ? "1" : "0"}
      data-camera-mode={cameraMode}
      data-quality={quality}
    >
      {webgl === false ? (
        <WebGLFallback />
      ) : (
        <>
          {webgl && <Universe />}
          <LabelLayer />
          {!sceneReady && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-24" aria-hidden>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted animate-pulse">Initializing navigation computer…</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
