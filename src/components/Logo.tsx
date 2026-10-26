import { useId } from "react";

/**
 * O'Atlas logo mark — an oval Moroccan arabesque medallion.
 * Drawn as one quadrant mirrored four ways so it stays perfectly symmetrical.
 * Uses currentColor, so set the colour with a text-* class.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 60 80"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <g id={`q-${id}`}>
          {/* top scroll */}
          <path d="M30 6 C38 8 44 14 44 22 C44 28 38 30 35 27 C33 25 34 22 37 22" />
          {/* inner leaf */}
          <path d="M30 15 C34 17 36 21 34 25 C33 27 31 28 30 28" />
          {/* side curl */}
          <path d="M54 40 C53 32 47 29 43 32 C40 35 41 39 44 39" />
          {/* centre petal */}
          <path d="M30 40 C30 34 34 31 37 33 C40 35 38 40 30 40" />
        </g>
      </defs>
      <ellipse cx="30" cy="40" rx="27" ry="37" />
      <use href={`#q-${id}`} />
      <use href={`#q-${id}`} transform="matrix(-1 0 0 1 60 0)" />
      <use href={`#q-${id}`} transform="matrix(1 0 0 -1 0 80)" />
      <use href={`#q-${id}`} transform="matrix(-1 0 0 -1 60 80)" />
      <circle cx="30" cy="40" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
