import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Celebrations } from "./components/Celebrations";
import { Contact } from "./components/Contact";
import { EventPromise } from "./components/EventPromise";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { SignatureExperiences } from "./components/SignatureExperiences";
import { ThankYou } from "./components/ThankYou";
import { WhatsAppIcon } from "./components/WhatsAppIcon";
import {
  defaultEventInquiry,
  defaultWhatsappMessage,
  inquiryEndpoint,
  whatsappLink,
  type EventInquiry,
} from "./data/site";

const normalizePath = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
};

export default function App() {
  // Shared by the hero form and the final reservation form, so both stay in sync.
  const [inquiry, setInquiry] = useState<EventInquiry>(defaultEventInquiry);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [path, setPath] = useState(normalizePath);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to: string) => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, "", to);
    setPath(normalizePath());
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const submitInquiry = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(inquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(inquiry),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setSubmitError(
          data?.message ??
            "We could not send your inquiry. Please try again or contact us on WhatsApp.",
        );
        return;
      }

      setSubmitted(true);
      navigate("/thank-you");
    } catch {
      setSubmitError(
        "We could not send your inquiry. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetInquiry = () => {
    setSubmitted(false);
    setSubmitError(null);
    setInquiry(defaultEventInquiry());
  };

  const isThankYou = path === "/thank-you" || path === "/thank-you.html";

  if (isThankYou) {
    const firstName = inquiry.name.trim().split(/\s+/)[0] ?? "";

    return (
      <ThankYou
        firstName={firstName}
        onBackHome={() => {
          resetInquiry();
          navigate("/");
        }}
      />
    );
  }

  const updateInquiry = (next: EventInquiry) => {
    setInquiry(next);
    if (submitError) setSubmitError(null);
  };

  const formProps = {
    inquiry,
    onInquiryChange: updateInquiry,
    submitted,
    submitting,
    submitError,
    onSubmitInquiry: submitInquiry,
    onResetInquiry: resetInquiry,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-tertiary antialiased">
      <Navbar />
      <main>
        <Hero {...formProps} />
        <Marquee />
        <Celebrations />
        <EventPromise />
        <SignatureExperiences />
        <Contact {...formProps} />
      </main>
      <Footer />

      {/* Sticky WhatsApp */}
      <a
        href={whatsappLink(defaultWhatsappMessage)}
        target="_blank"
        rel="noreferrer"
        aria-label="Start a WhatsApp conversation"
        className="btn-primary fixed right-5 bottom-22 z-40 border border-white/40 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.75)] hover:-translate-y-0.5 sm:right-7"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed right-5 bottom-5 z-40 grid h-11 w-11 place-items-center rounded-sm border border-tertiary bg-accent text-white shadow-[0_12px_28px_-10px_rgba(41,41,41,0.65)] transition-colors hover:border-primary hover:bg-primary sm:right-7 sm:bottom-6"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
