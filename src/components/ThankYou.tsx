import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, CalendarCheck, MailCheck, Sparkles } from "lucide-react";
import { brand, defaultWhatsappMessage, photos, whatsappLink } from "../data/site";
import { LogoMark } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    icon: MailCheck,
    title: "We review your inquiry",
    body: "Our events team reads every detail you shared and checks availability for your date.",
  },
  {
    icon: CalendarCheck,
    title: "We contact you within 24–48 hours",
    body: "We will be in touch by email or WhatsApp to talk through your vision and next steps.",
  },
  {
    icon: Sparkles,
    title: "We craft your celebration",
    body: "Together we shape a bespoke celebration in the heart of Marrakech.",
  },
];

export function ThankYou({
  firstName,
  onBackHome,
}: {
  firstName: string;
  onBackHome: () => void;
}) {
  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-accent text-white">
      <img
        src={photos.photo2.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,41,41,0.82)_0%,rgba(41,41,41,0.68)_45%,rgba(41,41,41,0.94)_100%)]" />
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.05]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <button type="button" onClick={onBackHome} className="group flex items-center gap-3 text-left">
          <span className="grid h-11 w-11 place-items-center rounded-sm bg-white text-black shadow-sm transition-transform duration-500 group-hover:scale-105">
            <LogoMark className="h-8 w-8" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.35rem] font-semibold tracking-tight text-white">
              {brand.name}
            </span>
            <span className="mt-1 hidden font-display text-[0.62rem] font-semibold tracking-[0.22em] text-secondary uppercase md:block">
              Marrakech · {brand.tagline}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 rounded-sm border border-white/40 px-4 py-2.5 font-display text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors hover:bg-white hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-5 pb-14 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease }}
          className="w-full max-w-2xl rounded-lg border border-white/15 bg-white p-7 text-tertiary shadow-[0_36px_80px_-30px_rgba(0,0,0,0.8)] sm:p-10"
        >
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-sm bg-primary text-white shadow-sm"
            >
              <BadgeCheck className="h-7 w-7" />
            </motion.span>
            <div>
              <p className="font-arabic text-xl leading-none text-primary">شكراً</p>
              <p className="mt-1.5 font-display text-[0.7rem] font-semibold tracking-[0.2em] text-surface uppercase">
                Inquiry received
              </p>
            </div>
          </div>

          <h1 className="type-h2 mt-6 text-tertiary">
            Thank you{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="type-body-md mt-3 text-surface">
            Your inquiry has been received. Our team will be in touch within 24–48 hours to
            help you plan an extraordinary celebration.
          </p>

          <ol className="mt-7 grid gap-3">
            {steps.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex gap-3 rounded-sm border border-secondary bg-neutral p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-white text-primary shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-tertiary">{title}</p>
                  <p className="type-body-sm mt-0.5 text-surface">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onBackHome} className="btn-primary w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Return to homepage
            </button>
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-sm border border-tertiary px-6 py-3 font-display text-sm font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-tertiary hover:text-white sm:w-auto"
            >
              <WhatsAppIcon className="invert transition-[filter] group-hover:invert-0" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      <footer className="relative z-10 pb-8 text-center text-xs text-secondary">
        © {new Date().getFullYear()} {brand.fullName}
      </footer>
    </main>
  );
}
