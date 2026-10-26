import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  eventTypeOptions,
  formatEventDate,
  type EventInquiry,
} from "../data/site";
import { Star8 } from "./Ornament";
import { cn } from "../utils/cn";

interface InquiryErrors {
  name?: string;
  email?: string;
  eventType?: string;
  guestCount?: string;
}

const copy = {
  hero: {
    eyebrow: "Start planning",
    title: "Start Planning Your Celebration",
    subtitle: "Share your vision and let us help you create an extraordinary event.",
    submit: "Send inquiry",
  },
  contact: {
    eyebrow: "Reservation",
    title: "Wedding & Event Reservation",
    subtitle: "Share your event details and let us help bring your vision to life.",
    submit: "Send event inquiry",
  },
} as const;

export function InquiryForm({
  variant,
  inquiry,
  onChange,
  submitted,
  submitting,
  submitError,
  onSubmitInquiry,
  onResetInquiry,
}: {
  variant: "hero" | "contact";
  inquiry: EventInquiry;
  onChange: (inquiry: EventInquiry) => void;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  onSubmitInquiry: () => void | Promise<void>;
  onResetInquiry: () => void;
}) {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const isHero = variant === "hero";
  const text = copy[variant];
  const prefix = `${variant}-inquiry`;
  const now = new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    setErrors({});
  }, [submitted]);

  const update = (patch: Partial<EventInquiry>) => onChange({ ...inquiry, ...patch });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const next: InquiryErrors = {};
    if (inquiry.name.trim().length < 2) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inquiry.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!inquiry.eventType) next.eventType = "Choose the type of event.";
    if (!inquiry.guestCount || Number(inquiry.guestCount) < 1 || Number(inquiry.guestCount) > 2000) {
      next.guestCount = "Enter an estimated guest count (1–2,000).";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    void onSubmitInquiry();
  };

  const reset = () => {
    setErrors({});
    onResetInquiry();
  };

  return (
    <div
      id={isHero ? "inquiry" : undefined}
      className="relative scroll-mt-28 overflow-hidden rounded-lg border border-secondary bg-white text-tertiary shadow-[0_28px_60px_-28px_rgba(41,41,41,0.55)]"
    >
      <div className="pattern-zellige pointer-events-none absolute inset-x-0 top-0 h-20 opacity-[0.055]" />
      <div className="h-1 w-full bg-primary" />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key={`${prefix}-success`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={cn("relative", isHero ? "p-6 sm:p-7" : "p-7 sm:p-9")}
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
              className={cn(
                "grid place-items-center rounded-sm bg-primary text-white shadow-sm",
                isHero ? "h-12 w-12" : "h-14 w-14",
              )}
            >
              <BadgeCheck className={isHero ? "h-6 w-6" : "h-7 w-7"} />
            </motion.span>
            <p className="mt-4 font-arabic text-xl text-primary">شكراً</p>
            <h3 className="type-h2 mt-1 text-tertiary">
              Thank you, {inquiry.name.split(" ")[0]}.
            </h3>
            <p className="type-body-sm mt-2 text-surface">
              Your celebration is taking shape. Here is a summary of the details you shared.
            </p>
            <dl
              className={cn(
                "mt-5 grid gap-x-4 gap-y-3 rounded-lg border border-secondary bg-neutral p-4 text-sm",
                isHero ? "grid-cols-2" : "sm:grid-cols-2 sm:p-5",
              )}
            >
              {[
                ["Event", inquiry.eventType],
                ["Date", formatEventDate(inquiry.eventDate)],
                ["Guests", inquiry.guestCount],
                ["Message", inquiry.message.trim() ? "Received" : "Not added"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-display text-[0.68rem] font-semibold tracking-[0.14em] text-surface uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 font-semibold text-tertiary">{value}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-sm border border-tertiary px-5 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-tertiary uppercase transition-colors hover:bg-tertiary hover:text-white"
            >
              Start another inquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={`${prefix}-form`}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4 }}
            className={cn("relative", isHero ? "p-5 sm:p-6" : "p-6 sm:p-8")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[0.7rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  {text.eyebrow}
                </p>
                <h2 className="mt-1 font-display text-xl leading-[1.2] font-medium text-tertiary sm:text-2xl">
                  {text.title}
                </h2>
                <p className="type-body-sm mt-1.5 text-surface">{text.subtitle}</p>
              </div>
              <Star8 className="mt-1 h-5 w-5 shrink-0 text-primary" />
            </div>

            <div className={cn("mt-5 grid sm:grid-cols-2", isHero ? "gap-3.5" : "gap-4")}>
              <div>
                <label htmlFor={`${prefix}-name`} className="field-label flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 text-primary" /> Full name *
                </label>
                <input
                  id={`${prefix}-name`}
                  className={cn("field", errors.name && "field-error")}
                  placeholder="Your full name"
                  value={inquiry.name}
                  onChange={(e) => update({ name: e.target.value })}
                  autoComplete="name"
                  maxLength={120}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs font-semibold text-[#c9302c]">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor={`${prefix}-email`} className="field-label flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Email address *
                </label>
                <input
                  id={`${prefix}-email`}
                  type="email"
                  className={cn("field", errors.email && "field-error")}
                  placeholder="you@example.com"
                  value={inquiry.email}
                  onChange={(e) => update({ email: e.target.value })}
                  autoComplete="email"
                  maxLength={190}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-1 text-xs font-semibold text-[#c9302c]">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor={`${prefix}-phone`} className="field-label flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" /> Phone / WhatsApp
                </label>
                <input
                  id={`${prefix}-phone`}
                  type="tel"
                  className="field"
                  placeholder="+212 6 00 00 00 00"
                  value={inquiry.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  autoComplete="tel"
                  maxLength={40}
                />
              </div>

              <div>
                <label htmlFor={`${prefix}-type`} className="field-label flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-primary" /> Event type *
                </label>
                <select
                  id={`${prefix}-type`}
                  className={cn("field", errors.eventType && "field-error")}
                  value={inquiry.eventType}
                  onChange={(e) => update({ eventType: e.target.value })}
                  aria-invalid={Boolean(errors.eventType)}
                >
                  {eventTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && <p className="mt-1 text-xs font-semibold text-[#c9302c]">{errors.eventType}</p>}
              </div>

              <div>
                <label htmlFor={`${prefix}-date`} className="field-label flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" /> Event date
                </label>
                <input
                  id={`${prefix}-date`}
                  type="date"
                  min={minDate}
                  className="field"
                  value={inquiry.eventDate}
                  onChange={(e) => update({ eventDate: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor={`${prefix}-guests`} className="field-label flex items-center gap-1.5">
                  <UsersRound className="h-3.5 w-3.5 text-primary" /> Number of guests *
                </label>
                <input
                  id={`${prefix}-guests`}
                  type="number"
                  min="1"
                  max="2000"
                  inputMode="numeric"
                  className={cn("field", errors.guestCount && "field-error")}
                  placeholder="e.g. 120"
                  value={inquiry.guestCount}
                  onChange={(e) => update({ guestCount: e.target.value })}
                  aria-invalid={Boolean(errors.guestCount)}
                />
                {errors.guestCount && <p className="mt-1 text-xs font-semibold text-[#c9302c]">{errors.guestCount}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${prefix}-message`} className="sr-only">
                  Tell us about your dream celebration
                </label>
                <textarea
                  id={`${prefix}-message`}
                  className={cn("field resize-y", isHero ? "min-h-[4.5rem]" : "min-h-[5.75rem]")}
                  placeholder="Tell us about your dream celebration..."
                  value={inquiry.message}
                  onChange={(e) => update({ message: e.target.value })}
                  maxLength={3000}
                />
              </div>
            </div>

            <div className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={`${prefix}-website`}>Leave this field empty</label>
              <input
                id={`${prefix}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={inquiry.website}
                onChange={(e) => update({ website: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={cn(
                "btn-primary group w-full disabled:cursor-not-allowed disabled:opacity-70",
                isHero ? "mt-5" : "mt-6",
              )}
            >
              {submitting ? "Sending…" : text.submit}
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              )}
            </button>

            {submitError && (
              <p
                role="alert"
                className="mt-3 rounded-sm border border-[#c9302c]/30 bg-[#c9302c]/5 px-3 py-2 text-xs font-semibold text-[#c9302c]"
              >
                {submitError}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
