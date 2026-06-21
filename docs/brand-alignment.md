# SwipeEd × The Equal Lens — Brand-Alignment Design-of-Record

> **This repo is the isolated re-skin.** It is a clone of the live SwipeEd game (`/Users/priyanshu/swipeed`),
> set up so the brand re-skin can be built **without touching the live game**. The clone's git remote was
> renamed `origin` → `upstream`, so nothing here can accidentally push to live SwipeEd. When a phase is
> proven, it can be cherry-picked / merged back upstream deliberately.
>
> Source brand spec: *The Equal Lens — Brand & Product Guidelines v2.1* (June 2026).
> Companion inventory: the live repo's `knowledge/games/world-art-tokens.md` (every artefact that defines
> the world's look). Scoping only at this stage — see the build order for what ships when.

## 1. The idea (why this is mostly execution, not invention)
SwipeEd is **already The Equal Lens in concept** — the brand thesis *is* our pedagogy:
- **"Unlearn. Relearn. Grow."** = our `swipeed-core-principle`. ✅
- **UN (eraser) + RE (pencil)**, traits Aware/Curious/Brave + Empathy/Creative/Hopeful = our `un-re.tsx`
  (already an eraser + pencil). ✅
- *"Bias is learned, so it can be unlearned" through play* = our whole catalogue. ✅
- The brand even states **"Tokens live in `src/app/globals.css`"** and references `/public/` art — it was
  written for this stack.

So the gap is **visual execution + the mascot**, not concept.

## 2. Decisions taken
- **Mascot — re-skin Sam toward Lensy (not replace).** Keep Sam's role (the companion who *grows up with
  the player*, small → grown), but **redraw Sam in Lensy's visual language**: purple alien, **eyes built
  from the eQ mark**, sticker outline, childlike proportions. Same family as Lensy without being literally
  Lensy. UN & RE restyle to **Insight-teal (UN) / Grow-coral (RE)** character forms.
- **Aesthetic — full sticker re-skin.** Replace **glassmorphism** with the brand's **sticker/cut-out**
  surface language (chunky Ink outline + hard offset shadow, flat fills), the **doodle set**, and
  **dotted-paper** texture, across all games. The 3D world is **kept and tinted** to the brand palette (the
  sticker language is the 2D/UI layer; the world adopts brand colour + the Lensy-family companion).

## 3. The token map (Phase 1 — the foundation)
Brand ships as **named CSS tokens** in `src/app/globals.css`; dark values under `[data-audience="adult"]`.
Re-map our tokens to the brand's exact names + hexes, **keeping back-compat aliases** so existing component
classes keep working during the transition.

| Brand token | Light (Kids) | Dark (Adult) | Role | Replaces (current) |
|---|---|---|---|---|
| `--color-brand` | `#553286` | `#C9B8E6` | Primary violet | `--brand-500` / `--primary` |
| `--color-brandsoft` | `#7F65A4` | `#B3A4D6` | Muted violet | — |
| `--color-paper` | `#FBF9FF` | `#15101F` | Page background | `--background` / `--app-bg` |
| `--color-surface` | `#FFFFFF` | `#221A30` | Cards / notes | `--card` |
| `--color-mist` | `#E7E0F1` | `#3A2E4D` | Lines / hover | `--border` / hover |
| `--color-ink` | `#221436` | `#F1ECFA` | Text & outlines | `--foreground` |
| `--color-band` | `#553286` | `#241B38` | Footer / CTA band | — |
| `--dot` | `#ECE6F6` | `#2A2140` | Dotted-paper texture | — |
| `--color-insight` | `#2DD4BF` | (same) | Teal · **Unlearn** | `--flag-green` (see §6) |
| `--color-grow` | `#FF7A5C` | (same) | Coral · **Relearn** | `--flag-red` (see §6) |
| `--color-sun` | `#FFC94D` | (same) | Yellow · **CTA / highlight** | `--accent-amber` / `--flame` |
| `--color-sky` | `#4FB0E8` | (same) | Blue · support | — (new) |
| Violet scale | `50 #F3F0F6 … 600 #553286 … 900 #221436` | — | tints/shades | — |

**Type:** **Baloo 2** → `--font-hand` (headlines, mascots, Lensy speech; 600/700/800) · **Poppins** →
`--font-display` (wordmark + UI labels; 500/600) · **Nunito Sans** → `--font-body` (400/600/700). All free
on Google Fonts. *(Today: Fredoka display + Nunito body — swap Fredoka→Baloo 2, add Poppins, Nunito→Nunito
Sans.)*

**Dark theme:** move from the `.dark` class to **`[data-audience="adult"]`** (brand mechanism). Sun CTA
keeps **Deep-Indigo/Ink text** in both themes; sticky notes stay pastel with fixed dark text so the "paper"
metaphor survives; theme changes cross-fade **320ms**.

