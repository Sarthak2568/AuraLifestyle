// src/routes/admin.js
import express from "express";
import mongoose from "mongoose";
import { Parser } from "json2csv";
import { getIo } from "../utils/socket.js"; // ensure backend socket util exists and is attached in server.js
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

/*
  This admin router is intentionally flexible: it reads collections directly from
  mongoose.connection so it works with the project's existing schemas.

  It also emits socket events:
    - order:created / order:updated
    - product:created / product:updated
    - inventory:updated
    - user:updated

  For production, replace DEV_ADMIN_BYPASS with real auth middleware.
*/

/* -------------------- helpers -------------------- */
function parseDateParam(v) {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d)) return null;
  return d;
}

function requireAdmin(req, res, next) {
  // Dev bypass for local testing. Set DEV_ADMIN_BYPASS=1 in .env to skip auth locally.
  if (process.env.DEV_ADMIN_BYPASS === "1") return next();

  // Replace this with your real auth check; e.g. check req.user && req.user.role === 'admin'
  if (req.user && req.user.role === "admin") return next();

  return res.status(403).json({ success: false, message: "Admin required" });
}

/* -------------------- ORDERS -------------------- */
/**
 GET /api/admin/orders?q=&status=&from=&to=&limit=&page=
 returns list of orders
*/
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { q, status, from, to, limit = 100, page = 1 } = req.query;
    const col = mongoose.connection.collection("orders");
    const filter = {};

    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [
        { orderNumber: rx },
        { "address.email": rx },
        { customerId: rx },
        { "razorpay.payment_id": rx },
        { "payment.paymentId": rx },
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      const f = parseDateParam(from);
      const t = parseDateParam(to);
      if (f) filter.createdAt.$gte = f;
      if (t) {
        t.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = t;
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const docs = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    // Also return a count (fast approximate count would be fine but use countDocuments)
    const count = await col.countDocuments(filter);

    res.json({ items: docs, count });
  } catch (e) {
    console.error("admin/orders err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 GET /api/admin/orders/:id   (id may be _id or orderNumber)
*/
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection("orders");
    let doc = null;

    // try by ObjectId
    if (ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) });
    }
    if (!doc) {
      // try by orderNumber
      doc = await col.findOne({ orderNumber: id });
    }
    if (!doc) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: doc });
  } catch (e) {
    console.error("admin/orders/:id err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 PATCH /api/admin/orders/:id  { status, notes, tracking, shipment, meta, addHistory }
 updates order fields (status, etc)
*/
router.patch("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const col = mongoose.connection.collection("orders");

    // allow updating by _id or orderNumber
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { orderNumber: id };

    const update = { $set: {}, $push: {} };
    const allowedSet = ["status", "notes", "tracking", "shipment", "fulfillment", "adminNotes", "shippingInfo"];
    allowedSet.forEach((k) => {
      if (payload[k] !== undefined) update.$set[k] = payload[k];
    });

    if (payload.meta && typeof payload.meta === "object") update.$set.meta = payload.meta;
    if (payload.addHistory) update.$push.history = payload.addHistory;

    // remove $push if empty
    if (!Object.keys(update.$push).length) delete update.$push;

    // if nothing to set, return bad request
    if (!Object.keys(update.$set).length && !update.$push) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const r = await col.findOneAndUpdate(filter, update, { returnDocument: "after" });
    if (!r.value) return res.status(404).json({ success: false, message: "Order not found" });

    // emit socket event: order updated
    try {
      const io = getIo();
      io.to("admin").emit("order:updated", r.value);
    } catch (e) {
      // non-fatal if sockets not attached
      console.warn("emit order:updated failed", e?.message || e);
    }

    res.json({ success: true, order: r.value });
  } catch (e) {
    console.error("admin/patch orders err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- EXPORT CSV -------------------- */
/**
 GET /api/admin/orders/export?status=&from=&to=&q=
 returns CSV attachment (orders)
*/
router.get("/orders/export", requireAdmin, async (req, res) => {
  try {
    const { q, status, from, to } = req.query;
    const col = mongoose.connection.collection("orders");
    const filter = {};

    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ orderNumber: rx }, { "address.email": rx }, { customerId: rx }, { "payment.paymentId": rx }];
    }
    if (from || to) {
      filter.createdAt = {};
      const f = parseDateParam(from);
      const t = parseDateParam(to);
      if (f) filter.createdAt.$gte = f;
      if (t) {
        t.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = t;
      }
    }

    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(10000).toArray();

    // prepare rows compatible with existing CSV in your system
    const rows = docs.map((d) => ({
      orderNumber: d.orderNumber || d._id,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
      email: d.address?.email || d.customer?.email || "",
      name: d.address?.fullName || d.customer?.name || "",
      userId: d.customerId || d.customer?.userId || "",
      total: d.total || d.sub || 0,
      status: d.status || "",
      payment_id: d.razorpay?.payment_id || d.payment?.paymentId || "",
      items: (d.items || []).map((it) => `${it.title || it.name} x${it.qty}`).join(" | "),
      address: `${d.address?.address1 || ""} ${d.address?.address2 || ""} ${d.address?.city || ""} ${d.address?.pincode || ""}`.trim(),
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader("Content-Disposition", `attachment; filename="orders-${new Date().toISOString().slice(0,10)}.csv"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (e) {
    console.error("admin/orders/export err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- PRODUCTS / INVENTORY -------------------- */
/**
 GET /api/admin/products
*/
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("products");
    const docs = await col.find({}).sort({ title: 1 }).limit(2000).toArray();
    return res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error("admin/products err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 POST /api/admin/products
 body => product payload (creates new product doc)
*/
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("products");
    const payload = req.body || {};
    const r = await col.insertOne(payload);
    const created = await col.findOne({ _id: r.insertedId });

    // emit product created
    try { getIo().to("admin").emit("product:created", created); } catch(e){}

    res.json({ success: true, product: created });
  } catch (e) {
    console.error("admin/products post err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 PATCH /api/admin/products/:id
 body => partial updates
*/
router.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection("products");
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { sku: id };

    const payload = req.body || {};
    const r = await col.findOneAndUpdate(filter, { $set: payload }, { returnDocument: "after" });
    if (!r.value) return res.status(404).json({ success: false, message: "Product not found" });

    try { getIo().to("admin").emit("product:updated", r.value); } catch(e){}

    res.json({ success: true, product: r.value });
  } catch (e) {
    console.error("admin/products patch err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 GET /api/admin/inventory
 returns { sku, title, image, stock }
*/
router.get("/inventory", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("products");
    const docs = await col
      .find({}, { projection: { sku: 1, title: 1, name: 1, image: 1, images: 1, stock: 1, inventory: 1 } })
      .sort({ title: 1 })
      .toArray();

    const normalized = docs.map((d) => ({
      _id: d._id,
      sku: d.sku || (d._id ? String(d._id) : undefined),
      title: d.title || d.name || "",
      image: d.image || (d.images && d.images[0]) || null,
      stock: (d.stock !== undefined ? d.stock : (d.inventory && d.inventory.stock) || 0),
    }));

    res.json({ items: normalized, count: normalized.length });
  } catch (e) {
    console.error("admin/inventory err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/**
 PATCH /api/admin/inventory/restock
 body { sku, qty }
*/
router.patch("/inventory/restock", requireAdmin, async (req, res) => {
  try {
    const { sku, qty } = req.body || {};
    if (!sku || qty === undefined) return res.status(400).json({ success: false, message: "sku & qty required" });

    const col = mongoose.connection.collection("products");
    // Attempt update by sku, then fallback to _id if sku is an id
    const or = [{ sku }];
    if (ObjectId.isValid(sku)) or.push({ _id: new ObjectId(sku) });

    const filter = { $or: or };
    const r = await col.findOneAndUpdate(filter, { $inc: { stock: Number(qty) } }, { returnDocument: "after" });

    if (!r.value) return res.status(404).json({ success: false, message: "Product not found" });

    // emit inventory update
    try { getIo().to("admin").emit("inventory:updated", { sku: r.value.sku || String(r.value._id), stock: r.value.stock }); } catch(e){}

    res.json({ success: true, product: r.value });
  } catch (e) {
    console.error("admin/inventory/restock err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- USERS -------------------- */
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("users");
    const docs = await col.find({}, { projection: { email: 1, name: 1, role: 1, userId: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(1000).toArray();
    res.json({ items: docs, count: docs.length });
  } catch (e) {
    console.error("admin/users err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.patch("/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const col = mongoose.connection.collection("users");
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { email: id };

    const update = { $set: {} };
    if (payload.role) update.$set.role = payload.role;
    if (payload.name) update.$set.name = payload.name;
    if (payload.phone) update.$set.phone = payload.phone;

    const r = await col.findOneAndUpdate(filter, update, { returnDocument: "after" });
    if (!r.value) return res.status(404).json({ success: false, message: "User not found" });

    try { getIo().to("admin").emit("user:updated", r.value); } catch(e){}

    res.json({ success: true, user: r.value });
  } catch (e) {
    console.error("admin/users patch err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const col = mongoose.connection.collection("users");
    let filter;
    if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
    else filter = { email: id };

    const r = await col.findOneAndDelete(filter);
    if (!r.value) return res.status(404).json({ success: false, message: "User not found" });

    try { getIo().to("admin").emit("user:deleted", { id: r.value._id, email: r.value.email }); } catch(e){}

    res.json({ success: true });
  } catch (e) {
    console.error("admin/users delete err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

/* -------------------- SETTINGS (simple) -------------------- */
router.get("/settings", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("settings");
    const doc = (await col.findOne({})) || {};
    res.json({ success: true, settings: doc });
  } catch (e) {
    console.error("admin/settings err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

router.patch("/settings", requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.collection("settings");
    const payload = req.body || {};
    const r = await col.findOneAndUpdate({}, { $set: payload }, { upsert: true, returnDocument: "after" });
    res.json({ success: true, settings: r.value });
  } catch (e) {
    console.error("admin/patch settings err", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
});

export default router;
