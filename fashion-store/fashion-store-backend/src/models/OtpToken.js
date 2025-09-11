import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema(
  {
    email: { type: String, index: true, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

otpTokenSchema.index({ email: 1, expiresAt: 1 });

export default mongoose.model("OtpToken", otpTokenSchema);
