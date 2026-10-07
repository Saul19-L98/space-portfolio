export const commonVertex = /* glsl */ `
varying vec3 vLocalPos;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vLocalPos = position;
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;
