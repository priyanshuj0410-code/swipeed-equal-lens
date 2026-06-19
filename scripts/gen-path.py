#!/usr/bin/env python3
"""Generate src/content/path.ts from the Master Node Table spreadsheet.

Source of truth: scripts/master-node-table.xlsx (sheet "Master Node Table").
Edit the spreadsheet, then rerun:  python3 scripts/gen-path.py
Requires: openpyxl  (pip install openpyxl)

Phase 0 mapping decisions (see the path PR):
  - All 41 nodes are emitted, in `order`, grouped into 5 chapters.
  - `game` (+ `href`) is set ONLY for the 12 already-built games; everything else
    has no game and renders as the disabled "not built / soon" treatment.
  - prereq/buildsOn/topics/ageGate are carried through but NOT used for gating yet.
"""
import json, os, sys
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
XLSX = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "master-node-table.xlsx")
OUT = os.path.join(HERE, "..", "src", "content", "path.ts")

# table node_id -> the dispatch id the app already knows (engine-host id, or glrl/mythbuster)
GAME = {
    "g01": "feelings", "g02": "my-body", "g03": "family-garden",
    "c1": "capstone-1", "c2": "capstone-2", "c3": "capstone-3", "c4": "capstone-4",
    "g04": "same-same", "g05": "can-do", "g06": "body-lab", "g07": "what-makes-me", "g08": "safety-squad", "g09": "friend-frenemy", "g10": "fair-play", "g11": "not-funny", "g12": "smart-screen",
    "g13": "puberty-quest", "g14": "amazing-journey", "g15": "boundary-bot", "g16": "crossroads", "g20": "defenders",
    "g21": "body-confident", "g22": "plan-it", "g23": "outbreak", "g26": "equalize", "g28": "reality-check",
    "g17": "flip-script", "g18": "norm-storm", "g19": "speak-up", "g24": "glrl", "g25": "mythbuster",
    "g29": "my-choices", "g30": "status-know-it", "g31": "mutual", "g32": "spectrum",
    "g27": "stand-up", "g33": "lead-the-way", "g34": "change-makers", "g35": "justice-league",
}

def href_for(game):
    if game == "glrl": return "/decks"
    if game == "mythbuster": return "/play/mythbuster"
    return f"/game/{game}"

# one fitting emoji per node (we pick these; the table has no emoji column)
EMOJI = {
    "g01": "😊", "g02": "🛡️", "g03": "🏡", "g04": "🧒", "g05": "🦸", "c1": "🏆",
    "g06": "🧪", "g07": "🪞", "g08": "🦺", "g09": "🤝", "g10": "⚖️", "g11": "🙅", "g12": "📱", "c2": "🏆",
    "g13": "🌱", "g14": "🧬", "g15": "🤖", "g16": "🔀", "g17": "🎬", "g18": "🌪️", "g19": "📣", "g20": "🦠", "c3": "🏆",
    "g21": "💪", "g22": "🗓️", "g23": "🧫", "g24": "🚦", "g25": "💡", "g26": "🟰", "g27": "✊", "g28": "🔍", "c4": "🏆",
    "g29": "🧭", "g30": "🩺", "g31": "💚", "g32": "🌈", "g33": "💼", "g34": "🌍", "g35": "🏛️", "g36": "🔓", "c5": "🏆",
}

CHAPTER_SUBTITLE = {
    "Ch.1 · Ages 3–6": "Everyone is equal & can-do",
    "Ch.2 · Ages 6–9": "Fair is fair",
    "Ch.3 · Ages 9–12": "Question the script",
    "Ch.4 · Ages 12–15": "Equality in practice",
    "Ch.5 · Ages 15–18": "Change the system",
}

def clean(v):
    if v is None: return None
    s = str(v).strip()
    return None if s in ("", "—", "-") else s

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb["Master Node Table"]
rows = [r for r in ws.iter_rows(values_only=True)]
hidx = next(i for i, r in enumerate(rows)
            if r and any(str(c).strip().lower() == "order" for c in r if c)
            and any(str(c).strip().lower() == "node_id" for c in r if c))
hdr = [str(h).strip() if h is not None else f"col{j}" for j, h in enumerate(rows[hidx])]

def col(d, *names):
    for n in names:
        if n in d: return d[n]
    return None

