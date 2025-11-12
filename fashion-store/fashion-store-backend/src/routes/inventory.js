// src/routes/inventory.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';

const router = express.Router();

/** --- helpers --- */
async function adminAuth(req, _res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) {
      const err = new Error('Missing token');
      err.code = 401;
      throw err;
    }
    let payload = null;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      const err = new Error('Invalid/expired token');
      err.code = 401;
      throw err;
    }
    const role = payload?.role || 'user';
    if (role !== 'admin') {
      const err = new Error('Admin only');
      err.code = 403;
      throw err;
    }
    next();
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/inventory/check
 * body: { items: [{ sku: string, qty: number }, ...] }
 * returns: { ok: boolean, shortages: [{ sku, requested, available, title }], stock: { [sku]: number } }
 */
router.post('/check', async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) {
      return res.json({ ok: true, shortages: [], stock: {} });
    }

    const skus = [
      ...new Set(items.map(i => String(i.sku || i.id || '').trim()).filter(Boolean)),
    ];

    const docs = await Product.find({ sku: { $in: skus } }).select('sku title stock');
    const map = new Map(docs.map(d => [String(d.sku), d]));
    const shortages = [];
    const stock = {};

    for (const it of items) {
      const sku = String(it.sku || it.id || '').trim();
      const reqQty = Number(it.qty || 1);
      const doc = map.get(sku);
      const available = doc ? Number(doc.stock || 0) : 0;

      stock[sku] = available;
      if (available < reqQty) {
        shortages.push({
          sku,
          requested: reqQty,
          available,
          title: doc?.title || sku,
        });
      }
    }

    return res.json({ ok: shortages.length === 0, shortages, stock });
  } catch (err) {
    console.error('inventory/check error:', err);
    return res.status(500).json({ ok: false, message: 'inventory_check_failed' });
  }
});

/** Simple peek */
router.get('/stock/:sku', async (req, res) => {
  try {
    const sku = String(req.params.sku || '').trim();
    if (!sku) return res.status(400).json({ success: false, message: 'Missing sku' });
    const doc = await Product.findOne({ sku }).select('sku title stock updatedAt');
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, product: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'stock_fetch_failed', error: e?.message || 'unknown_error' });
  }
});

/** Admin: restock or set absolute stock
 * PATCH /api/inventory/admin/restock
 * body:
 *   { "sku":"m-10", "delta": 3 }        // add/subtract
 *   { "sku":"m-10", "set":   12 }       // set absolute
 */
router.patch('/admin/restock', adminAuth, async (req, res) => {
  try {
    const sku = String(req.body?.sku || '').trim();
    const hasDelta = typeof req.body?.delta !== 'undefined';
    const hasSet = typeof req.body?.set !== 'undefined';
    if (!sku || (!hasDelta && !hasSet)) {
      return res.status(400).json({ success: false, message: 'sku and (delta|set) required' });
    }

    let update = null;
    if (hasSet) {
      const n = Math.max(0, Number(req.body.set) || 0);
      update = { $set: { stock: n } };
    } else {
      const d = Number(req.body.delta) || 0;
      update = { $inc: { stock: d } };
    }

    const doc = await Product.findOneAndUpdate({ sku }, update, { new: true }).select('sku title stock');
    if (!doc) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'restock_failed', error: e?.message || 'unknown_error' });
  }
});

/** Admin: low stock list
 * GET /api/inventory/admin/low-stock?threshold=3&limit=50
 */
router.get('/admin/low-stock', adminAuth, async (req, res) => {
  try {
    const threshold = Math.max(0, Number(req.query?.threshold || 3));
    const limit = Math.min(Math.max(Number(req.query?.limit || 50), 1), 500);

    const products = await Product.find({ stock: { $lte: threshold } })
      .sort({ stock: 1, updatedAt: -1 })
      .limit(limit)
      .select('sku title stock');

    res.json({ success: true, count: products.length, products });
  } catch (e) {
    res.status(500).json({ success: false, message: 'low_stock_failed', error: e?.message || 'unknown_error' });
  }
});

// sanity ping
router.get('/ping', (_req, res) => res.json({ ok: true }));

export default router;
