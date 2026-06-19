// Puberty Quest (node #13, ages 9–12) — opens Chapter 3. A light myth-busting quest through "Puberty
// Valley": collect accurate fact cards into the Pocketbook, bust Myth Monsters with the truth (UN & RE),
// and ask anything in the anonymous Ask-It box. Menstruation-positive, even-handed (every body, for
// everybody), no-fail. One sensitive fact is gated by the School-Comfort setting.

export type Fact = { emoji: string; say: string };

// The Period Place — menstruation, positively and practically (taught co-ed by default).
export const PERIOD_FACTS: Fact[] = [
  { emoji: "🩸", say: "A period is normal, healthy blood — there's nothing dirty about it." },
  { emoji: "🔄", say: "About once a month the body sheds its lining. That's the cycle." },
  { emoji: "🧻", say: "A pad or clean cloth catches the flow — change it through the day." },
  { emoji: "🗑️", say: "Wrap and bin used pads; wash cloth and dry it in the sun. Wash your hands." },
  { emoji: "📅", say: "Tracking your dates helps you know when a period is coming." },
];

// Changes All Over — for all bodies, so everyone understands everyone.
export const CHANGE_FACTS: Fact[] = [
  { emoji: "📈", say: "Growth spurts — you get taller, sometimes fast. Totally normal." },
  { emoji: "🗣️", say: "Voices deepen, and may crack for a while. That passes." },
  { emoji: "🧔", say: "Body hair grows — underarms, legs, face, and private areas." },
  { emoji: "💦", say: "More sweat and body odour — a daily wash keeps you fresh." },
  { emoji: "🌙", say: "Wet dreams can happen in sleep. They're normal — nothing is wrong." },
];

// Moods & My Changing Self — emotional changes and body image.
export const MOOD_FACTS: Fact[] = [
  { emoji: "🎢", say: "Moods can swing up and down — that's your body changing. It's normal." },
  { emoji: "⏳", say: "Everyone changes at a different time. Early or late, you're right on time for you." },
  { emoji: "🪞", say: "Your body is changing — but you're still you." },
  { emoji: "💛", say: "Every body is a good body. Be kind to yours." },
];
// Shown only when the School-Comfort setting is OFF (the fuller setting). Factual and brief.
export const MOOD_FACT_OPEN: Fact = { emoji: "🤫", say: "Touching your own body (masturbation) is common and not harmful. It's a private thing." };

// Myth Monster battles — the UN & RE core. Choose the fact that busts the myth; the true one pops it.
export type MythFact = { text: string; ok: boolean };
export type Myth = { emoji: string; myth: string; facts: MythFact[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    emoji: "👹", myth: "“Periods are dirty!”",
    facts: [{ text: "A period is normal, healthy blood.", ok: true }, { text: "You can't cook or pray on your period.", ok: false }],
    re: "A period is normal, healthy blood — nothing dirty about it. You can do everything as usual.",
  },
  {
    emoji: "👾", myth: "“Only girls change at puberty!”",
    facts: [{ text: "All bodies change at puberty.", ok: true }, { text: "Boys don't really change.", ok: false }],
    re: "Every body changes at puberty — boys and girls alike. Knowing this ends a lot of teasing.",
  },
  {
    emoji: "🦠", myth: "“A wet dream means something's wrong!”",
    facts: [{ text: "Wet dreams are a normal part of growing up.", ok: true }, { text: "It means you're sick.", ok: false }],
    re: "Wet dreams are completely normal — nothing is wrong, and they happen on their own.",
  },
  {
    emoji: "🐲", boss: true, myth: "“Everyone develops at exactly the same time!”",
    facts: [{ text: "Bodies change at different times — that's fine.", ok: true }, { text: "If you're late, something's wrong with you.", ok: false }],
    re: "Bodies change at different times. Early or late, you are perfectly, completely normal.",
  },
];
export const MYTH_UN = "Lots of kids hear that one — it's not your fault. Let's rub it out.";
export const MYTH_MISS = "That's another myth! Try the true fact to bust the monster.";

// Ask-It — the anonymous question box. Vetted, kind answers; distress routes to help.
export type AskItem = { q: string; a: string; help?: boolean };
export const ASK_IT: AskItem[] = [
  { q: "Is it normal that one side grew before the other?", a: "Yes! Bodies often change a little unevenly, then catch up. Totally normal." },
  { q: "When will my voice change or my period start?", a: "Everyone's different — usually somewhere between 9 and 14. There's no 'right' time." },
  { q: "Why do I feel grumpy for no reason?", a: "Puberty hormones can swing your mood. It passes — and talking to someone helps." },
  { q: "Something online or in my body is worrying me.", a: "You deserve help. Tell a trusted adult or a counsellor — or call Childline 1098, free, any time.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Welcome to Puberty Valley! Every body changes — let's explore the real facts together.",
  home: "Where to next, explorer?",
  periodPlace: "The Period Place — periods are normal and healthy. Tap each fact.",
  changes: "Changes All Over — for every body. Tap to learn each one.",
  moods: "Moods & My Changing Self. Tap each fact.",
  mythMonsters: "A Myth Monster! Pick the true fact to bust it.",
  askIt: "The Ask-It box — ask anything, safely. Tap a question.",
  badge: "Pocketbook badge earned!",
  busted: "Bam! Myth busted with the truth.",
  complete: "You filled your Puberty Pocketbook and busted every myth. Every body changes — you've got this! 🌱",
};
