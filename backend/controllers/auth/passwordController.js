// Password recovery controller: forgot password, OTP verification, change password.

import bcrypt from "bcrypt";
import "dotenv/config";
import { User } from "../../models/userModel.js";
import { sendOTPMail } from "../../verifyEmail/sendOTPMail.js";
import { ok, fail } from "../../utils/apiResponse.js";

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Same response regardless of whether user exists — prevents email enumeration
    if (!user) {
      return res.status(200).json(
        ok("If that email is registered, an OTP has been sent.")
      );
    }

    // Generate a 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ Hash OTP before storing — plain text OTP in DB is a critical vulnerability
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send the raw OTP to user's email (only place it ever appears in plain text)
    await sendOTPMail(rawOtp, email);

    return res.status(200).json(ok("OTP sent to your email. Valid for 10 minutes."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    // Explicitly select otp + otpExpiry (both have select: false on schema)
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(404).json(fail("User not found."));
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json(fail("No active OTP found. Please request a new one."));
    }

    if (user.otpExpiry < new Date()) {
      // Clear expired OTP from DB
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json(fail("OTP has expired. Please request a new one."));
    }

    // ✅ Compare against hashed OTP using bcrypt
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json(fail("Invalid OTP."));
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json(ok("OTP verified successfully. You may now reset your password."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    // Zod schema enforces this at route level too, but double-check here
    if (newPassword !== confirmPassword) {
      return res.status(400).json(fail("Passwords do not match."));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(fail("User not found."));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    // ✅ Record when password changed — enables JWT invalidation for old tokens
    user.passwordChangedAt = new Date();

    await user.save();

    return res.status(200).json(ok("Password changed successfully. Please log in again."));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
};
