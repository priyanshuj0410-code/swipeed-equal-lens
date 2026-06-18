import { SwipeDeck } from "@/components/swipe-deck";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-8 px-5 py-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">
            S
          </span>
          <span className="text-xl font-semibold tracking-tight">SwipeEd</span>
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">
          Active micro-learning, one swipe at a time. Swipe right if you know it, left to review.
        </p>
      </header>

      <main className="flex w-full flex-1 items-center justify-center">
        <SwipeDeck />
      </main>

      <footer className="text-center text-xs text-muted-foreground">
        First game on the <span className="font-medium text-foreground">Praxis</span> engine ·
        installable PWA
      </footer>
    </div>
  );
}
