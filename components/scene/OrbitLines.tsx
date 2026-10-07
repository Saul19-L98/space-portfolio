"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { System } from "@/content/schema";
import { DOMAIN_COLORS } from "@/content";
import type { SystemLayout } from "@/lib/orbit";
import { presenceAt } from "@/lib/orbit";
import { useStore } from "@/lib/store";
import { UNIT_CIRCLE } from "./materials";

interface Props {
  system: System;
  layout: SystemLayout;
}

const BASE_OPACITY = 0.2;

export function OrbitLines({ system, layout }: Props) {
  const materials = useMemo(
    () =>
      layout.orbits.map(
        () => new THREE.LineBasicMaterial({ color: "#8fa3c7", transparent: true, opacity: BASE_OPACITY, depthWrite: false }),
      ),
    [layout],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const domainOf = useMemo(() => new Map(system.planets.map((p) => [p.slug, p.domain])), [system]);

  // Imperative highlight on hover / selection: no React re-render per hover.
  useEffect(() => {
    const apply = () => {
      const { hover, planetSlug, systemSlug } = useStore.getState();
      layout.orbits.forEach((o, i) => {
        const m = materials[i];
        const active = systemSlug === system.slug;
        const hot = active && ((hover?.kind === "planet" && hover.planet === o.slug) || planetSlug === o.slug);
        m.color.set(hot ? DOMAIN_COLORS[domainOf.get(o.slug) ?? "data"] : "#8fa3c7");
        m.userData.target = hot ? 0.85 : BASE_OPACITY;
      });
    };
    apply();
    const unsubs = [
      useStore.subscribe((s) => s.hover, apply),
      useStore.subscribe((s) => s.planetSlug, apply),
      useStore.subscribe((s) => s.systemSlug, apply),
    ];
    return () => unsubs.forEach((u) => u());
  }, [layout, materials, system.slug, domainOf]);

  useFrame(() => {
    const date = useStore.getState().date;
    layout.orbits.forEach((o, i) => {
      const m = materials[i];
      const target = (m.userData.target ?? BASE_OPACITY) * presenceAt(o.startMs, date);
      m.opacity += (target - m.opacity) * 0.15;
    });
  }, -3);

  return (
    <group>
      {layout.orbits.map((o, i) => (
        <lineLoop
          key={o.slug}
          geometry={UNIT_CIRCLE}
          material={materials[i]}
          scale={[o.radius, o.radius, o.radius]}
          rotation={[-o.inclination, 0, 0]}
        />
      ))}
    </group>
  );
}
