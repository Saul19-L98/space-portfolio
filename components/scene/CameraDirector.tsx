"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type CameraControlsImpl from "camera-controls";
import { systems } from "@/content";
import { azimuthOf, fitDistance, poseFor } from "@/lib/camera";
import { buildSystemLayout } from "@/lib/orbit";
import { bodies, planetId } from "@/lib/registry";
import { useStore } from "@/lib/store";

const ACTION = {
  NONE: 0,
  ROTATE: 1,
  TRUCK: 2,
  DOLLY: 8,
  ZOOM: 16,
  TOUCH_ROTATE: 32,
  TOUCH_DOLLY: 1024,
  TOUCH_DOLLY_TRUCK: 256,
} as const;

const galaxyCentroid: [number, number, number] = (() => {
  const c = [0, 0, 0];
  for (const s of systems) {
    c[0] += s.galaxyPosition[0];
    c[1] += s.galaxyPosition[1];
    c[2] += s.galaxyPosition[2];
  }
  return [c[0] / systems.length, c[1] / systems.length, c[2] / systems.length];
})();

const galaxyRadius = (() => {
  let r = 0;
  for (const s of systems) {
    const layout = buildSystemLayout(s);
    const d = Math.hypot(
      s.galaxyPosition[0] - galaxyCentroid[0],
      s.galaxyPosition[1] - galaxyCentroid[1],
      s.galaxyPosition[2] - galaxyCentroid[2],
    );
    r = Math.max(r, d + layout.outerRadius);
  }
  return r * 1.05;
})();

const layouts = new Map(systems.map((s) => [s.slug, buildSystemLayout(s)]));

