"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useStore } from "@/lib/store";

/** Keeps the renderer in sync with the quality tier. Tone mapping moves to the composer when it is on. */
export function RendererConfig() {
  const gl = useThree((s) => s.gl);
  const quality = useStore((s) => s.quality);
  useEffect(() => {
    gl.toneMapping = quality === "low" ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.setClearColor("#03050c", 1);
  }, [gl, quality]);
  return null;
}
