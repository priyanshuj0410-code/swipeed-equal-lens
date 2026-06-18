// Generates solid-brand PWA icons (placeholders) with no external deps.
// Replace public/icon-*.png with real artwork when branding is ready.
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function png(size, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const row = Buffer.alloc(1 + size * 4);
  for (let x = 0; x < size; x++) {
    row[1 + x * 4] = r;
    row[2 + x * 4] = g;
    row[3 + x * 4] = b;
    row[4 + x * 4] = 255;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const brand = [124, 58, 237]; // #7c3aed
mkdirSync("public", { recursive: true });
writeFileSync("public/icon-192.png", png(192, brand));
writeFileSync("public/icon-512.png", png(512, brand));
console.log("Wrote public/icon-192.png and public/icon-512.png");
