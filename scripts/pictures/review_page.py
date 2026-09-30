#!/usr/bin/env python3
"""review_page.py: build the owner's review page for a FLUX style test (SWED-91).

  <mflux python> review_page.py <test dir> [notes.json]            round one: two styles side by side
  <mflux python> review_page.py <test dir> [notes.json] --round 2  round two: the shaded style beside round one's Lensy style

Reads <test dir>/text-style and <test dir>/lensy-style (from flux_batch.py), writes <test dir>/review/index.html and
review/pics/<style>/<id>.png (cut-outs at 360px). notes.json maps "<style>-<id>" to the reviewer's note on that picture.
The page stores the owner's verdicts in the artifact's db: collection "verdicts" (doc "<style>-<id>": verdict ok or
redo, and a note) and doc "decision/style" (choice text, lensy or neither, and a note). Round two keeps those and adds collection "verdicts-r2" (doc "<id>")
and doc "decision/look" (choice yes, more, less or other, and a note), with notes.json keyed "shaded-<id>".
"""
import html
import json
import os
import sys

from PIL import Image

STYLES = [("text", "Text style", "text-style", "Drawn from a written style description only."),
          ("lensy", "Lensy style", "lensy-style", "Drawn with Lensy's waving picture as a style reference.")]


def main():
    args = [a for a in sys.argv[1:] if a not in ("--round", "2")]
    if "--round" in sys.argv:
        return round_two(args[0], json.load(open(args[1])) if len(args) > 1 else {})
    d = sys.argv[1]
    notes = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
    out = os.path.join(d, "review")
    concepts, meta = [], {}
    for key, label, folder, how in STYLES:
        log = json.load(open(os.path.join(d, folder, "log.json")))
        meta[key] = {"label": label, "how": how, "seconds": round(sum(p["seconds"] for p in log["pictures"]) / max(1, len(log["pictures"])))}
        os.makedirs(os.path.join(out, "pics", key), exist_ok=True)
        for p in log["pictures"]:
            im = Image.open(os.path.join(d, folder, f"{p['id']}-cut.png"))
            im.thumbnail((360, 360))
            im.save(os.path.join(out, "pics", key, f"{p['id']}.png"), optimize=True)
    order = [p["id"] for p in json.load(open(os.path.join(d, "text-style", "log.json")))["pictures"]]
    words = {p["id"]: p["word"] for p in json.load(open(os.path.join(d, "text-style", "log.json")))["pictures"]}
    for cid in order:
        concepts.append({"id": cid, "word": words[cid], "notes": {k: notes.get(f"{k}-{cid}", "") for k, *_ in STYLES}})
    data = {"styles": [{"key": k, "label": l, "how": meta[k]["how"], "seconds": meta[k]["seconds"]} for k, l, *_ in STYLES],
            "concepts": concepts}
    page = TEMPLATE.replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    open(os.path.join(out, "index.html"), "w", encoding="utf8").write(page)
    print(os.path.join(out, "index.html"), len(concepts), "concepts")


