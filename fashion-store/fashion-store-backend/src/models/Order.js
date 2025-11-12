// src/models/Order.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  sku: String,
  title: String,
  price: Number,
  qty: Number,
  size: String,
  color: String,
  image: String
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  pincode: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, index: true },
  customerId: String,
  address: AddressSchema,
  items: [ItemSchema],
  sub: Number,
  shipping: Number,
  gst: Number,
  total: Number,
  status: { type: String, default: "pending" }, // pending / paid / shipped / cancelled / refunded
  payment: {
    provider: String,
    orderId: String,
    paymentId: String,
    signature: String,
    status: String,
    amount: Number,
    currency: String
  },
  shippingInfo: {
    courier: String,
    trackingNumber: String
  },
  adminNotes: String,
  history: [{ at: Date, note: String, by: String }]
}, { timestamps: true });

OrderSchema.index({ "payment.paymentId": 1 }, { unique: true, sparse: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
