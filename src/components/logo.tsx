/** The app mark — The Equal Lens eQ interlock (placeholder; swap for the official /brand/logo/ export). */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/eq-mark.svg"
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`${className ?? ""} object-contain`.trim()}
    />
  );
}
