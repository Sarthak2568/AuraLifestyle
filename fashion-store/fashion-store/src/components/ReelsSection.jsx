import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

/** Put your files under /public/reels (r1.mp4 / r1.jpg etc.) */
const DEFAULT_REELS = [
  { id: "r1", src: "/reels/r1.mp4", poster: "/reels/r1.jpg", title: "Street Drop: Monochrome" },
  { id: "r2", src: "/reels/r2.mp4", poster: "/reels/r2.jpg", title: "Oversized Fits: Day to Night" },
  { id: "r3", src: "/reels/r3.mp4", poster: "/reels/r3.jpg", title: "Graphic Tees – Behind the Scenes" },
  { id: "r4", src: "/reels/r4.mp4", poster: "/reels/r4.jpg", title: "Weekend Denim Staples" },
  { id: "r5", src: "/reels/r5.mp4", poster: "/reels/r5.jpg", title: "Crop Hoodies: Layering 101" },
  { id: "r6", src: "/reels/r6.mp4", poster: "/reels/r6.jpg", title: "Athleisure Shorts IRL" },
  { id: "r7", src: "/reels/r7.mp4", poster: "/reels/r7.jpg", title: "Matcha Tee – Studio Reel" },
  { id: "r8", src: "/reels/r8.mp4", poster: "/reels/r8.jpg", title: "Summer Dress: Lookbook" },
];

function useInViewPlay(videoRef) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) el.play?.().catch(() => {});
          else el.pause?.();
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoRef]);
}

function VideoCard({ src, poster, title }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  useInViewPlay(ref);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover aspect-[9/16]"
        onError={(e) => (e.currentTarget.poster = poster || "/images/placeholder.jpg")}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
        <div className="text-sm font-medium line-clamp-2">{title}</div>
      </div>
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute top-2 right-2 z-10 rounded-full bg-black/60 text-white p-2 backdrop-blur border border-white/20"
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}

function perView() {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 768) return 2;
  if (w < 1024) return 3;
  return 4;
}

export default function ReelsSection({ items = DEFAULT_REELS }) {
  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [pv, setPv] = useState(perView());

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      setCanPrev(el.scrollLeft > 10);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setPv(perView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const step = useMemo(() => {
    const el = railRef.current;
    return el ? Math.round(el.clientWidth * 0.95) : 800;
  }, [pv]);

  const scrollBy = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="py-10">
      {/* Heading aligned with everything else */}
      <div className="container mx-auto px-4 flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Reels</h2>
          <p className="text-sm opacity-70">Fresh fits in motion — tap to watch.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className={`h-10 w-10 rounded-full border flex items-center justify-center ${
              canPrev ? "bg-white hover:bg-neutral-50" : "opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className={`h-10 w-10 rounded-full border flex items-center justify-center ${
              canNext ? "bg-white hover:bg-neutral-50" : "opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Full-bleed rail exactly like your Featured/Culture blocks */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-neutral-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-neutral-900" />

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((r) => (
            <div
              key={r.id}
              className="snap-start shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <VideoCard {...r} />
            </div>
          ))}
        </div>

        {/* mobile arrows */}
        <div className="sm:hidden absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur border flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur border flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
