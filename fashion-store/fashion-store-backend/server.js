// server.js
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

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
  'http://localhost:3000', // CRA
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

/* -------------------- routes -------------------- */
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
