import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await Product.find().sort("-createdAt").limit(100);
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const prod = await Product.findOne(
    /^[a-f0-9]{24}$/i.test(id) ? { _id: id } : { slug: id }
  );
  if (!prod) return res.status(404).json({ error: "Not found" });
  res.json(prod);
});

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.slug && body.name) body.slug = body.name.toLowerCase().replace(/\s+/g, "-");
    const saved = await Product.create(body);
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ error: "Invalid data", details: e.message });
  }
});

export default router;
