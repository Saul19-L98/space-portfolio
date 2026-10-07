"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { systems } from "@/content";
import { buildSystemLayout } from "@/lib/orbit";
import { bodies, labelElements } from "@/lib/registry";
import { useStore } from "@/lib/store";

const stars = systems.map((s) => ({
  slug: s.slug,
  center: new THREE.Vector3(...s.galaxyPosition),
  radius: buildSystemLayout(s).starRadius,
}));

interface Candidate {
  el: HTMLElement;
  x: number;
  y: number;
  lift: number;
  opacity: number;
  priority: number;
}

const sizeCache = new Map<HTMLElement, { w: number; h: number; at: number }>();

function measure(el: HTMLElement, now: number) {
  const c = sizeCache.get(el);
  if (c && now - c.at < 1500) return c;
  const m = { w: el.offsetWidth || 120, h: el.offsetHeight || 26, at: now };
  sizeCache.set(el, m);
  return m;
}

/** Projects registered bodies into the DOM label layer every frame. No React renders. */
export function LabelProjector() {
  const size = useThree((s) => s.size);
  const v = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const toStar = useMemo(() => new THREE.Vector3(), []);
  const candidates = useMemo<Candidate[]>(() => [], []);
  const placed = useMemo<{ x0: number; y0: number; x1: number; y1: number }[]>(() => [], []);

  useFrame((state) => {
    const camera = state.camera;
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    camera.getWorldPosition(camPos);
    const s = useStore.getState();
    const w = size.width;
    const h = size.height;
    const now = performance.now();
    candidates.length = 0;
    placed.length = 0;

    for (const [id, rec] of bodies) {
      const el = labelElements.get(id);
      if (!el) continue;

      // Scope: which labels belong to the current view.
      let scoped = 1;
      const [sys, planet, moon] = id.split("/");
      if (rec.kind === "ship") scoped = 1;
      else if (rec.kind === "system") scoped = s.view === "galaxy" || s.view === "pilot" ? 1 : s.systemSlug === sys ? 0 : 0.55;
      else if (rec.kind === "planet") {
        if (s.view === "galaxy" || s.view === "pilot") scoped = 0;
        else if (s.systemSlug !== sys) scoped = 0;
        else if (s.view === "planet") scoped = s.planetSlug === planet ? 1 : 0.45;
        else scoped = 1;
      } else if (rec.kind === "moon") {
        scoped = s.view === "planet" && s.systemSlug === sys && s.planetSlug === planet && !!moon ? 1 : 0;
      }
      if (scoped === 0 || !rec.visible) {
        hide(el);
        continue;
      }

      v.set(rec.position[0], rec.position[1], rec.position[2]);
      // Occlusion by the parent star (planets and moons only).
      if (rec.kind !== "system" && rec.kind !== "ship") {
        const star = stars.find((st) => st.slug === sys);
        if (star) {
          dir.copy(v).sub(camPos);
          const len = dir.length();
          dir.divideScalar(len);
          toStar.copy(star.center).sub(camPos);
          const tProj = toStar.dot(dir);
          if (tProj > 0 && tProj < len) {
            const perp = toStar.distanceToSquared(dir.clone().multiplyScalar(tProj));
            if (perp < star.radius * star.radius) {
              hide(el);
              continue;
            }
          }
        }
      }
      const dist = camPos.distanceTo(v);
      v.project(camera);
      if (v.z > 1 || v.z < -1) {
        hide(el);
        continue;
      }
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (1 - (v.y * 0.5 + 0.5)) * h;
      if (x < -200 || x > w + 200 || y < -100 || y > h + 100) {
        hide(el);
        continue;
      }
      let opacity = scoped * Math.min(1, rec.presence * 1.5);
      if (rec.kind === "planet" && s.view === "system") {
        // Fade the farthest labels a little so the near ones read first.
        opacity *= THREE.MathUtils.clamp(1.25 - dist / 900, 0.55, 1);
      }
      // Offset label just above the body on screen.
      const bodyPx = (rec.radius / Math.max(dist, 0.001)) * (h / (2 * Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360)));
      const lift = Math.min(Math.max(bodyPx + 10, 14), 80);

      // Priority: ship and the hovered/selected body always win, then flagships, then nearer bodies.
      const hovered =
        (s.hover?.kind === rec.kind && (s.hover.planet ?? s.hover.system) === (planet ?? sys) && (s.hover.moon ?? "") === (moon ?? "")) ||
        (rec.kind === "planet" && s.planetSlug === planet && s.systemSlug === sys);
      let priority = -dist;
      if (rec.kind === "ship") priority = 1e9;
      else if (hovered) priority = 1e8;
      else if (rec.kind === "system") priority = 1e7 - dist;
      else if (el.dataset.flagship === "1") priority += 1e5;
      candidates.push({ el, x, y, lift, opacity, priority });
    }

    // Greedy collision avoidance: place high-priority labels first, hide the ones that would overlap.
    candidates.sort((a, b) => b.priority - a.priority);
    for (const c of candidates) {
      const m = measure(c.el, now);
      const x0 = c.x - m.w / 2;
      const y1 = c.y - c.lift;
      const y0 = y1 - m.h;
      const x1 = x0 + m.w;
      let collides = false;
      for (const r of placed) {
        if (x0 < r.x1 + 4 && x1 > r.x0 - 4 && y0 < r.y1 + 2 && y1 > r.y0 - 2) {
          collides = true;
          break;
        }
      }
      if (collides && c.priority < 1e7) {
        hide(c.el);
        continue;
      }
      placed.push({ x0, y0, x1, y1 });
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${(c.y - c.lift).toFixed(1)}px, 0) translate(-50%, -100%)`;
      c.el.style.opacity = c.opacity.toFixed(3);
      if (c.el.dataset.visible !== "1") c.el.dataset.visible = "1";
      c.el.style.pointerEvents = c.opacity > 0.3 ? "auto" : "none";
    }
  }, 0);

  return null;
}

function hide(el: HTMLElement) {
  if (el.dataset.visible !== "0") {
    el.dataset.visible = "0";
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  }
}