## 4. The sticker UI kit (Phase 2)
- **Sticker surface:** chunky **2.5px `--color-ink` outline** + a **hard offset shadow (4px 4px, no blur)**
  + flat `--color-surface` fill. Cards, buttons, notes share this cut-out look. The outline uses the Ink
  token, so it **flips with the theme**. → re-skin our shared `.glass-card` / `.glass-pill` (every game
  routes through these two classes, so this flips the whole app centrally), then sweep inline glass styles.
- **CTA:** Sun yellow fill + Ink text.
- **Doodle set:** 8 hand-drawn marks (squiggle, sparkle, arrow, heart, star, spiral, zigzag, swirl) in
  accent colours — **easter-egg texture, never functional icons**.
- **Dotted-paper** background via `--dot`.

## 5. Motion tokens (Phase 3)
`anim-float` (9px rise/fall, 5s · doodles/hero) · `anim-wobble` (±4°, 4.5s · stars/badges) · `anim-bob`
(bob+tilt, 5.5s · mascots) · `anim-pop` (spring scale-in, 0.5s · notes & Lensy appearing) · `hover-pop`
(lift + 1.5° tilt · cards/buttons). 320ms theme cross-fade. **All disabled under `prefers-reduced-motion`**
(we already honour it) — motion is seasoning, never load-bearing.

## 6. Open decisions (settle before Phases 4–6)
1. **GLRL green/red flags** — keep as **gameplay-semantic** (healthy/unhealthy), or fold into
   Insight-teal / Grow-coral? *Recommend: keep semantic; just ensure they harmonise.* (Brand's teal/coral
   carry the Unlearn/Relearn meaning, which is a *different* axis from GLRL's flag judgement.)
2. **Thread colours (7: A–G)** — keep as a distinct functional taxonomy, or re-tune into the 4-accent brand
   family? *Recommend: keep, re-tuned to sit in-family with the violet.*
3. **Product naming** — "SwipeEd", "The Equal Lens", or *SwipeEd by The Equal Lens*? Drives the wordmark,
   app icon, and browser-tab title.
4. **Adult/dark mode** — the game is ages 3–18 (all "Kids mode"); the brand's Adult-dark + "How do you
   identify today?" modal reads as **website scope**. *Recommend: the game stays Kids-light by default and
   only adopts the `[data-audience]` **mechanism**; full Adult mode is the marketing site, not the game.*
5. **3D world** — confirmed **kept + tinted**, not flattened.

## 7. Build order (phased; one branch per phase in THIS repo)
| Phase | Scope | Effort |
|---|---|---|
| **0 — design-of-record** *(this doc)* | the map, decisions, token spec, build order | 🟢 done |
| **1 — token + type foundation** | re-map `globals.css` to brand tokens (back-compat aliases) + fonts (Baloo 2 / Poppins / Nunito Sans) + `[data-audience]` dark | ✅ **shipped** |
| **2 — sticker UI kit** | redefine `.glass-card`/`.glass-pill` as sticker surfaces + dotted paper; sweep glass text/CTA/pip colours | ✅ **shipped** (doodle set + CTA cut-out outline deferred to a polish pass) |
| **3 — motion tokens** | `anim-*` + `hover-pop` + 320ms cross-fade | ✅ **shipped** (Sam→`anim-bob`, pills→`hover-pop`; `anim-float/wobble/pop` available, wired broadly with doodles/Lensy later) |
| **4 — logo / icon / wordmark** | eQ mark; app icon = Lensy face; lockup; `manifest.ts`, icons, splash | 🟡 med + naming call |
| **5 — Sam → Lensy-family (2D)** | redraw `sam.tsx` (purple, eQ-mark eyes, sticker), keep "grows with you"; UN&RE → teal/coral character forms | 🔴 med-high (art) |
| **6 — 3D world to brand** | retune `seasons.ts` + colormap atlases + thread colours to the violet+accent family; swap path companion (`character-female-c.glb`) for a Lensy-family model (+ optional Lensy spaceship beat) | 🔴 high (art/model) |

**Cheapest, do-first:** Phase 1 (central, low-risk, makes the whole app *read* as Equal Lens at once).
**Expensive tail:** Phases 5–6 (Sam art + the 3D model swap).

## 8. How this rejoins live SwipeEd
Each phase is a branch here; when proven (build clean + visually right), it's cherry-picked or merged
**upstream** into the live repo deliberately, phase by phase — so the live game only changes when a phase is
ready. Nothing here auto-propagates. Keep the live repo's `knowledge/` KB updated when a phase lands
upstream (per `AGENTS.md`).
