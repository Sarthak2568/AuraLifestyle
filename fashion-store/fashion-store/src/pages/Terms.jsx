import React from "react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms &amp; Conditions</h1>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Use of Our Website</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use this website only to make enquiries and place legally valid orders.</li>
          <li>Do not place false or fraudulent orders. If reasonably suspected, we may cancel such orders and notify the competent authorities.</li>
          <li>Provide accurate contact details (email, postal address and phone). You agree that we may use these details to contact you about your order where necessary.</li>
          <li>If you do not provide the required information, you will not be able to place an order.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Contract</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>After you place an order, you will receive an Order Confirmation and later a Shipping Confirmation.</li>
          <li><span className="font-medium">Availability of Products:</span> all orders are subject to product availability. If a product is unavailable, we may suggest substitutes of similar quality and value. If you do not wish to proceed with substitutes, we will reimburse any amount you have paid.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Refusal to Process an Order</h2>
        <p>
          While we strive to process every order, exceptional circumstances may require us to refuse an order even after sending an Order Confirmation.
          We reserve the right to do so at any time. We may also remove or modify any product, material, or content on the website.
        </p>
        <p>
          We shall not be liable to you or to any third party for removing or modifying any product or content, or for not processing an order after the Order Confirmation has been sent.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Delivery</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Typical delivery window: <span className="font-medium">3–7 working days</span> after dispatch (pan-India average).</li>
          <li>Delivery times depend on your location, local courier availability, seasonal load, and uncontrollable events (weather, strikes, government restrictions), etc.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Price &amp; Payment</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We try to ensure prices shown are correct; however, errors may occur. If a pricing error is found, we will contact you to confirm the order at the correct price or cancel it with a full refund.</li>
          <li>We are not obliged to provide a product at an obviously incorrect lower price (even after Shipping Confirmation) if the pricing error is apparent and could reasonably be recognized as such.</li>
          <li>Prices shown exclude delivery charges unless stated otherwise.</li>
          <li>Prices may change at any time.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Taxes</h2>
        <p>
          Purchases are subject to applicable taxes as per prevailing laws and regulations in India (including GST, where applicable).
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Returns (Summary)</h2>
        <p>
          Returns are governed by our detailed <a className="underline" href="/returns">Exchange &amp; Return Policy</a>.
          Key points:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Request returns within <span className="font-medium">3 days</span> of delivery.</li>
          <li>Items must be unused, unwashed and with all tags attached; packaging should be intact.</li>
          <li>Reverse-pickup charge: <span className="font-medium">₹100</span> (where arranged by us).</li>
          <li>Sale / clearance items are generally non-returnable and non-refundable.</li>
          <li>For damaged/defective/wrong items, email <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a> within 24 hours of delivery.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Invoice</h2>
        <p>An invoice is provided along with the products upon delivery.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Fraud Prevention</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We may refuse returns suspected to be fraudulent or in violation of policy.</li>
          <li>All returned products undergo inspection for condition and authenticity.</li>
          <li>Fraudulent attempts may be reported to the relevant authorities.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Modification of Terms</h2>
        <p>
          Aura Lifestyle may modify or update these Terms at any time without prior notice. Any changes will be made in the best interests of our customers.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Customer Satisfaction</h2>
        <p>
          Your satisfaction is our priority. We are committed to resolving issues fairly and promptly in line with our published policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Governing Law &amp; Jurisdiction</h2>
        <p>
          These Terms and any separate agreements for the provision of services are governed by the laws of India.
          Courts at <span className="font-medium">Mumbai, Maharashtra</span> shall have exclusive jurisdiction.
        </p>
      </section>
    </div>
  );
}
