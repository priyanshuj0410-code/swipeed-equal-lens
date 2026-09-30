#!/usr/bin/env python3
"""story_review_page.py: the owner's after-shipping review page for a game's multi-step stories (SWED-100).

  python3 scripts/forge/story_review_page.py <game file stem> [--out <dir>]

For safety-heavy games the owner reads the shipped stories after they go live (multi-step rollout playbook). The page
shows every multi-step branch and role-play the way a player meets it, with the best option and why marked, and marks
the stories that had a safety finding in any review round or that name a helpline. The owner's verdicts are kept in
the artifact's db: collection "reviews", one doc per story id: {verdict: "ok" or "flag", note, at}.
Writes <out>/index.html (default .forge/<game>/review-page/).
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402
import steps_wave as W  # noqa: E402

HELPLINE = re.compile(r"\b(181|1091|112|100|14416|1098|15100)\b")


def safety_ids(stem):
    ids = set()
    d = W.steps_dir(stem)
    if not os.path.isdir(d):
        return ids
    for root, _, files in os.walk(d):
        for f in files:
            if f == "fix-log.ndjson":
                for line in open(os.path.join(root, f), encoding="utf8"):
                    if line.strip() and re.search(r"safety", line, re.I):
                        ids.add(json.loads(line).get("id"))
    return ids


def main():
    a = sys.argv[1:]
    stem = a[0]
    out = a[a.index("--out") + 1] if "--out" in a else os.path.join(C.REPO, ".forge", stem, "review-page")
    name = W.labels().get(stem, stem)
    scns, _ = C.parse_file(os.path.join(C.GAMES, stem + ".ts"))
    safe = safety_ids(stem)
    stories = []
    for o in scns:
        if not C.is_story(o):
            continue
        text = json.dumps(o, ensure_ascii=False)
        stories.append({"id": o["id"], "type": o["type"], "cat": o["cat"], "hook": o["hook"], "setup": o.get("setup", ""),
                        "steps": [{"prompt": s["prompt"], "why": s["why"],
                                   "options": [{"text": x["text"], "then": x["then"], "best": bool(x.get("best"))} for x in s["options"]]}
                                  for s in o["steps"]],
                        "debrief": o.get("debrief", ""), "relearn": o.get("relearn", ""),
                        "safety": o["id"] in safe, "helpline": bool(HELPLINE.search(text))})
    cats = sorted({s["cat"] for s in stories})
    data = {"game": name, "stories": stories, "cats": cats}
    page = (TEMPLATE.replace("__GAME__", html.escape(name))
            .replace("__COUNT__", str(len(stories)))
            .replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/")))
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "index.html"), "w", encoding="utf8").write(page)
    print(f"{os.path.join(out, 'index.html')}: {len(stories)} stories, {sum(s['safety'] for s in stories)} with a safety finding, "
          f"{sum(s['helpline'] for s in stories)} naming a helpline")


TEMPLATE = r"""<title>__GAME__ Story Review</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&family=Poppins:wght@600;700&display=swap">
<style>
:root {
  --paper: #FBF9FF; --surface: #FFFFFF; --ink: #221436; --muted: #5E5470; --line: #DCD3EA;
  --violet: #553286; --violet-deep: #42266B; --tint: #F1EBFA; --best: #1F7A4D; --best-tint: #E3F4EA;
  --flag: #A33A2B; --flag-tint: #FBE7E3; --amber: #8A5A00; --amber-tint: #FFF3D6;
  --display: "Poppins", ui-sans-serif, system-ui, sans-serif; --body: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --paper: #16101F; --surface: #211930; --ink: #F3EEFB; --muted: #B9AECB; --line: #3A2F4D;
  --violet: #C4A8F0; --violet-deep: #E0D1F8; --tint: #2B2140; --best: #7ED4A5; --best-tint: #1D3328;
  --flag: #F2A193; --flag-tint: #3A221E; --amber: #F0C46B; --amber-tint: #3A2F17; } }
:root[data-theme="dark"] {
  --paper: #16101F; --surface: #211930; --ink: #F3EEFB; --muted: #B9AECB; --line: #3A2F4D;
  --violet: #C4A8F0; --violet-deep: #E0D1F8; --tint: #2B2140; --best: #7ED4A5; --best-tint: #1D3328;
  --flag: #F2A193; --flag-tint: #3A221E; --amber: #F0C46B; --amber-tint: #3A2F17; }
* { box-sizing: border-box; }
body { background: var(--paper); color: var(--ink); font: 16px/1.55 var(--body); }
.wrap { max-width: 980px; margin: 0 auto; padding: 36px 20px 96px; display: grid; gap: 28px; }
h1 { margin: 0 0 10px; font: 700 clamp(28px, 4vw, 38px)/1.12 var(--display); text-wrap: balance; }
p { margin: 0; max-width: 70ch; }
.lede { color: var(--muted); font-size: 17px; }
.eyebrow { font: 800 12px/1 var(--body); letter-spacing: .08em; text-transform: uppercase; color: var(--violet); margin-bottom: 8px; }
.status { font-size: 14px; color: var(--muted); min-height: 1.4em; margin-top: 10px; }
.status.warn { color: var(--flag); }
.toolbar { position: sticky; top: 0; z-index: 2; background: var(--paper); border-bottom: 1px solid var(--line); padding: 10px 0; display: grid; gap: 8px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.progress { font-weight: 800; font-variant-numeric: tabular-nums; }
button.pill { font: 700 14px/1 var(--body); padding: 8px 13px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
button.pill:hover { border-color: var(--violet); }
button.pill[aria-pressed="true"] { background: var(--tint); border-color: var(--violet); color: var(--violet-deep); }
button.pill.ok[aria-pressed="true"] { background: var(--best-tint); border-color: var(--best); color: var(--best); }
button.pill.flag[aria-pressed="true"] { background: var(--flag-tint); border-color: var(--flag); color: var(--flag); }
button:disabled { opacity: .45; cursor: default; }
button:focus-visible, summary:focus-visible, textarea:focus-visible, input:focus-visible { outline: 3px solid var(--violet); outline-offset: 2px; }
input[type=search] { font: 15px var(--body); padding: 8px 12px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); min-width: 220px; }
.stories { display: grid; gap: 14px; }
details.story { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
details.story.is-ok { border-color: var(--best); }
details.story.is-flag { border-color: var(--flag); }
details.story > summary { list-style: none; cursor: pointer; padding: 14px 16px; display: grid; gap: 6px; }
details.story > summary::-webkit-details-marker { display: none; }
.meta { display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
.tag { border-radius: 999px; padding: 3px 8px; background: var(--tint); color: var(--violet-deep); }
.tag.safety { background: var(--amber-tint); color: var(--amber); }
.hook { font: 700 17px/1.4 var(--display); }
.body { padding: 0 16px 16px; display: grid; gap: 14px; }
.setup { color: var(--muted); font-style: italic; }
.q { display: grid; gap: 6px; }
.q h4 { margin: 0; font: 700 15px/1.4 var(--body); }
.q h4 small { color: var(--muted); font-weight: 700; margin-right: 6px; }
ul.opts { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
ul.opts li { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; display: grid; gap: 2px; }
ul.opts li.best { border-color: var(--best); background: var(--best-tint); }
ul.opts li b { font-weight: 700; }
ul.opts li span { color: var(--muted); font-size: 14px; }
.why { font-size: 14px; } .why b { color: var(--best); }
.end { font-size: 14px; color: var(--muted); border-top: 1px dashed var(--line); padding-top: 10px; display: grid; gap: 4px; }
.end b { color: var(--ink); }
.verdict { display: grid; gap: 8px; border-top: 1px solid var(--line); padding-top: 12px; }
textarea { width: 100%; min-height: 58px; resize: vertical; border: 1.5px solid var(--line); border-radius: 10px; padding: 8px 10px; font: 15px/1.4 var(--body); background: var(--paper); color: var(--ink); }
.empty { color: var(--muted); padding: 20px 0; }
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">Live stories for your review</div>
    <h1>__GAME__ Story Review</h1>
    <p class="lede">All __COUNT__ branches and role-plays in __GAME__, as a player meets them, with the best option and why marked.
    They are live. Open any story, then mark it Looks right or Flag it with a few words; I read your flags from here
    and fix them the same day. Stories marked <span class="tag safety">Safety</span> had a safety finding in a review
    round; <span class="tag">Helpline</span> means the story names a helpline number.</p>
    <p id="status" class="status" role="status"></p>
  </header>

  <div class="toolbar">
    <div class="row">
      <span class="progress" id="progress"></span>
      <input type="search" id="q" placeholder="Search the stories" aria-label="Search the stories">
    </div>
    <div class="row" role="group" aria-label="Show">
      <button class="pill f" data-f="all" aria-pressed="true">All</button>
      <button class="pill f" data-f="safety" aria-pressed="false">Safety</button>
      <button class="pill f" data-f="helpline" aria-pressed="false">Helpline</button>
      <button class="pill f" data-f="open" aria-pressed="false">Not reviewed</button>
      <button class="pill f" data-f="flag" aria-pressed="false">Flagged</button>
    </div>
    <div class="row" role="group" aria-label="Category" id="cats"></div>
  </div>

  <div class="stories" id="stories"></div>
</div>

<script>
const DATA = __DATA__;
const $ = s => document.querySelector(s);
const reviews = {};
let filter = "all", cat = "", query = "", db = null, canWrite = true;
const open = new Set();

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

function visible(s) {
  const v = (reviews[s.id] || {}).verdict;
  if (filter === "safety" && !s.safety) return false;
  if (filter === "helpline" && !s.helpline) return false;
  if (filter === "open" && v) return false;
  if (filter === "flag" && v !== "flag") return false;
  if (cat && s.cat !== cat) return false;
  if (query) { const hay = JSON.stringify(s).toLowerCase(); if (!hay.includes(query)) return false; }
  return true;
}

function storyBody(s) {
  const b = el("div", "body");
  if (s.setup) b.append(el("p", "setup", s.setup));
  s.steps.forEach((st, k) => {
    const q = el("div", "q");
    const h = el("h4"); h.append(el("small", null, "Question " + (k + 1) + " of " + s.steps.length), document.createTextNode(st.prompt)); q.append(h);
    const ul = el("ul", "opts");
    for (const x of st.options) {
      const li = el("li", x.best ? "best" : "");
      li.append(el("b", null, (x.best ? "Best: " : "") + x.text), el("span", null, x.then));
      ul.append(li);
    }
    q.append(ul);
    const w = el("p", "why"); w.append(el("b", null, "Why: "), document.createTextNode(st.why)); q.append(w);
    b.append(q);
  });
  const end = el("div", "end");
  if (s.debrief) { const d = el("p"); d.append(el("b", null, "Debrief: "), document.createTextNode(s.debrief)); end.append(d); }
  const r = el("p"); r.append(el("b", null, "Take-away: "), document.createTextNode(s.relearn)); end.append(r);
  b.append(end);
  const v = reviews[s.id] || {};
  const box = el("div", "verdict");
  const acts = el("div", "row");
  for (const [val, label] of [["ok", "Looks right"], ["flag", "Flag"]]) {
    const bt = el("button", "pill " + val, label); bt.setAttribute("aria-pressed", v.verdict === val ? "true" : "false"); bt.disabled = !canWrite;
    bt.addEventListener("click", () => save(s.id, { verdict: v.verdict === val ? "" : val }));
    acts.append(bt);
  }
  box.append(acts);
  if (v.verdict === "flag" || v.note) {
    const ta = el("textarea"); ta.placeholder = "What should change?"; ta.value = v.note || ""; ta.disabled = !canWrite;
    ta.setAttribute("aria-label", "Note on " + s.id);
    ta.addEventListener("change", () => save(s.id, { note: ta.value.trim() }));
    box.append(ta);
  }
  b.append(box);
  return b;
}

function render() {
  const box = $("#stories"); box.textContent = "";
  let done = 0, flagged = 0, shown = 0;
  for (const s of DATA.stories) {
    const v = (reviews[s.id] || {}).verdict; if (v) done++; if (v === "flag") flagged++;
    if (!visible(s)) continue;
    shown++;
    const d = el("details", "story" + (v === "ok" ? " is-ok" : v === "flag" ? " is-flag" : ""));
    if (open.has(s.id)) d.open = true;
    d.addEventListener("toggle", () => { if (d.open) { open.add(s.id); if (!d.querySelector(".body")) d.append(storyBody(s)); } else open.delete(s.id); });
    const sum = el("summary");
    const meta = el("div", "meta");
    meta.append(el("span", null, s.id), el("span", null, s.type === "role-play" ? "Role-play" : "Branch"), el("span", null, s.cat.replace(/-/g, " ")), el("span", null, s.steps.length + " questions"));
    if (s.safety) meta.append(el("span", "tag safety", "Safety"));
    if (s.helpline) meta.append(el("span", "tag", "Helpline"));
    if (v === "ok") meta.append(el("span", "tag", "Looks right"));
    if (v === "flag") meta.append(el("span", "tag safety", "Flagged"));
    sum.append(meta, el("span", "hook", s.hook));
    d.append(sum);
    if (d.open) d.append(storyBody(s));
    box.append(d);
  }
  if (!shown) box.append(el("p", "empty", "No stories match this view."));
  $("#progress").textContent = done + " of " + DATA.stories.length + " reviewed" + (flagged ? ", " + flagged + " flagged" : "");
}

function status(t, warn) { const s = $("#status"); s.textContent = t; s.className = "status" + (warn ? " warn" : ""); }

const pending = {};
async function save(id, patch) {
  if (!db) return;
  const next = Object.assign({ verdict: "", note: "" }, reviews[id] || {}, patch, { at: Date.now() });
  reviews[id] = next; render();
  if (pending[id]) { pending[id] = next; return; }
  pending[id] = next;
  try { while (pending[id]) { const body = pending[id]; pending[id] = null; await db.collection("reviews").doc(id).set(body); } }
  catch (e) {
    pending[id] = null;
    if (e && e.code === "invalid_argument") { canWrite = false; status("This view can read the stories but not save a review.", true); render(); }
    else status("A change did not save. Try that tap again in a moment.", true);
  }
}

const catBox = $("#cats");
for (const c of [""].concat(DATA.cats)) {
  const b = el("button", "pill c", c ? c.replace(/-/g, " ") : "Every category"); b.dataset.c = c; b.setAttribute("aria-pressed", c === cat ? "true" : "false");
  b.addEventListener("click", () => { cat = c; catBox.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x.dataset.c === cat ? "true" : "false")); render(); });
  catBox.append(b);
}
document.querySelectorAll("button.f").forEach(b => b.addEventListener("click", () => {
  filter = b.dataset.f; document.querySelectorAll("button.f").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false")); render();
}));
let t = null;
$("#q").addEventListener("input", e => { clearTimeout(t); t = setTimeout(() => { query = e.target.value.trim().toLowerCase(); render(); }, 150); });

render();
status("Loading your saved review...");
(async () => {
  const cl = window.claude;
  db = cl && cl.use ? await cl.use("db") : null;
  const user = cl && cl.use ? await cl.use("user") : null;
  if (!db) { canWrite = false; status("Open this page in Claude to save your review. You can still read every story.", true); render(); return; }
  if (user && user.can) { try { if ((await user.can("data.write")) === false) { canWrite = false; status("You can read the stories but not save a review from this view.", true); } } catch (e) {} }
  db.collection("reviews").onSnapshot(snap => {
    for (const d of snap.docs) { const b = d.data(); if (b) reviews[d.id] = Object.assign({}, b); }
    for (const ch of snap.docChanges()) if (ch.type === "removed") delete reviews[ch.doc.id];
    render(); if (canWrite) status("");
  }, () => status("Saved reviews could not load. Reload the page to try again.", true));
})();
</script>
"""

if __name__ == "__main__":
    main()
