"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { System } from "@/content/schema";
import { STAR_COLORS } from "@/lib/palettes";
import { Rng, hashString } from "@/lib/prng";
import { registerBody, unregisterBody } from "@/lib/registry";
import { systemPath } from "@/lib/routes";
import { useStore } from "@/lib/store";
import { HIT_GEOMETRY, HIT_MATERIAL, PLANET_GEOMETRY, createStarMaterial, getGlowTexture } from "./materials";

interface Props {
  system: System;
  radius: number;
}

export function Star({ system, radius }: Props) {
  const rich = system.kind === "rich";
  const seed = hashString(`star:${system.slug}`);
  const material = useMemo(() => {
    const rng = new Rng(seed);
    const colorA = rich ? STAR_COLORS.rich[0] : rng.pick(STAR_COLORS.dim);
    const colorB = rich ? STAR_COLORS.rich[1] : colorA;
    return createStarMaterial(colorA, colorB, rich ? 6 : 0.75, seed);
  }, [rich, seed]);
  const glow = useMemo(() => {
    const m = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: new THREE.Color(material.uniforms.uColorA.value as THREE.Color),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: rich ? 0.9 : 0.35,
    });
    return m;
  }, [material, rich]);

  useEffect(() => () => void (material.dispose(), glow.dispose()), [material, glow]);

  const group = useRef<THREE.Group>(null);
  const record = useMemo(() => registerBody(system.slug, "system", radius), [system.slug, radius]);
  useEffect(() => () => unregisterBody(system.slug), [system.slug]);

  const world = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) {
      group.current.getWorldPosition(world);
      record.position[0] = world.x;
      record.position[1] = world.y;
      record.position[2] = world.z;
    }
  }, -3);

  const setHover = useStore((s) => s.setHover);
  const requestNavigate = useStore((s) => s.requestNavigate);
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover({ kind: "system", system: system.slug });
  };
  const onOut = () => setHover(null);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const s = useStore.getState();
    if (s.touch && !(s.hover?.kind === "system" && s.hover.system === system.slug)) {
      setHover({ kind: "system", system: system.slug });
      return;
    }
    if (s.view === "galaxy" || s.systemSlug !== system.slug) requestNavigate(systemPath(system.slug));
  };

  return (
    <group ref={group}>
      <mesh geometry={PLANET_GEOMETRY} material={material} scale={radius} />
      <sprite material={glow} scale={radius * (rich ? 9 : 5)} />
      <mesh
        geometry={HIT_GEOMETRY}
        material={HIT_MATERIAL}
        scale={radius * 1.6}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onClick}
      />
    </group>
  );
}
