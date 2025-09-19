import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
// import productRoutes from "./src/routes/products.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // running behind Render's proxy

app.use(express.json());

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
  })
);

// health check for Render
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// connect DB (expects MONGODB_URI)
connectDB();

app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
