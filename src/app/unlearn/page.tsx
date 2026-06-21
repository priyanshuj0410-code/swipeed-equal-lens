import UnlearnRelearnCanvas, { type Myth } from "@/components/unlearn-relearn-canvas";
import { CANVAS_MYTHS } from "@/content/chapter-canvas";

// Real myths from the chapter banks (prefer the gender/respect thread) for the experience.
const PICKED: Myth[] = CANVAS_MYTHS.filter((m) => m.category.startsWith("E") || m.category.includes("/3."))
  .slice(0, 8)
  .map((m) => ({ myth: m.myth, truth: m.truth, explanation: m.explanation }));

const FALLBACK: Myth[] = [
  { myth: "Boys don't cry.", truth: "Everyone has feelings.", explanation: "Emotions aren't gendered — naming them builds empathy." },
  { myth: "Pink is for girls.", truth: "Colours have no gender.", explanation: "Pink was marketed to boys a century ago." },
  { myth: "Some jobs aren't for women.", truth: "Ability isn't decided by gender." },
];

const MYTHS = PICKED.length >= 3 ? PICKED : FALLBACK;

export default function UnlearnPage() {
  return (
    <>
      {/* Real, scrollable page content to draw on — NOT position:relative, so the overlay's
          full-document canvas (a top-level sibling below) can span the whole page. */}
      <main className="mx-auto max-w-2xl px-6 pb-44 pt-16">
        <span className="eyebrow">The Equal Lens method</span>
        <h1 className="mt-2 font-[family-name:var(--font-hand)] text-5xl font-extrabold leading-[1.05] text-[var(--color-ink)]">
          Unlearn → Relearn
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[color-mix(in_oklch,var(--color-ink),transparent_22%)]">
          Bias hides on the page — as things we were told once and never questioned. This canvas lets you
          rub those myths out, then write the truth back in. Pick up <b>UN</b> the eraser, scrub a sticky
          note until the myth smudges away, then switch to <b>RE</b> the pen to reveal what is actually true.
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-hand)] text-2xl font-extrabold text-[var(--color-ink)]">
          1 · Bias hides on the page
        </h2>
        <p className="mt-3 leading-relaxed text-[color-mix(in_oklch,var(--color-ink),transparent_25%)]">
          Most stereotypes never arrive as arguments — they arrive as background, drawn into the world
          around us until they look like plain facts. The first move is just to <i>see</i> them: to notice
          the quiet rule on the page and decide to scrub it out.
        </p>

        <h2 className="mt-10 font-[family-name:var(--font-hand)] text-2xl font-extrabold text-[var(--color-ink)]">
          2 · Pick up UN, then RE
        </h2>
        <p className="mt-3 leading-relaxed text-[color-mix(in_oklch,var(--color-ink),transparent_25%)]">
          Choose <b>Unlearn</b> from the toolbar and drag the eraser across a myth note until it fades.
          Then choose <b>Relearn</b> and draw over the cleared note — the truth, with a short why, is
          written in its place. <b>Browse</b> mode hands the page back to you: drag the notes around,
          scroll freely. <b>Reset</b> starts the wall over; <b>+ myth</b> adds another.
        </p>

        <blockquote className="mt-12 rounded-2xl border-[2.5px] border-[var(--color-ink)] bg-[var(--color-surface)] p-6 shadow-[4px_4px_0_var(--violet-200)]">
          <p className="font-[family-name:var(--font-hand)] text-xl font-bold leading-snug text-[var(--color-brand)]">
            “Myths hide in the page; UN erases them and RE writes the truth.”
          </p>
        </blockquote>

        <h2 className="mt-12 font-[family-name:var(--font-hand)] text-2xl font-extrabold text-[var(--color-ink)]">
          3 · Try it on the myths around you
        </h2>
        <p className="mt-3 leading-relaxed text-[color-mix(in_oklch,var(--color-ink),transparent_25%)]">
          The sticky notes scattered across this page are real myths from the SwipeEd learning path. Each
          one is waiting to be unlearned and relearned. On a phone they collapse into a tappable list —
          tap UN, then a card, then RE. On a desktop, grab the eraser and scrub.
        </p>
        <p className="mt-24 text-center text-sm text-[color-mix(in_oklch,var(--color-ink),transparent_45%)]">
          Tip: press <kbd className="rounded border border-current px-1">Esc</kbd> to drop the tool and go back to Browse.
        </p>
      </main>

      {/* The experience — full-document canvas + sticky notes + tool dock. Top-level sibling. */}
      <UnlearnRelearnCanvas myths={MYTHS} />
    </>
  );
}