nodes = []
for r in rows[hidx + 1:]:
    if r is None or all(c is None for c in r): continue
    d = {hdr[j]: r[j] for j in range(min(len(hdr), len(r)))}
    if clean(col(d, "order")) is None: continue
    nid = clean(col(d, "node_id"))
    game = GAME.get(nid)
    topics_raw = clean(col(d, "topics (UNESCO)", "topics")) or ""
    topics = [t.strip() for t in topics_raw.replace(";", ",").split(",") if t.strip()]
    nodes.append({
        "order": int(col(d, "order")),
        "id": nid,
        "label": clean(col(d, "node_label")),
        "type": "capstone" if (clean(col(d, "node_type")) or "").lower() == "capstone" else "lesson",
        "chapter": clean(col(d, "chapter")),
        "ageGate": int(col(d, "age_gate")),
        "thread": clean(col(d, "thread")),
        "threadName": clean(col(d, "thread_name")),
        "hex": clean(col(d, "hex")),
        "topics": topics,
        "prereq": clean(col(d, "prerequisite")),
        "buildsOn": clean(col(d, "builds_on")),
        "note": clean(col(d, "note")),
        "emoji": EMOJI.get(nid, "•"),
        "game": game,
        "href": href_for(game) if game else None,
    })

nodes.sort(key=lambda n: n["order"])

# chapters in first-seen order
chapters = []
seen = {}
for n in nodes:
    ch = n["chapter"]
    if ch not in seen:
        seen[ch] = {"key": ch, "title": ch, "subtitle": CHAPTER_SUBTITLE.get(ch, ""),
                    "ageGate": n["ageGate"], "startOrder": n["order"], "endOrder": n["order"]}
        chapters.append(seen[ch])
    seen[ch]["endOrder"] = n["order"]

def js(v):
    return json.dumps(v, ensure_ascii=False)

def node_line(n):
    keys = ["order","id","label","type","chapter","ageGate","thread","threadName","hex","topics","prereq","buildsOn","note","emoji","game","href"]
    parts = []
    for k in keys:
        v = n[k]
        if v is None: continue
        parts.append(f"{k}: {js(v)}")
    return "  { " + ", ".join(parts) + " },"

lines = []
lines.append("// AUTO-GENERATED from scripts/master-node-table.xlsx by scripts/gen-path.py — do not edit by hand.")
lines.append("// Edit the spreadsheet and rerun the generator. Phase 0: order + thread colour + chapter")
lines.append("// regions; built games are playable, the rest render disabled ('not built'). No gates yet.")
lines.append("")
lines.append('export type NodeType = "lesson" | "capstone";')
lines.append('export type ThreadKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "★";')
lines.append("")
lines.append("export type GameNode = {")
lines.append("  order: number;")
lines.append("  id: string; // stable table id (g01…/c1…)")
lines.append("  label: string;")
lines.append("  type: NodeType;")
lines.append("  chapter: string;")
lines.append("  ageGate: number; // 3/6/9/12/15 — carried for later phases, NOT gated yet")
lines.append("  thread: ThreadKey;")
lines.append("  threadName: string;")
lines.append("  hex: string; // bubble tint (one colour per thread)")
lines.append("  topics: string[];")
lines.append("  prereq?: string; // linear predecessor — carried, NOT gated yet")
lines.append("  buildsOn?: string; // spiral reference — analytics/callbacks only")
lines.append("  note?: string;")
lines.append("  emoji: string;")
lines.append("  game?: string; // dispatch id for a built game; absent => not built (disabled)")
lines.append("  href?: string; // navigation target (classic view / fallback)")
lines.append("};")
lines.append("")
lines.append("export const NODES: GameNode[] = [")
lines += [node_line(n) for n in nodes]
lines.append("];")
lines.append("")
lines.append("export type Chapter = { key: string; title: string; subtitle: string; ageGate: number; startOrder: number; endOrder: number };")
lines.append("export const CHAPTERS: Chapter[] = [")
for c in chapters:
    lines.append("  { " + ", ".join(f"{k}: {js(c[k])}" for k in ["key","title","subtitle","ageGate","startOrder","endOrder"]) + " },")
lines.append("];")
lines.append("")
lines.append("// ---- backward-compat shape for the classic 2D view (src/components/learning-path.tsx) ----")
lines.append('export type PathStatus = "active" | "locked";')
lines.append("export type PathNode = { id: string; title: string; emoji: string; kind: string; status: PathStatus; href?: string; tag?: \"gender\" };")
lines.append("export type PathSection = { title: string; subtitle: string; nodes: PathNode[] };")
lines.append("export const PATH: PathSection[] = CHAPTERS.map((ch) => ({")
lines.append("  title: ch.title,")
lines.append("  subtitle: ch.subtitle,")
lines.append("  nodes: NODES.filter((n) => n.chapter === ch.key).map((n) => ({")
lines.append("    id: n.game ?? n.id,")
lines.append("    title: n.label,")
lines.append("    emoji: n.emoji,")
lines.append("    kind: n.threadName,")
lines.append('    status: (n.game ? "active" : "locked") as PathStatus,')
lines.append("    href: n.href,")
lines.append('    tag: n.thread === "E" ? ("gender" as const) : undefined,')
lines.append("  })),")
lines.append("}));")
lines.append("")

out = "\n".join(lines)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as f:
    f.write(out)
print(f"Wrote {OUT}: {len(nodes)} nodes, {len(chapters)} chapters, {sum(1 for n in nodes if n['game'])} built/playable.")
