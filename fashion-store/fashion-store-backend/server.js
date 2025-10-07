// server.js
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto'; // ← ESM-safe named import

// Handle both default or named export for connectDB
import * as dbModule from './src/config/db.js';
const connectDB = dbModule.connectDB || dbModule.default || dbModule;

// Routes
import authRoutes from './src/routes/auth.js';
import productsRoutes from './src/routes/products.js'; // ensure this exists

const app = express();
app.set('trust proxy', 1); // running behind Render/CF proxies

/* -------------------- middleware -------------------- */
// CORS allow your production domain, dev, and Netlify previews
const ALLOW_LIST = [
  'https://theauralifestyle.org',
  'https://www.theauralifestyle.org',
  'http://localhost:5173', // Vite
  'http://localhost:3000', // CRA or custom
];
const ALLOW_REGEX = [/\.netlify\.app$/i]; // any *.netlify.app preview

const corsOrigin = (origin, cb) => {
  if (!origin) return cb(null, true); // curl/postman/no-origin
  if (ALLOW_LIST.includes(origin) || ALLOW_REGEX.some((rx) => rx.test(origin))) {
    return cb(null, true);
  }
  return cb(new Error('CORS blocked: ' + origin));
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Helmet (CSP disabled to avoid breaking fonts/scripts; tighten later if needed)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

/* -------------------- health -------------------- */
// Render healthCheckPath expects /api/health
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
// keep old path too
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

/* -------------------- Razorpay setup -------------------- */
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set. /api/create-order will fail until configured.');
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Create an order on Razorpay
 * body: { amount:number (rupees), currency?:string="INR", receipt?:string, notes?:object }
 * Returns: { success, order }
 */
const createOrderHandler = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || rupees <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    const order = await razorpay.orders.create({
      amount: Math.round(rupees * 100), // rupees -> paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Order create error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Order creation failed', error: err?.message || 'unknown_error' });
  }
};

/**
 * Verify payment signature
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Returns: { success }
 */
const verifyPaymentHandler = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = createHmac('sha256', RAZORPAY_KEY_SECRET).update(payload).digest('hex');
    if (expected === razorpay_signature) {
      // TODO: persist "paid" status in DB if you store orders
      return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  } catch (err) {
    console.error('Verify error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Verification failed', error: err?.message || 'unknown_error' });
  }
};

// Mount under /api (used by your frontend) and also at root for compatibility
app.post('/api/create-order', createOrderHandler);
app.post('/api/verify-payment', verifyPaymentHandler);
app.post('/create-order', createOrderHandler);
app.post('/verify-payment', verifyPaymentHandler);

/* -------------------- existing routes -------------------- */
// Mount on BOTH old and /api prefixes (so callers don’t break)
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

/* -------------------- start -------------------- */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await (typeof connectDB === 'function' ? connectDB() : Promise.resolve());
    app.listen(PORT, () => console.log(`✅ API running on :${PORT}`));
  } catch (e) {
    console.error('❌ Failed to start server', e);
    process.exit(1);
  }
})();
