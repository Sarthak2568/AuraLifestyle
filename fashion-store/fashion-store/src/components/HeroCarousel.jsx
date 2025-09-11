// src/components/HeroCarousel.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Update the paths if your assets live elsewhere.
 * Make sure the video slide keeps id "hero-01".
 */
const SLIDES = [
  {
    id: "hero-01",
    kind: "video",
    src: "/videos/hero-01.mp4",   // ← change if needed
    poster: "/images/hero-01.jpg" // optional poster
  },
  {
    id: "hero-02",
    kind: "image",
    src: "/images/hero-02.jpg"    // ← change if needed
  },
  {
    id: "hero-03",
    kind: "image",
    src: "/images/hero-03.jpg"    // ← change if needed
  }
];

// Autoplay timings
const DEFAULT_DELAY = 4500;               // normal slides
const HOLD_MS_MAP = { "hero-01": 10000 }; // ≥10s hold for the video slide

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const videoRef = useRef(null);

  const next = () => setIdx((i) => (i + 1) % SLIDES.length);
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // simple preload of the next image for smoother transitions
  useEffect(() => {
    const n = SLIDES[(idx + 1) % SLIDES.length];
    if (n?.kind === "image") {
      const img = new Image();
      img.src = n.src;
    }
  }, [idx]);

  // Autoplay with enforced ≥10s hold for the video slide
  useEffect(() => {
    let timer;
    const active = SLIDES[idx];
    const hold = Math.max(DEFAULT_DELAY, HOLD_MS_MAP[active?.id] || 0);

    if (active?.kind === "video") {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.muted = true;       // required for autoplay on mobile
        v.playsInline = true;
        v.play?.().catch(() => {});
      }
      timer = setTimeout(next, hold);
    } else {
      // pause any previous video to save CPU
      videoRef.current?.pause?.();
      timer = setTimeout(next, DEFAULT_DELAY);
    }

    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <div className="relative w-full">
      {/* viewport (keeps height consistent; adjust aspect if you like) */}
      <div className="relative aspect-[21/9] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden">
        {SLIDES.map((s, i) => {
          const isActive = i === idx;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {s.kind === "video" ? (
                <video
                  ref={isActive ? videoRef : null} // attach ref only to active video
                  src={s.src}
                  poster={s.poster}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={s.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={prev}
          className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/80 hover:bg-white backdrop-blur border flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={next}
          className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/80 hover:bg-white backdrop-blur border flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
