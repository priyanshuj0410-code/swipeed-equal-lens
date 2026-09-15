# SwipeEd: Seasons Implementation Guide (for Claude Code)

**Goal:** give each of the 5 chapters of the single learning path its own *season/biome*
**Summer → Rainy → Autumn → Winter → Spring**: using the Kenney Platformer Kit's
recolouring system, plus weather particle effects (rain, snow, falling autumn leaves,
and optional spring blossom petals). It also adds a **day/night layer** tied to the device
clock (a calmer, warmer evening plus a gentle bedtime nudge (§7)) and uses the **Kenney
Holiday Kit** for warm, cosy winter props (§2).

> This is a reference guide. **Do not assume the codebase: confirm it first** (Step 0).
> All code below targets **React Three Fiber (R3F) + Three.js + @react-three/drei**, the
> most likely stack for a Next.js/Vercel 3D app using GLB models. If the project uses
> **vanilla Three.js**, the `THREE.*` APIs are identical: just drop the JSX wrappers.
> If it uses Babylon/PlayCanvas/Unity-WebGL, keep the *concepts* and translate.

---

## 0. Before you change anything (do this first)

1. **Detect the renderer & model format.** Search the repo for `@react-three/fiber`,
   `three`, `.glb`/`.gltf`, `useGLTF`, `Canvas`. Report what you find.
2. **Find the scene/environment code** (sky, fog, lights, ground) and the **path/node
   renderer** (where nodes are laid out: this should be driven by the master node table,
   see `SwipeEd - Master Node Table.xlsx`, column `chapter`).
3. **Find the Kenney models and their shared texture.** Kenney 3D models share **one
   palette texture** (commonly `colormap.png`) and one material. Locate it.
