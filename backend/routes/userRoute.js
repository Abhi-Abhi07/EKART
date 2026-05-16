// User and authentication route definitions.

import express from "express";
import { allUser, changePassword, forgotPassword, getUserById, login, logout, register, reVerify, updateUser, verify, verifyOTP } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/verify",verify);
router.post("/reVerify",reVerify);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/logout",isAuthenticated,logout);
router.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
router.post("/verify-otp/:email", validate({ body: verifyOtpSchema }), verifyOTP);
router.post("/change-password/:email", validate({ body: changePasswordSchema }), changePassword);
router.get("/all-user",isAuthenticated,isAdmin,allUser)
router.get("/get-user/:userId",getUserById)
router.put("/update/:id",isAuthenticated,singleUpload,updateUser)

export default router