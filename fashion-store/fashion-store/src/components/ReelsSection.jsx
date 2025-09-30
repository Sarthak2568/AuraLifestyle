// src/components/ReelsSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    .format(Math.round(Number(n || 0)));
const views = (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

const REELS = [
  {
    id: "hero-1",
    title: "Pine Backless Dress",
    views: 20000,
    likes: 52,
    shares: 66,
    sources: ["/videos/Cinematic_Streetwear_Ad_Generation.mp4", "/videos/Cinematic_Streetwear_Ad_Generation.mov"],
    poster: "/images/posters/pine-backless.jpg",
    product: { id: "w-05", title: "Pine Backless Dress", price: 1650, mrp: 0, image: "/images/W-05.png", href: "/product/w-05" },
  },
  {
    id: "IMG_6328",
    title: "Serene Strings Top",
    views: 21000,
    likes: 31,
    shares: 22,
    sources: ["/videos/IMG_6328.MP4", "/videos/IMG_6328.mov"],
    poster: "/images/posters/serene-strings.jpg",
    product: { id: "w-09", title: "Serene Strings Co-ord Set", price: 1699, mrp: 1899, image: "/images/W-09.png", href: "/product/w-09" },
  },
  {
    id: "matcha",
    title: "Rory Tie Up Dress",
    views: 82000,
    likes: 88,
    shares: 105,
    sources: ["/videos/matcha.mp4", "/videos/matcha.mov"],
    poster: "/images/posters/rory-tie.jpg",
    product: { id: "w-12", title: "Rory Tie Up Dress", price: 1899, mrp: 2100, image: "/images/W-12.png", href: "/product/w-12" },
  },
  {
    id: "rimberio_1",
    title: "Country Gingham Top",
    views: 9000,
    likes: 24,
    shares: 9,
    sources: ["/videos/rimberio_1.mp4", "/videos/rimberio_1.mov"],
    poster: "/images/posters/gingham.jpg",
    product: { id: "w-13", title: "Country Gingham Top", price: 790, mrp: 899, image: "/images/W-13.png", href: "/product/w-13" },
  },
];

/* ===================== LIGHTBOX ===================== */
function ReelLightbox({ items, index, onClose, onChange }) {
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const { addToCart } = useStore();
  const { show } = useToast();

  const last = items.length - 1;
  const i = Math.min(Math.max(index, 0), last);
  const curr = items[i] || {};
  const showLeft = i > 0;
  const showRight = i < last;

  const next = () => onChange(Math.min(i + 1, last));
  const prev = () => onChange(Math.max(i - 1, 0));

  useEffect(() => {
    if (paused || i === last) return;
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    const t = setTimeout(next, 6000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [i, paused, last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && i < last) next();
      if (e.key === "ArrowLeft" && i > 0) prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, last, onClose]);

  const handleAdd = () => {
    const p = curr.product || {};
    if (!p.id) return;
    addToCart({
      id: p.id,
      title: p.title,
      image: p.image,
      price: p.price,
      mrp: p.mrp ?? p.price,
      qty: 1,
    });
    show?.("Added to bag", { type: "success" });
  };

  const prevItem = showLeft ? items[i - 1] : null;
  const nextItem = showRight ? items[i + 1] : null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white text-black grid place-items-center shadow"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {showLeft && (
        <div className="hidden md:block mr-4">
          <div className="relative w-[200px] aspect-[9/16] rounded-2xl overflow-hidden bg-black/50 shadow-lg">
            <video className="absolute inset-0 h-full w-full object-cover" muted autoPlay loop playsInline preload="metadata" poster={prevItem?.poster}>
              {(prevItem?.sources || []).map((src) => <source key={src} src={src} />)}
            </video>
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
        </div>
      )}

      <div className="relative w-[min(92vw,360px)] md:w-[380px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl mx-2">
        <button
          onClick={() => setMuted((m) => !m)}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-black/60 text-white grid place-items-center"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <video
          key={`${curr.id}-${muted}`}
          className="absolute inset-0 h-full w-full object-cover"
          muted={muted}
          playsInline
          autoPlay
          loop
          preload="metadata"
          poster={curr.poster}
        >
          {(curr.sources || []).map((src) => <source key={src} src={src} />)}
        </video>

        <div className="absolute right-2 bottom-28 flex flex-col items-center gap-3 text-white z-20">
          <div className="grid place-items-center h-10 w-10 rounded-full bg-black/50"><Heart size={18} /></div>
          <div className="text-xs">{curr.likes ?? 0}</div>
          <div className="grid place-items-center h-10 w-10 rounded-full bg-black/50"><Share2 size={18} /></div>
          <div className="text-xs">{curr.shares ?? 0}</div>
        </div>

        <div className="absolute inset-x-3 bottom-3 z-20">
          <div className="rounded-xl bg-white/95 backdrop-blur p-2 shadow border">
            <div className="flex items-center gap-2">
              {curr.product?.image ? (
                <img src={curr.product.image} alt={curr.product.title} className="h-12 w-12 rounded-md object-cover border" />
              ) : null}
              <div className="min-w-0 flex-1">
                <Link to={curr.product?.href || "#"} className="text-sm font-medium truncate hover:underline">
                  {curr.product?.title || curr.title}
                </Link>
                <div className="text-xs">
                  <span className="font-semibold">{formatINR(curr.product?.price || 0)}</span>{" "}
                  {!!curr.product?.mrp && curr.product.mrp > (curr.product?.price || 0) ? (
                    <span className="line-through opacity-60">{formatINR(curr.product.mrp)}</span>
                  ) : null}
                </div>
              </div>
              {curr.product?.href ? (
                <Link to={curr.product.href} className="shrink-0 h-8 w-8 grid place-items-center rounded-md border" title="Open product">
                  <ExternalLink size={16} />
                </Link>
              ) : null}
            </div>
          </div>
          <button onClick={handleAdd} className="mt-2 w-full h-11 rounded-lg bg-black text-white font-semibold">ADD TO CART</button>
        </div>

        <button
          onClick={prev}
          disabled={!showLeft}
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full grid place-items-center bg-white/90 text-black shadow ${!showLeft ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}`}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          disabled={!showRight}
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full grid place-items-center bg-white/90 text-black shadow ${!showRight ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}`}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {showRight && (
        <div className="hidden md:block ml-4">
          <div className="relative w-[200px] aspect-[9/16] rounded-2xl overflow-hidden bg-black/50 shadow-lg">
            <video className="absolute inset-0 h-full w-full object-cover" muted autoPlay loop playsInline preload="metadata" poster={nextItem?.poster}>
              {(nextItem?.sources || []).map((src) => <source key={src} src={src} />)}
            </video>
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== SECTION ===================== */
export default function ReelsSection() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const items = useMemo(() => REELS, []);

  return (
    <section className="py-12">
      <style>{`
        .reel-card::after{
          content:""; position:absolute; inset:0; border-radius:1rem; padding:1px;
          background: linear-gradient(120deg, rgba(37,99,235,.0), rgba(37,99,235,.35), rgba(37,99,235,.0));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity:0; transition:opacity .25s ease;
        }
        .reel-card:hover::after{ opacity:1; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Video</h2>
          <p className="text-sm opacity-70">Tap a reel to view — add to cart from the video.</p>
        </div>

        <div className="grid justify-items-center gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {items.map((item, i) => (
            <article
              key={item.id}
              className="reel-card relative w-full max-w-[300px] rounded-2xl overflow-hidden border bg-black cursor-pointer"
              style={{ aspectRatio: "9 / 16" }}
              onClick={() => { setIdx(i); setOpen(true); }}
            >
              <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold flex items-center gap-1">
                <Eye size={14} /> {views(item.views || 0)}
              </div>

              <video className="absolute inset-0 h-full w-full object-cover" muted playsInline autoPlay loop preload="metadata" poster={item.poster}>
                {(item.sources || []).map((src) => <source key={src} src={src} />)}
              </video>

              <div className="absolute inset-x-0 bottom-0">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative p-3 text-white">
                  <div className="text-lg font-semibold drop-shadow-sm line-clamp-1">{item.title}</div>
                  {item.product ? (
                    <div className="text-sm">
                      <span className="font-bold">{formatINR(item.product.price || 0)}</span>{" "}
                      {!!item.product.mrp && item.product.mrp > (item.product.price || 0) ? (
                        <span className="line-through opacity-60">{formatINR(item.product.mrp)}</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && <ReelLightbox items={items} index={idx} onClose={() => setOpen(false)} onChange={setIdx} />}
    </section>
  );
}
