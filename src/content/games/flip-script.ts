// "Flip the Script" — ages 9–12, UNESCO topics 3.1 & 3.2 (social construction + stereotypes).
// Media-remix. The player is a media editor: each mock ad/poster carries a gender stereotype;
// the player swaps in a fair alternative and sees a before/after. India adaptation: Bollywood,
// TV and advertising literacy — colourism / 'fairness' products, 'lady of the house', the
// rescued-heroine trope — handled at a pre-teen, no-explicit-content level.

export type Swap = { text: string; fair: boolean };
export type Ad = {
  poster: string;
  emoji: string;
  original: string; // the biased line to fix
  options: Swap[];
  cheer: string; // shown after a fair remix
};

export const ADS: Ad[] = [
  {
    poster: "Fairness Cream Ad",
    emoji: "🧴",
    original: "“Get fair skin to find a husband.”",
    options: [
      { text: "“Get fair skin to get the job.”", fair: false },
      { text: "“Your skin is already perfect.”", fair: true },
      { text: "“Buy two, get one free!”", fair: false },
    ],
    cheer: "You busted the colourism!",
  },
  {
    poster: "Kitchen Product Poster",
    emoji: "🍲",
    original: "“For the lady of the house.”",
    options: [
      { text: "“For every good wife.”", fair: false },
      { text: "“For whoever cooks.”", fair: true },
      { text: "“Mothers know best.”", fair: false },
    ],
    cheer: "Cooking isn't only for women!",
  },
  {
    poster: "Dance Show Clip",
    emoji: "🕺",
    original: "“Boys who dance get laughed at.”",
    options: [
      { text: "“Boys should play sports instead.”", fair: false },
      { text: "“The boy wins the dance contest!”", fair: true },
      { text: "“Only girls should dance.”", fair: false },
    ],
    cheer: "Boys can dance — and shine!",
  },
  {
    poster: "Toy Advert",
    emoji: "🧸",
    original: "“Dolls for girls, cars for boys.”",
    options: [
      { text: "“Pink toys for girls only.”", fair: false },
      { text: "“Every toy is for every kid.”", fair: true },
      { text: "“Boys get the cool toys.”", fair: false },
    ],
    cheer: "Toys have no gender!",
  },
  {
    poster: "Movie Poster",
    emoji: "🎬",
    original: "“The hero saves the helpless girl.”",
    options: [
      { text: "“The girl waits to be rescued.”", fair: false },
      { text: "“The girl saves the day too!”", fair: true },
      { text: "“Girls can't be heroes.”", fair: false },
    ],
    cheer: "Girls can be heroes!",
  },
];
