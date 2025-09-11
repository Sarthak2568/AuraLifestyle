import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import ALL_PRODUCTS from "../data/products";
import { colorHex } from "../data/productMeta";

export default function Cart() {
  const { cart, setCartQty, removeFromCart, moveCartItemToWishlist, totals, shipping, setShipping, addToCart } = useStore();
  const { show } = useToast();
  const nav = useNavigate();

  const [form, setForm] = useState(shipping);
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // {code, kind:'percent'|'flat', value}
  const [giftWrap, setGiftWrap] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const valid = useMemo(() => {
    const phoneOk = /^\d{10}$/.test(form.phone || "");
    const pinOk = /^\d{6}$/.test(form.pincode || "");
    return Boolean(form.fullName && phoneOk && pinOk && form.address1 && form.city && form.state);
  }, [form]);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // ---- Suggestions (You may also like)
  const picks = useMemo(() => {
    const inCart = new Set(cart.map((c) => c.id));
    // use gender of the first cart item, else null
    const first = ALL_PRODUCTS.find((p) => p.id === cart[0]?.id);
    const g = first?.gender;
    const pool = ALL_PRODUCTS.filter((p) => (g ? p.gender === g : true) && !inCart.has(p.id));
    // stable 3 picks
    return pool.slice(0, 3);
  }, [cart]);

  // ---- Price math with extras
  const discountFromCoupon = useMemo(() => {
    if (!appliedCoupon) return 0;
    const base = totals.subtotal;
    if (appliedCoupon.kind === "percent") return Math.round((base * appliedCoupon.value) / 100);
    return Math.min(appliedCoupon.value, base);
  }, [appliedCoupon, totals.subtotal]);

  const pointsValue = useMemo(() => (usePoints ? 50 : 0), [usePoints]); // flat ₹50 off
  const wrapFee = giftWrap ? 25 : 0;
  const taxable = Math.max(0, totals.subtotal - discountFromCoupon - pointsValue);
  const gst = Math.round(taxable * 0.05);
  const grand = Math.max(0, taxable + gst + wrapFee);

  // ---- Apply coupon
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "AURA10") setAppliedCoupon({ code, kind: "percent", value: 10 });
    else if (code === "WELCOME50") setAppliedCoupon({ code, kind: "flat", value: 50 });
    else { setAppliedCoupon(null); show({ type: "info", title: "Invalid coupon", message: "Try AURA10 or WELCOME50" }); }
  };

  if (!cart.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="text-2xl font-bold mb-1">My Bag</h1>
        <div className="text-sm opacity-70 mb-6">BAG — ADDRESS — PAYMENT</div>
        <p className="opacity-70 mb-6">Your cart is empty.</p>
        <Link to="/men" className="px-4 py-2 rounded bg-black text-white">Shop Men</Link>
        <Link to="/women" className="ml-3 px-4 py-2 rounded border">Shop Women</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-2">
        <h1 className="text-2xl font-bold">My Bag</h1>
        <div className="text-sm opacity-70">BAG — ADDRESS — PAYMENT</div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {cart.map((item) => {
            const hex = colorHex(item.id, item.color);
            return (
              <div key={item.key} className="flex gap-4 p-4 border rounded-xl bg-white/80 shadow-sm">
                <img
                  src={item.image || "/images/placeholder.jpg"}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="text-xs opacity-70">Oversized T-Shirts</div>
                      <div className="mt-1 flex items-center gap-3 text-sm opacity-80">
                        <span>Size: {item.size || "-"}</span>
                        <span className="flex items-center gap-1">
                          Color: {item.color || "-"}
                          <span className="inline-block h-3 w-3 rounded-full border" style={{ background: hex }} />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{(item.price * item.qty).toFixed(0)}</div>
                      {item.mrp && item.mrp > item.price && (
                        <div className="text-xs line-through opacity-60">₹{(item.mrp * item.qty).toFixed(0)}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <button type="button" className="px-3 py-1" onClick={() => setCartQty(item.key, item.qty - 1)}>−</button>
                      <input
                        className="w-12 text-center bg-transparent py-1 outline-none"
                        value={item.qty}
                        onChange={(e) => setCartQty(item.key, e.target.value)}
                      />
                      <button type="button" className="px-3 py-1" onClick={() => setCartQty(item.key, item.qty + 1)}>+</button>
                    </div>

                    <button type="button" onClick={() => moveCartItemToWishlist(item.key)} className="text-sm opacity-70 hover:opacity-100">
                      Move to Wishlist
                    </button>
                    <button type="button" onClick={() => removeFromCart(item.key)} className="text-sm opacity-70 hover:opacity-100">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* YOU MAY ALSO LIKE */}
          {picks.length ? (
            <div className="mt-4 border rounded-xl p-4">
              <div className="font-semibold mb-3">You may also like</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {picks.map((p) => (
                  <div key={p.id} className="border rounded-xl overflow-hidden bg-white">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm line-clamp-1">{p.title}</div>
                      <div className="text-sm font-semibold">₹{p.price}</div>
                      <button
                        className="mt-2 w-full text-xs border rounded py-1"
                        onClick={() => {
                          const size = p.sizes?.[0] || "";
                          const color = p.colors?.[0] || "";
                          addToCart({ id: p.id, title: p.title, image: p.image, price: p.price, mrp: p.mrp, qty: 1, size, color });
                          show({ type: "cart", title: "Added to bag", message: p.title });
                        }}
                      >
                        ADD NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Summary + Options + Delivery */}
        <aside className="space-y-4">
          <button
            className="w-full rounded-xl bg-emerald-700 text-white py-3 font-semibold"
            onClick={() => { setTouched(true); if (!valid) return; setShipping(form); nav("/checkout"); }}
          >
            PLACE ORDER
          </button>

          {/* Promo upsell card */}
          <div className="p-4 border rounded-xl bg-gradient-to-r from-rose-50 to-amber-50">
            <div className="font-semibold mb-1">YOU ARE MISSING OUT!</div>
            <div className="text-sm opacity-80">Save an additional ₹48 by adding membership to your cart.</div>
            <button className="mt-2 text-xs border rounded px-3 py-1">ADD</button>
          </div>

          {/* Collapsibles */}
          <details className="p-4 border rounded-xl bg-white" open>
            <summary className="cursor-pointer font-medium">Apply Coupon</summary>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 rounded-lg border px-3 py-2 bg-transparent" value={coupon} onChange={(e)=>setCoupon(e.target.value)} placeholder="AURA10 / WELCOME50" />
              <button className="rounded-lg border px-3 py-2" onClick={applyCoupon}>Apply</button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 text-xs">
                Applied <span className="font-semibold">{appliedCoupon.code}</span> — {appliedCoupon.kind==="percent" ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`} off
              </div>
            )}
          </details>

          <details className="p-4 border rounded-xl bg-white">
            <summary className="cursor-pointer font-medium">Gift Voucher</summary>
            <div className="mt-3 text-sm opacity-70">(Optional) Accept voucher codes in checkout — not wired here.</div>
          </details>

          <details className="p-4 border rounded-xl bg-white">
            <summary className="cursor-pointer font-medium">Gift Wrap (₹25)</summary>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={giftWrap} onChange={(e)=>setGiftWrap(e.target.checked)} />
              Add gift wrap to this order
            </label>
          </details>

          <details className="p-4 border rounded-xl bg-white">
            <summary className="cursor-pointer font-medium">Aura Points</summary>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={usePoints} onChange={(e)=>setUsePoints(e.target.checked)} />
              Redeem 100 points for <span className="font-medium">₹50</span> off
            </label>
          </details>

          {/* Billing details */}
          <div className="p-4 border rounded-xl bg-white">
            <h2 className="font-semibold mb-3">Billing Details</h2>
            <div className="flex justify-between mb-1 text-sm"><span>Cart Total (Excl. taxes)</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
            {appliedCoupon && <div className="flex justify-between mb-1 text-sm text-emerald-700"><span>Coupon Discount</span><span>-₹{discountFromCoupon.toFixed(2)}</span></div>}
            {usePoints && <div className="flex justify-between mb-1 text-sm text-emerald-700"><span>Aura Points</span><span>-₹{pointsValue.toFixed(2)}</span></div>}
            {giftWrap && <div className="flex justify-between mb-1 text-sm"><span>Gift Wrap</span><span>₹{wrapFee.toFixed(2)}</span></div>}
            <div className="flex justify-between mb-1 text-sm"><span>GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-semibold mt-2"><span>Total Amount</span><span>₹{grand.toFixed(2)}</span></div>
          </div>

          {/* Delivery form */}
          <div className="p-4 border rounded-xl bg-white">
            <h2 className="font-semibold mb-3">Delivery Details</h2>
            <label className="block text-sm mb-2">Full Name
              <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.fullName} onChange={onChange("fullName")} placeholder="Your name" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Phone (10-digit)
                <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.phone} onChange={onChange("phone")} placeholder="9876543210" />
              </label>
              <label className="text-sm">Pincode
                <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.pincode} onChange={onChange("pincode")} placeholder="400001" />
              </label>
            </div>
            <label className="block text-sm mt-3">Address Line 1
              <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.address1} onChange={onChange("address1")} placeholder="House no, street" />
            </label>
            <label className="block text-sm mt-3">Address Line 2 (optional)
              <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.address2} onChange={onChange("address2")} placeholder="Area, landmark" />
            </label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <label className="text-sm">City
                <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.city} onChange={onChange("city")} placeholder="Mumbai" />
              </label>
              <label className="text-sm">State
                <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-transparent" value={form.state} onChange={onChange("state")} placeholder="Maharashtra" />
              </label>
            </div>

            {!valid && touched && (
              <div className="mt-3 text-xs text-rose-600">Please fill name, 10-digit phone, 6-digit pincode, address, city and state.</div>
            )}

            <button
              type="button"
              className={`mt-4 w-full rounded-lg py-2 ${valid ? "bg-black text-white" : "bg-neutral-200 text-neutral-500"}`}
              onClick={() => { setTouched(true); if (!valid) return; setShipping(form); nav("/checkout"); }}
            >
              Continue to Address
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
