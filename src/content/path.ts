// AUTO-GENERATED from scripts/master-node-table.xlsx by scripts/gen-path.py — do not edit by hand.
// Edit the spreadsheet and rerun the generator. Phase 0: order + thread colour + chapter
// regions; built games are playable, the rest render disabled ('not built'). No gates yet.

export type NodeType = "lesson" | "capstone";
export type ThreadKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "★";

export type GameNode = {
  order: number;
  id: string; // stable table id (g01…/c1…)
  label: string;
  type: NodeType;
  chapter: string;
  ageGate: number; // 3/6/9/12/15 — carried for later phases, NOT gated yet
  thread: ThreadKey;
  threadName: string;
  hex: string; // bubble tint (one colour per thread)
  topics: string[];
  prereq?: string; // linear predecessor — carried, NOT gated yet
  buildsOn?: string; // spiral reference — analytics/callbacks only
  note?: string;
  emoji: string;
  game?: string; // dispatch id for a built game; absent => not built (disabled)
  href?: string; // navigation target (classic view / fallback)
};

export const NODES: GameNode[] = [
  { order: 1, id: "g01", label: "Feelings Friends", type: "lesson", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "C", threadName: "Feelings & Life Skills", hex: "#F59E0B", topics: ["5.2", "5.3 (emotions)"], note: "Name emotions & say 'no' — the base for everything", emoji: "😊", game: "feelings", href: "/game/feelings" },
  { order: 2, id: "g02", label: "My Body, My Rules", type: "lesson", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "A", threadName: "Body & Growing Up", hex: "#0EA5E9", topics: ["6.1", "4.2", "4.3", "7.2", "5.5"], prereq: "g01", note: "Your body is yours; safe vs unsafe touch", emoji: "🛡️", game: "my-body", href: "/game/my-body" },
  { order: 3, id: "g03", label: "My Family Garden", type: "lesson", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "D", threadName: "Relationships", hex: "#EC4899", topics: ["1.1", "1.2", "7.1"], prereq: "g02", note: "Families & friends; kinds of love", emoji: "🏡", game: "family-garden", href: "/game/family-garden" },
  { order: 4, id: "g04", label: "Same Same, Different", type: "lesson", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.1", "1.3"], prereq: "g03", note: "We're equal inside; difference is wonderful", emoji: "🧒", game: "same-same", href: "/game/same-same" },
  { order: 5, id: "g05", label: "Can-Do Kids", type: "lesson", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.2"], prereq: "g04", buildsOn: "g04", note: "Anyone can do anything, whatever their gender", emoji: "🦸", game: "can-do", href: "/game/can-do" },
  { order: 6, id: "c1", label: "Capstone: My First Friends", type: "capstone", chapter: "Ch.1 · Ages 3–6", ageGate: 3, thread: "★", threadName: "Capstone milestone", hex: "#EAB308", topics: [], prereq: "g05", note: "Chapter 1 graduation — the Friendship Garden blooms", emoji: "🏆", game: "capstone-1", href: "/game/capstone-1" },
  { order: 7, id: "g06", label: "Body Lab Juniors", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "A", threadName: "Body & Growing Up", hex: "#0EA5E9", topics: ["6.1", "6.2", "6.3", "6.4"], prereq: "c1", buildsOn: "g02", note: "How bodies work & grow", emoji: "🧪", game: "body-lab", href: "/game/body-lab" },
  { order: 8, id: "g07", label: "What Makes Me, Me", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.1"], prereq: "g06", buildsOn: "g04", note: "Sex vs gender — base of the gender thread", emoji: "🪞", game: "what-makes-me", href: "/game/what-makes-me" },
  { order: 9, id: "g08", label: "Safety Squad", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "B", threadName: "Safety, Consent & Boundaries", hex: "#DC2626", topics: ["4.1", "4.2", "4.3", "3.3", "5.5"], prereq: "g07", buildsOn: "g02", note: "Touch, privacy & online safety", emoji: "🦺", game: "safety-squad", href: "/game/safety-squad" },
  { order: 10, id: "g09", label: "Friend or Frenemy?", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "D", threadName: "Relationships", hex: "#EC4899", topics: ["1.2", "5.1", "5.3", "7.1"], prereq: "g08", buildsOn: "g03", note: "Healthy vs unhealthy friendships", emoji: "🤝", game: "friend-frenemy", href: "/game/friend-frenemy" },
  { order: 11, id: "g10", label: "Fair Play World", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.2", "1.1", "1.3", "1.4", "2.1", "2.2", "2.3"], prereq: "g09", buildsOn: "g07", note: "Sharing chores & opportunity fairly", emoji: "⚖️", game: "fair-play", href: "/game/fair-play" },
  { order: 12, id: "g11", label: "Not Fair, Not Funny", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.3"], prereq: "g10", buildsOn: "g10", note: "Gender teasing, and being an ally", emoji: "🙅", game: "not-funny", href: "/game/not-funny" },
  { order: 13, id: "g12", label: "Smart Screen Heroes", type: "lesson", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "G", threadName: "Values, Rights & Media", hex: "#475569", topics: ["5.2", "5.4", "8.2", "8.3"], prereq: "g11", note: "Media real-vs-pretend, choices, hygiene, caring", emoji: "📱", game: "smart-screen", href: "/game/smart-screen" },
  { order: 14, id: "c2", label: "Capstone: Fair & Safe Explorer", type: "capstone", chapter: "Ch.2 · Ages 6–9", ageGate: 6, thread: "★", threadName: "Capstone milestone", hex: "#EAB308", topics: [], prereq: "g12", note: "Chapter 2 graduation", emoji: "🏆", game: "capstone-2", href: "/game/capstone-2" },
  { order: 15, id: "g13", label: "Puberty Quest", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "A", threadName: "Body & Growing Up", hex: "#0EA5E9", topics: ["6.3", "6.1", "6.4", "7.2"], prereq: "c2", buildsOn: "g06", note: "Puberty — timely; builds on Body Lab", emoji: "🌱", game: "puberty-quest", href: "/game/puberty-quest" },
  { order: 16, id: "g14", label: "The Amazing Journey", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["6.2", "8.1"], prereq: "g13", buildsOn: "g13", note: "Reproduction — after anatomy & puberty", emoji: "🧬", game: "amazing-journey", href: "/game/amazing-journey" },
  { order: 17, id: "g15", label: "Boundary Bot", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "B", threadName: "Safety, Consent & Boundaries", hex: "#DC2626", topics: ["4.1", "4.2", "4.3", "3.3", "5.5"], prereq: "g14", buildsOn: "g08", note: "Consent, boundaries & online safety", emoji: "🤖", game: "boundary-bot", href: "/game/boundary-bot" },
  { order: 18, id: "g16", label: "Crossroads", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "D", threadName: "Relationships", hex: "#EC4899", topics: ["1.1", "1.2", "1.4", "5.1", "5.2", "5.3", "7.1"], prereq: "g15", buildsOn: "g09", note: "Peer pressure, decisions & feelings", emoji: "🔀", game: "crossroads", href: "/game/crossroads" },
  { order: 19, id: "g17", label: "Flip the Script", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.1", "3.2", "1.3", "2.1", "2.2", "2.3", "5.4"], prereq: "g16", buildsOn: "g10", note: "Spot & remix gender stereotypes in media", emoji: "🎬", game: "flip-script", href: "/game/flip-script" },
  { order: 20, id: "g18", label: "Norm Storm", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.2", "2.3"], prereq: "g17", buildsOn: "g17", note: "Which social norms help, and which harm", emoji: "🌪️", game: "norm-storm", href: "/game/norm-storm" },
  { order: 21, id: "g19", label: "Speak Up", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.3", "5.5"], prereq: "g18", buildsOn: "g11", note: "Forms of gender-based harm & where to get help", emoji: "📣", game: "speak-up", href: "/game/speak-up" },
  { order: 22, id: "g20", label: "Defenders of the Body", type: "lesson", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["8.2", "8.3"], prereq: "g19", buildsOn: "g12", note: "HIV & infections; reducing stigma", emoji: "🦠", game: "defenders", href: "/game/defenders" },
  { order: 23, id: "c3", label: "Capstone: Growing Up Smart", type: "capstone", chapter: "Ch.3 · Ages 9–12", ageGate: 9, thread: "★", threadName: "Capstone milestone", hex: "#EAB308", topics: [], prereq: "g20", note: "Chapter 3 graduation", emoji: "🏆", game: "capstone-3", href: "/game/capstone-3" },
  { order: 24, id: "g21", label: "Body Confident", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "A", threadName: "Body & Growing Up", hex: "#0EA5E9", topics: ["6.1", "6.3", "6.4"], prereq: "c3", buildsOn: "g13", note: "Puberty depth & body image", emoji: "💪", game: "body-confident", href: "/game/body-confident" },
  { order: 25, id: "g22", label: "Plan It", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["6.2", "8.1"], prereq: "g21", buildsOn: "g14", note: "Fertility, pregnancy & contraception", emoji: "🗓️", game: "plan-it", href: "/game/plan-it" },
  { order: 26, id: "g23", label: "Outbreak: Stop the Spread", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["8.2", "8.3"], prereq: "g22", buildsOn: "g20", note: "STIs & HIV", emoji: "🧫" },
  { order: 27, id: "g24", label: "Green Light / Red Light", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "B", threadName: "Safety, Consent & Boundaries", hex: "#DC2626", topics: ["1.2", "4.2", "5.3", "7.1", "7.2"], prereq: "g23", buildsOn: "g15", note: "Reading healthy vs unhealthy relationships (flagship)", emoji: "🚦", game: "glrl", href: "/decks" },
  { order: 28, id: "g25", label: "MythBuster: Gender", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.1", "3.2"], prereq: "g24", buildsOn: "g18", note: "Bust the gender myths teens hear constantly", emoji: "💡", game: "mythbuster", href: "/play/mythbuster" },
  { order: 29, id: "g26", label: "Equalize", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.1", "3.2", "1.4", "2.2", "3.3", "4.1"], prereq: "g25", buildsOn: "g10", note: "Equality pays off; child marriage", emoji: "🟰" },
  { order: 30, id: "g27", label: "Stand Up", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "B", threadName: "Safety, Consent & Boundaries", hex: "#DC2626", topics: ["3.3", "4.1", "2.2"], prereq: "g26", buildsOn: "g19", note: "GBV: bystander action & rights", emoji: "✊", game: "stand-up", href: "/game/stand-up" },
  { order: 31, id: "g28", label: "Reality Check", type: "lesson", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "G", threadName: "Values, Rights & Media", hex: "#475569", topics: ["5.1", "5.2", "5.4", "5.5", "2.1", "2.3"], prereq: "g27", buildsOn: "g16", note: "Decisions, media & pornography literacy, finding help", emoji: "🔍" },
  { order: 32, id: "c4", label: "Capstone: Reading Relationships", type: "capstone", chapter: "Ch.4 · Ages 12–15", ageGate: 12, thread: "★", threadName: "Capstone milestone", hex: "#EAB308", topics: [], prereq: "g28", note: "Chapter 4 graduation", emoji: "🏆" },
  { order: 33, id: "g29", label: "My Choices, My Future", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["8.1", "6.2", "6.1", "6.3", "5.5", "2.2"], prereq: "c4", buildsOn: "g22", note: "Contraception, family planning & services", emoji: "🧭" },
  { order: 34, id: "g30", label: "Status: Know It", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "F", threadName: "Sexual & Reproductive Health", hex: "#059669", topics: ["8.2", "8.3"], prereq: "g29", buildsOn: "g23", note: "STI/HIV testing & treatment", emoji: "🩺" },
  { order: 35, id: "g31", label: "Mutual", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "B", threadName: "Safety, Consent & Boundaries", hex: "#DC2626", topics: ["1.2", "4.2", "5.2", "5.3", "6.4", "7.2"], prereq: "g30", buildsOn: "g24", note: "Sexual consent, legal age & relationships", emoji: "💚" },
  { order: 36, id: "g32", label: "Spectrum", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "D", threadName: "Relationships", hex: "#EC4899", topics: ["7.1", "1.3", "3.1"], prereq: "g31", buildsOn: "g24", note: "Identity, orientation & respect", emoji: "🌈" },
  { order: 37, id: "g33", label: "Lead the Way", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.2"], prereq: "g32", buildsOn: "g26", note: "Structural equality: pay gap, leadership, unpaid care", emoji: "💼", game: "lead-the-way", href: "/game/lead-the-way" },
  { order: 38, id: "g34", label: "Change Makers", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "E", threadName: "Gender & Respect", hex: "#7C3AED", topics: ["3.2", "3.3", "4.1", "2.2", "1.4"], prereq: "g33", buildsOn: "g26", note: "Campaign vs GBV & inequality; the law", emoji: "🌍", game: "change-makers", href: "/game/change-makers" },
  { order: 39, id: "g35", label: "Justice League: Rights Edition", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "G", threadName: "Values, Rights & Media", hex: "#475569", topics: ["3.3", "2.2", "3.2", "4.1", "1.4"], prereq: "g34", buildsOn: "g27", note: "Rights & redress pathways", emoji: "🏛️", game: "justice-league", href: "/game/justice-league" },
  { order: 40, id: "g36", label: "Decoded", type: "lesson", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "G", threadName: "Values, Rights & Media", hex: "#475569", topics: ["5.4", "4.3", "5.1", "2.1", "2.3", "1.1"], prereq: "g35", buildsOn: "g28", note: "Pornography & critical thinking online", emoji: "🔓" },
  { order: 41, id: "c5", label: "Capstone: Ready for the World", type: "capstone", chapter: "Ch.5 · Ages 15–18", ageGate: 15, thread: "★", threadName: "Capstone milestone", hex: "#EAB308", topics: [], prereq: "g36", note: "Final graduation — look back at the whole world built since age 4", emoji: "🏆" },
];

export type Chapter = { key: string; title: string; subtitle: string; ageGate: number; startOrder: number; endOrder: number };
export const CHAPTERS: Chapter[] = [
  { key: "Ch.1 · Ages 3–6", title: "Ch.1 · Ages 3–6", subtitle: "Everyone is equal & can-do", ageGate: 3, startOrder: 1, endOrder: 6 },
  { key: "Ch.2 · Ages 6–9", title: "Ch.2 · Ages 6–9", subtitle: "Fair is fair", ageGate: 6, startOrder: 7, endOrder: 14 },
  { key: "Ch.3 · Ages 9–12", title: "Ch.3 · Ages 9–12", subtitle: "Question the script", ageGate: 9, startOrder: 15, endOrder: 23 },
  { key: "Ch.4 · Ages 12–15", title: "Ch.4 · Ages 12–15", subtitle: "Equality in practice", ageGate: 12, startOrder: 24, endOrder: 32 },
  { key: "Ch.5 · Ages 15–18", title: "Ch.5 · Ages 15–18", subtitle: "Change the system", ageGate: 15, startOrder: 33, endOrder: 41 },
];

// ---- backward-compat shape for the classic 2D view (src/components/learning-path.tsx) ----
export type PathStatus = "active" | "locked";
export type PathNode = { id: string; title: string; emoji: string; kind: string; status: PathStatus; href?: string; tag?: "gender" };
export type PathSection = { title: string; subtitle: string; nodes: PathNode[] };
export const PATH: PathSection[] = CHAPTERS.map((ch) => ({
  title: ch.title,
  subtitle: ch.subtitle,
  nodes: NODES.filter((n) => n.chapter === ch.key).map((n) => ({
    id: n.game ?? n.id,
    title: n.label,
    emoji: n.emoji,
    kind: n.threadName,
    status: (n.game ? "active" : "locked") as PathStatus,
    href: n.href,
    tag: n.thread === "E" ? ("gender" as const) : undefined,
  })),
}));
