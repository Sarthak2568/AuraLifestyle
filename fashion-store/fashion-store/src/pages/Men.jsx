import React from "react";
import ProductGrid from "../components/ProductGrid";
import { useStore } from "../context/StoreContext";

const FALLBACK_MEN = [
  "M-01.png","M-02.png","M-03.png","M-04.png",
  "M-05.jpg","M-06.jpg","M-07.jpg","M-08.png",
  "M-09.png","M-10.png",
].map((f, i) => ({
  id: `MEN-${i + 1}`,
  name: `Men Drop Tee ${i + 1}`,
  price: 1299,
  compareAt: 1599,
  gender: "men",
  images: [{ url: `/images/${f}` }],
  cover: `/images/${f}`,
  tags: ["men", "tee", "oversized"],
}));

export default function Men() {
  const { products } = useStore();
  const men = (products || []).filter((p) => p?.gender === "men");

  const data = men.length ? men : FALLBACK_MEN;

  return (
    <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6 my-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">Men</h1>
      <ProductGrid products={data} />
    </div>
  );
}
