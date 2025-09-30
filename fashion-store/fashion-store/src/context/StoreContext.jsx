// src/context/StoreContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, productsApi } from "../lib/api";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

// ---------- utils ----------
const readLS = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const itemKey = (o) => `${o.id}|${o.size || ""}|${o.color || ""}`;

// ---------- provider ----------
function StoreProvider({ children }) {
  // --- auth ---
  const [user, setUser] = useState(() => readLS("user", null));
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const loginRequestOtp = async (email, name = "") => {
    await authApi.requestOtp(email, name);
    return true;
  };

  const loginVerifyOtp = async (email, code) => {
    const { token: jwt, user: u } = await authApi.verifyOtp(email, code);
    setUser(u);
    setToken(jwt);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", jwt);
    return u;
  };

  // --- products (fetch from backend; fallback=[]) ---
  const [products, setProducts] = useState([]);
  useEffect(() => {
    let alive = true;
    productsApi
      .list()
      .then((list) => {
        if (!alive) return;
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setProducts([]));
    return () => {
      alive = false;
    };
  }, []);

  // Index for local, synchronous product lookups (keeps old API alive)
  const index = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => {
      const titleSlug = slugify(p?.title || p?.name || p?.id);
      [p?.id, p?.slug, p?.handle, p?.sku, titleSlug]
        .filter(Boolean)
        .forEach((k) => map.set(String(k), p));
    });
    return map;
  }, [products]);

  const getProductSync = useCallback(
    (key) => (key ? index.get(String(key)) || null : null),
    [index]
  );

  // --- cart / wishlist (LS backed) ---
  const [cart, setCart] = useState(() => readLS("cart", []));
  const [wishlist, setWishlist] = useState(() => readLS("wishlist", []));

  useEffect(() => writeLS("cart", cart), [cart]);
  useEffect(() => writeLS("wishlist", wishlist), [wishlist]);

  const addToCart = (item) => {
    if (!item?.id) return;
    const price = Number.isFinite(Number(item.price)) ? Number(item.price) : 0;
    const mrp = Number.isFinite(Number(item.mrp)) ? Number(item.mrp) : price;

    const normalized = {
      id: item.id,
      title: item.title || item.name || "Product",
      image:
        item.image ||
        item.cover ||
        item.images?.[0]?.url ||
        item.images?.[0] ||
        "/images/placeholder.jpg",
      price,
      mrp,
      size: item.size || "",
      color: item.color || "",
      qty: Math.max(1, Math.min(99, Number(item.qty) || 1)),
    };

    setCart((prev) => {
      const key = itemKey(normalized);
      const next = prev.map((p) => ({ ...p, _k: itemKey(p) }));
      const idx = next.findIndex((p) => p._k === key);
      if (idx >= 0) {
        next[idx] = {
          ...next[idx],
          qty: Math.min(99, (next[idx].qty || 1) + normalized.qty),
        };
        delete next[idx]._k;
        return next;
      }
      return [...prev, normalized];
    });
  };

  // Flexible qty setter: accepts (id, qty, size, color) OR (itemObj, qty) OR (keyString, qty)
  const setCartQty = (a, qtyLike, size, color) => {
    const qty = Math.max(1, Math.min(99, Number(qtyLike) || 1));
    let key;
    if (typeof a === "string" && (size !== undefined || color !== undefined)) {
      key = `${a}|${size || ""}|${color || ""}`;
    } else if (typeof a === "object" && a) {
      key = itemKey(a);
    } else {
      key = a; // already a key string
    }
    setCart((prev) =>
      prev.map((p) => (itemKey(p) === key ? { ...p, qty } : p))
    );
  };

  // Back-compat with older Cart.jsx that calls updateCartQty(id, n, size, color)
  const updateCartQty = (id, n, size, color) => setCartQty(id, n, size, color);

  // Flexible remover: (id, size, color) OR (itemObj) OR (keyString)
  const removeFromCart = (...args) => {
    let key;
    if (args.length === 1 && typeof args[0] === "object") {
      key = itemKey(args[0]);
    } else if (args.length >= 1) {
      const [id, size, color] = args;
      if (typeof id === "string" && (size !== undefined || color !== undefined)) {
        key = `${id}|${size || ""}|${color || ""}`;
      } else {
        key = id; // assume key string
      }
    }
    if (!key) return;
    setCart((prev) => prev.filter((p) => itemKey(p) !== key));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (itemOrId) => {
    const id =
      typeof itemOrId === "string" ? itemOrId : itemOrId?.id || itemOrId?.slug;
    if (!id) return;
    setWishlist((prev) => {
      const exists = prev.some((w) => String(w.id) === String(id));
      if (exists) return prev.filter((w) => String(w.id) !== String(id));
      const p = getProductSync(id) || itemOrId || {};
      return [
        ...prev,
        {
          id: id,
          title: p.title || p.name || "Product",
          image:
            p.image ||
            p.cover ||
            p.images?.[0]?.url ||
            p.images?.[0] ||
            "/images/placeholder.jpg",
          price: p.price || 0,
        },
      ];
    });
  };

  // Back-compat helpers used in some Cart code
  const moveToWishlist = (cartItem) => {
    if (!cartItem?.id) return;
    setWishlist((prev) =>
      prev.some((w) => String(w.id) === String(cartItem.id))
        ? prev
        : [...prev, { id: cartItem.id }]
    );
    removeFromCart(cartItem);
  };

  const moveWishlistToCart = (id) => {
    const p = getProductSync(id);
    if (!p) return;
    addToCart({ id, price: p.price || 1, title: p.title, image: p.image });
    setWishlist((prev) => prev.filter((w) => String(w.id) !== String(id)));
  };

  const value = useMemo(
    () => ({
      // auth
      user,
      token,
      logout,
      loginRequestOtp,
      loginVerifyOtp,

      // catalog
      products,
      setProducts,
      getProductSync,

      // cart + wishlist
      cart,
      addToCart,
      setCartQty,
      updateCartQty, // legacy alias
      removeFromCart,
      clearCart,

      wishlist,
      toggleWishlist,
      moveToWishlist,
      moveWishlistToCart,
    }),
    [
      user,
      token,
      products,
      cart,
      wishlist,
      // stable fns are fine, but include to be explicit:
      logout,
      loginRequestOtp,
      loginVerifyOtp,
      getProductSync,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default StoreProvider;
