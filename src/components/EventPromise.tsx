import { HeartHandshake, Sparkles, TreePalm } from "lucide-react";
import { promises } from "../data/site";
import { Eyebrow, Star8Outline } from "./Ornament";
import { Reveal } from "./Reveal";

const icons = {
  sparkles: Sparkles,
  palm: TreePalm,
  heart: HeartHandshake,
};

/** Section 3 — Our event promise */
export function EventPromise() {
  return (
    <section id="promise" className="relative scroll-mt-24 overflow-hidden bg-tertiary text-white">
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_0%,rgba(0,0,0,0.22),transparent_72%)]" />
      <Star8Outline className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 text-white/[0.04]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow tone="light">The O'Atlas experience</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="type-h2 mt-4 text-white">
              Our Event <span className="text-primary-soft">Promise</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-body-md mt-4 text-secondary">
              A beautiful setting, thoughtful details and unforgettable moments.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {promises.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <Reveal key={item.title} delay={index * 0.1}>
                <article className="group h-full rounded-lg border border-white/12 bg-accent p-8 transition-colors duration-300 hover:border-primary-soft/60">
                  <span className="grid h-12 w-12 place-items-center rounded-sm bg-primary/20 text-primary-soft transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-6 font-display text-xl leading-[1.25] font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="type-body-sm mt-2.5 text-secondary">{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
