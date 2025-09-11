import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const nav = useNavigate();
  const { state } = useLocation();
  const total = state?.price?.total ?? 0;

  const payNow = () => {
    // simulate payment success
    setTimeout(() => {
      alert("Payment successful! (dummy)");
      nav("/");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <div className="border rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span>Total Payable</span>
          <span className="font-semibold">₹{total}</span>
        </div>
        <div className="text-sm opacity-70 mb-4">
          This is a dummy payment screen. We’ll integrate Razorpay later.
        </div>
        <button type="button" onClick={payNow} className="w-full bg-black text-white rounded py-2">
          Pay Now
        </button>
        <button type="button" onClick={() => nav(-1)} className="w-full border rounded py-2 mt-2">
          Back
        </button>
      </div>
    </div>
  );
}
