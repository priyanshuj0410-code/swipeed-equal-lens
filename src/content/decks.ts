import type { Card, Deck, DeckId } from "@/lib/types";
import { CARDS } from "@/content/cards";

// Deck registry. Display order = MVP focus first (Daily, Online, Friendships), then
// the rest, with the romantic "Crushes & Dating" deck last (hidden in School-Comfort Mode).
export const DECKS: Deck[] = [
  { id: "daily", title: "Daily Deck", blurb: "10 mixed cards — your daily warm-up", schoolComfortSafe: true, isDaily: true },
  { id: "online", title: "Online & DMs", blurb: "Spot red flags in chats, posts and DMs", schoolComfortSafe: true },
  { id: "friendships", title: "Friendships", blurb: "Trust, loyalty and respect between friends", schoolComfortSafe: true },
  { id: "family", title: "Family & Boundaries", blurb: "Care, privacy and 'your body, your rules'", schoolComfortSafe: true },
  { id: "peer", title: "Peer, Group & Self", blurb: "Pressure, moods and being yourself", schoolComfortSafe: true },
  { id: "norm-busters", title: "Norm-Busters", blurb: "Challenge the things people normalise", schoolComfortSafe: true },
  { id: "crushes", title: "Crushes & Dating", blurb: "Early romance: pace, respect and control", schoolComfortSafe: false },
];

export const DECK_BY_ID: Record<DeckId, Deck> = Object.fromEntries(
  DECKS.map((d) => [d.id, d])
) as Record<DeckId, Deck>;

/** Themed-deck cards (non-daily). */
export function cardsForDeck(deckId: DeckId): Card[] {
  return CARDS.filter((c) => c.deck === deckId);
}

/** Decks visible given School-Comfort Mode. */
export function availableDecks(schoolComfort: boolean): Deck[] {
  return DECKS.filter((d) => !schoolComfort || d.schoolComfortSafe);
}

// Deterministic shuffle (mulberry32) so the Daily Deck is stable within a day.
function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed >>> 0;
  const rand = () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A daily mix of 10 cards drawn from the school-comfort-safe themed decks. */
export function dailyCards(schoolComfort: boolean, date = new Date()): Card[] {
  const pool = CARDS.filter(
    (c) => c.deck !== "daily" && (!schoolComfort || DECK_BY_ID[c.deck].schoolComfortSafe)
  );
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  return seededShuffle(pool, seed).slice(0, 10);
}

/** Resolve the playable card list for any deck id (handles the synthetic Daily deck). */
export function resolveDeckCards(deckId: DeckId, schoolComfort: boolean): Card[] {
  return deckId === "daily" ? dailyCards(schoolComfort) : cardsForDeck(deckId);
}
