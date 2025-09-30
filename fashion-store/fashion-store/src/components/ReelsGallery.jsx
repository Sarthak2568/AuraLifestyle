// src/components/ReelsGallery.jsx
import React, { useState } from "react";
import ReelsLightbox from "./ReelsLightbox";
import { useStore } from "../context/StoreContext";

// Provide reel items here (or fetch from backend):
const REELS = [
  {
    id: "reel-rose-dress",
    src: "/videos/rimbero_1.mp4",       // put in public/videos
    thumb: "/images/men/M-01.png",
    productId: "MEN-ROSE-DRESS",
    title: "Rose Slit Dress",
    price: 2199,
    instagramUrl: "https://www.instagram.com/p/XXXXXXXX/",
    // default add-to-cart color/size if desired:
    defaultColor: "Black",
    defaultSize: "M",
  },
  // ...add more reels...
];

export default function ReelsGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const { addToCart, products } = useStore();

  const onAddToCart = (reel) => {
    // find product for better image/price if needed
    const product =
      products?.find((p) => String(p.id) === String(reel.productId)) || null;

    const image =
      product?.imagesByColor?.[reel.defaultColor]?.[0] ||
      product?.images?.[0] ||
      reel.thumb;

    addToCart({
      id: reel.productId,
      title: reel.title,
      price: reel.price,
      image,
      qty: 1,
      size: reel.defaultSize || product?.sizes?.[0] || "M",
      color: reel.defaultColor || "Default",
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">Reels</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {REELS.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setActive(r);
                setOpen(true);
              }}
              className="group overflow-hidden rounded-xl border hover:shadow"
            >
              <div className="aspect-[9/16] w-full overflow-hidden">
                <img
                  src={r.thumb}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                />
              </div>
              <div className="p-2 text-left">
                <div className="font-medium line-clamp-1">{r.title}</div>
                <div className="text-sm opacity-70">₹{r.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ReelsLightbox
        open={open}
        reel={active}
        onClose={() => setOpen(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
