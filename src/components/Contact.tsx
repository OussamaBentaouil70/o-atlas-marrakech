import { photos, type EventInquiry } from "../data/site";
import { Eyebrow, Star8Outline } from "./Ornament";
import { Reveal } from "./Reveal";
import { InquiryForm } from "./InquiryForm";

/** Section 5 — Final reservation & contact */
export function Contact({
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
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-accent text-white">
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_8%_0%,rgba(0,0,0,0.2),transparent_72%)]" />
      <Star8Outline className="pointer-events-none absolute -right-24 -bottom-28 h-96 w-96 text-white/[0.04]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow align="left" tone="light">Your celebration starts here</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="type-h2 mt-5 text-white">
              Plan Your <span className="text-primary-soft">Dream Wedding</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-body-md mt-4 max-w-lg text-secondary">
              From your first moments together to your final dance beneath the stars, let
              us create a celebration as extraordinary as your love story.
            </p>
          </Reveal>

          {/* Photo 9 — general view of the estate, its architecture and pool */}
          <Reveal delay={0.22}>
            <figure className="arch relative mt-8 max-w-[460px] overflow-hidden border border-white/15 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.75)]">
              <img
                src={photos.photo9.src}
                alt={photos.photo9.alt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="dappled pointer-events-none absolute inset-0" />
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="w-full max-w-[680px] lg:ml-auto lg:pt-2">
          <InquiryForm
            variant="contact"
            inquiry={inquiry}
            onChange={onInquiryChange}
            submitted={submitted}
            submitting={submitting}
            submitError={submitError}
            onSubmitInquiry={onSubmitInquiry}
            onResetInquiry={onResetInquiry}
          />
        </Reveal>
      </div>
    </section>
  );
}