TEMPLATE = r"""<title>Feelings Friends Picture Test</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&family=Poppins:wght@600;700&display=swap">
<style>
:root {
  --paper: #FBF9FF; --surface: #FFFFFF; --ink: #221436; --muted: #5E5470; --line: #DCD3EA;
  --violet: #553286; --violet-deep: #42266B; --tint: #F1EBFA; --pic: #FFFFFF;
  --ok: #1F7A4D; --ok-tint: #E3F4EA; --redo: #A33A2B; --redo-tint: #FBE7E3;
  --display: "Poppins", ui-sans-serif, system-ui, sans-serif; --body: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --paper: #16101F; --surface: #211930; --ink: #F3EEFB; --muted: #B9AECB; --line: #3A2F4D;
  --violet: #C4A8F0; --violet-deep: #E0D1F8; --tint: #2B2140; --pic: #FFFFFF;
  --ok: #7ED4A5; --ok-tint: #1D3328; --redo: #F2A193; --redo-tint: #3A221E; } }
:root[data-theme="dark"] {
  --paper: #16101F; --surface: #211930; --ink: #F3EEFB; --muted: #B9AECB; --line: #3A2F4D;
  --violet: #C4A8F0; --violet-deep: #E0D1F8; --tint: #2B2140; --pic: #FFFFFF;
  --ok: #7ED4A5; --ok-tint: #1D3328; --redo: #F2A193; --redo-tint: #3A221E; }
* { box-sizing: border-box; }
body { background: var(--paper); color: var(--ink); font: 16px/1.55 var(--body); }
.wrap { max-width: 1180px; margin: 0 auto; padding: 36px 24px 96px; display: grid; gap: 36px; }
h1 { margin: 0 0 10px; font: 700 clamp(28px, 4vw, 38px)/1.12 var(--display); text-wrap: balance; }
h2 { margin: 0 0 6px; font: 700 22px/1.2 var(--display); }
p { margin: 0; max-width: 68ch; }
.lede { color: var(--muted); font-size: 17px; }
.eyebrow { font: 800 12px/1 var(--body); letter-spacing: .08em; text-transform: uppercase; color: var(--violet); margin-bottom: 8px; }
.asks { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-top: 18px; }
.ask { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; }
.ask b { display: block; font-weight: 800; }
.ask span { color: var(--muted); font-size: 14px; }
.status { font-size: 14px; color: var(--muted); min-height: 1.4em; }
.status.warn { color: var(--redo); }
.styles { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-top: 14px; }
.choice { background: var(--surface); border: 2px solid var(--line); border-radius: 18px; padding: 16px; cursor: pointer; display: grid; gap: 10px; text-align: left; color: inherit; font: inherit; }
.choice[aria-pressed="true"] { border-color: var(--violet); box-shadow: 0 0 0 3px var(--tint); }
.choice:focus-visible, button:focus-visible, textarea:focus-visible { outline: 3px solid var(--violet); outline-offset: 2px; }
.choice h3 { margin: 0; font: 700 18px/1.2 var(--display); }
.choice small { color: var(--muted); font-size: 14px; }
.strip { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.strip img { width: 100%; aspect-ratio: 1; object-fit: contain; background: var(--pic); border-radius: 10px; }
.neither { display: flex; gap: 10px; align-items: center; margin-top: 12px; flex-wrap: wrap; }
.row-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
button.pill { font: 700 14px/1 var(--body); padding: 9px 14px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
button.pill:hover { border-color: var(--violet); }
button.pill[aria-pressed="true"].ok { background: var(--ok-tint); border-color: var(--ok); color: var(--ok); }
button.pill[aria-pressed="true"].redo { background: var(--redo-tint); border-color: var(--redo); color: var(--redo); }
button.pill[aria-pressed="true"].filter { background: var(--tint); border-color: var(--violet); color: var(--violet-deep); }
button:disabled { opacity: .45; cursor: default; }
textarea { width: 100%; min-height: 58px; resize: vertical; border: 1.5px solid var(--line); border-radius: 10px; padding: 8px 10px; font: 15px/1.4 var(--body); background: var(--paper); color: var(--ink); }
.toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; position: sticky; top: 0; z-index: 2; background: var(--paper); padding: 10px 0; border-bottom: 1px solid var(--line); }
.progress { font-weight: 700; font-variant-numeric: tabular-nums; }
.concepts { display: grid; gap: 18px; }
.concept { display: grid; grid-template-columns: 170px 1fr 1fr; gap: 16px; align-items: start; padding: 16px 0; border-top: 1px solid var(--line); }
.concept > h3 { margin: 4px 0 0; font: 700 20px/1.2 var(--display); }
.concept > h3 small { display: block; font: 600 13px/1.4 var(--body); color: var(--muted); margin-top: 4px; }
.pic { display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: start; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 12px; }
.card { background: var(--pic); border: 2px solid #221436; border-radius: 16px; padding: 10px 8px 8px; display: grid; justify-items: center; gap: 4px; }
.card img { width: 128px; height: 128px; object-fit: contain; }
.card span { font: 800 14px/1.2 var(--body); color: #221436; text-align: center; }
.pic .side { display: grid; gap: 8px; min-width: 0; }
.pic .which { font: 800 12px/1 var(--body); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.mynote { font-size: 14px; color: var(--muted); background: var(--tint); border-radius: 10px; padding: 8px 10px; }
.mynote b { color: var(--ink); }
.pic.is-ok { border-color: var(--ok); }
.pic.is-redo { border-color: var(--redo); }
.meta { color: var(--muted); font-size: 14px; display: grid; gap: 6px; }
@media (max-width: 860px) {
  .concept { grid-template-columns: 1fr; }
  .pic { grid-template-columns: 120px 1fr; }
  .card img { width: 100px; height: 100px; }
}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">SWED-91 · style test</div>
    <h1>Feelings Friends Picture Test</h1>
    <p class="lede">Thirty Feelings Friends ideas, each drawn in two candidate styles, shown on a plain answer card the way a
    child would see them. These were made free on the Mac with FLUX.2 [klein] 4B, whose Apache 2.0 licence lets us ship the pictures in the app.</p>
    <div class="asks">
      <div class="ask"><b>1. Pick a style</b><span>Text style or Lensy style, or neither if both miss the brand.</span></div>
      <div class="ask"><b>2. Flag what needs redoing</b><span>Tap Redo on any picture that is wrong, with a few words why. My own notes are in lavender.</span></div>
      <div class="ask"><b>3. That's it</b><span>Your choices save as you go. I read them from here and make the next round.</span></div>
    </div>
    <p id="status" class="status" role="status"></p>
  </header>

  <section aria-labelledby="style-h">
    <h2 id="style-h">Which style should the picture bank use?</h2>
    <div class="styles" id="styles"></div>
    <div class="neither">
      <button class="pill" id="neither" aria-pressed="false">Neither: try another direction</button>
    </div>
    <label class="meta" style="margin-top:12px">Anything to add about the style (optional)
      <textarea id="style-note" placeholder="For example: warmer skin tones, thinner outlines, more like Lensy"></textarea>
    </label>
  </section>

  <section aria-labelledby="pics-h">
    <div class="toolbar">
      <div>
        <h2 id="pics-h" style="margin:0">Every picture</h2>
        <span class="progress" id="progress"></span>
      </div>
      <div class="row-actions" role="group" aria-label="Show">
        <button class="pill filter" data-filter="all" aria-pressed="true">All</button>
        <button class="pill filter" data-filter="open" aria-pressed="false">Not reviewed</button>
        <button class="pill filter" data-filter="redo" aria-pressed="false">Redo</button>
        <button class="pill filter" data-filter="noted" aria-pressed="false">Has my note</button>
        <button class="pill" id="rest-ok">Mark the rest as looks right</button>
      </div>
    </div>
    <div class="concepts" id="concepts"></div>
  </section>

  <footer class="meta">
    <span>Model: FLUX.2 [klein] 4B (Apache 2.0), run locally with mflux, 8-bit, 4 steps, 768 px, then the white background cut to transparent. Pictures are for style review only and are not in the app yet.</span>
    <span>Rules they are checked against: brand look (flat, rounded, soft violet outlines, big friendly eyes), no text in pictures, no photographs or realistic renders of children, helpers shown with a range of genders, skin tones, clothes and family shapes, and nothing frightening. Body-safety pictures wait for SWED-83.</span>
  </footer>
</div>

<script>
const DATA = __DATA__;
const $ = (s, el = document) => el.querySelector(s);
const verdicts = {};
let decision = {};
let filter = "all";
let db = null;
let canWrite = true;

function key(style, id) { return style + "-" + id; }

function renderStyles() {
  const box = $("#styles");
  box.textContent = "";
  for (const s of DATA.styles) {
    const b = document.createElement("button");
    b.className = "choice";
    b.setAttribute("aria-pressed", decision.choice === s.key ? "true" : "false");
    b.disabled = !canWrite;
    const h = document.createElement("h3"); h.textContent = s.label;
    const sm = document.createElement("small"); sm.textContent = s.how + " About " + s.seconds + " seconds a picture.";
    const strip = document.createElement("div"); strip.className = "strip";
    for (const c of DATA.concepts.slice(0, 6)) {
      const im = document.createElement("img"); im.src = "pics/" + s.key + "/" + c.id + ".png"; im.alt = c.word + " in " + s.label; im.loading = "lazy";
      strip.append(im);
    }
    b.append(h, sm, strip);
    b.addEventListener("click", () => saveDecision({ choice: s.key }));
    box.append(b);
  }
  const n = $("#neither");
  n.setAttribute("aria-pressed", decision.choice === "neither" ? "true" : "false");
  n.disabled = !canWrite;
  const note = $("#style-note");
  if (document.activeElement !== note) note.value = decision.note || "";
  note.disabled = !canWrite;
}

function reviewed(style, id) { return verdicts[key(style, id)] && verdicts[key(style, id)].verdict; }

function visible(c) {
  if (filter === "all") return true;
  if (filter === "noted") return DATA.styles.some(s => c.notes[s.key]);
  if (filter === "open") return DATA.styles.some(s => !reviewed(s.key, c.id));
  if (filter === "redo") return DATA.styles.some(s => reviewed(s.key, c.id) === "redo");
  return true;
}

function renderConcepts() {
  const box = $("#concepts");
  box.textContent = "";
  let done = 0, total = 0, redo = 0;
  for (const c of DATA.concepts) {
    for (const s of DATA.styles) { total++; const v = reviewed(s.key, c.id); if (v) done++; if (v === "redo") redo++; }
    if (!visible(c)) continue;
    const row = document.createElement("article"); row.className = "concept";
    const h = document.createElement("h3"); h.textContent = c.word;
    row.append(h);
    for (const s of DATA.styles) {
      const k = key(s.key, c.id); const v = verdicts[k] || {};
      const pic = document.createElement("div"); pic.className = "pic" + (v.verdict === "ok" ? " is-ok" : v.verdict === "redo" ? " is-redo" : "");
      const card = document.createElement("div"); card.className = "card";
      const im = document.createElement("img"); im.src = "pics/" + s.key + "/" + c.id + ".png"; im.alt = c.word + ", " + s.label; im.loading = "lazy";
      const w = document.createElement("span"); w.textContent = c.word;
      card.append(im, w);
      const side = document.createElement("div"); side.className = "side";
      const which = document.createElement("div"); which.className = "which"; which.textContent = s.label;
      side.append(which);
      if (c.notes[s.key]) { const n = document.createElement("div"); n.className = "mynote"; const b = document.createElement("b"); b.textContent = "My note: "; n.append(b, document.createTextNode(c.notes[s.key])); side.append(n); }
      const acts = document.createElement("div"); acts.className = "row-actions";
      for (const [val, label] of [["ok", "Looks right"], ["redo", "Redo"]]) {
        const bt = document.createElement("button"); bt.className = "pill " + val; bt.textContent = label;
        bt.setAttribute("aria-pressed", v.verdict === val ? "true" : "false"); bt.disabled = !canWrite;
        bt.addEventListener("click", () => saveVerdict(s.key, c.id, { verdict: v.verdict === val ? "" : val }));
        acts.append(bt);
      }
      side.append(acts);
      if (v.verdict === "redo" || v.note) {
        const ta = document.createElement("textarea"); ta.placeholder = "What should change?"; ta.value = v.note || ""; ta.disabled = !canWrite;
        ta.setAttribute("aria-label", "Note on " + c.word + ", " + s.label);
        ta.addEventListener("change", () => saveVerdict(s.key, c.id, { note: ta.value.trim() }));
        side.append(ta);
      }
      pic.append(card, side);
      row.append(pic);
    }
    box.append(row);
  }
  $("#progress").textContent = done + " of " + total + " reviewed" + (redo ? ", " + redo + " to redo" : "");
}

function status(text, warn) { const el = $("#status"); el.textContent = text; el.className = "status" + (warn ? " warn" : ""); }

const pending = {};
async function saveVerdict(style, id, patch) {
  if (!db) return;
  const k = key(style, id);
  const next = Object.assign({ style: style, id: id, verdict: "", note: "" }, verdicts[k] || {}, patch, { at: Date.now() });
  verdicts[k] = next; renderConcepts();
  if (pending[k]) { pending[k] = next; return; }
  pending[k] = next;
  try {
    while (pending[k]) { const body = pending[k]; pending[k] = null; await db.collection("verdicts").doc(k).set(body); }
  } catch (e) { handleWriteError(e); pending[k] = null; }
}

let decisionBusy = false, decisionNext = null;
async function saveDecision(patch) {
  if (!db) return;
  decision = Object.assign({ choice: "", note: "" }, decision, patch, { at: Date.now() });
  renderStyles();
  decisionNext = decision;
  if (decisionBusy) return;
  decisionBusy = true;
  try { while (decisionNext) { const body = decisionNext; decisionNext = null; await db.doc("decision/style").set(body); } }
  catch (e) { handleWriteError(e); }
  decisionBusy = false;
}

function handleWriteError(e) {
  if (e && e.code === "invalid_argument") { canWrite = false; status("This view can read the review but not save it. Open it from your own account to leave verdicts.", true); renderStyles(); renderConcepts(); }
  else if (e && e.code === "quota_exceeded") status("The review store is full, so this change was not saved.", true);
  else status("A change did not save. Try that tap again in a moment.", true);
}

document.querySelectorAll("button.filter").forEach(b => b.addEventListener("click", () => {
  filter = b.dataset.filter;
  document.querySelectorAll("button.filter").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
  renderConcepts();
}));
$("#neither").addEventListener("click", () => saveDecision({ choice: "neither" }));
$("#style-note").addEventListener("change", e => saveDecision({ note: e.target.value.trim() }));
$("#rest-ok").addEventListener("click", async () => {
  if (!db || !canWrite) return;
  for (const c of DATA.concepts) for (const s of DATA.styles) if (!reviewed(s.key, c.id)) await saveVerdict(s.key, c.id, { verdict: "ok" });
});

renderStyles(); renderConcepts();
status("Loading your saved review...");

(async () => {
  const cl = window.claude;
  db = cl && cl.use ? await cl.use("db") : null;
  const user = cl && cl.use ? await cl.use("user") : null;
  if (!db) { status("Open this page in Claude to save your review. You can still look through every picture.", true); canWrite = false; renderStyles(); renderConcepts(); return; }
  if (user && user.can) { try { const w = await user.can("data.write"); if (w === false) { canWrite = false; status("You can look through the pictures but not save a review from this view.", true); } } catch (e) {} }
  db.collection("verdicts").onSnapshot(snap => {
    for (const d of snap.docs) { const b = d.data(); if (b) verdicts[d.id] = Object.assign({}, b); }
    for (const ch of snap.docChanges()) if (ch.type === "removed") delete verdicts[ch.doc.id];
    renderConcepts();
    if (canWrite) status("");
  }, () => status("Saved verdicts could not load. Reload the page to try again.", true));
  db.doc("decision/style").onSnapshot(snap => { decision = snap.exists ? Object.assign({}, snap.data()) : {}; renderStyles(); },
    () => status("The saved style choice could not load. Reload the page to try again.", true));
})();
</script>
"""

