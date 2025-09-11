import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Heart, ShoppingCart, User } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import SettingsMenu from "./SettingsMenu";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openSide, setOpenSide] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5">
      {/* full-width row so the left edge really sits at the extreme left */}
      <nav className="w-full px-3 sm:px-4 lg:px-6 h-[64px] flex items-center justify-between">
        {/* LEFT: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            aria-label="menu"
            onClick={() => setOpenSide((s) => !s)}
            className="p-2 rounded hover:bg-black/5"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="select-none">
            <span className="text-[22px] font-extrabold tracking-tight">
              AuraLifestyle
            </span>
          </Link>

          {/* inline links */}
          <div className="hidden md:flex items-center gap-8 ml-6 text-[15px]">
            <NavLink
              to="/men"
              className={({ isActive }) =>
                `hover:opacity-70 ${isActive ? "font-semibold" : ""}`
              }
            >
              Men
            </NavLink>
            <NavLink
              to="/women"
              className={({ isActive }) =>
                `hover:opacity-70 ${isActive ? "font-semibold" : ""}`
              }
            >
              Women
            </NavLink>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/wishlist"
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5"
          >
            <Heart size={18} />
            <span className="hidden sm:inline">Wishlist</span>
          </NavLink>
          <NavLink
            to="/cart"
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
          </NavLink>

          <button
            onClick={() => setOpenProfile((o) => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-black/5"
          >
            <User size={18} />
            <span className="hidden sm:inline">Profile</span>
          </button>
          {openProfile && <ProfileMenu onClose={() => setOpenProfile(false)} />}
        </div>
      </nav>

      {/* mobile side sheet */}
      {openSide && (
        <div className="md:hidden border-t border-black/5">
          <div className="w-full px-3 sm:px-4 lg:px-6 py-3 grid gap-2">
            <NavLink to="/men" onClick={() => setOpenSide(false)}>
              Men
            </NavLink>
            <NavLink to="/women" onClick={() => setOpenSide(false)}>
              Women
            </NavLink>
            <SettingsMenu inline />
          </div>
        </div>
      )}
    </header>
  );
}
