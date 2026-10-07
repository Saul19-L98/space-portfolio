import * as THREE from "three";
import type { PlanetDesign, RingDesign } from "@/lib/planet-design";
import { archetypeId } from "@/lib/planet-design";
import type { Quality } from "@/lib/store";
import { commonVertex } from "@/shaders/common.vert";
import { planetFragment } from "@/shaders/planet.frag";
import { cloudsFragment } from "@/shaders/clouds.frag";
import { atmosphereFragment } from "@/shaders/atmosphere.frag";
import { ringFragment } from "@/shaders/ring.frag";
import { starFragment } from "@/shaders/star.frag";

export const PLANET_GEOMETRY = new THREE.SphereGeometry(1, 48, 32);
export const MOON_GEOMETRY = new THREE.SphereGeometry(1, 24, 16);
export const HIT_GEOMETRY = new THREE.SphereGeometry(1, 8, 8);
/** Raycastable but never drawn: three skips objects whose material is invisible. */
export const HIT_MATERIAL = new THREE.MeshBasicMaterial({ visible: false });

export const UNIT_CIRCLE = (() => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 160; i++) {
    const t = (i / 160) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(t), 0, Math.sin(t)));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
})();

export const QUALITY_OCTAVES: Record<Quality, number> = { high: 5, medium: 4, low: 3 };

export function createPlanetMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: commonVertex,
    fragmentShader: planetFragment,
    uniforms: {
      uTime: { value: 0 },
      uSeedOffset: { value: new THREE.Vector3() },
      uArchetype: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uColorC: { value: new THREE.Color() },
      uColorD: { value: new THREE.Color() },
      uNoiseScale: { value: 2 },
      uOctaves: { value: 5 },
      uDistort: { value: 0.3 },
      uBandFreq: { value: 8 },
      uBandWarp: { value: 0.3 },
      uIceCap: { value: 1.5 },
      uOceanLevel: { value: 0 },
      uEmissive: { value: 0 },
      uEmissiveColor: { value: new THREE.Color() },
      uLightDir: { value: new THREE.Vector3(1, 0, 0) },
      uAtmoColor: { value: new THREE.Color() },
      uAtmoPower: { value: 3 },
      uQuality: { value: 5 },
      uPresence: { value: 1 },
    },
  });
}

export function applyDesign(mat: THREE.ShaderMaterial, d: PlanetDesign, quality: Quality) {
  const u = mat.uniforms;
  (u.uSeedOffset.value as THREE.Vector3).set(...d.seedOffset);
  u.uArchetype.value = archetypeId(d.archetype);
  (u.uColorA.value as THREE.Color).set(d.palette[0]);
  (u.uColorB.value as THREE.Color).set(d.palette[1]);
  (u.uColorC.value as THREE.Color).set(d.palette[2]);
  (u.uColorD.value as THREE.Color).set(d.palette[3]);
  u.uNoiseScale.value = d.noiseScale;
  u.uOctaves.value = d.octaves;
  u.uDistort.value = d.distort;
  u.uBandFreq.value = d.bandFreq;
  u.uBandWarp.value = d.bandWarp;
  u.uIceCap.value = d.iceCap;
  u.uOceanLevel.value = d.oceanLevel;
  u.uEmissive.value = d.emissive;
  (u.uEmissiveColor.value as THREE.Color).set(d.emissiveColor);
  (u.uAtmoColor.value as THREE.Color).set(d.atmoColor);
  u.uAtmoPower.value = d.atmoPower;
  u.uQuality.value = QUALITY_OCTAVES[quality];
}

export function createCloudMaterial(d: PlanetDesign): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: commonVertex,
    fragmentShader: cloudsFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSeedOffset: { value: new THREE.Vector3(d.seedOffset[2], d.seedOffset[0], d.seedOffset[1]) },
      uCover: { value: d.cloudCover },
      uLightDir: { value: new THREE.Vector3(1, 0, 0) },
      uPresence: { value: 1 },
      uDrift: { value: 1 },
    },
  });
}

export function createAtmosphereMaterial(d: PlanetDesign): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: commonVertex,
    fragmentShader: atmosphereFragment,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(d.atmoColor) },
      uPower: { value: d.atmoPower },
      uLightDir: { value: new THREE.Vector3(1, 0, 0) },
      uIntensity: { value: d.archetype === "gas" || d.archetype === "ringed" ? 0.9 : 1.2 },
      uPresence: { value: 1 },
    },
  });
}

export function createRingMaterial(ring: RingDesign, seedOffset: [number, number, number]): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: commonVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uColorA: { value: new THREE.Color(ring.palette[0]) },
      uColorB: { value: new THREE.Color(ring.palette[1]) },
      uInner: { value: ring.inner },
      uOuter: { value: ring.outer },
      uSeedOffset: { value: new THREE.Vector3(...seedOffset) },
      uLightDir: { value: new THREE.Vector3(1, 0, 0) },
      uPresence: { value: 1 },
    },
  });
}

export function createStarMaterial(colorA: string, colorB: string, intensity: number, seed: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: commonVertex,
    fragmentShader: starFragment,
    uniforms: {
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uIntensity: { value: intensity },
      uTime: { value: 0 },
      uSeedOffset: { value: new THREE.Vector3(seed % 97, (seed >> 3) % 89, (seed >> 7) % 83) },
    },
  });
}

let glowTexture: THREE.CanvasTexture | null = null;
/** Soft radial gradient used for star glow sprites. Client-only. */
export function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.65)");
  g.addColorStop(0.45, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}
