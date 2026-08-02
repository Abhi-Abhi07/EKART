// Zod schemas for user/auth endpoint validation.

import { z } from "zod";

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName:  z.string().trim().min(1, "Last name is required").max(50),
  email:     z.string().trim().email("Please provide a valid email address").toLowerCase(),
  password:  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

export const loginSchema = z.object({
  email:    z.string().trim().email("Please provide a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// ─── Password Recovery Schemas ────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").toLowerCase(),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain digits only"),
});

export const changePasswordSchema = z
  .object({
    newPassword:     z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── User Profile Schema ──────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),
  lastName:  z.string().trim().min(1).max(50).optional(),
  phoneNo:   z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Please provide a valid phone number")
    .optional(),
  role:      z.enum(["user", "admin"]).optional(),
  // Address subdocument fields
  street:  z.string().trim().max(100).optional(),
  city:    z.string().trim().max(60).optional(),
  state:   z.string().trim().max(60).optional(),
  zipCode: z.string().trim().max(20).optional(),
  country: z.string().trim().max(60).optional(),
}).strict(); // reject any unexpected extra fields
