import { useCallback, useState } from "react";
import { signatureExperiences } from "../data/site";
import { Eyebrow } from "./Ornament";
import { PhotoLightbox, ZoomableImage, type ZoomPhoto } from "./PhotoLightbox";
import { Reveal } from "./Reveal";
import { cn } from "../utils/cn";

/** Section 4 — Featured event formats. Layout: 2 large items, then 3 smaller ones. */
export function SignatureExperiences() {
  const [zoomed, setZoomed] = useState<ZoomPhoto | null>(null);
  const close = useCallback(() => setZoomed(null), []);

  return (
    <section id="experiences" className="texture-linen relative scroll-mt-24 overflow-hidden bg-neutral">
      <div className="pattern-zellige pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow align="left">Signature experiences</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="type-h2 mt-4 text-tertiary">
                Unforgettable Ways to <span className="text-primary">Celebrate</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="md:col-span-5">
            <p className="type-body-md text-tertiary/80">
              Discover the settings and experiences that make O'Atlas Marrakech a
              remarkable destination for weddings and private events.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
          {signatureExperiences.map((item, index) => {
            const featured = index < 2;
            return (
              <Reveal
                key={item.title}
                delay={(featured ? index : index - 2) * 0.1}
                className={cn(featured ? "lg:col-span-3" : "lg:col-span-2", index === 4 && "sm:col-span-2 lg:col-span-2")}
              >
                <article className="group h-full overflow-hidden rounded-lg border border-secondary bg-white">
                  <ZoomableImage
                    photo={{ ...item.photo, title: item.title }}
                    onOpen={setZoomed}
                    className={cn("aspect-square", index === 4 && "sm:aspect-[2/1] lg:aspect-square")}
                  />
                  <div className="p-5 sm:p-6">
                    <h3
                      className={cn(
                        "font-display leading-[1.25] font-semibold text-tertiary transition-colors group-hover:text-primary",
                        featured ? "text-xl sm:text-[1.35rem]" : "text-lg",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="type-body-sm mt-2 max-w-md text-surface">{item.description}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
      <PhotoLightbox photo={zoomed} onClose={close} />
    </section>
  );
}
