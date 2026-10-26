import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import type { Celebration, Photo } from "../data/site";
import { cn } from "../utils/cn";

function GalleryPhoto({ photo }: { photo: Photo }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-secondary">
      <ImageOff className="h-7 w-7" strokeWidth={1.5} />
      <p className="type-body-sm">This photo is unavailable. Please choose another image.</p>
    </div>
  ) : (
    <img
      src={photo.src}
      alt={photo.alt}
      className="h-full w-full object-contain"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function GalleryDialog({ celebration, onClose }: { celebration: Celebration; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbnailRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const photo = celebration.gallery[index];
  const count = celebration.gallery.length;

  const move = useCallback(
    (direction: number) => setIndex((current) => (current + direction + count) % count),
    [count],
  );

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const root = document.getElementById("root");
    const previousInert = root?.inert ?? false;

    // The gallery is portaled outside the app so the page can be made inert while it is open.
    document.body.style.overflow = "hidden";
    if (root) root.inert = true;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      } else if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (root) root.inert = previousInert;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [move, onClose]);

  useEffect(() => {
    thumbnailRef.current?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "nearest",
      inline: "nearest",
    });

    const nextPhoto = new Image();
    nextPhoto.src = celebration.gallery[(index + 1) % count].src;
  }, [celebration, count, index, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-y-auto rounded-lg border border-white/15 bg-white shadow-[0_32px_90px_-24px_rgba(0,0,0,0.65)] sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-4 border-b border-secondary bg-white p-4 sm:px-6 sm:py-5">
          <div>
            <p className="font-display text-[0.65rem] font-semibold tracking-[0.18em] text-surface uppercase">
              O'Atlas Marrakech / Gallery
            </p>
            <h2 id={titleId} className="mt-1 font-display text-xl leading-tight font-medium text-tertiary sm:text-2xl">
              {celebration.title}
            </h2>
            <p id={descriptionId} className="type-body-sm mt-2 max-w-3xl text-surface">
              {celebration.description}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close celebration gallery"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-secondary text-tertiary transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative h-[min(52dvh,560px)] min-h-[150px] shrink-0 overflow-hidden bg-accent"
          onTouchStart={(event) => {
            touchStart.current = event.touches.length === 1
              ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
              : null;
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start || !event.changedTouches.length) return;
            const deltaX = event.changedTouches[0].clientX - start.x;
            const deltaY = event.changedTouches[0].clientY - start.y;
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
              move(deltaX < 0 ? 1 : -1);
            }
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={photo.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="absolute inset-0"
            >
              <GalleryPhoto photo={photo} />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous gallery photo"
            className="absolute top-1/2 left-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-sm border border-white/40 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next gallery photo"
            className="absolute top-1/2 right-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-sm border border-white/40 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="shrink-0 border-t border-secondary bg-white p-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4" aria-live="polite" aria-atomic="true">
            <p className="type-body-sm text-tertiary">{photo.alt}</p>
            <span className="shrink-0 font-display text-xs font-semibold tracking-widest text-surface">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto p-1" role="group" aria-label="Choose a gallery photo">
            {celebration.gallery.map((image, imageIndex) => (
              <button
                key={image.src}
                ref={imageIndex === index ? thumbnailRef : undefined}
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={`Show photo ${imageIndex + 1}: ${image.alt}`}
                aria-pressed={imageIndex === index}
                className={cn(
                  "relative h-14 w-18 shrink-0 overflow-hidden rounded-md bg-neutral ring-offset-2 ring-offset-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:h-16 sm:w-22",
                  imageIndex === index ? "ring-2 ring-black" : "opacity-55 hover:opacity-100",
                )}
              >
                <img src={image.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.7rem] text-surface">Temporary stock photography shown for inspiration.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CelebrationGallery({ celebration, onClose }: { celebration: Celebration | null; onClose: () => void }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {celebration && <GalleryDialog key={celebration.title} celebration={celebration} onClose={onClose} />}
    </AnimatePresence>,
    document.body,
  );
}