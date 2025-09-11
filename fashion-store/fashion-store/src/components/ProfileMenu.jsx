import React from "react";
import { ChevronDown, LogOut, UserCircle2, Heart, ShoppingBag, Settings, BadgeInfo } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProfileMenu({ onOpenAuth }) {
  const { user, logout } = useStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <UserCircle2 />
        <span className="hidden sm:block">{user ? user.name : "Account"}</span>
        <ChevronDown className="size-4" />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden z-50"
        >
          {user ? (
            <div className="py-2 text-sm">
              <div className="px-4 py-2 text-neutral-500">Hello, <span className="font-semibold">{user.name}</span></div>
              <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Heart className="size-4" /> Wishlist
              </Link>
              <Link to="/cart" className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <ShoppingBag className="size-4" /> Orders / Cart
              </Link>
              <Link to="#" className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Settings className="size-4" /> Settings
              </Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="py-2">
              <button
                onClick={() => { setOpen(false); onOpenAuth?.(); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
              >
                <BadgeInfo className="size-4" /> Login / Create account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
