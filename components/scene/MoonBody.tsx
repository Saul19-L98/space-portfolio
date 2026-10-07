"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Moon, Planet, System } from "@/content/schema";
import type { MoonOrbit } from "@/lib/orbit";
import { positionAt } from "@/lib/orbit";
import { designFor } from "@/lib/planet-design";
import { moonId, registerBody, unregisterBody } from "@/lib/registry";
import { useStore } from "@/lib/store";
import { MOON_GEOMETRY, applyDesign, createPlanetMaterial } from "./materials";

interface Props {
  system: System;
  planet: Planet;
  moon: Moon;
  orbit: MoonOrbit;
  epochMs: number;
  starWorld: THREE.Vector3;
}

export function MoonBody({ system, planet, moon, orbit, epochMs, starWorld }: Props) {
  const seed = useStore((s) => s.seed);
  const quality = useStore((s) => s.quality);
  const pseudo = useMemo<Planet>(
    () => ({ ...planet, slug: `${planet.slug}/${moon.slug}`, size: "small", moons: [], flagship: false, fragmentary: false }),
    [planet, moon.slug],
  );
  const design = useMemo(() => designFor(pseudo, seed), [pseudo, seed]);
  const material = useMemo(() => createPlanetMaterial(), []);
  useEffect(() => {
    applyDesign(material, design, quality);
    material.uniforms.uAtmoPower.value = 5;
  }, [material, design, quality]);
  useEffect(() => () => material.dispose(), [material]);

  const id = moonId(system.slug, planet.slug, moon.slug);
  const record = useMemo(() => registerBody(id, "moon", orbit.bodyRadius), [id, orbit.bodyRadius]);
  useEffect(() => () => unregisterBody(id), [id]);

  const mesh = useRef<THREE.Mesh>(null);
  const tmp = useMemo(() => [0, 0, 0] as [number, number, number], []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const light = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const { date } = useStore.getState();
    positionAt(orbit, date, tmp, epochMs);
    m.position.set(tmp[0], tmp[1], tmp[2]);
    m.rotation.y = state.clock.elapsedTime * design.spin * 2;
    m.getWorldPosition(world);
    light.copy(starWorld).sub(world).normalize();
    (material.uniforms.uLightDir.value as THREE.Vector3).copy(light);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const parentPresence = (m.parent?.userData.presence as number | undefined) ?? 1;
    material.uniforms.uPresence.value = parentPresence;
    m.scale.setScalar(orbit.bodyRadius);
    record.position[0] = world.x;
    record.position[1] = world.y;
    record.position[2] = world.z;
    record.presence = parentPresence;
    record.visible = parentPresence > 0.02;
  }, -2.9);

  return <mesh ref={mesh} geometry={MOON_GEOMETRY} material={material} />;
}
