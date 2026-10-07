"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { System } from "@/content/schema";
import { buildSystemLayout } from "@/lib/orbit";
import { useStore } from "@/lib/store";
import { OrbitLines } from "./OrbitLines";
import { PlanetBody } from "./PlanetBody";
import { Star } from "./Star";

interface Props {
  system: System;
}

export function SolarSystem({ system }: Props) {
  const layout = useMemo(() => buildSystemLayout(system), [system]);
  const active = useStore((s) => s.systemSlug === system.slug);
  const starWorld = useMemo(() => new THREE.Vector3(...system.galaxyPosition), [system.galaxyPosition]);
  const orbitBySlug = useMemo(() => new Map(layout.orbits.map((o) => [o.slug, o])), [layout]);

  return (
    <group position={system.galaxyPosition}>
      <Star system={system} radius={layout.starRadius} />
      <OrbitLines system={system} layout={layout} />
      {system.planets.map((planet) => {
        const orbit = orbitBySlug.get(planet.slug);
        return orbit ? (
          <PlanetBody key={planet.slug} system={system} planet={planet} orbit={orbit} starWorld={starWorld} interactive={active} />
        ) : null;
      })}
    </group>
  );
}
