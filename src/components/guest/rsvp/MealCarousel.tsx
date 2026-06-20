"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, Check } from "@phosphor-icons/react";
import type { Dish } from "./menu";

type MealCarouselProps = {
  dishes: Dish[];
  value: string | null;
  onChange: (id: string) => void;
};

export default function MealCarousel({
  dishes,
  value,
  onChange,
}: MealCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  const goTo = (index: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (!width) return;
    const clamped = Math.max(0, Math.min(dishes.length - 1, index));
    track.scrollTo({ left: clamped * width, behavior: smooth ? "smooth" : "auto" });
  };

  // Keep the arrows + dots in sync with native scroll/swipe position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth;
        if (!width) return;
        setActive(Math.round(track.scrollLeft / width));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // On (re)mount, open on the dish already chosen so the visible slide and the
  // recorded selection never disagree (e.g. after toggling attendance off/on).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !value) return;
    const index = dishes.findIndex((dish) => dish.id === value);
    const width = track.clientWidth;
    if (index > 0 && width) {
      track.scrollLeft = index * width;
      setActive(index);
    }
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-snap to the active slide after a viewport resize / orientation change,
  // otherwise the snapped slide can land half-cut.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth;
        if (width) track.scrollLeft = activeRef.current * width;
      });
    });
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const selected = dishes.find((dish) => dish.id === value);

  return (
    <div>
      <div className="relative">
        {/* Swipeable track — native scroll-snap drives momentum on mobile */}
        <div
          ref={trackRef}
          role="group"
          aria-label="Choose your dish"
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {dishes.map((dish, index) => {
            const isSelected = dish.id === value;
            return (
              <div key={dish.id} className="w-full shrink-0 snap-center">
                {/* bg tint shows during load instead of a blank white band */}
                <div className="relative overflow-hidden rounded-2xl bg-charcoal/10 ring-1 ring-gold/20">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={1408}
                    height={768}
                    sizes="(max-width: 512px) 100vw, 512px"
                    className="h-auto w-full"
                  />
                  {isSelected && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-inset ring-gold" />
                  )}
                </div>

                <p className="font-script mt-4 text-center text-3xl leading-tight text-burgundy">
                  {dish.label}
                </p>
                <p className="mx-auto mt-1.5 min-h-[3rem] max-w-xs text-center text-xs leading-relaxed text-charcoal/65">
                  {dish.name}
                </p>

                <button
                  type="button"
                  onClick={() => onChange(dish.id)}
                  onFocus={() => goTo(index, false)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Selected" : "Choose"}: ${dish.name}`}
                  className={`mx-auto mt-2 flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    isSelected
                      ? "border-burgundy bg-burgundy text-cream"
                      : "border-burgundy/30 text-burgundy hover:border-burgundy"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-[5px] border ${
                      isSelected
                        ? "border-cream/70 bg-cream/15"
                        : "border-burgundy/40"
                    }`}
                  >
                    {isSelected && <Check size={13} weight="bold" />}
                  </span>
                  {isSelected ? "Selected" : "Choose this dish"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Arrows live in an overlay matching the photo's aspect ratio, so they
            stay centred on the image no matter how the dish name wraps */}
        <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[1408/768]">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous dish"
            disabled={active === 0}
            className="pointer-events-auto absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-burgundy shadow-md backdrop-blur-sm transition disabled:pointer-events-none disabled:opacity-0"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next dish"
            disabled={active === dishes.length - 1}
            className="pointer-events-auto absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-burgundy shadow-md backdrop-blur-sm transition disabled:pointer-events-none disabled:opacity-0"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* Position dots — small visual, generous 36px hit area */}
      <div className="mt-4 flex items-center justify-center">
        {dishes.map((dish, index) => (
          <button
            key={dish.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${dish.label}`}
            aria-current={index === active}
            className="flex h-9 w-7 items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                index === active ? "w-5 bg-burgundy" : "w-2 bg-burgundy/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Announce the viewed slide to screen readers as they swipe/arrow */}
      <p className="sr-only" aria-live="polite">
        Dish {active + 1} of {dishes.length}: {dishes[active]?.label}
      </p>

      {/* Running summary so they never lose their pick on the long scroll */}
      <p className="mt-3 text-center text-sm" aria-live="polite">
        {selected ? (
          <>
            <span className="text-charcoal/65">Your choice: </span>
            <span className="font-semibold text-burgundy">{selected.label}</span>
          </>
        ) : (
          <span className="text-charcoal/65">
            Swipe through and tap to choose your dish
          </span>
        )}
      </p>
    </div>
  );
}
