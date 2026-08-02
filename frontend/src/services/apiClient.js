// Shared Axios client for consistent API and cookie-based auth handling.

import axios from "axios";
import store from "../redux/store";
import { clearUser } from "../redux/userSlice";

/**
 * Axios instance with unified base URL.
 *
 * Uses Vite's built-in DEV flag (not an env variable) so no Vercel
 * dashboard setting can accidentally override this behaviour:
 *
 * - DEV build  (localhost)   → hit backend directly at :8000
 * - PROD build (Vercel)      → empty baseURL = same-origin requests
 *   Vercel rewrites /api/*   → ekart-backend-eight.vercel.app/api/*
 *   Cookie is same-origin → no cross-domain blocking ✅
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:8000" : "",
  withCredentials: true,
});

/**
 * Response interceptor — handles 401 Unauthorized globally.
 * Only redirects to /login if the user WAS actively logged in (session expired mid-use).
 * Silent fail during initial session bootstrap (user state is null → not logged in yet).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { user } = store.getState().user;
      if (user) {
        // Active session expired — clear state and redirect
        store.dispatch(clearUser());
        window.location.href = "/login";
      }
      // No user in state → silent fail (bootstrapping or public page)
    }
    return Promise.reject(error);
  }
);
