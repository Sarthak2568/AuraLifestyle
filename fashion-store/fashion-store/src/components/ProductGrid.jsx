// src/components/ProductGrid.jsx
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], title }) {
  if (!products.length)
    return (
      <section className="py-10">
        {title && (
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        )}
        <p className="text-zinc-600 dark:text-zinc-300">No products found.</p>
      </section>
    );

  return (
    <section className="py-10">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
