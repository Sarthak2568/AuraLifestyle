import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/auth/upsert-user
 * body: { name: string, email: string, phone?: string }
 * Creates or updates a user by email. No OTP, no password.
 */
router.post("/upsert-user", async (req, res) => {
  try {
    let { name, email, phone } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    phone = (phone || "").trim();

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name, email, phone } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({
      ok: true,
      user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone }
    });
  } catch (e) {
    console.error("upsert-user error:", e);
    if (e.code === 11000) return res.status(409).json({ error: "Email already exists" });
    res.status(500).json({ error: "Failed to save user" });
  }
});

export default router;
