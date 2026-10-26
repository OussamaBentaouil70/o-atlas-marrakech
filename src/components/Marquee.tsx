import { Star8 } from "./Ornament";

const phrases = [
  "Destination weddings",
  "Poolside ceremonies",
  "Receptions beneath the stars",
  "Traditional Moroccan welcomes",
  "Illuminated palm gardens",
  "Private celebrations",
];

export function Marquee() {
  const row = [...phrases, ...phrases];
  return (
    <div id="marquee" className="relative scroll-mt-24 overflow-hidden bg-primary py-3.5 text-white" aria-hidden="true">
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div className="animate-marquee flex w-max items-center gap-10 pr-10 whitespace-nowrap">
        {row.map((p, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-sm font-semibold tracking-[0.14em] text-white uppercase sm:text-base">
              {p}
            </span>
            <Star8 className="h-3.5 w-3.5 shrink-0 text-secondary" />
          </span>
        ))}
      </div>
    </div>
  );
}
