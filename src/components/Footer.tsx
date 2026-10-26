import { ArrowRight } from "lucide-react";
import { brand, defaultWhatsappMessage, navLinks, whatsappLink } from "../data/site";
import { LogoMark } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer id="footer" className="relative scroll-mt-24 overflow-hidden border-t border-tertiary bg-accent text-white">
      <div className="pattern-zellige-light pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8">
        <div className="grid gap-10 border-b border-tertiary pb-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <a href="#top" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-sm bg-white text-black">
                <LogoMark className="h-8 w-8" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl font-semibold">{brand.fullName}</span>
                <span className="mt-1 block font-display text-[0.6rem] font-semibold tracking-[0.24em] text-secondary uppercase">
                  {brand.tagline}
                </span>
              </span>
            </a>
            <p className="type-body-sm mt-4 max-w-sm text-secondary">
              Destination weddings and exclusive celebrations among palm trees, elegant
              architecture and reflecting pools.
            </p>
          </div>

          <nav className="md:col-span-3">
            <h3 className="font-display text-xs font-semibold tracking-[0.22em] text-primary-soft uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="type-body-sm text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className="font-display text-xs font-semibold tracking-[0.22em] text-primary-soft uppercase">
              Get in touch
            </h3>
            <a
              href="#contact"
              className="type-body-sm group mt-4 inline-flex items-center gap-2 text-secondary transition-colors hover:text-white"
            >
              Plan your celebration
              <ArrowRight className="h-4 w-4 text-primary-soft transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="type-body-sm mt-2.5 flex items-center gap-2 text-secondary transition-colors hover:text-white"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-surface sm:flex-row sm:items-center">
          <p className="text-secondary/75">
            © {new Date().getFullYear()} {brand.fullName} · Luxury weddings &amp; events
          </p>
          <a
            href="#top"
            className="font-display font-semibold tracking-[0.14em] text-secondary uppercase transition-colors hover:text-white"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