def round_two(d, notes):
    out = os.path.join(d, "review")
    log = json.load(open(os.path.join(d, "shaded-style", "log.json")))
    os.makedirs(os.path.join(out, "pics", "shaded"), exist_ok=True)
    for p in log["pictures"]:
        im = Image.open(os.path.join(d, "shaded-style", f"{p['id']}-cut.png"))
        im.thumbnail((360, 360))
        im.save(os.path.join(out, "pics", "shaded", f"{p['id']}.png"), optimize=True)
    order = [p["id"] for p in json.load(open(os.path.join(d, "text-style", "log.json")))["pictures"]]
    words = {p["id"]: p["word"] for p in log["pictures"]}
    secs = round(sum(p["seconds"] for p in log["pictures"]) / max(1, len(log["pictures"])))
    data = {"seconds": secs, "concepts": [{"id": c, "word": words[c], "note": notes.get(f"shaded-{c}", "")} for c in order if c in words]}
    css = TEMPLATE[TEMPLATE.index("<style>"):TEMPLATE.index("</style>") + len("</style>")]
    page = ROUND_TWO.replace("__STYLE__", css).replace("__SECS__", str(secs)).replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    open(os.path.join(out, "index.html"), "w", encoding="utf8").write(page)
    print(os.path.join(out, "index.html"), len(data["concepts"]), "concepts (round two)")


