import React from "react";

export default function Returns() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Exchange &amp; Return Policy</h1>

      <section className="space-y-3 mb-8">
        <p>
          We aim to deliver a seamless, fair and sustainable shopping experience. Please read these guidelines
          carefully before placing your order.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Requests for exchange/return must be placed within <span className="font-medium">3 days</span> of delivery.</li>
          <li>Items must be unused, unwashed, and in original packaging with all tags attached.</li>
          <li>Products returned with stains/damage/wear may be rejected unless received in that condition.</li>
          <li>Sale / clearance items are generally <span className="font-medium">non-returnable and non-refundable</span>.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">No Money Refund Policy</h2>
        <p>
          We do not offer cash/original-payment refunds. Approved refunds are issued as a{" "}
          <span className="font-medium">Gift Card</span> for future purchases.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Sale Orders &amp; Discount Codes</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Products purchased during a sale are not eligible for return; only size exchange is allowed (subject to stock).</li>
          <li>Gift cards and coupon codes can be applied during sales.</li>
          <li>₹100 exchange charge applies on sale products.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Size Exchange Policy</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><span className="font-medium">Window:</span> place the request within 3 days of delivery.</li>
          <li><span className="font-medium">Valid reasons:</span> wrong size, wrong item received, or manufacturing defect.</li>
          <li><span className="font-medium">Second exchange:</span> an additional ₹100 will apply; second-time returns are not allowed.</li>
          <li><span className="font-medium">Process:</span> submit your request at <a className="underline" href="https://theauralifestyle.org/">theauralifestyle.org</a>. Once approved, pickup will be attempted twice; if unsuccessful, please self-ship.</li>
          <li>On receipt and QC pass, we process the exchange. The end-to-end process may take 7–10 working days; updates are sent to your registered email.</li>
          <li><span className="font-medium">Stock:</span> exchanges depend on availability; if unavailable, we will issue a Gift Card or offer an alternative item.</li>
          <li>You may exchange for a different product by paying the price difference.</li>
          <li>If pickup service is unavailable at your pincode, self-ship to the address shared on approval.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Return Policy (Apparel)</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Requests must be placed within 3 days of delivery.</li>
          <li>Non-returnable items: innerwear, accessories, customised products.</li>
          <li>Reverse-shipping deduction: <span className="font-medium">₹129</span>.</li>
          <li>Refund method: Gift Card issued after QC at our warehouse.</li>
          <li>Gift Card validity: 180 days from issue. Coupons and Gift Cards cannot be combined in a single order.</li>
          <li>Orders placed using a Gift Card are not eligible for exchange/return.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Reverse Pickup &amp; Charges</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Reverse pickup is arranged only after confirmation by our Customer Experience Team.</li>
          <li>Standard reverse-pickup charge: <span className="font-medium">₹100</span>. When a Gift Card refund is issued for returns, a reverse-shipping deduction of <span className="font-medium">₹129</span> applies.</li>
          <li>We rely on 3rd-party partners (e.g., BlueDart, Delhivery, DTDC). Packaging must be intact for pickup.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Damaged / Wrong / Missing Items</h2>
        <p>
          If you receive a damaged, defective, missing or wrong product, contact us within{" "}
          <span className="font-medium">24 hours</span> of delivery at{" "}
          <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a>.
          Once confirmed, we will arrange the appropriate resolution.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Order Cancellation</h2>
        <p>
          Orders cannot be cancelled once placed due to our no-refund policy.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Respectful Communication</h2>
        <p>
          Our support team follows policy strictly and is not authorized to make exceptions. We request respectful communication to avoid delays in resolution.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why These Policies Help You</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>A fair and consistent system for all customers.</li>
          <li>Nominal fees to sustain quality logistics and service.</li>
          <li>Gift Card refunds let you shop conveniently later.</li>
          <li>More sustainable operations help keep prices reasonable.</li>
        </ul>

        <div className="mt-6">
          Need help? Email us at{" "}
          <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a>.
        </div>
      </section>
    </div>
  );
}
