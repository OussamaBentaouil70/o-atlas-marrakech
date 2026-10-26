# AGENTS.md — O'Atlas Marrakech (Luxury Weddings & Events)

Briefing for AI coding agents and developers. Read fully before editing.

---

## 1. What this project is

A **single-page marketing / lead-generation website** for **O'Atlas Marrakech**, a
single venue (estate) in Marrakech offering **luxury destination weddings and private
events**: poolside ceremonies, receptions beneath the stars, Moroccan-themed evenings
and private parties, set among palm trees, elegant architecture and reflecting pools.

The site's goal is to convert visitors into **event inquiries** via:
1. An inquiry form in the **hero** and again in the **final reservation section** (shared state).
2. **WhatsApp** buttons (navbar, mobile menu, footer, sticky bottom-right button).

It is **not** a booking engine and has **no backend** (see §5).

> History: the project previously was "Riad Azahar" (a boutique riad) and then
> "Nelia Marrakech" (a collection of riads). Both were fully replaced. Do not
> reintroduce riads, buyouts, FAQ, planning steps or old colours unless asked.

### Tone
Elegant, romantic, refined Moroccan hospitality. Copy is client-supplied — keep it
verbatim unless asked to edit. Section eyebrows/headings come straight from the brief.

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 (strict, `noUnusedLocals`/`noUnusedParameters` → unused imports FAIL the type-check) |
| Bundler | Vite 7 + `vite-plugin-singlefile` → outputs ONE inlined `dist/index.html` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), CSS-first config via `@theme` in `src/index.css` (no `tailwind.config.js`) |
| Animation | `framer-motion` |
| Icons | `lucide-react` (no brand icons — use `MessageCircle` for WhatsApp) |
| Utility | `cn()` in `src/utils/cn.ts` (`clsx` + `tailwind-merge`) |
| Fonts | Google Fonts in `index.html`: Open Sans (headings/UI), system Arial (body), Amiri (Arabic accent) |

```bash
npm run dev
npm run build      # -> dist/index.html
npx tsc --noEmit   # always run together with build
```
Rules: never hand-edit `package.json` / `vite.config.ts` (use `npm install`). Entry is `src/App.tsx`.

---

## 3. File map

```
index.html                       Title "O'Atlas Marrakech · Luxury Weddings & Events", meta, favicon, fonts
PHPMailer-Inquiry-Setup.md       Reusable end-to-end guide: PHPMailer setup, env, templates, testing, deployment
src/
  App.tsx                        Page composition, shared inquiry state, sticky WhatsApp, back-to-top
  index.css                      Theme tokens, utilities (zellige pattern, arch, dappled, linen), form field styles
  data/site.ts                   ★ ALL content: photos map, brand, nav links, sections data, form options, WhatsApp config
  components/
    Navbar.tsx                   Fixed; transparent over hero → ivory on scroll; 3 zones (brand / links / actions); mobile menu
    Hero.tsx                     SECTION 1 — Photo 2 background; text LEFT, InquiryForm (variant "hero") RIGHT
    InquiryForm.tsx              ★ Shared form (variants "hero" | "contact"), validation, success summary
    Marquee.tsx                  Decorative scrolling phrases (olive band) between hero and section 2
    Celebrations.tsx             SECTION 2 — "What we offer": 3 categories, square gallery triggers (photos 3,6,7)
    CelebrationGallery.tsx       Per-category photo gallery popup: arrows, thumbnails, swipe, focus trap, Esc/backdrop close
    EventPromise.tsx             SECTION 3 — "Our Event Promise": 3 pillars with icons, dark olive background
    SignatureExperiences.tsx     SECTION 4 — 5 formats (photos 5,6,4,7,10); layout 2 large + 3 small, zoomable
    Contact.tsx                  SECTION 5 — "Plan Your Dream Wedding", Photo 9 in arch frame + InquiryForm ("contact")
    ThankYou.tsx                 `/thank-you` confirmation page: hero, next steps, home + WhatsApp CTAs
    Footer.tsx                   Brand, nav, contact links
    PhotoLightbox.tsx            ZoomableImage (click-to-zoom) + PhotoLightbox (portal, Esc/backdrop close)
    Reveal.tsx                   Scroll-in reveal wrapper
    Ornament.tsx                 Star8, Star8Outline, Eyebrow (tone "dark" | "light")
public/
  .htaccess                      SPA fallback (`/thank-you`) + deny `.env`
  api/
    bootstrap.php                .env loader, `env()` / `e()` / `json_response()` / `render_template()`, PHPMailer includes
    send-inquiry.php             POST endpoint: validation, honeypot, admin + client emails
    templates/                   Inline-CSS email HTML (`client-thank-you.php`, `admin-notification.php`)
    lib/PHPMailer/               PHPMailer 6.12.0 (vendored, no Composer)
.env                             SMTP / admin / site config (NOT deployed by the build; upload manually)
.env.example                     Documented template for `.env`
```
(Named `EventPromise`, not `Promise`, to avoid shadowing the JS global.)

