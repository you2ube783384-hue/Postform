"use client";

import React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images;
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const next = React.useCallback(() => setActive((a) => (a + 1) % images.length), [images.length]);
  const prev = React.useCallback(() => setActive((a) => (a - 1 + images.length) % images.length), [images.length]);

  // Lightbox keyboard navigation
  React.useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border-2 border-pf-black bg-pf-sand pf-stripes font-mono-tech text-xs uppercase tracking-widest text-pf-muted">
        NO IMAGE AVAILABLE
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="space-y-3">
      {/* Mobile — swipeable gallery */}
      <div className="relative lg:hidden">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto border-2 border-pf-black bg-pf-sand scrollbar-none"
          style={{ scrollbarWidth: "none" }}
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== active && idx >= 0 && idx < images.length) setActive(idx);
          }}
          aria-label="Product image gallery — swipe to browse"
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(true)}
              className="relative aspect-[4/5] w-full shrink-0 snap-center"
              aria-label={`Open image ${i + 1} of ${images.length} fullscreen`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? product.name}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label="Gallery position">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActive(i);
                scrollRef.current?.scrollTo({ left: i * (scrollRef.current?.clientWidth ?? 0), behavior: "smooth" });
              }}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === active}
              className={cn("h-2 w-2 border border-pf-black", i === active ? "bg-pf-black" : "bg-pf-cream")}
            />
          ))}
        </div>
        <span className="absolute left-3 top-3 border border-pf-black bg-pf-black px-2 py-0.5 font-mono-tech text-[10px] font-bold tracking-widest text-pf-cream">
          {active + 1}/{images.length}
        </span>
      </div>

      {/* Desktop — editorial gallery with thumbs */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-[88px_1fr]">
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[4/5] overflow-hidden border-2 transition-colors",
                i === active ? "border-pf-black bg-pf-yellow" : "border-pf-black/25 hover:border-pf-black"
              )}
            >
              <Image src={img.url} alt={img.alt ?? product.name} fill sizes="88px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="group relative aspect-[4/5] overflow-hidden border-2 border-pf-black bg-pf-sand">
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt ?? product.name}
            fill
            priority
            sizes="(max-width: 1600px) 60vw, 900px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Open fullscreen viewer"
            className="absolute bottom-3 right-3 flex items-center gap-2 border-2 border-pf-black bg-pf-paper px-3 py-2 font-mono-tech text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-pf-yellow"
          >
            <Expand className="h-3.5 w-3.5" strokeWidth={2.5} /> Fullscreen
          </button>
          {images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="flex h-10 w-10 items-center justify-center border-2 border-pf-black bg-pf-paper hover:bg-pf-yellow"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="flex h-10 w-10 items-center justify-center border-2 border-pf-black bg-pf-paper hover:bg-pf-yellow"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-pf-cream"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen product viewer"
        >
          <div className="flex items-center justify-between border-b-2 border-pf-black px-4 py-3">
            <span className="font-display text-lg text-pf-black">
              POSTFORM<span className="text-pf-yellow">▮</span>
            </span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close viewer"
              autoFocus
              className="flex h-10 w-10 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-yellow"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden bg-pf-black">
            <Image
              src={current.url}
              alt={current.alt ?? product.name}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-pf-cream bg-pf-black/70 text-pf-cream hover:bg-pf-yellow hover:text-pf-black"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-pf-cream bg-pf-black/70 text-pf-cream hover:bg-pf-yellow hover:text-pf-black"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Image ${i + 1}`}
                      className={cn("h-1.5 w-8", i === active ? "bg-pf-yellow" : "bg-pf-cream/40")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between border-t-2 border-pf-black px-4 py-2 font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
            <span>
              {active + 1} / {images.length} — {current.alt ?? product.name}
            </span>
            <span className="hidden sm:block">ESC TO CLOSE / ← → TO NAVIGATE</span>
          </div>
        </div>
      )}
    </div>
  );
}
