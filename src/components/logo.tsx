/** The SwipeEd app mark. */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/swipeed-logo.svg"
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`${className ?? ""} rounded-[20%] object-cover`.trim()}
    />
  );
}
