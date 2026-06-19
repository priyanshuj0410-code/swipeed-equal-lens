// Per-chapter seasons for the single learning path (Phase A: static seasons).
// Summer -> Rainy -> Autumn -> Winter -> Spring, one per chapter region. Seasons are pure
// styling (sky, fog, light, ground tint, foliage colormap) layered on the SAME path.
import * as THREE from "three";

export type SeasonKey = "summer" | "rainy" | "autumn" | "winter" | "spring";
export const SEASON_ORDER: SeasonKey[] = ["summer", "rainy", "autumn", "winter", "spring"];

type SeasonDef = {
  skyTop: string;
  skyBottom: string;
  bg: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  sunColor: string;
  sunIntensity: number;
  ambient: number;
  ground: { base: string; light: string; dark: string };
  colormap: string;
  weather: "rain" | "snow" | "leaves" | "petals" | null; // used in Phase B
};

// Tone note (from the guide): keep Rainy & Winter WARM/bright, not grey.
export const SEASONS: Record<SeasonKey, SeasonDef> = {
  summer: {
    skyTop: "#79bdf7", skyBottom: "#eaf6ff", bg: "#eaf6ff",
    fogColor: "#dbeefb", fogNear: 40, fogFar: 235,
    sunColor: "#fff3da", sunIntensity: 1.25, ambient: 0.42,
    ground: { base: "#3da679", light: "#59c387", dark: "#20896b" },
    colormap: "/models/Textures/colormap_summer.png", weather: null,
  },
  rainy: {
    skyTop: "#8fb6cf", skyBottom: "#dff0f0", bg: "#dff0f0",
    fogColor: "#cfe4e2", fogNear: 35, fogFar: 185,
    sunColor: "#eaf2ea", sunIntensity: 0.98, ambient: 0.5,
    ground: { base: "#2f7d52", light: "#46a06a", dark: "#1c6347" },
    colormap: "/models/Textures/colormap_rainy.png", weather: "rain",
  },
  autumn: {
    skyTop: "#f4c98a", skyBottom: "#fcefd6", bg: "#fcefd6",
    fogColor: "#f3dcad", fogNear: 45, fogFar: 205,
    sunColor: "#ffce8a", sunIntensity: 1.16, ambient: 0.46,
    ground: { base: "#bf6a2c", light: "#e08a3e", dark: "#974f22" },
    colormap: "/models/Textures/colormap_autumn.png", weather: "leaves",
  },
  winter: {
    skyTop: "#cbdcec", skyBottom: "#f4f8fc", bg: "#f4f8fc",
    fogColor: "#eef4fb", fogNear: 40, fogFar: 190,
    sunColor: "#fff0d8", sunIntensity: 1.05, ambient: 0.66,
    ground: { base: "#f1f6fb", light: "#ffffff", dark: "#dde7f1" },
    colormap: "/models/Textures/colormap_winter.png", weather: "snow",
  },
  spring: {
    skyTop: "#9fd9f7", skyBottom: "#eafbf0", bg: "#eafbf0",
    fogColor: "#ddf3e8", fogNear: 50, fogFar: 215,
    sunColor: "#fff1f4", sunIntensity: 1.2, ambient: 0.46,
    ground: { base: "#57c06a", light: "#7fd98a", dark: "#3fa45a" },
    colormap: "/models/Textures/colormap_spring.png", weather: "petals",
  },
};

// Parsed (THREE.Color) targets, to avoid per-frame allocations while lerping.
export const SEASON_TARGET = Object.fromEntries(
  SEASON_ORDER.map((k) => {
    const s = SEASONS[k];
    return [
      k,
      {
        skyTop: new THREE.Color(s.skyTop),
        skyBottom: new THREE.Color(s.skyBottom),
        bg: new THREE.Color(s.bg),
        fogColor: new THREE.Color(s.fogColor),
        fogNear: s.fogNear,
        fogFar: s.fogFar,
        sunColor: new THREE.Color(s.sunColor),
        sunIntensity: s.sunIntensity,
        ambient: s.ambient,
      },
    ];
  })
) as Record<SeasonKey, {
  skyTop: THREE.Color; skyBottom: THREE.Color; bg: THREE.Color; fogColor: THREE.Color;
  fogNear: number; fogFar: number; sunColor: THREE.Color; sunIntensity: number; ambient: number;
}>;

// Mutable runtime state: SeasonDriver lerps these toward the active season; SkyDome /
// SunLight / Ground / ambient read them each frame. `index` is the discrete season (drives
// the snap swaps: ground vertex colours + foliage colormap). One path scene at a time.
const init = SEASON_TARGET.summer;
export const seasonRT = {
  index: 0,
  skyTop: init.skyTop.clone(),
  skyBottom: init.skyBottom.clone(),
  bg: init.bg.clone(),
  fogColor: init.fogColor.clone(),
  fogNear: init.fogNear,
  fogFar: init.fogFar,
  sunColor: init.sunColor.clone(),
  sunIntensity: init.sunIntensity,
  ambient: init.ambient,
  night: 0, // 0..1, driven by the day/night layer — used for stars/moon + lamp glow
};
