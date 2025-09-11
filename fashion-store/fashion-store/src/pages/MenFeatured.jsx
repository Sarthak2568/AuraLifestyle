// src/pages/MenFeatured.jsx
import { useEffect, useMemo } from "react";
import { useStore } from "../context/StoreContext.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function MenFeatured() {
  const { products, setGender } = useStore();
  useEffect(() => { setGender("Men"); }, [setGender]);
  const items = useMemo(
    () => products.filter(p => (p.category||[]).includes("Men")),
    [products]
  );

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Men • Featured Collection</h1>
      <ProductGrid items={items} />
    </section>
  );
}
