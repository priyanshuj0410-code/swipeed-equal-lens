// The 5 chapter themes for the 2.5D sticker canvas (Phase 6). Each chapter region gets a palette + a
// (stub, for now) sticker feel, re-imagined in the Equal Lens family with a seasonal accent. Cross-faded
// by scroll position. Official themed sticker packs drop into /brand/canvas/<key>/ later. See
// docs/world-canvas.md.
export type CanvasTheme = {
  key: string;
  name: string;
  skyTop: string;
  skyBottom: string;
  tree: string;
  treeDark: string;
  ground: string;
  accent: string;
  weather: "none" | "rain" | "leaves" | "snow" | "petals";
};

export const CANVAS_THEMES: CanvasTheme[] = [
  { key: "summer", name: "Summer", skyTop: "#cdeafe", skyBottom: "#eaf6ff", tree: "#54bd77", treeDark: "#2f8f57", ground: "#bfe3c0", accent: "#2dd4bf", weather: "none" },
  { key: "rainy", name: "Rainy", skyTop: "#c7dbe8", skyBottom: "#e3eef4", tree: "#3f9d6b", treeDark: "#2c7f52", ground: "#b6d6bf", accent: "#4fb0e8", weather: "rain" },
  { key: "autumn", name: "Autumn", skyTop: "#f7d6a6", skyBottom: "#fdeccf", tree: "#d9803a", treeDark: "#a85a25", ground: "#e6c498", accent: "#ff7a5c", weather: "leaves" },
  { key: "winter", name: "Winter", skyTop: "#ddd6ec", skyBottom: "#eee9f6", tree: "#b9aede", treeDark: "#9b8cc7", ground: "#ece7f4", accent: "#553286", weather: "snow" },
  { key: "spring", name: "Spring", skyTop: "#d6f3e0", skyBottom: "#eefaf2", tree: "#5bc06f", treeDark: "#3fa45a", ground: "#c9ead0", accent: "#ff9ec0", weather: "petals" },
];

export const themeForChapterIndex = (i: number): CanvasTheme =>
  CANVAS_THEMES[Math.min(Math.max(i, 0), CANVAS_THEMES.length - 1)];
