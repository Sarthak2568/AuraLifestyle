// src/routes/orders.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

/** --- helpers --- */
async function getAuthUser(req) {
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
  const user = await User.findById(payload.uid).lean();
  return { payload, user };
}

async function adminAuth(req, _res, next) {
  try {
    const { user, payload } = await getAuthUser(req);
    const role = user?.role || payload?.role || 'user';
    if (role !== 'admin') {
      const err = new Error('Admin only');
      err.code = 403;
      throw err;
    }
    req.user = user;
    req.jwt = payload;
    next();
  } catch (e) {
    next(e);
  }
}

/** --- user routes --- */

/**
 * GET /api/orders/mine
 * Returns all orders for the logged-in user.
 * Matches by (legacy) customerId === payload.userId OR address.email === user.email.
 */
router.get('/mine', async (req, res) => {
  try {
    const { payload, user } = await getAuthUser(req);

    const or = [];
    if (payload?.userId) or.push({ customerId: payload.userId });
    if (user?.email) or.push({ 'address.email': user.email });

    if (!or.length) return res.json({ success: true, orders: [] });

    const orders = await Order.find({ $or: or })
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.json({ success: true, orders });
  } catch (e) {
    return res.status(e.code || 500).json({ success: false, message: e.message || 'orders_fetch_failed' });
  }
});

/**
 * GET /api/orders/mine/summary
 * Lightweight view for quick checks.
 */
router.get('/mine/summary', async (req, res) => {
  try {
    const { payload, user } = await getAuthUser(req);

    const or = [];
    if (payload?.userId) or.push({ customerId: payload.userId });
    if (user?.email) or.push({ 'address.email': user.email });

    if (!or.length) return res.json({ success: true, orders: [] });

    const orders = await Order.find({ $or: or })
      .sort({ createdAt: -1 })
      .select('orderNumber total status createdAt');

    return res.json({ success: true, orders });
  } catch (e) {
    return res.status(e.code || 500).json({ success: false, message: e.message || 'orders_summary_failed' });
  }
});

/** --- admin routes --- */

/**
 * GET /api/orders/admin/list?status=paid&email=test@example.com&limit=50
 * Admin-only: list orders with simple filters.
 */
router.get('/admin/list', adminAuth, async (req, res) => {
  try {
    const { status, email } = req.query || {};
    let limit = Math.min(Math.max(Number(req.query?.limit || 50), 1), 200);

    const filter = {};
    if (status) filter.status = String(status);
    if (email) filter['address.email'] = String(email).toLowerCase();

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    res.json({ success: true, count: orders.length, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: 'admin_list_failed', error: e?.message || 'unknown_error' });
  }
});

/**
 * GET /api/orders/admin/order/:id
 * Admin-only: fetch by orderNumber (preferred) or Mongo _id.
 */
router.get('/admin/order/:id', adminAuth, async (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!id) return res.status(400).json({ success: false, message: 'Missing id' });

    const byNumber = await Order.findOne({ orderNumber: id }).select('-__v');
    const order = byNumber || (await Order.findById(id).select('-__v'));

    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: 'admin_order_fetch_failed', error: e?.message || 'unknown_error' });
  }
});

export default router;
