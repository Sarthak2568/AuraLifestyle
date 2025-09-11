// src/pages/WomenFeatured.jsx
import { useEffect, useMemo } from "react";
import { useStore } from "../context/StoreContext.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function WomenFeatured() {
  const { products, setGender } = useStore();
  useEffect(() => { setGender("Women"); }, [setGender]);
  const items = useMemo(
    () => products.filter(p => (p.category||[]).includes("Women")),
    [products]
  );

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Women • Featured Collection</h1>
      <ProductGrid items={items} />
    </section>
  );
}
