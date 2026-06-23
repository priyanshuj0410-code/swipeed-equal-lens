// Pre-generated narration clips (option C). Reads scripts/narration-manifest.json (from collect-narration.py),
// renders each line to an MP3 at public/audio/<folder>/<hash>.mp3 (folder = per-chapter voice), and writes
// public/audio/manifest.json (the set of present "<folder>/<hash>" keys that speak.ts checks). Resumable:
// existing clips are skipped. Provider is pluggable — Kokoro (free, on-device at build time) by default; swap in
// ElevenLabs etc. later. Run: npx tsx scripts/gen-audio.mts   (optionally TTS_LIMIT=50 for a quick sample)
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KokoroTTS } from "kokoro-js";
import * as lamejs from "@breezystack/lamejs";
import { clean, audioKey } from "../src/lib/audio-key.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO = path.join(ROOT, "public", "audio");
const MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";

// per-chapter render voice (the one consistent voice each chapter ships with — tweak + regenerate freely).
const VOICES: Record<string, string> = {
  "1": "bf_emma", "2": "af_heart", "3": "af_bella", "4": "af_nova",
  "5": "af_aoede", "6": "am_michael", "7": "af_sarah", "8": "bf_lily", def: "af_heart",
};
const folderOf = (ch: string) => (ch === "def" ? "def" : `ch${ch}`);

const Mp3Encoder = (lamejs as unknown as { Mp3Encoder?: unknown }).Mp3Encoder
  ?? (lamejs as unknown as { default?: { Mp3Encoder?: unknown } }).default?.Mp3Encoder;

function encodeMp3(float32: Float32Array, sampleRate: number): Buffer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enc = new (Mp3Encoder as any)(1, sampleRate, 64); // mono, 64 kbps
  const samples = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const chunks: Buffer[] = [];
  const BLOCK = 1152;
  for (let i = 0; i < samples.length; i += BLOCK) {
    const buf = enc.encodeBuffer(samples.subarray(i, i + BLOCK));
    if (buf.length) chunks.push(Buffer.from(buf));
  }
  const end = enc.flush();
  if (end.length) chunks.push(Buffer.from(end));
  return Buffer.concat(chunks);
}

async function main() {
  const manifestPath = path.join(ROOT, "scripts", "narration-manifest.json");
  const rows: { chapter: string; text: string }[] = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const limit = process.env.TTS_LIMIT ? parseInt(process.env.TTS_LIMIT, 10) : Infinity;

  console.log(`loading Kokoro (cpu, q8)…`);
  const t0 = Date.now();
  const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: "q8", device: "cpu" });
  console.log(`model ready in ${((Date.now() - t0) / 1000).toFixed(1)}s · ${rows.length} lines queued`);

  let made = 0, skipped = 0, failed = 0, done = 0;
  for (const r of rows) {
    if (made >= limit) break;
    done++;
    const folder = folderOf(r.chapter);
    const text = clean(r.text);
    if (!text) continue;
    const key = audioKey(r.text);
    const dir = path.join(AUDIO, folder);
    const out = path.join(dir, `${key}.mp3`);
    try { await fs.access(out); skipped++; continue; } catch { /* not there → render */ }
    try {
      const voice = VOICES[r.chapter] ?? VOICES.def;
      const audio = await tts.generate(text, { voice, speed: 1 });
      // RawAudio: .audio (Float32Array) + .sampling_rate
      const a = audio as unknown as { audio: Float32Array; sampling_rate: number };
      const mp3 = encodeMp3(a.audio, a.sampling_rate);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(out, mp3);
      made++;
      if (made % 25 === 0) console.log(`  ${done}/${rows.length} · made ${made} · skipped ${skipped} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    } catch (e) {
      failed++;
      console.warn(`  ✗ ${r.chapter} "${text.slice(0, 40)}…"`, (e as Error).message);
    }
  }

  // rebuild the manifest from whatever clips exist on disk
  const keys: string[] = [];
  for (const folder of await fs.readdir(AUDIO).catch(() => [] as string[])) {
    const dir = path.join(AUDIO, folder);
    if (!(await fs.stat(dir)).isDirectory()) continue;
    for (const f of await fs.readdir(dir)) if (f.endsWith(".mp3")) keys.push(`${folder}/${f.replace(/\.mp3$/, "")}`);
  }
  await fs.writeFile(path.join(AUDIO, "manifest.json"), JSON.stringify(keys));
  console.log(`\nDONE · made ${made} · skipped ${skipped} · failed ${failed} · manifest has ${keys.length} clips`);
}

main().catch((e) => { console.error(e); process.exit(1); });
