import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { show } = useToast();
  if (!product) return null;

  const id = product.id || product._id || product.slug || product.name || product.title;
  const name = product.title || product.name || "Product";
  const price = Number(product.price ?? product.salePrice ?? 0);
  const compareAt = product.mrp ?? product.compareAt;
  const cover =
    product.image || product.cover || product.images?.[0]?.url || "/images/placeholder.jpg";

  const inWish = Array.isArray(wishlist) ? wishlist.some((w) => w && w.id === id) : false;

  return (
    <div className="group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      <Link to={`/product/${encodeURIComponent(id)}`}>
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={cover}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-3">
        <h3 className="font-semibold line-clamp-1">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-bold">₹{price}</span>
          {compareAt && <span className="text-sm line-through text-neutral-500">₹{compareAt}</span>}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              addToCart({ id, title: name, image: cover, price, mrp: compareAt, qty: 1 });
              show({ type: "cart", title: "Added to bag", message: name });
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => {
              toggleWishlist({ id, name, price, cover });
              show({
                type: "wish",
                title: inWish ? "Removed from wishlist" : "Added to wishlist",
                message: name,
              });
            }}
            className={`h-10 w-10 rounded border flex items-center justify-center ${
              inWish ? "bg-red-500 text-white border-red-500" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            }`}
            aria-label="wishlist"
            title="Wishlist"
          >
            <Heart size={18} fill={inWish ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
