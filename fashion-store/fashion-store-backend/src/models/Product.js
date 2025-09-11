import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  price: { type: Number, required: true },
  mrp: Number,
  images: [String],
  colors: [String],
  sizes: [String],
  fabric: String,
  category: [String],
  description: String,
  tags: [String],
  genderImages: { Men: String, Women: String }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
