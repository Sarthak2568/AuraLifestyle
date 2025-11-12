// src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OtpToken from '../models/OtpToken.js';
import { transporter as mailTransport, FROM_EMAIL, FROM_NAME } from '../config/mail.js';

const router = express.Router();

// --- helpers ---
function sign(user) {
  const payload = { uid: user._id, userId: user.userId, role: user.role || 'user' };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

// --- PASSWORD FLOWS (compat) ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    const token = sign(user);
    res.json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Register failed', error: e?.message || 'unknown_error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    user.password = undefined;
    const token = sign(user);
    res.json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Login failed', error: e?.message || 'unknown_error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.uid).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid/expired token' });
  }
});

// --- OTP FLOWS ---
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN || 10);
    const otp = genOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // Save OTP
    await OtpToken.create({ email, otp, expiresAt });

    // Log to server console (dev aid)
    console.log(`[OTP] ${email} → ${otp} (valid ${OTP_TTL_MIN}m)`);

    // Email it (best-effort)
    if (mailTransport) {
      try {
        await mailTransport.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: email,
          subject: 'Your AuraLifestyle OTP',
          text: `Your OTP is ${otp}. It is valid for ${OTP_TTL_MIN} minutes.`,
          html: `<p>Your OTP is <b>${otp}</b>. It is valid for ${OTP_TTL_MIN} minutes.</p>`,
        });
      } catch (e) {
        console.error('OTP mail error:', e?.message || e);
      }
    }

    // For DEV only, optionally echo OTP in response
    const echo = (process.env.NODE_ENV !== 'production') && String(process.env.OTP_ECHO || '0') === '1';
    res.json({ success: true, message: 'OTP sent', ...(echo ? { devOtp: otp } : {}) });
  } catch (e) {
    console.error('request-otp error:', e);
    res.status(500).json({ success: false, message: 'otp_request_failed' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body || {};
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email/OTP required' });

    // Find latest OTP for this email
    const record = await OtpToken.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const now = new Date();
    if (record.expiresAt <= now) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      // Generate a random password to satisfy schema (user can login via OTP; password login optional)
      const randomPass = 'OTP@' + Math.random().toString(36).slice(-12);
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: phone || null,
        password: randomPass,
      });
    }

    // Consume OTPs for this email
    await OtpToken.deleteMany({ email });

    const token = sign(user);
    res.json({ success: true, token, user: { ...user.toObject(), password: undefined } });
  } catch (e) {
    console.error('verify-otp error:', e);
    res.status(500).json({ success: false, message: 'otp_verify_failed' });
  }
});

export default router;
