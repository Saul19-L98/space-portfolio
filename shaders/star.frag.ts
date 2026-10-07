import { noiseGLSL } from "./noise";

export const starFragment = /* glsl */ `
precision highp float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;
uniform float uTime;
uniform vec3 uSeedOffset;

varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

${noiseGLSL}

void main() {
  vec3 p = normalize(vLocalPos);
  float n = 0.5 + 0.5 * fbm(p * 3.0 + uSeedOffset + vec3(0.0, uTime * 0.03, 0.0), 4);
  vec3 color = mix(uColorA, uColorB, n);
  float limb = pow(max(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0), 0.6);
  gl_FragColor = vec4(color * uIntensity * (0.55 + 0.45 * limb), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
