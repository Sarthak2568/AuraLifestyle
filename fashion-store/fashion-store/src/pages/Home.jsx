// src/pages/Home.jsx
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel.jsx";
import CultureCarousel from "../components/CultureCarousel.jsx";
// at top with other imports
import ReelsSection from "../components/ReelsSection";

// ⬆️ Footer import removed

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* WOMEN / MEN billboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[86vh]">
        <Link to="/women" className="relative group overflow-hidden">
          <img
            src="/images/home_women.png"
            alt="Women billboard"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute left-1/2 top-[65%] -translate-x-1/2 flex flex-col items-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]">
              WOMEN
            </h2>
            <span className="px-6 py-2 border border-white rounded-lg text-sm tracking-wide backdrop-blur-sm bg-black/30 hover:bg-white hover:text-black transition">
              SHOP NOW
            </span>
          </div>
        </Link>

        <Link to="/men" className="relative group overflow-hidden">
          <img
            src="/images/M-12.png"
            alt="Men billboard"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute left-1/2 top-[65%] -translate-x-1/2 flex flex-col items-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
              MEN
            </h2>
            <span className="px-6 py-2 border border-white rounded-lg text-sm tracking-wide backdrop-blur-sm bg-black/30 hover:bg-white hover:text-black transition">
              SHOP NOW
            </span>
          </div>
        </Link>
      </section>

      {/* Featured (full-bleed) */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Collection</h2>
        </div>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
          <HeroCarousel />
        </div>
      </section>

       {/* 4) 🔥 Reels — inserted exactly here */}
      <ReelsSection />

      {/* Culture (full-bleed) */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Culture & Lifestyle</h2>
        </div>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
          <CultureCarousel />
        </div>
      </section>
      {/* ⬇️ Footer removed from here */}
    </div>
  );
}