ROUND_TWO = r"""<title>Feelings Friends Picture Test</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&family=Poppins:wght@600;700&display=swap">
__STYLE__
<style>
.concept { grid-template-columns: 170px 190px 1fr; }
.before { display: grid; justify-items: center; gap: 6px; }
.before .card { opacity: .8; }
.before .card img { width: 110px; height: 110px; }
.before small { color: var(--muted); font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.looks { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
@media (max-width: 860px) { .concept { grid-template-columns: 1fr; } .before { justify-items: start; } }
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">SWED-91 · round two</div>
    <h1>Feelings Friends Picture Test</h1>
    <p class="lede">You chose the Lensy style and asked for the shading and light that Lensy, UN and RE have. Here are all
    30 again in that look: soft shading with light from the upper left, highlights in the hair and eyes, and a soft
    shadow on the ground. Round one's fixes are in too: black or dark brown hair, no blonde children, and clearer
    poses for shy, count to five, take turns, wait your turn and slow breaths.</p>
    <div class="asks">
      <div class="ask"><b>1. Is this the look?</b><span>Yes, more shading, less shading, or something else.</span></div>
      <div class="ask"><b>2. Flag what needs redoing</b><span>Tap Redo on any picture that is wrong, with a few words why. My notes are in lavender; round one is shown faded on the left.</span></div>
      <div class="ask"><b>3. That's it</b><span>Your answers save as you go. I read them from here for the next step.</span></div>
    </div>
    <p id="status" class="status" role="status"></p>
  </header>

  <section aria-labelledby="look-h">
    <h2 id="look-h">Is this the look for the picture bank?</h2>
    <div class="looks" id="looks"></div>
    <label class="meta" style="margin-top:12px">Anything to add about the look (optional)
      <textarea id="look-note" placeholder="For example: stronger light, softer ground shadow, bigger eyes"></textarea>
    </label>
  </section>

  <section aria-labelledby="pics-h">
    <div class="toolbar">
      <div>
        <h2 id="pics-h" style="margin:0">Every picture</h2>
        <span class="progress" id="progress"></span>
      </div>
      <div class="row-actions" role="group" aria-label="Show">
        <button class="pill filter" data-filter="all" aria-pressed="true">All</button>
        <button class="pill filter" data-filter="open" aria-pressed="false">Not reviewed</button>
        <button class="pill filter" data-filter="redo" aria-pressed="false">Redo</button>
        <button class="pill filter" data-filter="noted" aria-pressed="false">Has my note</button>
        <button class="pill" id="rest-ok">Mark the rest as looks right</button>
      </div>
    </div>
    <div class="concepts" id="concepts"></div>
  </section>

  <footer class="meta">
    <span>Model: FLUX.2 [klein] 4B (Apache 2.0), run locally with mflux, 8-bit, 4 steps, 768 px, with Lensy's waving picture as the style reference; about __SECS__ seconds a picture. The white background is cut to transparent, the ground shadow stays. Not in the app yet.</span>
    <span>The no-shadows rule is for the app's cards and buttons, not illustrations: pictures match the mascots' shading and light. Other rules: no text in pictures, no photographs or realistic renders of children, a range of genders, skin tones, clothes and family shapes, nothing frightening. Body-safety pictures wait for SWED-83.</span>
  </footer>
</div>

<script>
const DATA = __DATA__;
const LOOKS = [["yes", "Yes, this look"], ["more", "More shading"], ["less", "Less shading"], ["other", "Something else"]];
const $ = (s, el = document) => el.querySelector(s);
const verdicts = {};
let look = {};
let filter = "all";
let db = null;
let canWrite = true;

function renderLooks() {
  const box = $("#looks"); box.textContent = "";
  for (const [val, label] of LOOKS) {
    const b = document.createElement("button"); b.className = "pill filter"; b.textContent = label;
    b.setAttribute("aria-pressed", look.choice === val ? "true" : "false"); b.disabled = !canWrite;
    b.addEventListener("click", () => saveLook({ choice: val }));
    box.append(b);
  }
  const note = $("#look-note");
  if (document.activeElement !== note) note.value = look.note || "";
  note.disabled = !canWrite;
}

function visible(c) {
  const v = (verdicts[c.id] || {}).verdict;
  if (filter === "noted") return !!c.note;
  if (filter === "open") return !v;
  if (filter === "redo") return v === "redo";
  return true;
}

function card(src, word, alt) {
  const el = document.createElement("div"); el.className = "card";
  const im = document.createElement("img"); im.src = src; im.alt = alt; im.loading = "lazy";
  const w = document.createElement("span"); w.textContent = word;
  el.append(im, w); return el;
}

function renderConcepts() {
  const box = $("#concepts"); box.textContent = "";
  let done = 0, redo = 0;
  for (const c of DATA.concepts) {
    const v = verdicts[c.id] || {};
    if (v.verdict) done++; if (v.verdict === "redo") redo++;
    if (!visible(c)) continue;
    const row = document.createElement("article"); row.className = "concept";
    const h = document.createElement("h3"); h.textContent = c.word; row.append(h);
    const before = document.createElement("div"); before.className = "before";
    const sm = document.createElement("small"); sm.textContent = "Round one";
    before.append(card("pics/lensy/" + c.id + ".png", c.word, c.word + ", round one"), sm);
    row.append(before);
    const pic = document.createElement("div"); pic.className = "pic" + (v.verdict === "ok" ? " is-ok" : v.verdict === "redo" ? " is-redo" : "");
    const side = document.createElement("div"); side.className = "side";
    const which = document.createElement("div"); which.className = "which"; which.textContent = "Round two, shaded"; side.append(which);
    if (c.note) { const n = document.createElement("div"); n.className = "mynote"; const b = document.createElement("b"); b.textContent = "My note: "; n.append(b, document.createTextNode(c.note)); side.append(n); }
    const acts = document.createElement("div"); acts.className = "row-actions";
    for (const [val, label] of [["ok", "Looks right"], ["redo", "Redo"]]) {
      const bt = document.createElement("button"); bt.className = "pill " + val; bt.textContent = label;
      bt.setAttribute("aria-pressed", v.verdict === val ? "true" : "false"); bt.disabled = !canWrite;
      bt.addEventListener("click", () => saveVerdict(c.id, { verdict: v.verdict === val ? "" : val }));
      acts.append(bt);
    }
    side.append(acts);
    if (v.verdict === "redo" || v.note) {
      const ta = document.createElement("textarea"); ta.placeholder = "What should change?"; ta.value = v.note || ""; ta.disabled = !canWrite;
      ta.setAttribute("aria-label", "Note on " + c.word);
      ta.addEventListener("change", () => saveVerdict(c.id, { note: ta.value.trim() }));
      side.append(ta);
    }
    pic.append(card("pics/shaded/" + c.id + ".png", c.word, c.word + ", round two"), side);
    row.append(pic);
    box.append(row);
  }
  $("#progress").textContent = done + " of " + DATA.concepts.length + " reviewed" + (redo ? ", " + redo + " to redo" : "");
}

function status(text, warn) { const el = $("#status"); el.textContent = text; el.className = "status" + (warn ? " warn" : ""); }

const pending = {};
async function saveVerdict(id, patch) {
  if (!db) return;
  const next = Object.assign({ id: id, verdict: "", note: "" }, verdicts[id] || {}, patch, { at: Date.now() });
  verdicts[id] = next; renderConcepts();
  if (pending[id]) { pending[id] = next; return; }
  pending[id] = next;
  try { while (pending[id]) { const body = pending[id]; pending[id] = null; await db.collection("verdicts-r2").doc(id).set(body); } }
  catch (e) { handleWriteError(e); pending[id] = null; }
}

let lookBusy = false, lookNext = null;
async function saveLook(patch) {
  if (!db) return;
  look = Object.assign({ choice: "", note: "" }, look, patch, { at: Date.now() });
  renderLooks();
  lookNext = look;
  if (lookBusy) return;
  lookBusy = true;
  try { while (lookNext) { const body = lookNext; lookNext = null; await db.doc("decision/look").set(body); } }
  catch (e) { handleWriteError(e); }
  lookBusy = false;
}

function handleWriteError(e) {
  if (e && e.code === "invalid_argument") { canWrite = false; status("This view can read the review but not save it. Open it from your own account to leave verdicts.", true); renderLooks(); renderConcepts(); }
  else if (e && e.code === "quota_exceeded") status("The review store is full, so this change was not saved.", true);
  else status("A change did not save. Try that tap again in a moment.", true);
}

document.querySelectorAll("button.filter[data-filter]").forEach(b => b.addEventListener("click", () => {
  filter = b.dataset.filter;
  document.querySelectorAll("button.filter[data-filter]").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
  renderConcepts();
}));
$("#look-note").addEventListener("change", e => saveLook({ note: e.target.value.trim() }));
$("#rest-ok").addEventListener("click", async () => {
  if (!db || !canWrite) return;
  for (const c of DATA.concepts) if (!(verdicts[c.id] || {}).verdict) await saveVerdict(c.id, { verdict: "ok" });
});

renderLooks(); renderConcepts();
status("Loading your saved review...");

(async () => {
  const cl = window.claude;
  db = cl && cl.use ? await cl.use("db") : null;
  const user = cl && cl.use ? await cl.use("user") : null;
  if (!db) { status("Open this page in Claude to save your review. You can still look through every picture.", true); canWrite = false; renderLooks(); renderConcepts(); return; }
  if (user && user.can) { try { const w = await user.can("data.write"); if (w === false) { canWrite = false; status("You can look through the pictures but not save a review from this view.", true); } } catch (e) {} }
  db.collection("verdicts-r2").onSnapshot(snap => {
    for (const d of snap.docs) { const b = d.data(); if (b) verdicts[d.id] = Object.assign({}, b); }
    for (const ch of snap.docChanges()) if (ch.type === "removed") delete verdicts[ch.doc.id];
    renderConcepts();
    if (canWrite) status("");
  }, () => status("Saved verdicts could not load. Reload the page to try again.", true));
  db.doc("decision/look").onSnapshot(snap => { look = snap.exists ? Object.assign({}, snap.data()) : {}; renderLooks(); },
    () => status("The saved answer could not load. Reload the page to try again.", true));
})();
</script>
"""


if __name__ == "__main__":
    main()
