import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lsGet } from "../utils/order";

export default function OrderSuccess() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const stateOrder = loc.state?.order;

  // If we came via refresh/direct open, fetch from saved orders:
  const order = useMemo(() => {
    if (stateOrder) return stateOrder;
    const all = lsGet("aura.orders", []);
    return all.find((o) => o.id === id);
  }, [id, stateOrder]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">Order</h1>
        <p className="opacity-70 mb-6">We couldn’t find that order.</p>
        <button className="px-4 py-2 border rounded" onClick={() => nav("/")}>
          Back to home
        </button>
      </div>
    );
  }

  const amount = order.amount;
  const itemsCount = order.items.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payment completed</h1>
          <span className="text-sm rounded-full px-3 py-1 bg-green-100 text-green-700">
            {order.paymentMethod}
          </span>
        </div>

        <div className="mt-2 text-sm opacity-80">
          Order placed on {new Date(order.createdAt).toLocaleString()}
        </div>

        <div className="mt-4 p-3 rounded bg-neutral-50 border">
          <div className="text-sm">Order ID</div>
          <div className="font-mono font-semibold">{order.id}</div>
        </div>

        {/* Customer & address */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="rounded border p-4">
            <div className="font-semibold mb-2">Customer</div>
            <div className="text-sm">
              {order.customer?.name || "Guest"}
              <br />
              {order.customer?.email || "—"}
            </div>
          </div>
          <div className="rounded border p-4">
            <div className="font-semibold mb-2">Shipping Address</div>
            {order.address ? (
              <div className="text-sm">
                {order.address.fullName}
                <br />
                {order.address.addr1}
                {order.address.addr2 ? `, ${order.address.addr2}` : ""}
                <br />
                {order.address.city}, {order.address.state} — {order.address.pincode}
                <br />
                Phone: {order.address.phone}
              </div>
            ) : (
              <div className="text-sm opacity-70">No address saved</div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <div className="font-semibold mb-2">Items ({itemsCount})</div>
          <div className="divide-y border rounded">
            {order.items.map((it, idx) => (
              <div key={`${it.id}-${idx}`} className="p-3 flex items-center gap-3">
                <img src={it.image} alt={it.title} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs opacity-70">
                    {it.size ? `Size: ${it.size}` : null}
                    {it.size && it.color ? " • " : ""}
                    {it.color ? `Color: ${it.color}` : null}
                  </div>
                </div>
                <div className="text-sm">
                  x{it.qty || 1} • ₹{it.price * (it.qty || 1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 border rounded p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{amount}</span>
          </div>
          <div className="flex items-center justify-between text-sm opacity-70 mt-1">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex items-center justify-between font-semibold mt-3">
            <span>Total Amount</span>
            <span>₹{amount}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 border rounded">
            Print / Download Bill
          </button>
          <button onClick={() => nav("/")} className="px-4 py-2 border rounded">
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
