import { cn } from "../utils/cn";

/** Eight-pointed khatam star with a transparent center cutout so it works on any background. */
export function Star8({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M50 17.5 L59.5 27 H73 V40.5 L82.5 50 L73 59.5 V73 H59.5 L50 82.5 L40.5 73 H27 V59.5 L17.5 50 L27 40.5 V27 H40.5 Z M50 40 A10 10 0 1 0 50 60 A10 10 0 1 0 50 40 Z"
      />
    </svg>
  );
}

/** Outlined variant for watermarks and large decorations. */
export function Star8Outline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="24" y="24" width="52" height="52" />
      <rect x="24" y="24" width="52" height="52" transform="rotate(45 32 32)" />
      <circle cx="50" cy="50" r="12" />
      <circle cx="50" cy="50" r="46" strokeDasharray="2 5" />
    </svg>
  );
}

/** Small section label: line — star — label — star — line */
export function Eyebrow({
  children,
  tone = "dark",
  align = "center",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-display text-[0.75rem] font-semibold tracking-[0.22em] uppercase",
        tone === "dark" ? "text-primary" : "text-primary-soft",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      {align === "center" && <span className="h-px w-8 bg-current opacity-40" />}
      <Star8 className={cn("h-3 w-3 shrink-0", tone === "dark" ? "text-primary" : "text-primary-soft")} />
      <span>{children}</span>
      <Star8 className={cn("h-3 w-3 shrink-0", tone === "dark" ? "text-primary" : "text-primary-soft")} />
      <span className="h-px w-8 bg-current opacity-40" />
    </div>
  );
}
