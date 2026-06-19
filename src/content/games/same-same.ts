// "Same Same, Different" — ages 3–6, UNESCO topic 3.1 (with respect).
// Audio-first, no-reading, no-fail. Two children appear side by side; the child taps
// what's the SAME (worth & feelings) then what's DIFFERENT (celebrated, never ranked).
// India adaptation: the pairs span faith, skin tone, ability and gender; gently counters
// early colourism and son-preference. Every tap gets a kind response.

export type Kid = { emoji: string; name: string };

export type Trait = {
  emoji: string;
  label: string; // short caption for the co-playing adult
  say: string; // the spoken / bubble line
};

export type SamePair = {
  left: Kid;
  right: Kid;
  same: Trait[];
  different: Trait[];
};

export const SAME_SAME: { pairs: SamePair[] } = {
  pairs: [
    {
      left: { emoji: "👧🏽", name: "Meena" },
      right: { emoji: "👦🏾", name: "Arjun" },
      same: [
        { emoji: "🏏", label: "both love cricket", say: "We both love cricket!" },
        { emoji: "😄", label: "both can be happy", say: "We can both be happy!" },
        { emoji: "🤝", label: "both deserve a turn", say: "We both deserve a turn!" },
      ],
      different: [
        { emoji: "💇", label: "different hair", say: "Different hair — wonderful!" },
        { emoji: "👕", label: "different clothes", say: "Different clothes — wonderful!" },
      ],
    },
    {
      left: { emoji: "🧑🏻‍🦽", name: "Sara" },
      right: { emoji: "👦🏽", name: "Dev" },
      same: [
        { emoji: "🎨", label: "both love to paint", say: "We both love to paint!" },
        { emoji: "🦁", label: "both can be brave", say: "We can both be brave!" },
        { emoji: "😢", label: "both can cry", say: "We can both cry!" },
      ],
      different: [
        { emoji: "♿", label: "one uses a wheelchair", say: "We move in different ways — wonderful!" },
        { emoji: "🌈", label: "different favourite colour", say: "Different colours — wonderful!" },
      ],
    },
    {
      left: { emoji: "👧🏼", name: "Priya" },
      right: { emoji: "👦🏿", name: "Sam" },
      same: [
        { emoji: "🧭", label: "both can lead", say: "We can both lead the team!" },
        { emoji: "💃", label: "both can dance", say: "We can both dance!" },
        { emoji: "📚", label: "both love to learn", say: "We both love to learn!" },
      ],
      different: [
        { emoji: "🎽", label: "different clothes", say: "Different clothes — wonderful!" },
        { emoji: "🙂", label: "different smile", say: "Different smiles — wonderful!" },
      ],
    },
  ],
};
