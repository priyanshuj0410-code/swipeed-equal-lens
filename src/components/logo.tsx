/** The app mark — The Equal Lens eQ interlock (official, /brand/logo/). No effects on the mark. */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo/primary.svg"
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`${className ?? ""} object-contain`.trim()}
    />
  );
}
