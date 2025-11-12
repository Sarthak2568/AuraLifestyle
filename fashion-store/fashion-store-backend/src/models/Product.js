// src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sku: { type: String, unique: true, sparse: true },
  title: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  images: [String],
  category: String,
  tags: [String],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
