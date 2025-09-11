import React from "react";
import ProductGrid from "../components/ProductGrid";
import { useStore } from "../context/StoreContext";

const FALLBACK_WOMEN = [
  "W-01.png","w-03.jpg","W-04.png","W-05.png",
  "W-06 f.png","W-06 b.png","W-07 f.png","W-08.png",
].map((f, i) => ({
  id: `WOM-${i + 1}`,
  name: `Women Oversize Tee ${i + 1}`,
  price: 1099,
  compareAt: 1499,
  gender: "women",
  images: [{ url: `/images/${f}` }],
  cover: `/images/${f}`,
  tags: ["women", "tee", "oversized"],
}));

export default function Women() {
  const { products } = useStore();
  const women = (products || []).filter((p) => p?.gender === "women");

  const data = women.length ? women : FALLBACK_WOMEN;

  return (
    <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6 my-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">Women</h1>
      <ProductGrid products={data} />
    </div>
  );
}