4. **Find how "current chapter/region" is known** as the player scrolls the path (camera
   position vs node `order`, or the active node's `chapter`).
5. **Summarise the current structure and your plan, then wait for go-ahead** before large edits.

**Hard constraint:** keep the **single path**. Seasons are *per-region styling*, not new
scenes or branching maps. Do not refactor the path system.

---

## 1. Chapter → Season mapping

This order is the natural seasonal cycle started at summer (summer → monsoon → autumn →
winter → spring), so it flows correctly and lands on spring for the final "graduation."

| Chapter | Ages | Season | Mood to hit | Weather |
|---|---|---|---|---|
| Ch.1 | 3-6 | **Summer** | bright, warm, carefree | none (sunny) |
| Ch.2 | 6-9 | **Rainy** (monsoon) | *joyful* monsoon: lush, splashy, rainbows (NOT gloomy) | **rain** |
| Ch.3 | 9-12 | **Autumn** | golden, changing, cosy | **falling leaves** |
| Ch.4 | 12-15 | **Winter** | *cosy & hopeful*: snow-as-wonder + warm **Holiday-Kit** props (NOT bleak; most tender content) | **snow** |
| Ch.5 | 15-18 | **Spring** | blossoming, fresh, new beginnings | optional **blossom petals** |

> Tone note for the designers: **Rainy and Winter must be executed warm**, not grey.
> Winter = warm lights + snow wonder (lean on the **Holiday Kit** props, §2); Rainy = bright, lush, rainbows.

---

## 2. How Kenney colours work (and how to make seasons)

Kenney (and KayKit) 3D models use a **single shared "colormap" palette texture**: a small
image holding every colour in the pack. Each model's UVs point at specific coloured pixels.
**Recolouring a swatch recolours everything that uses it.** Kenney's own packs ship colour
*variations* by swapping colours at certain palette positions: and in Kenney's Hexagon Kit,
**this is exactly how they produce seasons.** We do the same.

### Recommended approach: 5 colormap variants (matches Kenney's own method)

Create five versions of the palette texture, changing only the **grass** and **leaf** (and
optionally **ground/dirt**) swatches:

| File | Grass | Leaves | Notes |
|---|---|---|---|
| `colormap_summer.png` | `#5BB54A` bright green | `#3E9B3A` | the default look |
| `colormap_rainy.png` | `#2F7D45` deep saturated green | `#256B3A` | rain-soaked, lush |
| `colormap_autumn.png` | `#A8893E` golden | `#C2622D` orange-red | warm |
| `colormap_winter.png` | `#E7EEF5` snow white-blue | `#D7E3EE` | snow on ground/leaves |
| `colormap_spring.png` | `#7ECB5A` fresh green | `#F4B9D0` blossom pink | leaves = blossom |

**To create them:** open the kit's `colormap.png`, identify the grass/leaf swatch pixels,
recolour to the targets above, export each season as a PNG **at the same size, uncompressed
/ "high quality"** (compression causes colour banding on palette atlases: Kenney's explicit
warning). Keep the wood/path/character swatches unchanged.

**Texture import settings in Three.js** (critical for crisp palette + no banding):

```js
tex.colorSpace = THREE.SRGBColorSpace;
tex.flipY = false;          // GLTF/GLB convention
tex.magFilter = THREE.NearestFilter;  // crisp palette, no blurring between swatches
tex.minFilter = THREE.NearestFilter;  // (or LinearMipmapLinear if you must): avoid bleed
tex.generateMipmaps = false;
```

> Alternatives if you don't want to edit textures:
> **(B)** If trees/grass have *separate* materials, tint at runtime via `material.color`
> instead of swapping the map. (Often everything shares one material → limited.)
> **(C)** The Platformer Kit ships "Variation(s)": check whether it already includes
> autumn/snow leaf or grass variants you can reuse directly.

### Winter props: use Kenney's Holiday Kit

For the winter chapter, drop in **Kenney's Holiday Kit** (CC0; ~100 low-poly models in
GLTF/GLB; same low-poly art style as the Platformer Kit). It's full of the warm, cosy winter
models you want: snow-covered trees, a snow fort, a cabin, a toy train, lanterns, string
lights, gifts and festive objects (Christmas / Hanukkah / Kwanzaa): perfect for selling
*"cosy & hopeful winter"* instead of bleak. Use these props **as-is** (they're already warm
and colourful: don't recolour them), scatter them along the winter region of the path, and
give any light-emitting props (lanterns, string lights, fireplaces, candles) an **emissive**
material so they glow: especially once the day/night layer (§7) goes dark.

> Note: the Holiday Kit has its **own** colormap texture (separate kit), so the §2 seasonal
> recolour applies to the Platformer-Kit foliage while the Holiday props stay festive.

---

## 3. A single source of truth: the `SEASONS` config

Create `src/world/seasons.js` (adapt path/format to repo conventions):

```js
import * as THREE from 'three';

export const CHAPTER_TO_SEASON = {
  1: 'summer', 2: 'rainy', 3: 'autumn', 4: 'winter', 5: 'spring',
};

export const SEASONS = {
  summer: { sky:'#8FD3FF', fog:['#BFE6FF', 60, 200], sun:{color:'#FFF6E0', intensity:1.5}, ambient:0.6,
            colormap:'/textures/colormap_summer.png', weather:null },
  rainy:  { sky:'#7E8A99', fog:['#9AA7B5', 30, 120], sun:{color:'#C7D2DD', intensity:0.7}, ambient:0.55,
            colormap:'/textures/colormap_rainy.png',  weather:'rain' },
  autumn: { sky:'#FAD9A0', fog:['#F0C98A', 50, 170], sun:{color:'#FFD89A', intensity:1.2}, ambient:0.55,
            colormap:'/textures/colormap_autumn.png', weather:'leaves' },
  winter: { sky:'#CBD9E6', fog:['#E8F0F7', 40, 150], sun:{color:'#EAF2FF', intensity:0.95}, ambient:0.7,
            colormap:'/textures/colormap_winter.png', weather:'snow' },
  spring: { sky:'#AEE0FF', fog:['#DDF3E8', 55, 190], sun:{color:'#FFF1F4', intensity:1.3}, ambient:0.6,
            colormap:'/textures/colormap_spring.png', weather:'petals' },
};
```

> **Sky, fog and light sell the season as much as grass.** Don't skip them: a bright sky +
> warm sun is "summer"; a low grey sky + soft cool light + short fog is "rainy"; etc.

---

## 4. Applying a season (sky, fog, lights, colormap)

```jsx
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SEASONS } from './seasons';

export function SeasonEnvironment({ season, worldRoot }) {
  const { scene } = useThree();
  const s = SEASONS[season];

  // Preload all 5 colormaps once; swap per season.
  const maps = useTexture(
    Object.fromEntries(Object.entries(SEASONS).map(([k, v]) => [k, v.colormap]))
  );
  useMemo(() => {
    Object.values(maps).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
      t.magFilter = THREE.NearestFilter; t.generateMipmaps = false;
    });
  }, [maps]);

  // Sky + fog
  useEffect(() => {
    scene.background = new THREE.Color(s.sky);
    scene.fog = new THREE.Fog(new THREE.Color(s.fog[0]), s.fog[1], s.fog[2]);
  }, [scene, s]);

  // Swap the Kenney colormap on the world meshes.
  useEffect(() => {
    worldRoot?.traverse((o) => {
      if (o.isMesh && o.material && o.material.map) {
        o.material.map = maps[season];
        o.material.needsUpdate = true;
      }
    });
  }, [season, worldRoot, maps]);

  return (
    <>
      <ambientLight intensity={s.ambient} />
      <directionalLight color={s.sun.color} intensity={s.sun.intensity} position={[20, 40, 10]} castShadow />
    </>
  );
}
```

> If the kit uses **one shared material instance**, swapping its `.map` once recolours the
> whole biome. If meshes have **cloned materials**, the `traverse` handles them all. Confirm
> which, and (important) only swap the *world/foliage* meshes, not character/path meshes if
> they share the atlas: or use the season palette that leaves those swatches unchanged
> (recommended, per §2).

---

## 5. Weather particles

**Shared design rules**

- **Follow the camera/player.** Keep each particle field in a box centred on the camera
  (update `x`/`z` to the camera each frame) so it's always populated as the player scrolls.
- **Mount only the active season's emitter.**
- **Recycle** particles: when one falls below ground, respawn it at the top.
- **Perf:** use `THREE.Points` (rain/snow) or `InstancedMesh` (leaves/petals); `depthWrite:false`
  for precip; scale `count` by device tier; pause on `document.hidden`; honour
  `prefers-reduced-motion` (disable particles, keep the static recolour). See §8.

### 5a. Rain (Rainy chapter)

```jsx
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function Rain({ count = 700, area = [44, 30, 44], speed = 22, slant = 3, color = '#9FB8D6' }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i*3] = (Math.random()-0.5)*area[0];
      a[i*3+1] = Math.random()*area[1];
      a[i*3+2] = (Math.random()-0.5)*area[2];
    }
    return a;
  }, [count]);

  // A 1×N vertical streak texture so each point looks like a rain line.
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 2; c.height = 24;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 24);
    grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(1, 'rgba(255,255,255,1)');
    g.fillStyle = grad; g.fillRect(0, 0, 2, 24);
    const t = new THREE.CanvasTexture(c); return t;
  }, []);

  useFrame((state, dt) => {
    const p = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      p[i*3+1] -= speed * dt;
      p[i*3]   += slant * dt;
      if (p[i*3+1] < 0) {
        p[i*3+1] = area[1];
        p[i*3]   = (Math.random()-0.5)*area[0];
        p[i*3+2] = (Math.random()-0.5)*area[2];
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.position.x = state.camera.position.x;
    ref.current.position.z = state.camera.position.z;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} color={color} size={0.6} sizeAttenuation
        transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}
```

Optional extras: a faint overcast plane / darker fog (already in the `rainy` config), a
subtle looping rain sound, and a few ground "ripple" decals near the path.

### 5b. Snow (Winter chapter)

Same field, but **slow fall + gentle sine drift**, soft round flakes, opaque white.
"Snow on the ground" is handled by the **winter colormap** (§2): no accumulation sim needed.

```jsx
export function Snow({ count = 500, area = [44, 30, 44], speed = 2.2, drift = 0.7, color = '#FFFFFF' }) {
  const ref = useRef();
  const { positions, phase } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i*3] = (Math.random()-0.5)*area[0];
      positions[i*3+1] = Math.random()*area[1];
      positions[i*3+2] = (Math.random()-0.5)*area[2];
      phase[i] = Math.random()*Math.PI*2;
    }
    return { positions, phase };
  }, [count]);

  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'); g.beginPath(); g.arc(16,16,14,0,Math.PI*2);
    g.fillStyle = '#fff'; g.fill();
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state, dt) => {
    const p = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      phase[i] += dt;
      p[i*3+1] -= speed * dt;
      p[i*3]   += Math.sin(phase[i]) * drift * dt;   // flutter sideways
      if (p[i*3+1] < 0) { p[i*3+1] = area[1]; p[i*3] = (Math.random()-0.5)*area[0]; p[i*3+2] = (Math.random()-0.5)*area[2]; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.position.x = state.camera.position.x;
    ref.current.position.z = state.camera.position.z;
  });

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial map={tex} color={color} size={0.45} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
    </points>
  );
}
```

### 5c. Falling autumn leaves (Autumn chapter)

Use an **InstancedMesh of small quads** so each leaf can **tumble** (rotate) and **sway**.
Lower count than precip. Use a leaf texture (alpha cut-out) or simple coloured quads.

```jsx
export function FallingLeaves({ count = 130, area = [40, 26, 40], speed = 2.6,
                               colors = ['#C2622D', '#D98A3D', '#A8893E'], texture = null }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const leaves = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random()-0.5)*area[0], y: Math.random()*area[1], z: (Math.random()-0.5)*area[2],
    rx: Math.random()*Math.PI, ry: Math.random()*Math.PI, rz: Math.random()*Math.PI,
    spin: (Math.random()-0.5)*2.5, sway: 0.4 + Math.random()*0.6, phase: Math.random()*Math.PI*2,
    scale: 0.28 + Math.random()*0.18,
  })), [count]);

  useFrame((state, dt) => {
    leaves.forEach((d, i) => {
      d.y -= speed * dt; d.phase += dt; d.rz += d.spin * dt; d.rx += d.spin * 0.5 * dt;
      if (d.y < 0) { d.y = area[1]; d.x = (Math.random()-0.5)*area[0]; d.z = (Math.random()-0.5)*area[2]; }
      dummy.position.set(state.camera.position.x + d.x + Math.sin(d.phase)*d.sway,
                         d.y,
                         state.camera.position.z + d.z + Math.cos(d.phase*0.8)*d.sway);
      dummy.rotation.set(d.rx, d.ry, d.rz);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} color={texture ? '#ffffff' : colors[0]}
        side={THREE.DoubleSide} transparent alphaTest={0.5} roughness={1} />
    </instancedMesh>
  );
}
```

> No leaf texture handy? Use a tiny teardrop/quad and the autumn palette colours, or bake a
> 4-frame leaf sprite. For per-leaf colour variety, switch to `setColorAt` on the instanced
> mesh.

### 5d. Spring blossom petals (optional, Spring chapter)

Reuse `FallingLeaves` with pink petal colours/texture, smaller scale, slightly higher count
a lovely echo of autumn that reinforces "blossoming into adulthood."

```jsx
<FallingLeaves count={170} speed={1.8} colors={['#F4B9D0','#F7C9DC','#FBD7E6']} />
```

### 5e. The weather switcher

```jsx
import { SEASONS } from './seasons';
export function Weather({ season }) {
  const w = SEASONS[season].weather;
  if (w === 'rain')   return <Rain />;
  if (w === 'snow')   return <Snow />;
  if (w === 'leaves') return <FallingLeaves />;
  if (w === 'petals') return <FallingLeaves count={170} speed={1.8} colors={['#F4B9D0','#F7C9DC','#FBD7E6']} />;
  return null; // summer
}
```

---

## 6. Driving the season from the path

The active season = the chapter of the node the player is at (or nearest, while scrolling).

```jsx
import { CHAPTER_TO_SEASON } from './seasons';
// nodes = the master node table (order, chapter, ...). currentNode/scroll already exist in the app.
const chapter = currentNode?.chapter ?? nearestNodeByCameraZ(camera, nodes)?.chapter ?? 1;
const season  = CHAPTER_TO_SEASON[chapter];
```

**Smooth the transition at chapter boundaries** (the "a new season has arrived" beat):
instead of snapping, **lerp** `scene.fog.color`, `scene.background`, and the directional
light's `color`/`intensity` from the old season to the new over ~1-1.5 s, and **ramp the
particle opacity/count** down then up. Swap the colormap at the midpoint of the crossfade (or
crossfade two ground meshes if you want zero pop). Keep this logic in one place
(`useSeasonTransition`).

---

## 7. Day / Night & Evening Wind-Down

Day/night is **not** a Kenney feature: it's renderer-side, and it layers *on top of* the
seasons as a lighting modifier (no new textures). Final look = **season × time of day**. The
kid-friendly aim is a **calmer, warmer, dimmer evening** plus a gentle bedtime cue. Frame it
honestly: this is a soothing evening experience + nudging away from screens near bedtime
**not** a blue-light health claim (the melatonin evidence is mixed; warmth, dimming and
winding down are the real, modest wins).

### 7.1 The `timeOfDay` modifier (composes with SEASONS: does not replace it)

```js
// timeOfDay.js: multiplies/overrides the active season's sky, fog and light.
export const PHASES = {
  day:     { skyMul:1.00, fogMul:1.00, lightMul:1.00, warmth:0.00, lamps:false, sunElev: 55, moon:false },
  evening: { skyMul:0.85, fogMul:0.95, lightMul:0.80, warmth:0.45, lamps:true,  sunElev: 8,  moon:false, tint:'#FFB066' },
  night:   { skyMul:0.30, fogMul:0.80, lightMul:0.35, warmth:0.25, lamps:true,  sunElev:-12, moon:true,  tint:'#33406E' },
};

export function phaseForHour(h) {         // h = new Date().getHours(): local device time
  if (h >= 19 || h < 6) return 'night';   // 7pm, 6am
  if (h >= 17)          return 'evening'; // 5-7pm golden hour
  return 'day';
}
```

Apply the phase **after** the season (§4): scale the sky/fog brightness by `*Mul`, lerp the
sky/fog colours toward `tint` by `warmth`, scale the directional light's `intensity` by
`lightMul` and shift its `color` toward warm white by `warmth` (**lower colour temperature =
the legit "less blue" lever**), drop the sun low or swap to a dim cool **moon** at night, and
lower overall exposure. Crossfade between phases (~30-60 s, or on app open) reusing the season
lerp from §6: never snap.

```jsx
const phase = PHASES[phaseForHour(new Date().getHours())];
// sky   = lerp(season.sky,    phase.tint ?? season.sky,    phase.warmth);  // then brightness *= phase.skyMul
// fog   = lerp(season.fog[0], phase.tint ?? season.fog[0], phase.warmth);  // range *= phase.fogMul
// light : color = lerp(season.sun.color, '#FFE2B0', phase.warmth); intensity = season.sun.intensity * phase.lightMul
// night : mount <Moon/> + a few stars; reduce particle counts; lower bloom/exposure
```

### 7.2 Lamps that glow at night (where the Holiday Kit shines)

Give every light-emitting prop: lanterns, string lights, fireplaces, candles, windows, lamp
posts (Platformer Kit, and especially the **Holiday Kit**, §2): an emissive material toggled
by `phase.lamps`:

```jsx
worldRoot.traverse((o) => {
  if (o.isMesh && /lamp|lantern|light|fire|candle|window|bulb|string/i.test(o.name)) {
    o.material.emissive = new THREE.Color('#FFC97A');
    o.material.emissiveIntensity = phase.lamps ? 1.4 : 0.0;
    o.material.needsUpdate = true;
    // optional: add a cheap warm pointLight at the prop for a glow pool at night
  }
});
```

Warm pools of lamp light are what make a **cosy night**: and, with the Holiday Kit props, a
cosy *winter*.

### 7.3 Calmer at night + the wind-down nudge

- **Dial down stimulation in the evening/night:** fewer particles, slower animation, softer
  music. (Also honour `prefers-reduced-motion`, §8.)
- **Wind-down nudge:** in a parent-set quiet window (default ~8-9pm onward), have **Sam** give
  a gentle, non-guilt cue (*"It's getting late) let's pick this up tomorrow 🌙"*: and offer
  an easy stop. Nudging away from screens near bedtime is the strongest kid-sleep win; the
  warm/dim visuals support it.
- **Controls:** auto by device clock, with a **manual override**, respect for the **OS
  dark-mode** setting, and a **parent lock** (e.g., force night/quiet after a set hour). Never
  tie streaks or rewards to night-time play.

> **Honest framing for the team:** lead with "calmer evening + bedtime cue," not "blocks
> harmful blue light." Kids are more light-sensitive in the evening, so dimming plausibly
> helps: but 2024-25 research finds blue-blocking often doesn't change melatonin (though it
> may advance sleep and reduce next-day irritability). Warmth + dimming + winding down are the
> real, modest benefits.

---

## 8. Performance & accessibility (don't skip)

- **Counts by tier:** rain 400-800, snow 300-600, leaves 80-150, petals ≤180. Detect a
  low/high tier (e.g., from `gl.capabilities`, device memory, or a quick FPS probe) and scale.
- Cap `dpr` (e.g., `<Canvas dpr={[1, 1.75]}>`); particles use `depthWrite:false`.
- **Pause when hidden:** stop the `useFrame` updates on `document.hidden`.
- **`prefers-reduced-motion`:** if set, **disable particles entirely** and keep only the
  static seasonal recolour + sky/fog. (Also offer an in-app "reduce effects" toggle: good for
  the youngest players.)
- Only one emitter mounted at a time; reuse geometry/material; avoid per-frame allocations
  (the samples above mutate in place).

---

## 9. Suggested phasing (low-risk first)

- **Phase A: Static seasons (no particles):** create the 5 colormap variants; add the
  `SEASONS` config + `SeasonEnvironment` (sky, fog, lights, colormap swap); drop the **Holiday
  Kit** props into the winter region (§2); drive season from the current chapter. This alone
  makes all 5 chapters look distinct. *Lowest risk.*
- **Phase B: Weather:** add `Rain`, `Snow`, `FallingLeaves` (+ optional `petals`) via the
  `Weather` switcher.
- **Phase C: Day/Night:** add the `timeOfDay` modifier (§7), lamp / Holiday-prop emissives,
  the moon + stars at night, and the parent-set evening wind-down nudge.
- **Phase D: Polish:** crossfade transitions at boundaries, perf tiers, reduced-motion,
  optional sounds/ripples, per-leaf colour variety.

---

## 10. Asset & build checklist

- [ ] 5 colormap PNG variants (`summer/rainy/autumn/winter/spring`), same size, **uncompressed / high-quality**, in `/public/textures/` (or repo convention).
- [ ] (Optional) leaf + blossom-petal alpha textures in `/public/textures/`.
- [ ] **Kenney Holiday Kit** GLBs for the winter region (warm props: snow-covered trees, snow fort, cabin, lanterns, string lights, fires, gifts).
- [ ] `seasons.js` config, `SeasonEnvironment`, `Rain`, `Snow`, `FallingLeaves`, `Weather`, `useSeasonTransition`.
- [ ] `timeOfDay.js` (PHASES + `phaseForHour`); lamp / Holiday-prop emissive toggling; a `<Moon/>` + stars for night.
- [ ] Day/night controls: auto-by-clock + manual override + OS dark-mode + parent lock; the evening **wind-down nudge** (parent-set quiet window).
- [ ] Season derived from the **master node table** `chapter` field.
- [ ] Verify on a low-end mobile profile; verify `prefers-reduced-motion` path.
- [ ] Confirm the single path is unchanged (no new maps/scenes).

---

## Sources

- Kenney: **Platformer Kit** (3D, CC0, 150 assets, "Variation(s)"): https://kenney.nl/assets/platformer-kit
- Kenney (**Holiday Kit** (3D, CC0, ~100 low-poly models) trees, snow fort, cabin, lanterns, lights, gifts; warm winter props): https://kenney.nl/assets/holiday-kit
- Kenney: **How colours work in Kenney & KayKit 3D models** (shared colormap palette; variations swap palette colours; *Hexagon Kit uses this for seasons*): https://mastodon.gamedev.place/@kenney/112153581016142577
- Kenney: **Importing 3D models into game engines** (don't compress the atlas; use High Quality; GLB recommended for web): https://kenney.nl/knowledge-base/game-assets-3d/importing-3d-models-into-game-engines
- Codrops: **Creating an Immersive 3D Weather Visualization with React Three Fiber** (rain/snow via instancing in R3F): https://tympanus.net/codrops/2025/09/18/creating-an-immersive-3d-weather-visualization-with-react-three-fiber/
- React Three Fiber docs: https://docs.pmnd.rs/react-three-fiber
- Wawa Sensei: **R3F particles lesson** (snow/rain particle patterns): https://wawasensei.dev/courses/react-three-fiber/lessons/particles

**Day/night & evening use (kids):**

- Sleep Foundation: **How blue light affects kids' sleep** (children are more light-sensitive in the evening): https://www.sleepfoundation.org/children-and-sleep/how-blue-light-affects-kids-sleep
- 2024-25 study: **blue-light-blocking glasses advanced sleep phase & reduced next-day irritability, but did *not* change melatonin**: https://pmc.ncbi.nlm.nih.gov/articles/PMC12574898/
- **Sleep-friendly screen-behaviour recommendations** (reducing evening screen use near bedtime is the clearer win): https://pmc.ncbi.nlm.nih.gov/articles/PMC5839336/
