// Application bootstrap file that wires middleware, routes, and global handlers.

import express from "express";
import "dotenv/config";
import cors from "cors";
import dns from "dns/promises";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`server running at port : ${PORT}`);
});