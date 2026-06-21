# SwipeEd — Developer Hand-off (Claude Code)

*For the game-dev build chat · Updated June 2026 · companion to "SwipeEd — Seasons Implementation (Claude Code)"*

---

## 0. TL;DR — the project is now a lifelong journey

1. **SwipeEd is one product, ages 3 → parenthood.** It now spans **8 chapters: 69 games + 8 capstones = 77 nodes.** Kids' journey (Ch.1–5, ages 3–18) + adult journey (Ch.6–8: College, Building a Life, Parenthood + the Parent Layer).
2. **Re-import the Master Node Table** — it is the single source of truth (77 nodes; `order` + `prerequisite` re-sequenced; `gating` column). Pull node data from it; don't hand-edit in code.
3. **Every game node has a GDD** — `GDD 01`–`GDD 69` (Word). Capstones (c1–c8) have no GDD (they're milestones).
4. **Build the Life-Skills Toolkit + wellbeing shell** — the one cross-cutting system still to build (see §6).
5. **The Parent Layer ("SwipeEd Raising")** is a *mode within the one product* that any parent can open (see §5).
6. **Confirm the world↔game integration model** (still open — §7).
7. **Don't build yet:** co-play mechanics, and content for ages 0–2 / 18+ (§7).

---

## 1. Source-of-truth files

| File | Status | Use it for |
|---|---|---|
| `SwipeEd - Master Node Table.xlsx` | **UPDATED — 77 nodes** | The path data (Ch.1–8). **Re-import.** |
| `Comprehensive Sexuality Education - Topic Map (Ages 3-18).xlsx` | current | The kids' curriculum (UNESCO-8, gating). |
| `SwipeEd - The Adult Journey (18+).docx` | **NEW** | The design rationale for Ch.6–8 + the Parent Layer + decisions. |
| `SwipeEd - Life-Skills Toolkit (Thread C Spine).docx` | current | Spec for the Toolkit + wellbeing-shell system (§6). |
| `SwipeEd - Seasons Implementation (Claude Code).md` | current | Seasons, weather FX, day/night wind-down (Ch.1–5). |
| `GDD 01`–`GDD 69` (Word) | **complete** | Per-game content/specs for all 69 game nodes. |
| `SwipeEd - Project Summary.docx` | reference | Whole-project overview & rationale. |

---

## 2. The full structure (8 chapters)

| Chapter | Ages / trigger | Nodes | Count | Season / world |
|---|---|---|---|---|
| 1 | 3–6 | g01–g05, g37, c1 | 7 | Summer |
| 2 | 6–9 | g06–g12, g41, c2 | 9 | Rainy |
| 3 | 9–12 | g13–g20, g38, c3 | 10 | Autumn |
| 4 | 12–15 | g21–g28, g39, g40, g43, c4 | 12 | Winter (+ Holiday Kit) |
| 5 | 15–18 | g29–g36, g42, c5 | 10 | Spring |
| 6 | 18–22 (College) | g44–g52, c6 | 10 | adult — world widens (TBD) |
| 7 | 22 → first child | g53–g60, c7 | 9 | adult (TBD) |
| 8 | first child on (Parenthood) | g61–g69, c8 | 10 | adult (TBD) |

*Exact `order` is in the Master Node Table — always read it there. node_ids are out of play-order in places (e.g., g37 plays 3rd); the `order` column is the true sequence.*

---

## 3. The adult journey (Ch.6–8) — what's new

Three new chapters continue the same product and the same linear chain. **Adult adaptations** (vs the kids' chapters):

- **Life-stage-triggered, not age-gated.** Adults advance by life events (start college, partner up, decide on a baby, have a child), in any order — surface content just-in-time, not as a strict linear lock.
- **`gating = "Open"`** on adult lesson nodes = adult, comprehensive, **not** school-comfort-gated. (Capstones = `—`.)
- **Sam is grown** (adult peer; fully grown in the Parent Layer). UN & RE continue.
- **Both games and tools** — adult nodes lean more on tools / just-in-time references / scenarios than swipe-games (but keep the SwipeEd feel). *This game-and-tool duality also applies to the kids' journey.*

**Ch.6 College (18–22):** g44 Consent, For Real (B) · g45 Swipe Right? (D) · g46 Real Relationships (D) · g47 Own Your Health (F) · g48 Money & Independence (C) · g49 Mind & Belonging (C) · g52 Find Your Feet (C) · g50 Equal & Confident (E) · g51 Know Your Rights, Adult (G) · c6.

**Ch.7 Building a Life (22 → first child):** g53 Choosing & Building (D) · g54 Your Path, Your Call (D/E) · g55 Equal Partners (E) · g56 Respect at Home (B) · g57 The Family Map (D) · g58 Money, Together (C) · g59 If, When & Whether (F) · g60 Many Ways to Family (F/D) · c7.

**Ch.8 Parenthood + Parent Layer (first child on):** g61 Us, After Kids (D) · g62 Equal Parents (E) · g63 Looking After You (C) · **Parent Layer →** g64 The Talks, Age by Age (F) · g65 Break the Cycle (C) · g66 Raising Gender-Diverse Kids (E) · g67 Raising Neurodiverse Kids (C) · g68 Navigating Addictions (B) · g69 Be the Safe Adult (B) · c8.

---

## 4. Build rules (unchanged but now span 8 chapters)

- **`node_id` is the stable identity** (g01–g69, c1–c8) — key all save-data, routes and assets on it, **never on `order`** (order shifts as nodes are added).
- **`prerequisite`** = the previous node — the linear unlock chain (re-read it wholesale on import; it now runs c5 → g44 … → c8).
- **`builds_on`** = spiral callbacks (non-blocking) — several reach back across the whole life (e.g., g64 The Talks → g02 My Body, My Rules; g69 Be the Safe Adult → g08 Safety Squad).
- **`gating`** values: `Core` (always on) · `Gated` (school-comfort toggle, kids' sensitive nodes) · `Sensitive` (gate + disable-able: Mutual, Spectrum) · `Open` (adult, ungated) · `—` (capstone).
- **Thread → colour:** A `#0EA5E9` · B `#DC2626` · C `#F59E0B` · D `#EC4899` · E `#7C3AED` · F `#059669` · G `#475569` · Capstone ★ `#EAB308`. (Dual-thread adult nodes like g54 D/E and g60 F/D take one node colour — see the table.)

---

## 5. The Parent Layer ("SwipeEd Raising")

Ch.8 has two halves. **g61–g63** = the parent's own continuing journey (partnership after kids, equal co-parenting, parental wellbeing). **g64–g69** = the **Parent Layer**, a mode any parent can open — including a parent new to SwipeEd — to guide their child *and* grow as a parent:

- **g64 The Talks (Age by Age)** — RSE guidance mapped to the child's own SwipeEd chapters (a parent dips in as the child grows; mirrors g02 → g36).
- **g65–g69 positive parenting** — break the cycle / generational trauma (g65), raising gender-diverse (g66) & neurodiverse (g67) kids, navigating addictions (g68), being the safe adult / safeguarding & POCSO (g69).

It's **life-stage-triggered** (surfaces by the child's age), and it closes the generational loop: a parent guided here is the trusted adult the kids' journey assumes from g02 onward.

---

## 6. NEW SYSTEM to build — Life-Skills Toolkit + wellbeing shell

Full spec: `SwipeEd - Life-Skills Toolkit (Thread C Spine).docx`. Summary:

- A **persistent on-device Toolkit** of four tools — **Cool-Down · Decision Steps · Talk-It-Out · Help Map** — that unlock/level as the Thread-C games are played (g01 → g41 → g38 → g39 → g42, and onward into the adult chapters).
- **Two surfaces:** a Toolkit drawer (open any tool anywhere) + **"tool-moment" hooks** injected into other games at key beats (start with Firewall, Mutual, Green Light/Red Light, Stand Up).
- **Wellbeing app-shell:** optional mood check-in, an always-available breathing space, **kind (non-shaming) streaks**, calm mode, and the existing day/night wind-down.
- **Guardrails:** healthy-coping-only library (no pain/shock/restriction can be authored in); crisis → help routing (Childline 1098, Tele-MANAS 14416, KIRAN 1800-599-0019, cybercrime 1930); on-device, never identity-linked (DPDP).

---

## 7. Open decisions & not-yet

- **World↔game integration — please confirm.** How the 3D seasonal world and the (mostly 2D) games/tools join, and what the adult chapters' world looks like (the seasons run out at Ch.5 — Ch.6–8 need a visual treatment; "the world widens" is a candidate). Document the call.
- **Naming — confirm or swap.** One brand (SwipeEd) across the whole life; Parent-Layer working name **"SwipeEd Raising"** (alt "Co-Pilot").
- **Do NOT build yet:** co-play mechanics (partners using Ch.7/8 together; parent-and-child co-playing the young games — an app-wide layer for later), and content for **ages 0–2 and 18+** (out of scope for now).
- **Capstones (c1–c8)** don't yet have detailed specs of their own (they sit in the table as milestones).

---

## 8. Build checklist

- [ ] Re-import the Master Node Table → app path data (**77 nodes, Ch.1–8**).
- [ ] Key all save-data / routes / assets on **`node_id`**, not `order`.
- [ ] Add the adult chapters (Ch.6–8) with **life-stage triggers**, `Open` gating, Sam-grown, games+tools.
- [ ] Implement the `gating` values incl. `Open` (adult) and `—` (capstone).
- [ ] Build the **Life-Skills Toolkit** + tool-moment hooks + **wellbeing shell**.
- [ ] Stand up the **Parent Layer** as a mode (g64–g69), life-stage-triggered, openable by any parent.
- [ ] Wire content from **GDD 01–69**.
- [ ] Confirm & document the **world↔game integration** (incl. adult-chapter visuals).
- [ ] Leave hooks for **co-play** and **0–2 / 18+**; don't build yet.

---

*Single source of truth is always the Master Node Table — re-import the full set; this hand-off summarises, it doesn't replace it.*
