import { useCallback, useState } from "react";
import { Images } from "lucide-react";
import { celebrations, type Celebration } from "../data/site";
import { CelebrationGallery } from "./CelebrationGallery";
import { Eyebrow } from "./Ornament";
import { Reveal } from "./Reveal";

/** Section 2 — Event categories */
export function Celebrations() {
  const [selected, setSelected] = useState<Celebration | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="celebrations" className="relative scroll-mt-24 overflow-hidden bg-white">
      <div className="pattern-zellige pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>What we offer</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="type-h2 mt-4 text-tertiary">
              Celebrations at <span className="text-primary">O'Atlas Marrakech</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-body-md mx-auto mt-4 max-w-2xl text-surface">
              From romantic weddings to unforgettable private gatherings, discover
              extraordinary ways to celebrate in Marrakech.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {celebrations.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1}>
              <article className="group">
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-label={`Open ${item.title} gallery (${item.gallery.length} photos)`}
                  aria-haspopup="dialog"
                  className="group/gallery relative block aspect-square w-full overflow-hidden rounded-sm border border-secondary bg-neutral text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  <img
                    src={item.photo.src}
                    alt={item.photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/gallery:scale-[1.045]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-sm border border-white/30 bg-black/70 px-3 py-2 font-display text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition-colors group-hover/gallery:bg-black">
                    <Images className="h-4 w-4" />
                    View gallery · {item.gallery.length} photos
                  </span>
                </button>
                <p className="mt-5 font-display text-xs font-semibold tracking-[0.16em] text-primary">
                  0{index + 1}
                </p>
                <h3 className="mt-1.5 font-display text-xl leading-[1.25] font-semibold text-tertiary transition-colors group-hover:text-primary">
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    aria-haspopup="dialog"
                    className="text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    {item.title}
                  </button>
                </h3>
                <p className="type-body-sm mt-2.5 text-surface">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <CelebrationGallery celebration={selected} onClose={close} />
    </section>
  );
}
