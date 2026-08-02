// Authentication controller: register, login, logout, verify email, re-send verification.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../../models/userModel.js";
import { Session } from "../../models/sessionModel.js";
import { verifyEmail } from "../../verifyEmail/emailVerify.js";
import { ok, fail } from "../../utils/apiResponse.js";

// ─── Cookie Config ────────────────────────────────────────────────────────────
const IS_PROD = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,                      // JS cannot read it (XSS protection)
  secure: IS_PROD,                     // HTTPS only in production
  sameSite: IS_PROD ? "strict" : "lax", // CSRF protection
  path: "/",
  maxAge: 15 * 60 * 1000,             // 15 minutes — matches JWT expiry
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "strict" : "lax",
  path: "/",
  maxAge: 45 * 24 * 60 * 60 * 1000,  // 45 days — matches JWT expiry
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(fail("An account with this email already exists."));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Generate short-lived email verification token (10 min)
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    // Save token (select:false field — save directly, no leak risk)
    await User.findByIdAndUpdate(newUser._id, { token });

    const emailResult = await verifyEmail(token, email);
    if (!emailResult.success) {
      return res.status(500).json(
        fail("Account created but verification email failed to send.", {
          error: emailResult.error,
        })
      );
    }

    // toJSON transform on newUser strips password/token automatically
    return res.status(201).json(
      ok("Account registered successfully. Please check your email to verify.", {
        user: newUser,
      })
    );
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json(fail("Authorization token missing or invalid."));
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json(fail("Verification link has expired. Request a new one."));
      }
      return res.status(400).json(fail("Invalid verification token."));
    }

    // Explicitly select token field (select: false on schema)
    const user = await User.findById(decoded.id).select("+token");
    if (!user) {
      return res.status(404).json(fail("User not found."));
    }
    if (user.isVerified) {
      return res.status(400).json(fail("Account is already verified."));
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json(ok("Email verified successfully. You can now log in."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Re-send Verification Email ───────────────────────────────────────────────
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Return same message to prevent email enumeration
      return res.status(200).json(ok("If that email exists, a verification link has been sent."));
    }
    if (user.isVerified) {
      return res.status(400).json(fail("Account is already verified."));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    await User.findByIdAndUpdate(user._id, { token });
    await verifyEmail(token, email);

    // Never return the token in the response
    return res.status(200).json(ok("Verification email sent. Please check your inbox."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch password (select: false) and lockUntil for brute-force check
    const user = await User.findOne({ email }).select("+password +lockUntil");
    if (!user) {
      // Generic message to prevent user enumeration
      return res.status(401).json(fail("Invalid credentials."));
    }

    // Check account lockout
    if (user.isLocked) {
      return res.status(423).json(
        fail("Account temporarily locked due to too many failed attempts. Try again in 15 minutes.")
      );
    }

    // Verify email first
    if (!user.isVerified) {
      return res.status(403).json(
        fail("Please verify your email before logging in.")
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));
      return res.status(401).json(
        fail(`Invalid credentials.${attemptsLeft > 0 ? ` ${attemptsLeft} attempt(s) remaining.` : " Account will be locked."}`)
      );
    }

    // Successful login — reset brute-force counter
    await user.resetLoginAttempts();

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "45d" }
    );

    // Replace existing session
    await Session.deleteMany({ userId: user._id });
    await Session.create({ userId: user._id });

    // Set tokens as HttpOnly cookies — never exposed to JS
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // toJSON transform strips password/sensitive fields automatically
    return res.status(200).json(
      ok(`Welcome back, ${user.firstName}!`, { user })
    );
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.deleteMany({ userId });

    // Clear both cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    return res.status(200).json(ok("Logged out successfully."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};
