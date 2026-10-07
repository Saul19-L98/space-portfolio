import { noiseGLSL } from "./noise";

export const ringFragment = /* glsl */ `
precision highp float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uInner;
uniform float uOuter;
uniform vec3 uSeedOffset;
uniform vec3 uLightDir;
uniform float uPresence;

varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

${noiseGLSL}

void main() {
  float r = length(vLocalPos.xy);
  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  float bands = 0.5 + 0.5 * snoise(vec3(t * 18.0 + uSeedOffset.x, uSeedOffset.y, uSeedOffset.z));
  float fine = 0.5 + 0.5 * snoise(vec3(t * 60.0 + uSeedOffset.z, uSeedOffset.x, 0.0));
  float edge = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.92, 1.0, t));
  float alpha = edge * (0.35 + 0.65 * bands) * (0.6 + 0.4 * fine);
  vec3 color = mix(uColorA, uColorB, bands);
  float ndl = abs(dot(normalize(vWorldNormal), normalize(uLightDir)));
  color *= 0.25 + 0.75 * ndl;
  gl_FragColor = vec4(color, alpha * 0.9 * uPresence);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
