import React from "react";
import SlideOver from "./SlideOver";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function MiniWishlist() {
  const { showMiniWishlist, closeMiniWishlist, wishlist, toggleWishlist } = useStore();
  const nav = useNavigate();

  return (
    <SlideOver open={showMiniWishlist} onClose={closeMiniWishlist} title="Wishlist">
      {(wishlist?.length ?? 0) === 0 ? (
        <div className="text-sm opacity-70">Your wishlist is empty.</div>
      ) : (
        <>
          <ul className="space-y-3">
            {wishlist.map((it, i) => (
              <li key={`${it.id}-${i}`} className="flex gap-3 items-center">
                <img src={it.image} alt={it.title} className="w-14 h-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-1">{it.title}</div>
                  <div className="text-sm opacity-70">₹{it.price}</div>
                </div>
                <button onClick={() => toggleWishlist({ id: it.id })} className="text-xs rounded px-2 py-1 hover:bg-black/5">
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            className="mt-4 w-full rounded-xl border py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => { closeMiniWishlist(); nav("/wishlist"); }}
          >
            View Wishlist
          </button>
        </>
      )}
    </SlideOver>
  );
}
