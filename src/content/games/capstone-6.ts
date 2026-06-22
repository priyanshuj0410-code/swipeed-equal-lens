import type { CapstoneConfig } from "@/components/games/capstone-engine";

// Capstone 6 — "Standing on My Own" (node c6): the Chapter 6 (ages 18–22, College) graduation. A warm,
// no-fail celebration where Sam recaps the chapter's nine big ideas (Consent For Real → Know Your Rights),
// lighting a star for each, then graduates an independent young adult onward to building a life.
export const CAPSTONE_6: CapstoneConfig = {
  gameId: "capstone-6",
  title: "Capstone: Standing on My Own",
  doneTitle: "🎓 Standing on my own!",
  coins: 50,
  greet: "Chapter Six done — you're standing on your own two feet. Let's light a star for each big idea. Tap one!",
  graduate: "You did it! Chapter Six complete — an independent young adult, ready for what's next.",
  complete: "Standing on your own: consent, relationships, health, money, mind and rights — all yours now. Onward to building a life. 💜",
  recap: [
    { emoji: "🫶", idea: "Consent is an active, ongoing, sober-enough yes — and I support survivors.", sam: "You learned consent, for real." },
    { emoji: "💞", idea: "I date safely, read people honestly, and treat everyone kindly.", sam: "You swipe smart." },
    { emoji: "💚", idea: "I know healthy from controlling — and I can leave safely.", sam: "You can read a real relationship." },
    { emoji: "🩺", idea: "I own my health — protection, testing, no shame.", sam: "You own your health." },
    { emoji: "💰", idea: "I budget, dodge the traps, and keep money fair.", sam: "You've got money sorted." },
    { emoji: "🫂", idea: "I belong, I cope well, and asking for help is strength.", sam: "You found your mind and belonging." },
    { emoji: "🌟", idea: "My worth isn't my CV — I find my own path.", sam: "You found your feet." },
    { emoji: "🗣️", idea: "I claim my voice, lead, and back others.", sam: "You're equal and confident." },
    { emoji: "⚖️", idea: "I know my rights — and I can claim them.", sam: "You know your rights." },
  ],
};
