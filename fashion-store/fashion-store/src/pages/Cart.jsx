// src/pages/Cart.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import CheckoutSteps from "../components/CheckoutSteps";
import ALL_PRODUCTS from "../data/products";

/* -------------------------------------------------------------
   Helpers
-------------------------------------------------------------- */
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(Number(n || 0))));

function useSafeToast() {
  const ctx = useToast?.();
  return ctx?.show || (() => {});
}

function subtotalOf(cart = []) {
  return cart.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.qty || 1),
    0
  );
}

/* Demo gift-card vault (replace with backend when ready) */
const GIFT_CARDS = {
  AURA100: 100,
  WELCOME50: 50,
  DIWALI250: 250,
};

/* -------------------------------------------------------------
   Delivery form (email + arrows + small UX wins)
-------------------------------------------------------------- */
function DeliveryForm({ onPlace, pending }) {
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("checkout_address") || "{}");
    } catch {
      return {};
    }
  })();

  const [fullName, setFullName] = useState(saved.fullName || "");
  const [email, setEmail] = useState(saved.email || "");
  const [phone, setPhone] = useState(saved.phone || "");
  const [pincode, setPincode] = useState(saved.pincode || "");
  const [addr1, setAddr1] = useState(saved.address1 || "");
  const [addr2, setAddr2] = useState(saved.address2 || "");
  const [city, setCity] = useState(saved.city || "");
  const [state, setState] = useState(saved.state || "");
  const [remember, setRemember] = useState(Boolean(saved.remember));

  // auto-save as they type
  useEffect(() => {
    const snapshot = {
      fullName,
      email,
      phone,
      pincode,
      address1: addr1,
      address2: addr2,
      city,
      state,
      remember,
    };
    localStorage.setItem("checkout_address", JSON.stringify(snapshot));
  }, [fullName, email, phone, pincode, addr1, addr2, city, state, remember]);

  const validPhone = /^\d{10}$/.test(phone);
  const validPin = /^\d{6}$/.test(pincode);
  const validEmail =
    !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // optional but must be valid if entered

  const valid =
    fullName.trim() &&
    validPhone &&
    validPin &&
    validEmail &&
    addr1.trim() &&
    city.trim() &&
    state.trim();

  // super simple ETA rule: metro-ish pins start with 1/2/4; else add a day
  const eta = useMemo(() => {
    if (!validPin) return null;
    const d = ["1", "2", "4"].includes(String(pincode)[0]) ? "2–4 days" : "3–5 days";
    return d;
  }, [pincode, validPin]);

  return (
    <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Delivery Details</div>
        {eta ? (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            ETA: {eta}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 mt-2">
        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          className={`w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 ${
            email && !validEmail ? "border-rose-400" : ""
          }`}
          placeholder="Email (for receipts)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className={`rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 ${
              phone && !validPhone ? "border-rose-400" : ""
            }`}
            placeholder="Phone (10-digit)"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
          />
          <input
            className={`rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 ${
              pincode && !validPin ? "border-rose-400" : ""
            }`}
            placeholder="Pincode"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/[^\d]/g, ""))}
          />
        </div>

        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
          placeholder="Address Line 1"
          value={addr1}
          onChange={(e) => setAddr1(e.target.value)}
        />
        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
          placeholder="Address Line 2 (optional)"
          value={addr2}
          onChange={(e) => setAddr2(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Use this address next time</span>
        </label>

        <button
          disabled={!valid || pending}
          onClick={() =>
            onPlace?.({
              fullName,
              email,
              phone,
              pincode,
              address1: addr1,
              address2: addr2,
              city,
              state,
              remember,
            })
          }
          className={`w-full h-12 rounded-md font-semibold transition inline-flex items-center justify-center gap-2 ${
            !valid || pending
              ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
              : "bg-black text-white hover:opacity-90"
          }`}
        >
          {pending ? "Processing…" : "Place Order"}
          <svg
            className={`h-4 w-4 ${!valid || pending ? "opacity-60" : "opacity-100"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   Cart row
-------------------------------------------------------------- */
function CartRow({ item, onQty, onMove, onRemove }) {
  const price = Number(item.price || 0);
  const mrp = Number(item.mrp || 0);
  const cover = item.image || item.cover || "/images/placeholder.jpg";

  const onImgError = (e) => {
    if (e?.target?.src && !e.target.src.endsWith("/images/placeholder.jpg")) {
      e.target.src = "/images/placeholder.jpg";
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4 flex gap-4">
      <img
        src={cover}
        alt={item.title || item.name}
        onError={onImgError}
        className="w-28 h-28 object-cover rounded-lg border"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              {item.title || item.name}
            </div>
            <div className="mt-1 text-sm opacity-70">
              {item.category || "Oversized T-Shirts"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatINR(price * (item.qty || 1))}
            </div>
            {!!mrp && mrp > price && (
              <div className="text-sm line-through opacity-60">
                {formatINR(mrp)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-6">
          <div className="text-sm">
            Size: <span className="opacity-80">{item.size || "-"}</span>
          </div>
          <div className="text-sm">
            Color:{" "}
            <span
              className="inline-block h-3 w-3 rounded-full border align-middle"
              style={{ background: item.colorHex || "#e5e5e5" }}
              title={item.color || "-"}
            />{" "}
            <span className="opacity-80 align-middle ml-1">
              {item.color || "-"}
            </span>
          </div>

          <div className="inline-flex items-center border rounded-md">
            <button
              className="px-3 py-1"
              onClick={() => onQty(Math.max(1, (item.qty || 1) - 1))}
              aria-label="decrease"
            >
              −
            </button>
            <input
              className="w-12 text-center py-1 outline-none bg-transparent"
              value={item.qty || 1}
              onChange={(e) => {
                const n = Math.max(
                  1,
                  Math.min(99, Number(e.target.value) || 1)
                );
                onQty(n);
              }}
            />
            <button
              className="px-3 py-1"
              onClick={() => onQty(Math.min(99, (item.qty || 1) + 1))}
              aria-label="increase"
            >
              +
            </button>
          </div>

          <button className="underline" onClick={onMove}>
            Move to Wishlist
          </button>
          <button className="opacity-70 hover:opacity-100" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   Right-side promos (chevrons + Apply with arrow)
-------------------------------------------------------------- */
function PromoPanel({
  giftWrap,
  setGiftWrap,
  giftApplied,
  setGiftApplied,
  subTotal,
}) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const tryApply = () => {
    const c = (code || "").trim().toUpperCase();
    const value = GIFT_CARDS[c];
    if (!value) {
      setGiftApplied(null);
      setMsg("Invalid gift card");
      return;
    }
    const usable = Math.min(value, Math.max(0, Math.round(subTotal)));
    setGiftApplied({ code: c, value: usable });
    setMsg(`Applied ₹${usable} gift balance`);
  };

  const Row = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-800">
        <button
          className="w-full flex items-center justify-between px-4 py-3"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="font-medium">{title}</span>
          <svg
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-90" : ""
            } text-neutral-500`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {open ? <div className="px-4 pb-4">{children}</div> : null}
      </div>
    );
  };

  const pointsEarned = Math.floor(Math.max(0, subTotal) / 100);

  return (
    <div className="space-y-3">
      <Row title="Apply Coupon" defaultOpen={false}>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="AURA10 / WELCOME50"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="rounded-md border px-3 py-2 inline-flex items-center gap-2"
            onClick={tryApply}
          >
            Apply
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className={`mt-2 text-sm ${giftApplied ? "text-emerald-600" : "text-rose-600"}`}>
          {msg || (giftApplied ? `Applied: ${giftApplied.code}` : "")}
        </div>
        {giftApplied ? (
          <button
            className="mt-2 text-sm underline"
            onClick={() => {
              setGiftApplied(null);
              setMsg("");
              setCode("");
            }}
          >
            Remove gift card
          </button>
        ) : null}
      </Row>

      <Row title="Gift Voucher">
        <div className="text-sm opacity-80">Apply store-issued vouchers here (coming soon).</div>
      </Row>

      <Row title={`Gift Wrap (${formatINR(25)})`}>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={(e) => setGiftWrap(e.target.checked)}
          />
          <span>Add premium gift wrap to this order</span>
        </label>
      </Row>

      <Row title="Aura Points">
        <div className="text-sm opacity-80">
          You will earn <span className="font-semibold">{pointsEarned}</span> Aura Points on this order. (1 point for every ₹100 spent.)
        </div>
      </Row>
    </div>
  );
}

/* -------------------------------------------------------------
   MAIN CART PAGE
-------------------------------------------------------------- */
export default function Cart() {
  const navigate = useNavigate();
  const toast = useSafeToast();

  const {
    cart = [],
    products: ctxProducts = [],
    updateCartQty,
    removeFromCart,
    moveToWishlist,
  } = useStore();

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftApplied, setGiftApplied] = useState(null); // { code, value } | null

  const subTotal = useMemo(() => subtotalOf(cart), [cart]);
  const wrapFee = giftWrap ? 49 : 0; // keep 49 in totals
  const giftCredit = giftApplied?.value || 0;
  const total = Math.max(0, subTotal + wrapFee - giftCredit);

  const handlePlaceOrder = (address) => {
    const prev = (() => {
      try {
        return JSON.parse(localStorage.getItem("checkout_address") || "{}");
      } catch {
        return {};
      }
    })();
    localStorage.setItem("checkout_address", JSON.stringify({ ...prev, ...address }));
    navigate("/payment");
  };

  // Recos with fallback to ALL_PRODUCTS
  const productsSource = (ctxProducts && ctxProducts.length ? ctxProducts : ALL_PRODUCTS) || [];
  const taken = new Set(cart.map((c) => String(c.id)));
  const recos = productsSource.filter((p) => !taken.has(String(p.id))).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CheckoutSteps current="bag" />

      <div className="grid lg:grid-cols-[1fr,380px] gap-8 items-start">
        {/* LEFT */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold mb-1">My Bag</h1>

          {cart.length === 0 ? (
            <div className="rounded-xl border p-6 text-center">
              Your bag is empty.{" "}
              <Link className="underline" to="/men">
                Shop now
              </Link>
            </div>
          ) : (
            cart.map((it) => (
              <CartRow
                key={`${it.id}-${it.size || ""}-${it.color || ""}`}
                item={it}
                onQty={(n) => updateCartQty?.(it.id, n, it.size, it.color)}
                onMove={() => {
                  moveToWishlist?.(it);
                  removeFromCart?.(it.id, it.size, it.color);
                  toast({ title: "Added to wishlist", subtitle: it.title, type: "wish", timeout: 1600 });
                }}
                onRemove={() => {
                  removeFromCart?.(it.id, it.size, it.color);
                  toast("Removed from bag", { type: "success" });
                }}
              />
            ))
          )}

          {/* You may also like */}
          {recos.length > 0 && (
            <div className="mt-6">
              <div className="font-semibold mb-3">You may also like</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recos.map((p) => {
                  const cover = p.image || p.images?.[0] || p.cover || "/images/placeholder.jpg";
                  return (
                    <div key={p.id} className="rounded-xl overflow-hidden border hover:shadow-sm transition">
                      <Link to={`/product/${encodeURIComponent(p.id)}`}>
                        <img
                          src={cover}
                          alt={p.title || p.name}
                          className="aspect-[3/4] w-full object-cover"
                          onError={(e) => {
                            if (e?.target?.src && !e.target.src.endsWith("/images/placeholder.jpg")) {
                              e.target.src = "/images/placeholder.jpg";
                            }
                          }}
                        />
                      </Link>
                      <div className="p-3">
                        <div className="font-medium line-clamp-1">{p.title || p.name}</div>
                        <div className="text-sm mt-1">{formatINR(p.price)}</div>
                        <Link to={`/product/${encodeURIComponent(p.id)}`} className="mt-2 inline-flex items-center gap-2 text-sm underline">
                          ADD NOW
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: promos + bill + address */}
        <div className="space-y-6">
          <PromoPanel
            giftWrap={giftWrap}
            setGiftWrap={setGiftWrap}
            giftApplied={giftApplied}
            setGiftApplied={setGiftApplied}
            subTotal={subTotal}
          />

          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 p-4">
            <div className="font-semibold mb-2">Billing Details</div>
            <div className="flex items-center justify-between text-sm py-1">
              <span>Cart Total</span>
              <span>{formatINR(subTotal)}</span>
            </div>
            {giftWrap ? (
              <div className="flex items-center justify-between text-sm py-1">
                <span>Gift Wrap</span>
                <span>{formatINR(wrapFee)}</span>
              </div>
            ) : null}
            {giftApplied ? (
              <div className="flex items-center justify-between text-sm py-1 text-emerald-700">
                <span>Gift Card ({giftApplied.code})</span>
                <span>-{formatINR(giftCredit)}</span>
              </div>
            ) : null}
            <div className="border-t my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <div id="delivery-form">
            <DeliveryForm onPlace={handlePlaceOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
