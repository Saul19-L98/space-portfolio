import { noiseGLSL } from "./noise";

export const cloudsFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uSeedOffset;
uniform float uCover;
uniform vec3 uLightDir;
uniform float uPresence;
uniform float uDrift;

varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

${noiseGLSL}

void main() {
  vec3 p = normalize(vLocalPos);
  vec3 q = p * 2.2 + uSeedOffset + vec3(uTime * 0.012 * uDrift, 0.0, uTime * 0.006 * uDrift);
  float n = 0.5 + 0.5 * fbm(q, 4);
  float alpha = smoothstep(uCover, uCover + 0.25, n);
  float ndl = max(dot(normalize(vWorldNormal), normalize(uLightDir)), 0.0);
  vec3 color = vec3(1.0) * (0.12 + 0.88 * ndl);
  gl_FragColor = vec4(color, alpha * 0.85 * uPresence);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