---

## 4. Page structure

| # | Component | Anchor | Background | Content |
|---|---|---|---|---|
| – | Navbar | — | transparent → white | Links: Celebrations · Our promise · Signature experiences · Reservation. Buttons: WhatsApp, Plan your celebration (`.btn-primary`) |
| 1 | Hero | `#top` (form wrapper `#inquiry`) | accent (`#292929`) + Photo 2 | "LUXURY WEDDINGS & EVENTS IN MARRAKECH" / **Extraordinary Weddings, Timeless Celebrations** / CTA "Plan your celebration" → `#inquiry`; form "Start Planning Your Celebration" |
| – | Marquee | — | primary (`#337ab7`) | decorative |
| 2 | Celebrations | `#celebrations` | white (`#ffffff`) | "WHAT WE OFFER" / **Celebrations at O'Atlas Marrakech** — Weddings & Receptions, Private Dinners & Celebrations, Private Parties & Special Events |
| 3 | EventPromise | `#promise` | tertiary (`#333333`) | "THE O'ATLAS EXPERIENCE" / **Our Event Promise** — Bespoke Celebrations, Exceptional Event Spaces, Memorable Guest Experiences |
| 4 | SignatureExperiences | `#experiences` | neutral (`#eeeeee`) | "SIGNATURE EXPERIENCES" / **Unforgettable Ways to Celebrate** — 5 formats |
| 5 | Contact | `#contact` | accent (`#292929`) | "YOUR CELEBRATION STARTS HERE" / **Plan Your Dream Wedding** + form "Wedding & Event Reservation" |
| – | Footer | — | accent (`#292929`) | links |
| – | ThankYou | `/thank-you` (also `/thank-you.html`) | accent (`#292929`) + Photo 2 | Confirmation hero: "Inquiry received" / **Thank you, {first name}.** / next steps / return home + WhatsApp |

---

## 5. Form & state

`App.tsx` holds `inquiry` (shared by both forms → always in sync), `submitted`
(boolean), `submitting` and `submitError`.

`EventInquiry` fields: `name`, `email`, `phone`, `eventType` (default **"Wedding"**),
`eventDate`, `guestCount`, `message`, plus the hidden honeypot `website` (must stay empty).
(Budget and currency were removed at client request.)

Validation: name ≥ 2 chars, valid email, eventType required, guests 1–2000.
Event date min = today. Server repeats every check.

`submitInquiry` POSTs JSON to `inquiryEndpoint` (`/api/send-inquiry.php`). On success it
sets `submitted` and client-navigates to `/thank-you` (no reference in the URL or UI);
on failure the form stays filled and shows `submitError`.

Backend (`public/api/send-inquiry.php`):
1. Rejects non-POST; parses JSON (falls back to `$_POST`).
2. Honeypot `website` non-empty → fake success, no email.
3. Validates and sends the admin notification first (if it fails the request returns 500),
   then the client thank-you (failure is logged, not fatal).
4. Returns `{ ok: true }`; returns 503 when SMTP/ADMIN env values are missing.

