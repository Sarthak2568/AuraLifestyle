// routes/checkout.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// helper to get socket server (we'll attach in server.js)
function getIo(req) {
  return req.app.get("io");
}

/**
 * POST /api/checkout/create-order
 * body: { customer: {...}, items: [{ sku, qty, price, title, size, color }], payment: { provider, id, status, raw }, address: {...}, note}
 *
 * This endpoint expects payment already authorized/confirmed on client or handles payment capture separately.
 */
router.post("/create-order", async (req, res) => {
  const db = mongoose.connection;
  const productsCol = db.collection("products");
  const ordersCol = db.collection("orders");

  const { customer = {}, items = [], payment = {}, address = {}, note = "" } = req.body;
  if (!items || !items.length) return res.status(400).json({ success: false, message: "No items" });

  // Normalize items: ensure qty numeric
  const normalized = items.map((it) => ({ ...it, qty: Number(it.qty) || 0 }));

  // 1) Try to decrement stock for each item atomically via findOneAndUpdate with condition stock >= qty
  // Track successful decrements to rollback if any fail
  const decremented = [];

  try {
    for (const it of normalized) {
      const skuFilter = it.sku ? { sku: it.sku } : { _id: ObjectId.isValid(it._id) ? new ObjectId(it._id) : null };
      // remove null
      if (skuFilter._id === null) delete skuFilter._id;
      // require available stock if `stock` exists
      const filter = { ...skuFilter, stock: { $gte: it.qty } };
      const update = { $inc: { stock: -it.qty } };

      const result = await productsCol.findOneAndUpdate(filter, update, { returnDocument: "after" });
      if (!result.value) {
        // not enough stock — rollback previous decrements
        for (const d of decremented) {
          await productsCol.updateOne(d.filter, { $inc: { stock: d.qty } });
        }
        return res.status(400).json({ success: false, message: `Insufficient stock for ${it.title || it.sku}` });
      }
      // record to allow rollback if later fail
      decremented.push({ filter: skuFilter, qty: it.qty });
    }

    // 2) Create order document
    const orderDoc = {
      orderNumber: `ORD${Date.now()}`, // improve with nicer generator if needed
      customerId: customer.userId || customer.userId || customer.id || null,
      customer: customer,
      address,
      items: normalized,
      sub: normalized.reduce((s, it) => s + (Number(it.price || 0) * it.qty), 0),
      gst: 0,
      total: normalized.reduce((s, it) => s + (Number(it.price || 0) * it.qty), 0),
      status: payment?.status === "paid" ? "paid" : "pending",
      payment: payment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const r = await ordersCol.insertOne(orderDoc);

    // 3) Emit Socket.IO events (admin clients)
    try {
      const io = getIo(req);
      if (io) {
        io.emit("order:created", { order: orderDoc });
        // also emit inventory update events for each product
        for (const d of decremented) {
          // fetch current product info to send
          const p = await productsCol.findOne(d.filter, { projection: { sku: 1, title: 1, stock: 1, image: 1 } });
          io.emit("inventory:updated", { sku: p.sku, title: p.title, stock: p.stock, _id: p._id });
        }
      }
    } catch (e) {
      console.warn("socket emit failed", e);
    }

    return res.json({ success: true, orderId: r.insertedId, order: orderDoc });
  } catch (err) {
    console.error("create-order err", err);
    // try rollback if any decremented
    try {
      for (const d of decremented) {
        await productsCol.updateOne(d.filter, { $inc: { stock: d.qty } });
      }
    } catch (rollbackErr) {
      console.error("rollback failed", rollbackErr);
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
