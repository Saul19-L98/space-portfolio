import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { View } from "./routes";
import { nextSeed } from "./prng";
import { UNIVERSE_END } from "./time";

export type CameraMode = "idle" | "flying" | "orbit";
export type Quality = "high" | "medium" | "low";
export interface HoverTarget {
  kind: "system" | "planet" | "moon" | "ship";
  system?: string;
  planet?: string;
  moon?: string;
}

export interface UniverseStore {
  // selection (mirrors the URL)
  view: View;
  systemSlug: string | null;
  planetSlug: string | null;
  pendingPath: string | null;
  // hover / focus
  hover: HoverTarget | null;
  focusIndex: number;
  // camera
  cameraMode: CameraMode;
  flightSeq: number;
  // time
  date: number;
  playing: boolean;
  speed: number;
  // universe
  seed: number;
  // environment
  reducedMotion: boolean;
  touch: boolean;
  quality: Quality;
  sceneReady: boolean;
  helpOpen: boolean;

  select(view: View, system: string | null, planet: string | null): void;
  requestNavigate(path: string): void;
  consumeNavigate(): void;
  setHover(h: HoverTarget | null): void;
  setFocusIndex(i: number): void;
  setCameraMode(m: CameraMode): void;
  resetView(): void;
  setDate(ms: number): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  setSpeed(d: number): void;
  cycleSpeed(dir: 1 | -1): void;
  setSeed(seed: number): void;
  shuffle(): void;
  setEnv(p: Partial<Pick<UniverseStore, "reducedMotion" | "touch" | "quality">>): void;
  setSceneReady(): void;
  setHelpOpen(open: boolean): void;
}

export const SPEEDS = [1, 7, 30, 120];

export const useStore = create<UniverseStore>()(
  subscribeWithSelector((set, get) => ({
    view: "galaxy",
    systemSlug: null,
    planetSlug: null,
    pendingPath: null,
    hover: null,
    focusIndex: -1,
    cameraMode: "idle",
    flightSeq: 0,
    date: UNIVERSE_END,
    playing: true,
    speed: 7,
    seed: 0x5a1f0b3d,
    reducedMotion: false,
    touch: false,
    quality: "high",
    sceneReady: false,
    helpOpen: false,

    select: (view, system, planet) => {
      const s = get();
      if (s.view === view && s.systemSlug === system && s.planetSlug === planet) return;
      set({ view, systemSlug: system, planetSlug: planet, hover: null, focusIndex: -1 });
    },
    requestNavigate: (path) => set({ pendingPath: path }),
    consumeNavigate: () => set({ pendingPath: null }),
    setHover: (hover) => {
      const h = get().hover;
      if (h === hover) return;
      if (h && hover && h.kind === hover.kind && h.system === hover.system && h.planet === hover.planet && h.moon === hover.moon) return;
      set({ hover });
    },
    setFocusIndex: (focusIndex) => set({ focusIndex }),
    setCameraMode: (cameraMode) => {
      if (get().cameraMode !== cameraMode) set({ cameraMode });
    },
    resetView: () => set((s) => ({ flightSeq: s.flightSeq + 1 })),
    setDate: (date) => set({ date }),
    play: () => set({ playing: true }),
    pause: () => set({ playing: false }),
    togglePlay: () => set((s) => ({ playing: !s.playing })),
    setSpeed: (speed) => set({ speed }),
    cycleSpeed: (dir) =>
      set((s) => {
        const i = SPEEDS.indexOf(s.speed);
        const next = SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, (i < 0 ? 1 : i) + dir))];
        return { speed: next };
      }),
    setSeed: (seed) => set({ seed: seed >>> 0 }),
    shuffle: () => set((s) => ({ seed: nextSeed(s.seed) })),
    setEnv: (p) => set(p),
    setSceneReady: () => {
      if (!get().sceneReady) set({ sceneReady: true });
    },
    setHelpOpen: (helpOpen) => set({ helpOpen }),
  })),
);
