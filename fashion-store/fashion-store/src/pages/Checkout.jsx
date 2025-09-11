import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const DEMO_COUPONS = {
  SAVE100: { type: "flat", value: 100, label: "₹100 off" },
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free Shipping" },
};

export default function Checkout() {
  const { cart, totals } = useStore();
  const nav = useNavigate();

  const [addr, setAddr] = useState({
    name: "", phone: "", email: "",
    pincode: "", line1: "", line2: "", city: "", state: "",
  });
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [points, setPoints] = useState(0);

  const price = useMemo(() => {
    const subtotal = totals.subtotal;
    const gst = Math.round(subtotal * 0.12);
    let shipping = subtotal > 999 ? 0 : 49;

    let discount = 0;
    if (applied) {
      const c = DEMO_COUPONS[applied];
      if (c?.type === "flat") discount += c.value;
      if (c?.type === "percent") discount += Math.round((subtotal * c.value) / 100);
      if (c?.type === "freeship") shipping = 0;
    }

    const wrap = giftWrap ? 35 : 0;
    const redeem = Math.min(200, Math.max(0, points));
    const total = Math.max(0, subtotal + gst + shipping + wrap - discount - redeem);

    return { subtotal, gst, shipping, wrap, discount, redeem, total };
  }, [totals.subtotal, applied, giftWrap, points]);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (DEMO_COUPONS[code]) setApplied(code);
    else alert("Invalid coupon. Try: SAVE100 / WELCOME10 / FREESHIP");
  };

  const toPayment = () => {
    if (!addr.name || !addr.phone || !addr.email || !addr.pincode || !addr.line1 || !addr.city || !addr.state) {
      alert("Please fill all required fields.");
      return;
    }
    nav("/payment", { state: { addr, price, applied } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Address */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Full Name*" value={addr.name} onChange={e=>setAddr({...addr,name:e.target.value})}/>
              <input className="input" placeholder="Phone*" value={addr.phone} onChange={e=>setAddr({...addr,phone:e.target.value})}/>
              <input className="input sm:col-span-2" placeholder="Email*" value={addr.email} onChange={e=>setAddr({...addr,email:e.target.value})}/>
              <input className="input" placeholder="Pincode*" value={addr.pincode} onChange={e=>setAddr({...addr,pincode:e.target.value})}/>
              <input className="input sm:col-span-2" placeholder="Address line 1*" value={addr.line1} onChange={e=>setAddr({...addr,line1:e.target.value})}/>
              <input className="input sm:col-span-2" placeholder="Address line 2 (optional)" value={addr.line2} onChange={e=>setAddr({...addr,line2:e.target.value})}/>
              <input className="input" placeholder="City*" value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})}/>
              <input className="input" placeholder="State*" value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})}/>
            </div>
          </div>

          {/* Coupon / Wrap / Points */}
          <div className="p-4 border rounded-lg space-y-4">
            <div>
              <label className="text-sm opacity-70">Coupon</label>
              <div className="mt-1 flex gap-2">
                <input className="input flex-1" placeholder="SAVE100 / WELCOME10 / FREESHIP" value={coupon} onChange={e=>setCoupon(e.target.value)}/>
                <button type="button" className="btn" onClick={applyCoupon}>Apply</button>
              </div>
              {applied && <div className="text-sm mt-2">Applied: <b>{applied}</b> – {DEMO_COUPONS[applied]?.label}</div>}
            </div>

            <div className="flex items-center justify-between">
              <span>Add gift wrap (+₹35)</span>
              <input type="checkbox" checked={giftWrap} onChange={e=>setGiftWrap(e.target.checked)} />
            </div>

            <div className="flex items-center gap-2">
              <span>Redeem points (max 200)</span>
              <input className="input w-24" type="number" min={0} max={200} value={points} onChange={e=>setPoints(Number(e.target.value)||0)} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="p-4 border rounded-lg h-fit sticky top-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="flex justify-between mb-1"><span>Items</span><span>{cart.length}</span></div>
          <div className="flex justify-between mb-1"><span>Subtotal</span><span>₹{price.subtotal}</span></div>
          <div className="flex justify-between mb-1"><span>GST (12%)</span><span>₹{price.gst}</span></div>
          <div className="flex justify-between mb-1"><span>Shipping</span><span>{price.shipping === 0 ? "Free" : `₹${price.shipping}`}</span></div>
          {price.wrap > 0 && <div className="flex justify-between mb-1"><span>Gift Wrap</span><span>₹{price.wrap}</span></div>}
          {price.discount > 0 && <div className="flex justify-between mb-1 text-emerald-600"><span>Coupon</span><span>-₹{price.discount}</span></div>}
          {price.redeem > 0 && <div className="flex justify-between mb-1 text-emerald-600"><span>Points</span><span>-₹{price.redeem}</span></div>}
          <div className="flex justify-between font-semibold text-lg mt-2"><span>Total</span><span>₹{price.total}</span></div>

          <button type="button" className="mt-6 w-full bg-black text-white rounded py-2" onClick={toPayment}>
            Continue to Payment
          </button>
        </aside>
      </div>
    </div>
  );
}
