"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Planet, System } from "@/content/schema";
import type { OrbitSpec } from "@/lib/orbit";
import { positionAt, presenceAt } from "@/lib/orbit";
import { designFor } from "@/lib/planet-design";
import { planetId, registerBody, unregisterBody } from "@/lib/registry";
import { planetPath } from "@/lib/routes";
import { useStore } from "@/lib/store";
import {
  HIT_GEOMETRY,
  HIT_MATERIAL,
  PLANET_GEOMETRY,
  applyDesign,
  createAtmosphereMaterial,
  createCloudMaterial,
  createPlanetMaterial,
  createRingMaterial,
} from "./materials";
import { MoonBody } from "./MoonBody";

interface Props {
  system: System;
  planet: Planet;
  orbit: OrbitSpec;
  starWorld: THREE.Vector3;
  interactive: boolean;
}

export function PlanetBody({ system, planet, orbit, starWorld, interactive }: Props) {
  const seed = useStore((s) => s.seed);
  const quality = useStore((s) => s.quality);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const design = useMemo(() => designFor(planet, seed), [planet, seed]);

  const material = useMemo(() => createPlanetMaterial(), []);
  const clouds = useMemo(() => (design.clouds ? createCloudMaterial(design) : null), [design]);
  const atmosphere = useMemo(() => (quality !== "low" ? createAtmosphereMaterial(design) : null), [design, quality]);
  const ring = useMemo(() => (design.ring ? createRingMaterial(design.ring, design.seedOffset) : null), [design]);
  const ringGeometry = useMemo(
    () => (design.ring ? new THREE.RingGeometry(design.ring.inner, design.ring.outer, 96, 1) : null),
    [design.ring],
  );

  useEffect(() => {
    applyDesign(material, design, quality);
  }, [material, design, quality]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => clouds?.dispose(), [clouds]);
  useEffect(() => () => atmosphere?.dispose(), [atmosphere]);
  useEffect(() => () => void (ring?.dispose(), ringGeometry?.dispose()), [ring, ringGeometry]);

  const id = planetId(system.slug, planet.slug);
  const record = useMemo(() => registerBody(id, "planet", orbit.bodyRadius), [id, orbit.bodyRadius]);
  useEffect(() => () => unregisterBody(id), [id]);

  const group = useRef<THREE.Group>(null);
  const visual = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const cloudMesh = useRef<THREE.Mesh>(null);
  const hit = useRef<THREE.Mesh>(null);
  const tmp = useMemo(() => [0, 0, 0] as [number, number, number], []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const light = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { date } = useStore.getState();
    positionAt(orbit, date, tmp);
    g.position.set(tmp[0], tmp[1], tmp[2]);
    const presence = presenceAt(orbit.startMs, date);
    g.userData.presence = presence;
    g.visible = presence > 0.001;
    g.getWorldPosition(world);
    light.copy(starWorld).sub(world).normalize();

    const t = state.clock.elapsedTime;
    const spin = reducedMotion ? 0 : design.spin;
    const dist = state.camera.position.distanceTo(world);
    // Keep far planets legible: never render a body smaller than ~5 px on screen.
    const cam = state.camera as THREE.PerspectiveCamera;
    const pxPerUnit = state.size.height / (2 * dist * Math.tan((cam.fov * Math.PI) / 360));
    const minPx = 5;
    const enlarge = Math.max(1, minPx / Math.max(orbit.bodyRadius * pxPerUnit, 1e-4));
    if (visual.current) visual.current.scale.setScalar((0.05 + 0.95 * presence) * Math.min(enlarge, 6));
    if (body.current) body.current.rotation.y = t * spin;
    if (cloudMesh.current) cloudMesh.current.rotation.y = t * spin * 1.3;
    for (const m of [material, clouds, atmosphere, ring]) {
      if (!m) continue;
      (m.uniforms.uLightDir.value as THREE.Vector3).copy(light);
      m.uniforms.uPresence.value = presence;
      if (m.uniforms.uTime) m.uniforms.uTime.value = t;
    }
    if (clouds) clouds.uniforms.uDrift.value = reducedMotion ? 0 : 1;

    // Hit sphere: never smaller than ~18 px on screen.
    if (hit.current) hit.current.scale.setScalar(Math.max(orbit.bodyRadius * 1.8, dist * 0.012));

    record.position[0] = world.x;
    record.position[1] = world.y;
    record.position[2] = world.z;
    record.presence = presence;
    record.visible = presence > 0.02;
  }, -3);

  const setHover = useStore((s) => s.setHover);
  const requestNavigate = useStore((s) => s.requestNavigate);
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    setHover({ kind: "planet", system: system.slug, planet: planet.slug });
  };
  const onOut = () => {
    if (!interactive) return;
    setHover(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    const s = useStore.getState();
    const isHovered = s.hover?.kind === "planet" && s.hover.planet === planet.slug && s.hover.system === system.slug;
    if (s.touch && !isHovered) {
      setHover({ kind: "planet", system: system.slug, planet: planet.slug });
      return;
    }
    if (s.planetSlug !== planet.slug) requestNavigate(planetPath(system.slug, planet.slug));
  };

  const r = orbit.bodyRadius;
  return (
    <group ref={group}>
      <group ref={visual}>
        <mesh ref={body} geometry={PLANET_GEOMETRY} material={material} scale={r} />
        {clouds && <mesh ref={cloudMesh} geometry={PLANET_GEOMETRY} material={clouds} scale={r * 1.025} />}
        {atmosphere && <mesh geometry={PLANET_GEOMETRY} material={atmosphere} scale={r * 1.09} />}
        {ring && ringGeometry && design.ring && (
          <mesh geometry={ringGeometry} material={ring} rotation={[-Math.PI / 2 + design.ring.tilt, 0.2, 0]} scale={r} />
        )}
      </group>
      {(planet.moons ?? []).map((moon, i) => {
        const mo = orbit.moons[i];
        return mo ? (
          <MoonBody key={moon.slug} system={system} planet={planet} moon={moon} orbit={mo} epochMs={orbit.startMs} starWorld={starWorld} />
        ) : null;
      })}
      <mesh
        ref={hit}
        geometry={HIT_GEOMETRY}
        material={HIT_MATERIAL}
        onPointerOver={interactive ? onOver : undefined}
        onPointerOut={interactive ? onOut : undefined}
        onClick={interactive ? onClick : undefined}
      />
    </group>
  );
}
