// User profile and admin management routes.

import express from "express";
import { getMyProfile, allUser, getUserById, updateUser } from "../controllers/user/userController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema } from "../validations/userValidation.js";

const router = express.Router();

// All user routes require authentication
router.use(isAuthenticated);

// ─── Own Profile ──────────────────────────────────────────────────────────────
router.get("/profile", getMyProfile);
router.put("/:id", singleUpload, validate({ body: updateUserSchema }), updateUser);

// ─── Admin Only ───────────────────────────────────────────────────────────────
router.get("/all",       isAdmin, allUser);
router.get("/:userId",   isAdmin, getUserById);

export default router;