// Authentication and authorization guards for protected routes.

import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { fail } from "../utils/apiResponse.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(fail("Authorization token missing or invalid"));
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json(fail("Access token has expired"));
      }
      return res.status(401).json(fail("Access token is missing or invalid"));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json(fail("User not found"));
    }
    req.user = user;
    req.id = user._id;
    return next();
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json(fail("Access denied: Admins only"));
};