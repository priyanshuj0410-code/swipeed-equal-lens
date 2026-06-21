// Per-chapter canvas content (myths / facts / doodles), authored from the GDD "myths vs truth"
// banks — see "SwipeEd Canvas — Chapter N.json" + the "Chapter Canvas Theming" design doc.
// The canvas world dresses each chapter's stretch of the path with that chapter's struck-through
// myths (bias on the page) and the truth RE writes in their place. Light theme (kids ch.1–5).
import ch1 from "./chapter-1.json";
import ch2 from "./chapter-2.json";
import ch3 from "./chapter-3.json";
import ch4 from "./chapter-4.json";
import ch5 from "./chapter-5.json";

export type CanvasMyth = {
  id: string;
  node: string;
  category: string;
  audience: string;
  chapter: number;
  myth: string;
  truth: string;
  explanation: string;
  sources: string[];
};

export type ChapterCanvas = {
  chapter: number;
  title: string;
  ages: string;
  audience: string;
  theme: string;
  myths: CanvasMyth[];
  doodles?: { id: string; name: string; motif: string; role: string; accent: string }[];
  canvasFeel?: string;
};

export const CHAPTER_CANVAS = [ch1, ch2, ch3, ch4, ch5] as unknown as ChapterCanvas[];

// All myths, tagged with their chapter number, in path order.
export const CANVAS_MYTHS: CanvasMyth[] = CHAPTER_CANVAS.flatMap((c) =>
  c.myths.map((m) => ({ ...m, chapter: c.chapter }))
);
