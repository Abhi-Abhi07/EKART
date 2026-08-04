// Authentication routes: register, login, logout, email verification, password recovery, token refresh.

import express from "express";
import rateLimit from "express-rate-limit";

import { register, login, logout, verify, reVerify, refreshAccessToken } from "../controllers/auth/authController.js";
import { forgotPassword, verifyOTP, changePassword } from "../controllers/auth/passwordController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  changePasswordSchema,
} from "../validations/userValidation.js";

const router = express.Router();

// ─── Strict rate limiter for auth endpoints ───────────────────────────────────
// More aggressive than the global limiter — prevents brute-force at route level
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again in 15 minutes." },
});

// ─── Registration & Email Verification ───────────────────────────────────────
router.post("/register", authLimiter, validate({ body: registerSchema }), register);
router.post("/verify",   authLimiter, verify);
router.post("/re-verify", authLimiter, reVerify);

// ─── Login / Logout / Token Refresh ───────────────────────────────────────────
router.post("/login",   authLimiter, validate({ body: loginSchema }), login);
router.post("/logout",  isAuthenticated, logout);
router.post("/refresh", authLimiter, refreshAccessToken);

// ─── Password Recovery ────────────────────────────────────────────────────────
router.post("/forgot-password",          authLimiter, validate({ body: forgotPasswordSchema }), forgotPassword);
router.post("/verify-otp/:email",        authLimiter, validate({ body: verifyOtpSchema }), verifyOTP);
router.patch("/change-password/:email",  authLimiter, validate({ body: changePasswordSchema }), changePassword);

export default router;
