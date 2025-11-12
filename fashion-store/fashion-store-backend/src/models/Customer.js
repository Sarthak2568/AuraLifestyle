import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const AddressSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true, index: true, default: () => 'CUS_' + nanoid(10).toUpperCase() },
    fullName: String,
    email: { type: String, index: true, sparse: true },
    phone: { type: String, index: true, sparse: true },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

CustomerSchema.index({ email: 1 }, { sparse: true });
CustomerSchema.index({ phone: 1 }, { sparse: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
