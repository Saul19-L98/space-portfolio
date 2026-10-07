"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { registerBody, unregisterBody } from "@/lib/registry";
import { pilotPath } from "@/lib/routes";
import { useStore } from "@/lib/store";
import { HIT_GEOMETRY, HIT_MATERIAL, getGlowTexture } from "./materials";

/**
 * The pilot's ship rides with the camera in the lower-left of the view, so the
 * visitor is always "aboard". Hover shows the pilot label; click opens the profile.
 */
export function Ship() {
  const group = useRef<THREE.Group>(null);
  const record = useMemo(() => registerBody("ship", "ship", 1), []);
  useEffect(() => () => unregisterBody("ship"), []);

  const hull = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b9c6d8", metalness: 0.65, roughness: 0.35 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3a4659", metalness: 0.5, roughness: 0.6 }), []);
  const glass = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7cc4ff", emissive: "#7cc4ff", emissiveIntensity: 1.6, roughness: 0.2 }), []);
  const engine = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffb86b", emissive: "#ff9a3c", emissiveIntensity: 2.8 }), []);
  const flame = useMemo(
    () => new THREE.SpriteMaterial({ map: getGlowTexture(), color: "#ff9a3c", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 }),
    [],
  );
  useEffect(() => () => [hull, dark, glass, engine, flame].forEach((m) => m.dispose()), [hull, dark, glass, engine, flame]);

  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const s = useStore.getState();
    const t = state.clock.elapsedTime;
    const dist = 9;
    const vh = 2 * dist * Math.tan((cam.fov * Math.PI) / 360);
    const vw = vh * (state.size.width / Math.max(1, state.size.height));
    cam.getWorldDirection(forward);
    right.crossVectors(forward, cam.up).normalize();
    up.crossVectors(right, forward).normalize();
    const bob = s.reducedMotion ? 0 : Math.sin(t * 1.3) * 0.06;
    const compact = state.size.width < 768;
    const dx = compact ? -vw * 0.3 : -vw * 0.36;
    const dy = compact ? -vh * 0.18 : -vh * 0.3;
    g.position.copy(cam.position).addScaledVector(forward, dist).addScaledVector(right, dx).addScaledVector(up, dy + bob);
    // Face along the camera's forward with a slight bank towards the centre.
    q.copy(cam.quaternion);
    g.quaternion.copy(q);
    g.rotateY(-0.55);
    g.rotateZ(s.reducedMotion ? 0 : Math.sin(t * 0.7) * 0.04);
    g.rotateX(0.08);
    g.scale.setScalar(compact ? 0.65 : 1);
    flame.opacity = 0.7 + (s.reducedMotion ? 0 : Math.sin(t * 9) * 0.15);
    g.getWorldPosition(world);
    record.position[0] = world.x;
    record.position[1] = world.y + 0.75;
    record.position[2] = world.z;
    record.visible = true;
    record.presence = 1;
  }, -2);

  const setHover = useStore((s) => s.setHover);
  const requestNavigate = useStore((s) => s.requestNavigate);
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover({ kind: "ship" });
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const s = useStore.getState();
    if (s.touch && s.hover?.kind !== "ship") {
      setHover({ kind: "ship" });
      return;
    }
    if (s.view !== "pilot") requestNavigate(pilotPath());
  };

  return (
    <group ref={group}>
      {/* hull */}
      <mesh material={hull} rotation={[0, 0, -Math.PI / 2]}>
        <capsuleGeometry args={[0.28, 1.5, 6, 14]} />
      </mesh>
      {/* nose */}
      <mesh material={dark} position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.6, 14]} />
      </mesh>
      {/* cockpit */}
      <mesh material={glass} position={[0.35, 0.22, 0]} scale={[0.42, 0.2, 0.26]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      {/* wings */}
      <mesh material={dark} position={[-0.3, -0.05, 0.75]} rotation={[0.08, 0.25, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
      </mesh>
      <mesh material={dark} position={[-0.3, -0.05, -0.75]} rotation={[-0.08, -0.25, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
      </mesh>
      {/* fin */}
      <mesh material={hull} position={[-0.55, 0.32, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.45, 0.05]} />
      </mesh>
      {/* engines */}
      <mesh material={engine} position={[-1.0, 0, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.14, 0.3, 12]} />
      </mesh>
      <mesh material={engine} position={[-1.0, 0, -0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.14, 0.3, 12]} />
      </mesh>
      <sprite material={flame} position={[-1.3, 0, 0.22]} scale={0.8} />
      <sprite material={flame} position={[-1.3, 0, -0.22]} scale={0.8} />
      <mesh geometry={HIT_GEOMETRY} material={HIT_MATERIAL} scale={1.5} onPointerOver={onOver} onPointerOut={() => setHover(null)} onClick={onClick} />
    </group>
  );
}
