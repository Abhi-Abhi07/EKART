// Application bootstrap file that wires middleware, routes, and global handlers.

import express from "express";
import "dotenv/config";
import cors from "cors";
import dns from "dns/promises";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app  = express();
const PORT = process.env.PORT || 3000;

dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.set("trust proxy", 1);

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(helmet());
app.use(cookieParser()); // Required to parse HttpOnly cookies in req.cookies

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",               // Local development
  "https://ekart-psi-lilac.vercel.app",  // Production frontend
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // Allow non-browser clients
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("Not allowed by CORS policy"), false);
      }
      return callback(null, true);
    },
    credentials: true, // Required for cookies to be sent cross-origin
  })
);

// ─── Global Rate Limiter (general API) ───────────────────────────────────────
// Auth routes have their own stricter limiter defined in authRoute.js
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth",    authRoute);
app.use("/api/v1/user",    userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart",    cartRoute);
app.use("/api/v1/orders",  orderRoute);

// ─── Global Error Handlers ────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();