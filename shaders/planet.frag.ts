import { noiseGLSL } from "./noise";

export const planetFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uSeedOffset;
uniform float uArchetype; // 0 rocky · 1 terran · 2 desert · 3 ice · 4 lava · 5 gas · 6 ringed
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform float uNoiseScale;
uniform float uOctaves;
uniform float uDistort;
uniform float uBandFreq;
uniform float uBandWarp;
uniform float uIceCap;
uniform float uOceanLevel;
uniform float uEmissive;
uniform vec3 uEmissiveColor;
uniform vec3 uLightDir;
uniform vec3 uAtmoColor;
uniform float uAtmoPower;
uniform float uQuality;
uniform float uPresence;

varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

${noiseGLSL}

vec3 ramp4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
  if (t < 0.3333) return mix(a, b, t / 0.3333);
  if (t < 0.6666) return mix(b, c, (t - 0.3333) / 0.3333);
  return mix(c, d, (t - 0.6666) / 0.3334);
}

void main() {
  vec3 p = normalize(vLocalPos);
  vec3 q = p * uNoiseScale + uSeedOffset;
  int oct = int(min(uOctaves, uQuality) + 0.5);
  float n = fbm(q, oct);
  float h = clamp(0.5 + 0.5 * n, 0.0, 1.0);
  float lat = p.y;
  int a = int(uArchetype + 0.5);

  vec3 albedo = vec3(0.5);
  float spec = 0.0;
  vec3 emissive = vec3(0.0);

  if (a == 5 || a == 6) {
    // Gas giant: latitude bands warped by turbulence, plus a storm.
    float warp = fbm(q * 0.7 + 3.1, oct) * uBandWarp;
    float band = sin((lat + warp) * uBandFreq + h * 2.0) * 0.5 + 0.5;
    float band2 = sin((lat - warp * 0.5) * uBandFreq * 2.3 + 1.7) * 0.5 + 0.5;
    albedo = mix(mix(uColorA, uColorB, band), mix(uColorC, uColorD, band2), 0.35 + 0.3 * h);
    vec3 sp = normalize(vec3(0.6, -0.25 + 0.3 * sin(uSeedOffset.x), 0.75));
    float storm = exp(-pow(length(p - sp) / 0.16, 2.0));
    albedo = mix(albedo, uColorD, storm * 0.8);
  } else if (a == 1) {
    // Terran: ocean threshold, land ramp, polar caps, specular water.
    float ocean = smoothstep(uOceanLevel - 0.02, uOceanLevel + 0.02, h);
    vec3 water = mix(uColorA, uColorB, smoothstep(uOceanLevel - 0.25, uOceanLevel, h));
    vec3 land = mix(uColorC, uColorD, smoothstep(uOceanLevel, 1.0, h));
    albedo = mix(water, land, ocean);
    spec = (1.0 - ocean) * 0.9;
    float cap = smoothstep(uIceCap, uIceCap + 0.06, abs(lat) + n * 0.05);
    albedo = mix(albedo, vec3(0.96, 0.98, 1.0), cap);
    spec = mix(spec, 0.2, cap);
  } else if (a == 3) {
    // Ice: pale palette with ridged cracks and wide caps.
    float cracks = ridged(q * 2.0, oct);
    albedo = mix(mix(uColorA, uColorB, h), mix(uColorC, uColorD, h), cracks);
    float cap = smoothstep(uIceCap, uIceCap + 0.1, abs(lat));
    albedo = mix(albedo, vec3(1.0), cap * 0.6);
    spec = 0.5;
  } else if (a == 4) {
    // Lava: dark crust with emissive cracks (HDR, picked up by bloom).
    float r = ridged(q * 1.6, oct);
    float crack = smoothstep(0.78, 0.95, r);
    albedo = mix(mix(uColorA, uColorB, h), mix(uColorC, uColorD, h), 0.5);
    float pulse = 0.8 + 0.2 * sin(uTime * 0.8 + h * 10.0);
    emissive = uEmissiveColor * uEmissive * crack * pulse;
  } else {
    // Rocky / desert: height ramp with ridged detail.
    float detail = ridged(q * 3.0, oct) * uDistort;
    float hh = clamp(h * (1.0 - uDistort * 0.5) + detail * 0.5, 0.0, 1.0);
    albedo = ramp4(uColorA, uColorB, uColorC, uColorD, hh);
    if (a == 2) {
      float dune = sin((p.x + n * 0.3) * 40.0) * 0.5 + 0.5;
      albedo = mix(albedo, uColorD, dune * 0.12);
    }
  }

  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(vViewDir);
  float ndl = max(dot(N, L), 0.0);
  float diffuse = ndl * 0.92 + 0.08;
  vec3 H = normalize(L + V);
  float specular = pow(max(dot(N, H), 0.0), 48.0) * spec * ndl;
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), uAtmoPower);
  vec3 color = albedo * diffuse + albedo * vec3(0.05, 0.07, 0.12) + vec3(specular) + uAtmoColor * fresnel * (0.3 + 0.7 * ndl) + emissive;
  color *= mix(0.2, 1.0, uPresence);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
