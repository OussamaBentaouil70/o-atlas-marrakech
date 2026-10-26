import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { photos, type EventInquiry } from "../data/site";
import { InquiryForm } from "./InquiryForm";
import { Star8 } from "./Ornament";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  inquiry,
  onInquiryChange,
  submitted,
  submitting,
  submitError,
  onSubmitInquiry,
  onResetInquiry,
}: {
  inquiry: EventInquiry;
  onInquiryChange: (inquiry: EventInquiry) => void;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  onSubmitInquiry: () => void | Promise<void>;
  onResetInquiry: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-3%", "8%"]);

  return (
    <section ref={ref} id="top" className="relative isolate min-h-svh overflow-hidden bg-accent text-white">
      {/* Photo 2 — night view of the estate and illuminated pool */}
      <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        <img src={photos.photo2.src} alt={photos.photo2.alt} className="h-full w-full object-cover" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(41,41,41,0.92)_0%,rgba(41,41,41,0.8)_40%,rgba(41,41,41,0.55)_72%,rgba(41,41,41,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,41,41,0.55)_0%,transparent_26%,transparent_72%,rgba(41,41,41,0.5)_100%)]" />
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.045]" />

      <div className="relative z-10 mx-auto grid min-h-svh max-w-7xl content-center items-center gap-8 px-5 pt-28 pb-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:pt-32 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease }}
          className="max-w-xl"
        >
          <p className="flex items-center gap-3 font-display text-[0.75rem] font-semibold tracking-[0.22em] text-primary-soft uppercase">
            <Star8 className="h-3.5 w-3.5 shrink-0 text-primary-soft" />
            Luxury weddings &amp; events in Marrakech
          </p>

          <h1 className="type-h1 mt-5 text-white">
            Extraordinary Weddings,
            <br />
            <span className="text-primary-soft">Timeless Celebrations</span>
          </h1>

          <p className="mt-5 font-display text-lg font-medium text-secondary sm:text-xl">
            Where Moroccan elegance meets unforgettable moments.
          </p>

          <p className="type-body-md mt-4 max-w-lg text-white/90">
            O'Atlas Marrakech offers an exceptional setting for destination weddings and
            exclusive celebrations, surrounded by palm trees, elegant architecture and
            beautiful reflecting pools.
          </p>
          <p className="type-body-md mt-3 max-w-lg text-secondary">
            From romantic waterside ceremonies to spectacular evening receptions, every
            celebration becomes an unforgettable experience.
          </p>

          <a href="#inquiry" className="btn-light group mt-8">
            Plan your celebration
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.16, ease }}
          className="w-full max-w-[640px] lg:ml-auto"
        >
          <InquiryForm
            variant="hero"
            inquiry={inquiry}
            onChange={onInquiryChange}
            submitted={submitted}
            submitting={submitting}
            submitError={submitError}
            onSubmitInquiry={onSubmitInquiry}
            onResetInquiry={onResetInquiry}
          />
        </motion.div>
      </div>
    </section>
  );
}
