// src/components/HomeHeroCarousel.jsx
import Carousel from "./Carousel.jsx";

const slides = [
  {
    id: 1,
    type: "image",
    title: "Fresh Arrivals",
    subtitle: "Trendy drops you can’t miss",
    img: "/images/hero-1.jpg",
    durationMs: 4500,
    fit: "cover",
  },
  {
    id: 2,
    type: "video",
    title: "Lookbook",
    subtitle: "Shop the latest designs",
    src: "/videos/hero-1.mp4",
    poster: "/images/look-1.jpg",
    durationMs: 9000,
  },
  {
    id: 3,
    type: "image",
    title: "Best Sellers",
    subtitle: "Top rated by shoppers",
    img: "/images/hero-3.jpg",
    durationMs: 4500,
    fit: "cover",
  },
];

export default function HomeHeroCarousel() {
  return (
    <section className="w-full">
      <div className="relative aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] overflow-hidden rounded-none md:rounded-2xl">
        <Carousel
          className="h-full"
          items={slides}
          autoplayMs={4500}
          showDots
          showArrows
          render={(s) => (
            <div className="relative h-full w-full">
              {s.type === "video" ? (
                <video
                  src={s.src}
                  poster={s.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={s.img}
                  alt={s.title}
                  className={`absolute inset-0 h-full w-full ${
                    s.fit === "contain" ? "object-contain bg-black" : "object-cover"
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-8 left-6 md:left-12 text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm md:text-base opacity-90">{s.subtitle}</p>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
