import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { brand, defaultWhatsappMessage, navLinks, whatsappLink } from "../data/site";
import { LogoMark } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "../utils/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-38% 0px -55% 0px" },
    );
    navLinks.forEach((link) => {
      const el = document.getElementById(link.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-secondary bg-white/95 shadow-[0_8px_24px_-16px_rgba(41,41,41,0.22)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[100rem] items-center justify-between gap-4 px-5 transition-all duration-300 sm:gap-6 sm:px-7 lg:px-10",
            scrolled ? "py-3" : "py-4.5",
          )}
        >
          {/* Wordmark */}
          <a href="#top" className="group flex shrink-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-sm bg-white text-black shadow-sm transition-transform duration-500 group-hover:scale-105">
              <LogoMark className="h-8 w-8" />
            </span>
            <span className="leading-none">
              <span
                className={cn(
                  "block font-display text-[1.35rem] font-semibold tracking-tight transition-colors",
                  scrolled ? "text-tertiary" : "text-white",
                )}
              >
                {brand.name}
              </span>
              <span
                className={cn(
                  "mt-1 hidden font-display text-[0.62rem] font-semibold tracking-[0.22em] whitespace-nowrap uppercase transition-colors md:block",
                  scrolled ? "text-surface" : "text-secondary",
                )}
              >
                Marrakech · {brand.tagline}
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 whitespace-nowrap xl:flex 2xl:gap-8">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative font-display text-[0.78rem] font-semibold tracking-[0.1em] uppercase transition-colors",
                    isActive
                      ? scrolled
                        ? "text-primary"
                        : "text-primary-soft"
                      : scrolled
                        ? "text-tertiary hover:text-primary"
                        : "text-white/85 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rotate-45 bg-primary transition-all duration-300",
                      isActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-60",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2.5 whitespace-nowrap sm:gap-3">
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              aria-label="Message us on WhatsApp"
              className={cn(
                "hidden items-center gap-2 rounded-sm border px-4 py-[11px] font-display text-[0.78rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 lg:inline-flex",
                scrolled
                  ? "border-secondary bg-neutral text-tertiary hover:border-tertiary hover:bg-tertiary hover:text-white"
                  : "border-white/40 bg-white/10 text-white hover:border-white hover:bg-white hover:text-accent",
              )}
            >
              <WhatsAppIcon className={cn(scrolled && "invert")} />
              WhatsApp
            </a>
            <a
              href="#contact"
              className={cn("hidden whitespace-nowrap xl:inline-flex", scrolled ? "btn-primary" : "btn-light")}
            >
              Plan your celebration
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-sm border transition-colors xl:hidden",
                scrolled
                  ? "border-secondary text-tertiary hover:bg-neutral"
                  : "border-white/40 text-white hover:bg-white/10",
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-accent text-white"
          >
            <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div className="relative flex items-center justify-between border-b border-tertiary px-5 py-4 sm:px-8">
              <span className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-sm bg-white text-black">
                  <LogoMark className="h-8 w-8" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold">{brand.fullName}</span>
                  <span className="mt-0.5 block font-display text-[0.6rem] font-semibold tracking-[0.2em] text-secondary uppercase">
                    {brand.tagline}
                  </span>
                </span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-sm border border-secondary/35 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="relative flex flex-1 flex-col overflow-y-auto">
              <div className="m-auto flex w-full flex-col items-center gap-3 px-8 py-10">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="py-2 text-center font-display text-2xl font-medium text-white transition-colors hover:text-primary-soft sm:text-3xl"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.45 }}
                  className="btn-light mt-6 w-full max-w-xs justify-center"
                >
                  Plan your celebration
                </motion.a>
                <motion.a
                  href={whatsappLink(defaultWhatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.45 }}
                  className="mt-2 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-sm border border-secondary/40 px-6 py-3 font-display text-sm font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-white/10"
                >
                  <WhatsAppIcon />
                  WhatsApp us
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
