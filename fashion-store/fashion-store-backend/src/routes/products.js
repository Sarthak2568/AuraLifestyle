// src/routes/products.js
import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();

/**
 * GET /api/products
 * Query: q= (search title/sku), limit, page
 * Response: { success, items, total, page, pages }
 */
router.get('/', async (req, res) => {
  try {
    const { q, limit = 24, page = 1 } = req.query;
    const filter = {};

    if (q && String(q).trim()) {
      const s = String(q).trim();
      filter.$or = [
        { title: { $regex: s, $options: 'i' } },
        { sku:   { $regex: s, $options: 'i' } },
      ];
    }

    const perPage = Math.max(1, Math.min(Number(limit), 100));
    const pageNum = Math.max(1, Number(page));
    const skip = (pageNum - 1) * perPage;

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
      Product.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / perPage),
    });
  } catch (e) {
    console.error('products.list error:', e);
    return res.status(500).json({ success: false, message: 'products_list_failed' });
  }
});

/**
 * GET /api/products/:key
 * :key can be ObjectId OR sku OR slug
 * Response: { success, product }
 */
router.get('/:key', async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!key) return res.status(400).json({ success: false, message: 'missing_key' });

    let product = null;

    // 1) by _id
    if (mongoose.isValidObjectId(key)) {
      product = await Product.findById(key).lean();
    }
    // 2) by sku
    if (!product) {
      product = await Product.findOne({ sku: key }).lean();
    }
    // 3) by slug (optional future)
    if (!product) {
      product = await Product.findOne({ slug: key }).lean();
    }

    if (!product) return res.status(404).json({ success: false, message: 'product_not_found' });
    return res.json({ success: true, product });
  } catch (e) {
    console.error('products.detail error:', e);
    return res.status(500).json({ success: false, message: 'product_detail_failed' });
  }
});

export default router;
