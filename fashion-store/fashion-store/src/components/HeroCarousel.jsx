import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Tweak 'focal' to keep faces in frame (only used when fit="cover").
 * Lower second value shows more top (e.g., "50% 22%"), higher shows more bottom ("50% 40%").
 */
const SLIDES = [
  { id: "hero-01", kind: "video", src: "/videos/hero-1.mp4", poster: "/images/hero-1.jpg", focal: "50% 32%" },
  { id: "hero-02", kind: "video", src: "/videos/fvideo.mp4", focal: "50% 26%" },
  { id: "hero-03", kind: "image", src: "/images/hero-03.jpg", focal: "50% 28%" },
];

const DEFAULT_DELAY = 4500;
const HOLD_MS_MAP = { "hero-01": 10000 };

/* Measure any fixed header (only used if offsetHeader=true) */
function measureTopFixedOffset() {
  const explicit =
    document.querySelector("[data-nav]") ||
    document.querySelector("#navbar") ||
    document.querySelector("header[role=banner]") ||
    document.querySelector(".site-header") ||
    document.querySelector("header") ||
    document.querySelector("nav");

  const fixedTop = Array.from(document.body.querySelectorAll("*")).filter((el) => {
    const cs = window.getComputedStyle(el);
    return cs.position === "fixed" && (cs.top === "0px" || cs.top === "0") && el.offsetHeight > 0 && el.offsetWidth > 0;
  });

  let h = 0;
  if (fixedTop.length) h = Math.max(...fixedTop.map((el) => Math.round(el.getBoundingClientRect().height)));
  if (!h && explicit) h = Math.round(explicit.getBoundingClientRect().height);
  return h || 72; // fallback
}

/**
 * Props:
 * - variant: "default" | "tall" (height preset)
 * - fit: "cover" | "contain"  -> "contain" shows the entire frame (no crop)
 * - offsetHeader: boolean     -> add margin-top to sit below any fixed header
 */
export default function HeroCarousel({ variant = "default", fit = "cover", offsetHeader = false }) {
  const tall = variant === "tall";
  const fitContain = fit === "contain";

  const [idx, setIdx] = useState(0);
  const [topOffset, setTopOffset] = useState(72);
  const videoRef = useRef(null);

  // Height presets
  const heightClasses = tall
    ? "h-[82vw] sm:h-[62vw] md:h-[52vw] lg:h-[46vw] xl:h-[42vw] min-h-[420px] max-h-[960px]"
    : "h-[68vw] sm:h-[54vw] md:h-[46vw] lg:h-[40vw] xl:h-[36vw] min-h-[340px] max-h-[880px]";

  // Only add header offset if explicitly requested
  useLayoutEffect(() => {
    if (!offsetHeader) return;
    const update = () => setTopOffset(measureTopFixedOffset());
    update();
    window.addEventListener("resize", update);
    const header =
      document.querySelector("[data-nav]") ||
      document.querySelector("#navbar") ||
      document.querySelector("header") ||
      document.querySelector("nav");
    let ro;
    if (header && "ResizeObserver" in window) {
      ro = new ResizeObserver(update);
      ro.observe(header);
    }
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [offsetHeader]);

  const next = () => setIdx((i) => (i + 1) % SLIDES.length);
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // Preload next image
  useEffect(() => {
    const n = SLIDES[(idx + 1) % SLIDES.length];
    if (n?.kind === "image") {
      const img = new Image();
      img.src = n.src;
    }
  }, [idx]);

  // Autoplay (longer hold for video)
  useEffect(() => {
    let timer;
    const active = SLIDES[idx];
    const hold = Math.max(DEFAULT_DELAY, HOLD_MS_MAP[active?.id] || 0);

    if (active?.kind === "video") {
      const v = videoRef.current;
      if (v) {
        try {
          v.currentTime = 0;
          v.muted = true;
          v.playsInline = true;
          v.play?.();
        } catch {}
      }
      timer = setTimeout(next, hold);
    } else {
      videoRef.current?.pause?.();
      timer = setTimeout(next, DEFAULT_DELAY);
    }
    return () => clearTimeout(timer);
  }, [idx]);

  const mediaClass = `w-full h-full ${fitContain ? "object-contain" : "object-cover"}`;

  return (
    <section
      className="relative w-full"
      style={offsetHeader ? { marginTop: `${topOffset}px` } : undefined}
    >
      {/* Responsive height; object-fit governs cropping */}
      <div className={`relative w-full ${heightClasses} overflow-hidden ${fitContain ? "bg-black" : ""}`}>
        {SLIDES.map((s, i) => {
          const isActive = i === idx;
          const style = fitContain ? undefined : { objectPosition: s.focal || "50% 30%" };
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {s.kind === "video" ? (
                <video
                  ref={isActive ? videoRef : null}
                  src={s.src}
                  poster={s.poster || "/images/placeholder.jpg"}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className={mediaClass}
                  style={style}
                />
              ) : (
                <img
                  src={s.src}
                  alt=""
                  className={mediaClass}
                  style={style}
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
            className={`h-2 w-2 rounded-full transition ${i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
