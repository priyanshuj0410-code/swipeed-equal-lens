/** The Green Light / Red Light mark — two arrows swapping (swipe right = green, left = red). */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(-38 60 60)">
        <path d="M30 52 A30 30 0 0 1 90 52" stroke="#62b84b" strokeWidth="12" strokeLinecap="round" />
        <path d="M83 44 L99 50 L86 63 Z" fill="#62b84b" />
        <g transform="rotate(180 60 60)">
          <path d="M30 52 A30 30 0 0 1 90 52" stroke="#e05c52" strokeWidth="12" strokeLinecap="round" />
          <path d="M83 44 L99 50 L86 63 Z" fill="#e05c52" />
        </g>
      </g>
    </svg>
  );
}
