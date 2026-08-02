// Centralized user profile API calls — all /api/v1/user/* endpoints.

import { apiClient } from "./apiClient";

export const userService = {
  /**
   * Fetch the currently authenticated user's profile.
   * Used for session bootstrap on app load.
   * Cookies are sent automatically — no manual token needed.
   */
  getMyProfile: () => apiClient.get("/api/v1/user/profile"),

  /**
   * Update a user's profile (own profile or admin updating another user).
   * @param {string} userId
   * @param {FormData} formData - Includes text fields + optional file
   */
  updateProfile: (userId, formData) =>
    apiClient.put(`/api/v1/user/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /**
   * Fetch all users — admin only.
   * @param {{ page?, limit? }} params
   */
  getAllUsers: (params = {}) =>
    apiClient.get("/api/v1/user/all", { params }),

  /**
   * Fetch a user by ID — admin only.
   * @param {string} userId
   */
  getUserById: (userId) => apiClient.get(`/api/v1/user/${userId}`),
};
