// src/routes/customers.js
import { Router } from "express";
import Customer from "../models/Customer.js";

const router = Router();

/**
 * POST /api/customers/ensure
 * body: { fullName?, email?, phone?, address? }
 * Finds by email OR phone; creates if missing; stores address if new.
 * Returns { ok, customerId }
 */
router.post("/ensure", async (req, res) => {
  const { fullName, email, phone, address } = req.body || {};
  if (!email && !phone) return res.status(400).json({ ok: false, message: "email or phone required" });

  // find existing by email or phone
  let c = await Customer.findOne({
    $or: [{ email: email || null }, { phone: phone || null }],
  });

  if (!c) {
    c = await Customer.create({
      fullName: fullName || "",
      email: email || null,
      phone: phone || null,
      addresses: address ? [address] : [],
    });
  } else {
    // update basic fields if provided
    if (fullName && !c.fullName) c.fullName = fullName;
    if (email && !c.email) c.email = email;
    if (phone && !c.phone) c.phone = phone;

    // append address if not duplicate
    if (address) {
      const exists = c.addresses.some(
        (a) =>
          a.address1 === address.address1 &&
          a.pincode === address.pincode &&
          a.phone === address.phone
      );
      if (!exists) c.addresses.unshift(address);
    }
    await c.save();
  }

  res.json({ ok: true, customerId: c.customerId });
});

/**
 * GET /api/customers/:customerId
 */
router.get("/:customerId", async (req, res) => {
  const c = await Customer.findOne({ customerId: req.params.customerId }).lean();
  if (!c) return res.status(404).json({ ok: false, message: "not found" });
  res.json({ ok: true, customer: c });
});

export default router;
