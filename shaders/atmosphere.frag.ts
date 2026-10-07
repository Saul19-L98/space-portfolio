export const atmosphereFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uPower;
uniform vec3 uLightDir;
uniform float uIntensity;
uniform float uPresence;

varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(vViewDir);
  // Back faces of a slightly larger sphere: strongest next to the planet limb.
  float t = clamp(-dot(N, V) / 0.42, 0.0, 1.0);
  float glow = pow(t, uPower * 0.6);
  float ndl = max(dot(N, normalize(uLightDir)), 0.0);
  float light = 0.25 + 0.75 * ndl;
  vec3 color = uColor * glow * uIntensity * light * uPresence;
  gl_FragColor = vec4(color, glow);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
