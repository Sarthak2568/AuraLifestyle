import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import ALL_PRODUCTS from "../data/products";
import { getProductMeta, filteredChart } from "../data/productMeta";

function SizeRecommender({ product, onPick }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("true");

  const recommend = useMemo(() => {
    const h = Number(height), w = Number(weight);
    const sizes = product.sizes || [];
    if (!h || !w || !sizes.length) return null;
    const base = ["XS","S","M","L","XL","XXL","XXXL"].filter((s) => sizes.includes(s));
    let i = Math.floor((base.length - 1) / 2);
    if (h < 165) i -= 1; else if (h > 180) i += 1;
    if (w < 55) i -= 1; else if (w > 80) i += 1; else if (w > 92) i += 2;
    if (fit === "relaxed") i += 1; if (fit === "snug") i -= 1;
    i = Math.max(0, Math.min(base.length - 1, i));
    return base[i] || null;
  }, [height, weight, fit, product.sizes]);

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="font-medium mb-2">Size Recommender</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Height (cm)
          <input className="mt-1 w-full rounded border px-3 py-2 bg-transparent"
                 value={height} onChange={(e)=>setHeight(e.target.value.replace(/[^\d]/g,""))} placeholder="e.g. 175" />
        </label>
        <label className="text-sm">Weight (kg)
          <input className="mt-1 w-full rounded border px-3 py-2 bg-transparent"
                 value={weight} onChange={(e)=>setWeight(e.target.value.replace(/[^\d]/g,""))} placeholder="e.g. 72" />
        </label>
      </div>
      <div className="mt-3 flex gap-2 text-sm">
        {["snug","true","relaxed"].map((k)=>(
          <button key={k} type="button" onClick={()=>setFit(k)}
            className={`px-3 py-1 rounded border ${fit===k?"bg-black text-white":""}`}>
            {k==="true"?"True to size":k[0].toUpperCase()+k.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm">
        {recommend
          ? <div className="flex items-center justify-between">
              <div>Recommended size: <span className="font-semibold">{recommend}</span></div>
              <button type="button" onClick={()=>onPick?.(recommend)} className="px-3 py-1 rounded bg-black text-white">Pick {recommend}</button>
            </div>
          : <div className="opacity-70">Enter height & weight to get a recommendation.</div>}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const { show } = useToast();

  const source = products?.length ? products : ALL_PRODUCTS;
  const product = useMemo(() => source.find((p) => String(p.id) === String(id)), [source, id]);
  const meta = useMemo(() => getProductMeta(id) || {}, [id]);

  const topRef = useRef(null);
  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "auto" }); }, [id]);

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-14 min-h-[60vh]"><p>Product not found.</p></div>;
  }

  const cover = product.image || product.cover || "/images/placeholder.jpg";
  const name = product.title || product.name || "Product";

  const [size, setSize] = useState(product.sizes?.[0] || "M");
  const [color, setColor] = useState(product.colors?.[0] || "Default");
  const [qty, setQty] = useState(1);
  const wished = Array.isArray(wishlist) && wishlist.some((w) => w.id === product.id);
  const chart = filteredChart(meta.sizeChartKey, product.sizes);

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">
      <div className="grid lg:grid-cols-2 gap-10">
        <div><img src={cover} alt={name} className="w-full rounded-lg object-cover" /></div>

        <div>
          <div className="text-sm opacity-70">{meta.subtitle || (product.gender === "women" ? "Women" : "Men")}</div>
          <h1 className="text-3xl font-bold mb-2">{name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl font-semibold">₹{product.price}</div>
            {product.mrp && product.mrp > product.price && <div className="opacity-60 line-through">₹{product.mrp}</div>}
          </div>

          {product.colors?.length > 0 && (
            <div className="mb-5">
              <div className="font-medium mb-2">Color: <span className="opacity-80">{color}</span></div>
              <div className="flex gap-2">
                {product.colors.map((c) => {
                  const bg = (meta.colors && meta.colors[c]) || "#E5E5E5";
                  return (
                    <button key={c} type="button" aria-label={c} title={c} onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border ${color === c ? "ring-2 ring-offset-2 ring-black" : ""}`}
                      style={{ background: bg }} />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mb-5">
              <div className="font-medium mb-2">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded border ${size === s ? "bg-black text-white" : ""}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="font-medium mb-2">Quantity</div>
            <div className="inline-flex items-center border rounded">
              <button type="button" className="px-3 py-1" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <input className="w-14 text-center py-1 bg-transparent outline-none" value={qty}
                     onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} />
              <button type="button" className="px-3 py-1" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                addToCart({ id: product.id, title: name, image: cover, price: product.price, mrp: product.mrp, qty, size, color });
                show({ type: "cart", title: "Added to bag", message: `${name} — ${size}${color ? ` • ${color}` : ""}` });
              }}
              className="px-5 py-2 rounded bg-black text-white"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart({ id: product.id, title: name, image: cover, price: product.price, mrp: product.mrp, qty, size, color });
                show({ type: "cart", title: "Added to bag", message: `${name} — ${size}${color ? ` • ${color}` : ""}` });
              }}
              className="px-5 py-2 rounded border"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist({ id: product.id, name, price: product.price, cover });
                show({ type: "wish", title: wished ? "Removed from wishlist" : "Added to wishlist", message: name });
              }}
              className={`px-5 py-2 rounded border ${wished ? "bg-rose-600 text-white border-rose-600" : ""}`}
            >
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <div className="mb-6"><SizeRecommender product={product} onPick={(s) => setSize(s)} /></div>

          {meta.highlights?.length ? (
            <ul className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 list-disc list-inside">
              {meta.highlights.map((h) => <li key={h} className="text-sm">{h}</li>)}
            </ul>
          ) : null}

          <div className="space-y-3">
            <details className="rounded border p-4" open>
              <summary className="cursor-pointer font-medium">Description</summary>
              <p className="mt-2 text-sm opacity-90">{meta.description || "Premium everyday essential."}</p>
            </details>

            {filteredChart(meta.sizeChartKey, product.sizes) && (() => {
              const chart = filteredChart(meta.sizeChartKey, product.sizes);
              return (
                <details className="rounded border p-4">
                  <summary className="cursor-pointer font-medium">Size Chart</summary>
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">{chart.label}</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-[420px] w-full text-sm border-collapse">
                        <thead>
                          <tr>{chart.cols.map((c) => <th key={c} className="text-left border-b py-2 pr-4">{c}</th>)}</tr>
                        </thead>
                        <tbody>
                          {chart.rows.map((r, i) => (
                            <tr key={i}>{r.map((cell, j) => <td key={j} className="py-2 pr-4 border-b">{cell}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {chart.note && <div className="mt-2 text-xs opacity-70">{chart.note}</div>}
                  </div>
                </details>
              );
            })()}

            <details className="rounded border p-4">
              <summary className="cursor-pointer font-medium">Fabric &amp; Care</summary>
              <div className="mt-2">
                <div className="text-sm"><span className="font-medium">Fabric:</span> {meta.material || "Premium cotton"}</div>
                <ul className="mt-2 list-disc list-inside text-sm">
                  {(meta.care || []).map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