Mail is PHPMailer over SMTP; configuration lives in `.env` (`MAIL_HOST`, `MAIL_PORT`,
`MAIL_ENCRYPTION`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`,
`ADMIN_EMAIL`, `ADMIN_NAME`, `SITE_URL`, `WHATSAPP_NUMBER`). `.env` is loaded from one level
above `public_html`, then `public_html/.env`, then `public/api/.env`.

Variant copy (in `InquiryForm.tsx` → `copy`):
- hero: "Start Planning Your Celebration" / submit "Send inquiry"
- contact: "Wedding & Event Reservation" / submit "Send event inquiry"

**WhatsApp:** `whatsappBusinessNumber` in `src/data/site.ts` is `212728585823` (local
`0728585823`). `whatsappLink(msg)` builds `https://wa.me/<number>?text=…`. The WhatsApp
icon is `public/images/whatsapp-white-icon.webp`, rendered via `WhatsAppIcon`.

---

## 6. Photos (IMPORTANT)

The client's real photos are stored in `public/images/` and defined in the `photos`
map in `src/data/site.ts`:

| Key | File | Used in |
|---|---|---|
| photo2 | `wedding-hero-evening.jpg` | Hero background |
| photo3 | `wedding-pergola-ceremony.jpg` | Celebrations: Weddings & Receptions |
| photo4 | `wedding-moroccan-welcome.jpg` | Signature: Traditional Moroccan Welcomes |
| photo5 | `wedding-poolside-vows.jpg` | Signature: Romantic Poolside Ceremonies |
| photo6 | `wedding-gnawa-tradition.jpg` | Signature: Elegant Wedding Receptions |
| photo7 | `wedding-moroccan-lounge.jpg` | Signature: Moroccan-Themed Evenings |
| photo9 | `wedding-estate-ceremony.jpg` | Contact section (arch frame) |
| photo10 | `wedding-evening-party.jpg` | Signature: Exclusive Evening Parties |

To swap a photo: replace the file in `public/images/` (keep the name) or update the
`photos` map / gallery entry in `src/data/site.ts`.

Each `Celebration` also has a `gallery: Photo[]`. "Weddings & Receptions" uses all 14
photos from the client's *Wedding in Marrakech* set; "Private Dinners" and "Private
Parties" use the four *reception venues* photos (`reception-*.jpg`). Galleries keep the
cover photo first. Signature Experiences opens the single-image `PhotoLightbox`.

---

## 7. Design system

### Palette & tokens (from `oatlas.com/en/events/`) — defined in `src/index.css`
| Token | Hex | Role |
|---|---|---|
| `primary` | `#000000` | Black (was brand blue at client request) — primary buttons (`.btn-primary`), focus rings, active nav, icons |
| `secondary` | `#dddddd` | Borders, dividers, muted light text on dark sections |
| `tertiary` | `#333333` | Primary dark text on light backgrounds, Promise section background |
| `accent` | `#292929` | Deepest dark — Hero overlay, Promise cards, Contact & Footer backgrounds |
| `neutral` | `#eeeeee` | Light alternate section background & summary fills |
| `surface` | `#777777` | Secondary/muted body text on white cards & sections |

Derived helpers: `primary-hover #333333`, `primary-soft #ffffff` (light accent on dark sections). `.btn-light` (white) is used for buttons on dark backgrounds. Logo mark = `LogoMark` in `src/components/Logo.tsx` (black arabesque medallion on white badge); favicon is the same medallion inlined in `index.html`.

### Typography, radii, spacing & button tokens
- `h1` (`.type-h1`): Open Sans, `3rem`, weight `600`, line-height `1.1`.
- `h2` (`.type-h2`): Open Sans, `2rem`, weight `500`, line-height `1.2`.
- `body-md` (`.type-body-md`): Arial, `1rem`, line-height `1.5`.
- `body-sm` (`.type-body-sm`): Arial, `0.875rem`, line-height `1.5`.
- Radii: `sm: 4px`, `md: 3px`, `lg: 6px`.
- Spacing tokens: `8px` / `16px` / `32px`.
- Primary button (`.btn-primary`): `background: #000000`, `color: #ffffff`, `border-radius: 4px`, `padding: 12px 24px`.
- Utilities: `pattern-zellige` (black), `pattern-zellige-light` (`#dddddd`), `texture-linen`, `arch`, `.dappled`, `.field`, `.field-label`, `.field-error`, `animate-marquee`, `animate-drift`.

### Client visual preferences (carried over)
- Content/card images are **square**, no arch mask; images are **click-to-zoom**.
- "What we offer" images and category titles open category-specific gallery popups with thumbnails and previous/next navigation.
- The **arch (door) shape** is reserved for a single feature image (now Photo 9 in Contact).
- Hero = text left, full form right.
- Navbar = wide (`max-w-[100rem]`), three zones; full links only at `xl`, hamburger below.

---

## 8. Conventions & gotchas
- Edit content in `src/data/site.ts`, not inside components.
- Removing UI usually requires removing its icon import (strict TS).
- Modals use `createPortal` to `document.body`, lock scroll, close on Esc/backdrop.
- Wrap blocks in `<Reveal delay>`; easing `[0.22, 1, 0.36, 1]`.
- Sections use `scroll-mt-*` so anchors clear the fixed navbar.
- `.btn-primary` / `.btn-light` live in `@layer components` so Tailwind utilities (e.g. `hidden`) can override their `display`.
- Keep a11y: `aria-label` on icon buttons, `role="dialog"`/`aria-modal`, `aria-invalid`, focus rings.
- `.htaccess` in `public/` handles the `/thank-you` SPA fallback; `public/api/lib` and
  `public/api/templates` are denied to browsers. Keep both in the deployed output.
- `.env` is not copied by Vite; upload it manually (preferably one level above `public_html`).
- Vite dev does not execute PHP; test the endpoint with `php -S` or on the host.

## 9. Known gaps / TODO
1. SMTP credentials (`MAIL_PASSWORD`, `MAIL_USERNAME`, `ADMIN_EMAIL`, `SITE_URL`) are
   placeholders in `.env`; fill them before going live.
2. Google Tag Manager (`GTM-N3TLW44X`) and Search Console verification are in `index.html`.
3. Photo files are external to the inlined `dist/index.html` (served from `dist/images/`); keep the folder alongside the page.
4. No contact details (address, phone, email, map), no legal pages, analytics, SEO schema, or i18n (French/Arabic).
5. Final-section brief ended with "Event Date / Wedding / Copy Event Inquiry" — interpreted as: same form, event type defaulting to Wedding, submit "Send event inquiry". Confirm with the client.
