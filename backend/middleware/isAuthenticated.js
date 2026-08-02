// Authentication and authorization guards for protected routes.

import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { fail } from "../utils/apiResponse.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // ── Read token from HttpOnly cookie (primary) or Authorization header (fallback) ──
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json(fail("Access denied. Please log in."));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json(fail("Session expired. Please log in again."));
      }
      return res.status(401).json(fail("Invalid access token."));
    }

    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user) {
      return res.status(401).json(fail("User no longer exists."));
    }

    // ── JWT invalidation: reject tokens issued before a password change ──────
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json(
        fail("Password was recently changed. Please log in again.")
      );
    }

    req.user = user;
    req.id   = user._id;
    return next();
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json(fail("Access denied: Admins only."));
};