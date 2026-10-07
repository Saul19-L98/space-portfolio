export interface Pose {
  position: [number, number, number];
  target: [number, number, number];
}

/** Distance at which a sphere of radius r fills the smaller field of view. */
export function fitDistance(radius: number, vfovDeg: number, aspect: number): number {
  const vfov = (vfovDeg * Math.PI) / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const fov = Math.min(vfov, hfov);
  return radius / Math.sin(fov / 2);
}

/** Unit direction from azimuth (around Y) and elevation (above the XZ plane), both radians. */
export function sphericalDir(azimuth: number, elevation: number): [number, number, number] {
  const c = Math.cos(elevation);
  return [c * Math.cos(azimuth), Math.sin(elevation), c * Math.sin(azimuth)];
}

export function poseFor(
  target: [number, number, number],
  radius: number,
  azimuth: number,
  elevationDeg: number,
  vfovDeg: number,
  aspect: number,
): Pose {
  const d = fitDistance(radius, vfovDeg, aspect);
  const dir = sphericalDir(azimuth, (elevationDeg * Math.PI) / 180);
  return {
    position: [target[0] + dir[0] * d, target[1] + dir[1] * d, target[2] + dir[2] * d],
    target,
  };
}

/** Azimuth of the camera around a target, radians. */
export function azimuthOf(position: [number, number, number], target: [number, number, number]): number {
  return Math.atan2(position[2] - target[2], position[0] - target[0]);
}
