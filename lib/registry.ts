/**
 * Imperative, render-loop-friendly registries shared between the R3F scene and
 * the DOM label layer. Nothing here triggers React renders.
 */
export type BodyId = string; // `${system}` | `${system}/${planet}` | `${system}/${planet}/${moon}` | "ship"

export interface BodyRecord {
  id: BodyId;
  kind: "system" | "planet" | "moon" | "ship";
  position: Float32Array; // world position, length 3
  radius: number;
  presence: number; // 0..1
  visible: boolean;
}

export const bodies = new Map<BodyId, BodyRecord>();
export const labelElements = new Map<BodyId, HTMLElement>();

export function registerBody(id: BodyId, kind: BodyRecord["kind"], radius: number): BodyRecord {
  let rec = bodies.get(id);
  if (!rec) {
    rec = { id, kind, position: new Float32Array(3), radius, presence: 1, visible: true };
    bodies.set(id, rec);
  } else {
    rec.radius = radius;
  }
  return rec;
}

export function unregisterBody(id: BodyId) {
  bodies.delete(id);
}

export function planetId(system: string, planet: string) {
  return `${system}/${planet}`;
}

export function moonId(system: string, planet: string, moon: string) {
  return `${system}/${planet}/${moon}`;
}