export function CameraDirector() {
  const controls = useRef<CameraControlsImpl | null>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const view = useStore((s) => s.view);
  const systemSlug = useStore((s) => s.systemSlug);
  const planetSlug = useStore((s) => s.planetSlug);
  const flightSeq = useStore((s) => s.flightSeq);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const setCameraMode = useStore((s) => s.setCameraMode);

  const flight = useRef<{ key: string; until: number; planetKey?: string; azimuth: number; radius: number } | null>(null);
  const lastKey = useRef("");
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);

  const lockInput = (locked: boolean) => {
    const c = controls.current;
    if (!c) return;
    c.mouseButtons.left = locked ? ACTION.NONE : ACTION.ROTATE;
    c.mouseButtons.middle = ACTION.NONE;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.wheel = locked ? ACTION.NONE : ACTION.DOLLY;
    c.touches.one = locked ? ACTION.NONE : ACTION.TOUCH_ROTATE;
    c.touches.two = locked ? ACTION.NONE : ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
  };

  const planetRecord = (sys: string, planet: string) => bodies.get(planetId(sys, planet));

  // Flights: one per (view, system, planet, flightSeq) change. Idempotent under StrictMode.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const key = `${view}:${systemSlug ?? ""}:${planetSlug ?? ""}:${flightSeq}`;
    if (key === lastKey.current) return;
    lastKey.current = key;
    if (view === "pilot") return; // the ship rides with the camera: no flight

    const aspect = size.width / Math.max(1, size.height);
    const fov = camera.fov;
    c.getPosition(tmpPos);
    c.getTarget(tmpTarget);
    const current: [number, number, number] = [tmpPos.x, tmpPos.y, tmpPos.z];
    const currentTarget: [number, number, number] = [tmpTarget.x, tmpTarget.y, tmpTarget.z];
    const animate = !reducedMotion;

    let pose;
    let duration = 1.4;
    let radius = galaxyRadius;
    let azimuth = azimuthOf(current, currentTarget);
    if (view === "galaxy" || !systemSlug) {
      azimuth = Math.PI / 2 + 0.35;
      pose = poseFor(galaxyCentroid, galaxyRadius, azimuth, 30, fov, aspect);
      c.minDistance = 20;
      c.maxDistance = fitDistance(galaxyRadius, fov, aspect) * 2.2;
    } else {
      const system = systems.find((s) => s.slug === systemSlug)!;
      const layout = layouts.get(systemSlug)!;
      if (view === "planet" && planetSlug) {
        const rec = planetRecord(systemSlug, planetSlug);
        const orbit = layout.orbits.find((o) => o.slug === planetSlug);
        const target: [number, number, number] = rec
          ? [rec.position[0], rec.position[1], rec.position[2]]
          : system.galaxyPosition;
        const moonReach = orbit && orbit.moons.length ? orbit.moons[orbit.moons.length - 1].radius * 1.35 : 0;
        radius = Math.max((orbit?.bodyRadius ?? 1) * 3.2, moonReach + (orbit?.bodyRadius ?? 1));
        // Approach from the sunlit side: camera sits between the star and the planet, offset so the terminator shows.
        const sp = system.galaxyPosition;
        azimuth = Math.atan2(sp[2] - target[2], sp[0] - target[0]) + 0.75;
        pose = poseFor(target, radius, azimuth, 16, fov, aspect);
        duration = 0.9;
        c.minDistance = (orbit?.bodyRadius ?? 1) * 1.6;
        c.maxDistance = fitDistance(layout.outerRadius * 1.2, fov, aspect);
      } else {
        radius = layout.outerRadius * 1.12;
        pose = poseFor(system.galaxyPosition, radius, azimuth, 34, fov, aspect);
        duration = 1.3;
        c.minDistance = layout.starRadius * 2.5;
        c.maxDistance = fitDistance(galaxyRadius, fov, aspect) * 2.2;
      }
    }

    c.smoothTime = animate ? duration * 0.45 : 0;
    lockInput(true);
    setCameraMode("flying");
    flight.current = {
      key,
      until: performance.now() + (animate ? duration * 1000 + 1200 : 50),
      planetKey: view === "planet" && systemSlug && planetSlug ? planetId(systemSlug, planetSlug) : undefined,
      azimuth,
      radius,
    };
    c.setLookAt(pose.position[0], pose.position[1], pose.position[2], pose.target[0], pose.target[1], pose.target[2], animate);

    const onRest = () => finishFlight();
    c.addEventListener("rest", onRest);
    const finishFlight = () => {
      if (!flight.current || flight.current.key !== key) return;
      flight.current = null;
      c.smoothTime = 0.25;
      lockInput(false);
      setCameraMode(view === "galaxy" ? "idle" : "orbit");
      c.removeEventListener("rest", onRest);
    };
    return () => {
      c.removeEventListener("rest", onRest);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, systemSlug, planetSlug, flightSeq, reducedMotion]);

  // Per-frame: keep a moving planet framed, retarget in-flight, idle drift in the galaxy, flight timeout.
  const prevTarget = useRef<THREE.Vector3 | null>(null);
  useFrame((state, delta) => {
    const c = controls.current;
    if (!c) return;
    const s = useStore.getState();
    const f = flight.current;

    if (f) {
      if (f.planetKey) {
        const rec = bodies.get(f.planetKey);
        if (rec) {
          const aspect = size.width / Math.max(1, size.height);
          const pose = poseFor([rec.position[0], rec.position[1], rec.position[2]], f.radius, f.azimuth, 16, camera.fov, aspect);
          c.setLookAt(pose.position[0], pose.position[1], pose.position[2], pose.target[0], pose.target[1], pose.target[2], !s.reducedMotion);
        }
      }
      if (performance.now() > f.until) {
        flight.current = null;
        c.smoothTime = 0.25;
        lockInput(false);
        setCameraMode(s.view === "galaxy" ? "idle" : "orbit");
      }
      prevTarget.current = null;
      return;
    }

    if (s.view === "planet" && s.systemSlug && s.planetSlug) {
      const rec = bodies.get(planetId(s.systemSlug, s.planetSlug));
      if (rec) {
        c.setTarget(rec.position[0], rec.position[1], rec.position[2], false);
      }
    } else if (s.view === "galaxy" && s.cameraMode === "idle" && !s.reducedMotion && !s.hover) {
      c.rotate(delta * 0.012, 0, false);
    }
  }, -2);

  useEffect(() => {
    lockInput(false);
  }, []);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.25}
      draggingSmoothTime={0.1}
      dollyToCursor={false}
      minDistance={2}
      maxDistance={3000}
      maxPolarAngle={Math.PI * 0.92}
      minPolarAngle={Math.PI * 0.08}
    />
  );
}
