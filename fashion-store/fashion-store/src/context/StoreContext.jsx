import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ALL_PRODUCTS from "../data/products";

const readLS = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

// ---------- NORMALIZE ONE CART ITEM ----------
const normalizeItem = (itemLike) => {
  const id = itemLike?.id || itemLike?._id || itemLike?.slug || itemLike?.name || itemLike?.title;
  const title = itemLike?.title || itemLike?.name || "Product";
  const image = itemLike?.image || itemLike?.cover || itemLike?.images?.[0]?.url || "/images/placeholder.jpg";
  const rawPrice = itemLike?.price ?? itemLike?.salePrice ?? 0;
  const price = Number.isFinite(Number(rawPrice)) ? Number(rawPrice) : 0;
  const mrp = itemLike?.mrp ?? itemLike?.compareAt ?? price;
  const size = itemLike?.size || itemLike?.selectedSize || "";
  const color = itemLike?.color || itemLike?.selectedColor || "";
  const qty = Math.max(1, Math.min(99, Number(itemLike?.qty) || 1));
  const key = `${id}-${size}-${color}`;
  return { key, id, title, image, price, mrp, size, color, qty };
};

// ---------- MIGRATE ENTIRE CART FROM LS ----------
const loadCart = () => {
  const raw = readLS("aura:cart", []);
  const arr = Array.isArray(raw) ? raw : [];
  const normalized = arr
    .map(normalizeItem)
    .filter((i) => i.id && Number.isFinite(i.price) && i.price > 0); // drop broken/zero items
  writeLS("aura:cart", normalized);
  return normalized;
};

export default function StoreProvider({ children }) {
  // catalog present so PDP can always resolve
  const [products, setProducts] = useState(ALL_PRODUCTS);

  // cart / wishlist
  const [cart, setCart] = useState(loadCart);
  const [wishlist, setWishlist] = useState(readLS("aura:wishlist", []));
  useEffect(() => writeLS("aura:cart", cart), [cart]);
  useEffect(() => writeLS("aura:wishlist", wishlist), [wishlist]);

  // shipping (address)
  const [shipping, setShipping] = useState(
    readLS("aura:shipping", { fullName: "", phone: "", pincode: "", address1: "", address2: "", city: "", state: "" })
  );
  useEffect(() => writeLS("aura:shipping", shipping), [shipping]);

  // minimal auth
  const [user, setUser] = useState(readLS("aura:user", null));
  const signup = async ({ name, email, phone }) => { const u = { id: crypto.randomUUID?.() || Date.now(), name, email, phone }; setUser(u); writeLS("aura:user", u); return u; };
  const login = async ({ emailOrPhone }) => {
    const existing = readLS("aura:user", null);
    if (existing && (existing.email === emailOrPhone || existing.phone === emailOrPhone)) { setUser(existing); return existing; }
    const u = { id: crypto.randomUUID?.() || Date.now(), name: "Guest", email: emailOrPhone.includes("@") ? emailOrPhone : "", phone: emailOrPhone.includes("@") ? "" : emailOrPhone };
    setUser(u); writeLS("aura:user", u); return u;
  };
  const logout = () => { setUser(null); localStorage.removeItem("aura:user"); };

  // theme
  const [theme, setTheme] = useState(readLS("aura:theme", "light"));
  useEffect(() => { const root = document.documentElement; if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark"); writeLS("aura:theme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ------ CART HELPERS ------
  const addToCart = (itemLike) => {
    const item = normalizeItem(itemLike);
    if (!item.id || item.price <= 0) return;
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + item.qty) };
        return next;
      }
      return [...prev, item];
    });
  };

  const setCartQty = (key, qtyLike) => {
    const qty = Math.max(1, Math.min(99, Number(qtyLike) || 1));
    setCart((prev) => prev.map((p) => (p.key === key ? { ...p, qty } : p)));
  };

  const removeFromCart = (arg1, arg2) => {
    const key = arg2 || arg1;
    setCart((prev) => prev.filter((p) => p.key !== key));
  };

  const moveCartItemToWishlist = (key) => {
    const found = cart.find((p) => p.key === key);
    if (!found) return;
    setWishlist((w) => (w.some((x) => x.id === found.id) ? w : [...w, { id: found.id }]));
    removeFromCart(key);
  };

  const addToWishlist = (id) => setWishlist((prev) => (prev.some((w) => w.id === id) ? prev : [...prev, { id }] ));
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((w) => w.id !== id));
  const moveWishlistToCart = (id) => { addToCart({ id, qty: 1, price: (ALL_PRODUCTS.find(p=>p.id===id)?.price)||1 }); removeFromWishlist(id); };
  const toggleWishlist = (itemOrId) => {
    const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
    if (!id) return;
    setWishlist((prev) => (prev.some((w) => w.id === id) ? prev.filter((w) => w.id !== id) : [...prev, { id }]));
  };

  // totals (guard every number)
  const totals = useMemo(() => {
    const safeMul = (a, b) => (Number.isFinite(Number(a)) && Number.isFinite(Number(b)) ? Number(a) * Number(b) : 0);
    const mrpTotal = cart.reduce((s, i) => s + safeMul(i.mrp ?? i.price, i.qty), 0);
    const subtotal = cart.reduce((s, i) => s + safeMul(i.price, i.qty), 0);
    const savings = Math.max(0, mrpTotal - subtotal);
    const items = cart.reduce((n, i) => n + (Number.isFinite(Number(i.qty)) ? Number(i.qty) : 0), 0);
    return { mrpTotal, subtotal, savings, items };
  }, [cart]);

  const value = useMemo(() => ({
      products, setProducts,
      cart, wishlist, totals,
      user, theme, shipping,
      addToCart, setCartQty, removeFromCart, moveCartItemToWishlist,
      addToWishlist, removeFromWishlist, moveWishlistToCart, toggleWishlist,
      signup, login, logout,
      toggleTheme, setTheme, setShipping,
    }),
    [products, cart, wishlist, totals, user, theme, shipping]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
