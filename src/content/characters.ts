import type { Character, CharacterId } from "@/lib/types";

// A small, deliberately diverse recurring cast (genders, faiths, backgrounds). The character
// whose relationship you read carries the run's Clarity meter — the emotional stake. Emoji are
// stand-ins until illustrated portraits land.
export const CHARACTERS: Character[] = [
  { id: "meera", name: "Meera", avatar: "👧🏽", pronoun: "she", blurb: "Class 9, into sketching. Has a new crush and wants you to help her read it." },
  { id: "aisha", name: "Aisha", avatar: "🧕🏽", pronoun: "she", blurb: "Your friend since Class 4 — until a newer friend started getting between you." },
  { id: "rohan", name: "Rohan", avatar: "👦🏾", pronoun: "he", blurb: "Lives half his life in the group chat. Someone in his DMs is getting too close." },
  { id: "kabir", name: "Kabir", avatar: "🧑🏻", pronoun: "he", blurb: "Quiet, loyal, a bit of a pushover — learning where his boundaries are." },
  { id: "coach", name: "Coach", avatar: "🦉", pronoun: "they", blurb: "Your reading mentor. Sets the hardest, most-disguised cards to test your eye." },
];

export const CHARACTER_BY_ID: Record<CharacterId, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
) as Record<CharacterId, Character>;
