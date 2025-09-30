import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import AuthModal from "./AuthModal";

function Bars3({ className = "" }) {
  return (
    <span className={`inline-flex flex-col justify-between w-6 h-4 ${className}`}>
      <span className="h-0.5 w-full bg-current rounded" />
      <span className="h-0.5 w-full bg-current rounded" />
      <span className="h-0.5 w-full bg-current rounded" />
    </span>
  );
}

export default function Navbar() {
  const { user, logout, cart, wishlist } = useStore();
  const [openAuth, setOpenAuth] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const countCart = cart?.reduce?.((s, i) => s + (i.qty || 1), 0) || 0;
  const countWish = wishlist?.length || 0;

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-6">
            {/* Hamburger */}
            <button
              aria-label="menu"
              onClick={() => setOpenDrawer(true)}
              className="p-2 rounded hover:bg-white/10"
            >
              <Bars3 />
            </button>

            {/* Brand */}
            <Link to="/" className="font-extrabold tracking-wider text-lg">
              AURALIFESTYLE
            </Link>

            {/* Primary links */}
            <Link to="/women" className="opacity-90 hover:opacity-100">
              WOMEN
            </Link>
            <Link to="/men" className="opacity-90 hover:opacity-100">
              MEN
            </Link>
          </div>

          {/* Right */}
          <div className="relative flex items-center gap-4">
            <Link to="/search" className="opacity-90 hover:opacity-100">Search</Link>

            <Link to="/wishlist" className="opacity-90 hover:opacity-100">
              Wishlist{countWish ? <sup className="ml-1 text-xs">({countWish})</sup> : null}
            </Link>

            <Link to="/cart" className="opacity-90 hover:opacity-100">
              Cart{countCart ? <sup className="ml-1 text-xs">({countCart})</sup> : null}
            </Link>

            {user ? (
              <>
                <button
                  ref={btnRef}
                  onClick={() => setOpenUser((v) => !v)}
                  className="px-3 py-1 rounded bg-white text-black font-semibold hover:opacity-90"
                >
                  {user.name || user.email}
                </button>

                {/* perfectly aligned user menu (just under the bar, right-aligned) */}
                {openUser && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-14 w-64 rounded-xl bg-white text-neutral-900 shadow-lg border"
                  >
                    <div className="px-4 py-3 border-b">
                      <div className="text-sm opacity-70">Signed in as</div>
                      <div className="font-semibold truncate">
                        {user.name || user.email}
                      </div>
                    </div>

                    <nav className="p-2 text-sm">
                      <button
                        className="w-full text-left px-3 py-2 rounded hover:bg-neutral-100"
                        onClick={() => { setOpenUser(false); nav("/profile"); }}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded hover:bg-neutral-100"
                        onClick={() => { setOpenUser(false); nav("/orders"); }}
                      >
                        Orders
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded hover:bg-neutral-100"
                        onClick={() => { setOpenUser(false); nav("/settings"); }}
                      >
                        Settings
                      </button>
                      <div className="px-3 pt-2 pb-1">
                        <div className="text-xs mb-1 opacity-70">Theme</div>
                        <div className="flex gap-2">
                          <button
                            className="px-2 py-1 rounded border"
                            onClick={() => {
                              document.documentElement.classList.remove("dark");
                              localStorage.setItem("theme", "light");
                            }}
                          >
                            Light
                          </button>
                          <button
                            className="px-2 py-1 rounded border"
                            onClick={() => {
                              document.documentElement.classList.add("dark");
                              localStorage.setItem("theme", "dark");
                            }}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <button
                        className="w-full text-left px-3 py-2 mt-1 rounded bg-neutral-900 text-white hover:opacity-90"
                        onClick={() => { setOpenUser(false); logout(); }}
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setOpenAuth(true)}
                className="px-4 py-2 rounded bg-white text-black font-semibold hover:opacity-90"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* spacer for fixed nav */}
      <div className="h-14" />

      {/* Left drawer */}
      {openDrawer && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpenDrawer(false)}
          />
          <aside className="fixed z-50 left-0 top-0 h-full w-72 bg-white dark:bg-neutral-900 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-extrabold">AURALIFESTYLE</div>
              <button onClick={() => setOpenDrawer(false)} className="p-2">✕</button>
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link onClick={() => setOpenDrawer(false)} to="/women" className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">Women</Link>
              <Link onClick={() => setOpenDrawer(false)} to="/men" className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">Men</Link>
              <Link onClick={() => setOpenDrawer(false)} to="/wishlist" className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">Wishlist</Link>
              <Link onClick={() => setOpenDrawer(false)} to="/cart" className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">Cart</Link>
            </nav>
          </aside>
        </>
      )}

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}
