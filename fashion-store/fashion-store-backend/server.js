<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
// import productRoutes from "./src/routes/products.js";

dotenv.config();

=======
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import productsRoutes from './src/routes/products.js';

>>>>>>> 4a3761f (deploy(api): render blueprint + CORS + /api/health)
const app = express();
app.set("trust proxy", 1); // running behind Render's proxy

// middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
<<<<<<< HEAD

// allow your production domain, dev, and Netlify previews
const ALLOW_LIST = [
  "https://theauralifestyle.org",
  "https://www.theauralifestyle.org",
  "http://localhost:5173", // Vite
  "http://localhost:3000"  // CRA (if you ever use it)
];
const ALLOW_REGEX = [/\.netlify\.app$/]; // any *.netlify.app preview

const corsOrigin = (origin, cb) => {
  if (!origin) return cb(null, true); // curl/postman
  if (ALLOW_LIST.includes(origin) || ALLOW_REGEX.some(rx => rx.test(origin)))
    return cb(null, true);
  return cb(new Error("CORS blocked: " + origin));
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
=======
app.use(cookieParser());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
>>>>>>> 4a3761f (deploy(api): render blueprint + CORS + /api/health)
  })
);
app.use(morgan('dev'));

<<<<<<< HEAD
// health check for Render
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// connect DB (expects MONGODB_URI)
connectDB();

app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
=======
// health
app.get('/health', (_, res) => res.json({ ok: true }));

// routes — mount on BOTH old and /api prefixes (so callers don't need changes)
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
>>>>>>> 4a3761f (deploy(api): render blueprint + CORS + /api/health)

// start
const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
=======
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ API running on :${PORT}`));
  })
  .catch((e) => {
    console.error('❌ Failed to start server', e);
    process.exit(1);
  });
>>>>>>> 4a3761f (deploy(api): render blueprint + CORS + /api/health)
