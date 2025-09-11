import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Wishlist() {
  const { wishlist, products, moveWishlistToCart, toggleWishlist } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>

      {!wishlist.length ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <p className="text-sm opacity-70 mt-1">Save items you love to buy later.</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link to="/men" className="px-4 py-2 rounded bg-black text-white">Browse Men</Link>
            <Link to="/women" className="px-4 py-2 rounded border">Browse Women</Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(w => {
            const p = w.__product || products.find(x => String(x.id) === String(w.id));
            if (!p) return null;
            return (
              <div key={w.id} className="border rounded-lg overflow-hidden">
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
                </Link>
                <div className="p-3">
                  <Link to={`/product/${p.id}`} className="font-medium block line-clamp-1">{p.title}</Link>
                  <div className="text-sm font-semibold mt-1">₹{p.price}</div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => moveWishlistToCart(p.id)}
                      className="px-3 py-1 rounded bg-black text-white"
                    >
                      Move to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="px-3 py-1 rounded border"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
