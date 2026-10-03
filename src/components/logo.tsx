/** The SwipeEd logo (official, public/brand/swipeed/, SWED-125): the card stack with the coral arrow. The dark
 *  version (no dark outline) shows in dark mode and in the adult chapters, where the outline would vanish. */
export function Logo({ className, title }: { className?: string; title?: string }) {
  const hidden = title ? undefined : true;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/swipeed/logo.svg" alt={title ?? ""} aria-hidden={hidden} draggable={false} className={`${className ?? ""} object-contain dark:hidden`.trim()} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/swipeed/logo-on-dark.svg" alt={title ?? ""} aria-hidden={hidden} draggable={false} className={`${className ?? ""} hidden object-contain dark:block`.trim()} />
    </>
  );
}
