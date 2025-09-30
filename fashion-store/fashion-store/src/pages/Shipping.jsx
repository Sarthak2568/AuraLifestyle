import React from "react";

export default function Shipping() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Shipping Policy</h1>
      <p className="mt-2 text-sm opacity-70">Last updated: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="mt-6 space-y-4 text-sm leading-6">
        <p>
          At <strong>AuraLifestyle</strong>, we value our customers and aim to dispatch orders as quickly as possible.
          Once your order is <strong>confirmed</strong>, it will be <strong>shipped within 7 business days</strong>.
        </p>

        <h2 className="font-semibold text-base">Order Processing</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
          <li>You’ll receive an email/SMS with tracking details when your order ships.</li>
        </ul>

        <h2 className="font-semibold text-base">Delivery Timelines</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Metro cities: 2–5 business days after dispatch.</li>
          <li>Other locations: 3–7 business days after dispatch.</li>
          <li>Remote/Out-of-delivery areas may take longer based on courier coverage.</li>
        </ul>

        <h2 className="font-semibold text-base">Shipping Fees</h2>
        <p>
          Shipping charges (if any) are displayed at checkout based on your pincode, weight, and ongoing promotions.
        </p>

        <h2 className="font-semibold text-base">Address & Delivery Attempts</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Please ensure your address and phone number are accurate to avoid delays.</li>
          <li>If a delivery attempt fails, the courier may re-attempt or contact you.</li>
        </ul>

        <h2 className="font-semibold text-base">Need Help?</h2>
        <p>
          For shipping-related queries, reach us at{" "}
          <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a>{" "}
          or call <a className="underline" href="tel:+919650306378">+91 96503 06378</a>.
        </p>
      </div>
    </div>
  );
}
