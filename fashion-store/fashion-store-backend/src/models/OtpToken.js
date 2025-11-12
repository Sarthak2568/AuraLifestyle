// src/models/OtpToken.js
import mongoose from 'mongoose';

const OtpTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true }, // keep this index
    otp:   { type: String, required: true },              // plain (or hash later)
    // DO NOT set index:true here; TTL is declared below via schema.index(...)
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index for automatic cleanup (this is the only index on expiresAt)
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OtpToken', OtpTokenSchema);
