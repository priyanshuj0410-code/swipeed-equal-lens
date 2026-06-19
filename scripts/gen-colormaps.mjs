// Generate 5 seasonal variants of the Kenney colormap by recolouring only the green
// (grass/leaf) swatches; wood/path/character/sky swatches are left untouched.
// Run: node scripts/gen-colormaps.mjs   (requires sharp)
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "..", "public", "models", "Textures", "colormap.png");
const OUTDIR = path.join(HERE, "..", "public", "models", "Textures");

// season -> target grass/leaf colour (from the seasons guide §2)
const TARGET = {
  summer: "#5BB54A",
  rainy: "#2F7D45",
  autumn: "#D2691E", // strong orange
  winter: "#EEF4FA", // near-white snow
  spring: "#7ECB5A",
};

// how much of the original swatch's luminance variation to keep (lower = flatter toward
// the target). Winter is low so foliage reads as uniform snow-white, not pale green.
const LWEIGHT = { summer: 0.4, rainy: 0.4, autumn: 0.4, winter: 0.16, spring: 0.4 };

const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2 = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2(p, q, h + 1 / 3), hue2(p, q, h), hue2(p, q, h - 1 / 3)].map((v) => Math.round(v * 255));
}

// is this pixel a foliage green? (green clearly dominant; not brown/grey/blue/sky)
const isGreen = (r, g, b) => g > 60 && g - r > 12 && g - b > 12;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

for (const [season, hex] of Object.entries(TARGET)) {
  const [tr, tg, tb] = hexToRgb(hex);
  const [tH, tS, tL] = rgbToHsl(tr, tg, tb);
  const out = Buffer.from(data); // copy
  let recoloured = 0;
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    if (!isGreen(r, g, b)) continue;
    const [, , l] = rgbToHsl(r, g, b);
    // keep the season hue+sat; bias luminance toward the target but keep some swatch variation
    const lw = LWEIGHT[season] ?? 0.4;
    const newL = Math.max(0.06, Math.min(0.98, tL * (1 - lw) + l * lw));
    const [nr, ng, nb] = hslToRgb(tH, tS, newL);
    out[i] = nr; out[i + 1] = ng; out[i + 2] = nb;
    recoloured++;
  }
  const file = path.join(OUTDIR, `colormap_${season}.png`);
  await sharp(out, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9, palette: false }).toFile(file);
  console.log(`${season}: recoloured ${recoloured} px -> ${path.basename(file)}`);
}
console.log("done");
