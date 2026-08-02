// Centralized authentication API calls — all /api/v1/auth/* endpoints.

import { apiClient } from "./apiClient";

export const authService = {
  /**
   * Register a new user account.
   * @param {{ firstName, lastName, email, password }} data
   */
  register: (data) => apiClient.post("/api/v1/auth/register", data),

  /**
   * Log in and receive HttpOnly cookies (accessToken + refreshToken).
   * @param {{ email, password }} data
   */
  login: (data) => apiClient.post("/api/v1/auth/login", data),

  /**
   * Log out — clears server session and HttpOnly cookies.
   */
  logout: () => apiClient.post("/api/v1/auth/logout"),

  /**
   * Verify email using the token from the verification link.
   * @param {string} token - JWT from the email link
   */
  verifyEmail: (token) =>
    apiClient.post(
      "/api/v1/auth/verify",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  /**
   * Re-send verification email to the given address.
   * @param {string} email
   */
  reVerify: (email) => apiClient.post("/api/v1/auth/re-verify", { email }),

  /**
   * Request an OTP for password recovery.
   * @param {string} email
   */
  forgotPassword: (email) =>
    apiClient.post("/api/v1/auth/forgot-password", { email }),

  /**
   * Verify the OTP sent to the user's email.
   * @param {string} email
   * @param {string} otp
   */
  verifyOTP: (email, otp) =>
    apiClient.post(`/api/v1/auth/verify-otp/${email}`, { otp }),

  /**
   * Set a new password after OTP verification.
   * @param {string} email
   * @param {{ newPassword, confirmPassword }} data
   */
  changePassword: (email, data) =>
    apiClient.patch(`/api/v1/auth/change-password/${email}`, data),
};
