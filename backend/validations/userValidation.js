// Zod schemas for user/auth endpoint validation.

import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

export const verifyOtpSchema = z.object({
  otp: z.string().trim().min(4).max(8),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});
