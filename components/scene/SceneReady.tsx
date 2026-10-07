"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "@/lib/store";

export function SceneReady() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current > 2) return;
    frames.current += 1;
    if (frames.current === 2) useStore.getState().setSceneReady();
  });
  return null;
}
