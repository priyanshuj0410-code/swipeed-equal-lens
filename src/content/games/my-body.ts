// Content for My Body, My Rules (node #2, ages 3–6) — the body-safety foundation. Audio-first,
// no-fail, EMPOWERING NEVER FRIGHTENING. Built on the PANTS / good-touch–bad-touch model (POCSO/NCERT).
// All touch content is plain words only — never graphic. "It's never your fault" is unconditional.

export type BodyPart = { id: string; name: string; emoji: string; say: string };
export const BODY_PARTS: BodyPart[] = [
  { id: "eyes", name: "Eyes", emoji: "👀", say: "Your eyes — to see the whole world!" },
  { id: "ears", name: "Ears", emoji: "👂", say: "Your ears — to hear songs and stories!" },
  { id: "nose", name: "Nose", emoji: "👃", say: "Your nose — to smell yummy food!" },
  { id: "mouth", name: "Mouth", emoji: "👄", say: "Your mouth — to talk, laugh and say a big NO!" },
  { id: "hands", name: "Hands", emoji: "✋", say: "Your hands — to wave, hold and play!" },
  { id: "legs", name: "Legs", emoji: "🦵", say: "Your legs — strong, for running and jumping!" },
  { id: "feet", name: "Feet", emoji: "🦶", say: "Your feet — to walk, dance and stomp!" },
];

// The gentle default for privacy (the "underwear rule"). Correct anatomical names are introduced only
// with caregiver framing when School-Comfort is OFF (see the component); never listed clinically in the UI.
export const UNDERWEAR_RULE = "The parts under your underwear or swimsuit are your private parts. They belong to YOU.";
export const CORRECT_NAMES_NOTE = "Your private parts have real names too — it's okay to use them with a grown-up you trust.";
export const MINE_CHANT = "My body, my rules!";
export const MINE_SAY = "Your body belongs to YOU. You are the boss of your own body.";

// Safe / Unsafe / Not-Sure — plain cartoon situations the child sorts. Non-graphic. The safe move and
// "never your fault" are reinforced every time.
export type TouchKind = "safe" | "unsafe" | "notsure";
export type TouchCard = { text: string; kind: TouchKind; emoji: string };
export const TOUCH_CARDS: TouchCard[] = [
  { text: "A hug from someone you love, that you want.", kind: "safe", emoji: "🤗" },
  { text: "Holding a friend's hand.", kind: "safe", emoji: "🤝" },
  { text: "A doctor checks you with a parent there.", kind: "safe", emoji: "🩺" },
  { text: "Someone touches the parts under your underwear.", kind: "unsafe", emoji: "🚫" },
  { text: "Someone hurts you on purpose.", kind: "unsafe", emoji: "🚫" },
  { text: "Someone asks you to touch their private parts.", kind: "unsafe", emoji: "🚫" },
  { text: "A hug you do NOT want.", kind: "notsure", emoji: "🤔" },
  { text: "A tickle that won't stop when you say stop.", kind: "notsure", emoji: "🤔" },
  { text: "Someone says, “this is our little secret.”", kind: "notsure", emoji: "🤔" },
];

export const TOUCH_RULE: Record<TouchKind, string> = {
  safe: "That's a safe, kind touch. 💛",
  unsafe: "Say NO, move away, and tell a trusted grown-up. It is never, ever your fault.",
  notsure: "Not sure? You can still say no — and tell a trusted grown-up. It is never your fault.",
};
export const TOUCH_LABEL: Record<TouchKind, string> = { safe: "Safe", unsafe: "Unsafe", notsure: "Not sure" };

// The Big No, pointed at touch (carried over from Feelings Friends).
export type BigNo = { label: string; emoji: string; sam: string; accent: string };
export const BIG_NO_TOUCH: BigNo[] = [
  { label: "No!", emoji: "✋", sam: "A big, strong NO! You're the boss of your body!", accent: "#E05C52" },
  { label: "Stop!", emoji: "🛑", sam: "STOP! Loud and clear!", accent: "#FF9F40" },
  { label: "I don't like that!", emoji: "🙅", sam: "Brilliant — your voice is powerful!", accent: "#7C5CFC" },
  { label: "Move away", emoji: "🚶", sam: "Move away and go tell a grown-up. Well done!", accent: "#5B9BD5" },
];

// My Safety Net — trusted grown-ups the child can tell anything to (pick avatars, no photos).
export type Trusted = { id: string; name: string; emoji: string };
export const TRUSTED: Trusted[] = [
  { id: "mum", name: "Mum", emoji: "👩" },
  { id: "dad", name: "Dad", emoji: "👨" },
  { id: "grandma", name: "Grandma", emoji: "👵" },
  { id: "grandpa", name: "Grandpa", emoji: "👴" },
  { id: "teacher", name: "Teacher", emoji: "🧑‍🏫" },
  { id: "aunt", name: "Aunty", emoji: "👩‍🦰" },
  { id: "doctor", name: "Doctor", emoji: "🧑‍⚕️" },
  { id: "sibling", name: "Big sister/brother", emoji: "🧑" },
];
export const NET_TARGET = 3; // build at least 3 trusted grown-ups
export const TELL_RULE = "If one grown-up can't help, tell another — and keep telling until someone does.";
export const HELPLINE = "Childline — call 1098. A kind grown-up who helps, any time. (Grown-ups: also the POCSO e-Box.)";

export const SAM = {
  greet: "Your body is amazing — and it's all yours! 💪",
  home: "What shall we play?",
  body: "Tap a part — let's name your amazing body.",
  mine: "Say it with me: my body, my rules!",
  touch: "Is this one safe, unsafe, or not sure?",
  bigNo: "Let's practise our big, brave NO!",
  net: "Who are your trusted grown-ups? Pick the ones you can tell anything.",
  netDone: "That's your Safety Net! You can always tell them. 💛",
  boss: "You're the boss of your own body! 🌟",
};
