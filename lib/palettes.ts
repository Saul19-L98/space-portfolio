import type { Archetype } from "./planet-design";

/** Four-stop palettes per archetype (low → high elevation / band A → band D). */
export const PALETTES: Record<Archetype, [string, string, string, string][]> = {
  rocky: [
    ["#2b2420", "#5a4a3c", "#8c7a66", "#c9bba6"],
    ["#1f2328", "#3f4a55", "#6b7a88", "#a9b4bf"],
    ["#2a1c1a", "#6b3d2e", "#a3664b", "#d9a981"],
    ["#1b1d2a", "#45405c", "#7a6f8f", "#b3a8c4"],
  ],
  terran: [
    ["#0b2a5b", "#1e63b8", "#3f8f3a", "#c8c29a"],
    ["#07213f", "#1a5ca8", "#5a8f2f", "#e0d3a0"],
    ["#0a2d4e", "#157f9b", "#2e8b57", "#d4c494"],
    ["#1a1f4d", "#4b4ac2", "#8b63c9", "#efd9e6"],
  ],
  desert: [
    ["#5a3a1e", "#9c6a35", "#d2a05a", "#f3dca8"],
    ["#6b2f24", "#b25a3c", "#dd9a6a", "#f6d6b4"],
    ["#4a3d2a", "#8a7a4e", "#c7b376", "#efe3b0"],
  ],
  ice: [
    ["#9fc6e8", "#c9e3f6", "#e6f3fb", "#ffffff"],
    ["#7fa8c9", "#b3d1e9", "#dcebf5", "#f8fcff"],
    ["#8fb6d6", "#c4dff0", "#e9f4fb", "#ffffff"],
  ],
  lava: [
    ["#0b0909", "#2a1512", "#4a1e14", "#6b2a16"],
    ["#0d0b10", "#2b1a24", "#4c2232", "#6f2b2e"],
  ],
  gas: [
    ["#c99a66", "#e8c9a0", "#a86e46", "#f1e2c8"],
    ["#6b7fd0", "#a9b8ee", "#4d5db0", "#e1e7ff"],
    ["#3f8f8f", "#8fd1cf", "#2d6d73", "#d7f2f0"],
    ["#a44b6a", "#e09ab4", "#7a2f4e", "#f6d6e3"],
    ["#4e6b3a", "#9fc27e", "#355129", "#dcebc9"],
    ["#b36b2e", "#e7a86a", "#7c4518", "#f6dcb8"],
  ],
  ringed: [
    ["#c9b08a", "#eadbc0", "#9c7f5a", "#f4ecdc"],
    ["#7b8bc9", "#b9c4ee", "#56639f", "#e6ebff"],
    ["#b47a5a", "#e3b59a", "#8a5236", "#f5dccb"],
  ],
};

export const ATMOSPHERE: Record<Archetype, string[]> = {
  rocky: ["#8da4c4", "#b19a8a"],
  terran: ["#6fb4ff", "#8ed1ff", "#c9a8ff"],
  desert: ["#ffb879", "#ffd59a"],
  ice: ["#bfe6ff", "#e3f4ff"],
  lava: ["#ff6a2a", "#ff9a3c"],
  gas: ["#ffd9a8", "#b9c6ff", "#a8f0ea", "#ffb8d6"],
  ringed: ["#ffe6c2", "#c7d1ff"],
};

export const EMISSIVE: string[] = ["#ff5a1f", "#ff8c1a", "#ffb01f", "#ff3d6b"];

export const RING_PALETTES: [string, string][] = [
  ["#d9c7a6", "#7d6a4e"],
  ["#b8c3e6", "#5c6690"],
  ["#e6c9b8", "#8c6a5a"],
];

export const STAR_COLORS = {
  rich: ["#fff1c9", "#ffd79a"],
  dim: ["#9fb7ff", "#ff9d6e", "#ff6f6f", "#cbd5ff"],
};
