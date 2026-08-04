// Shared Axios client with automatic token refresh for cookie-based auth.

import axios from "axios";
import store from "../redux/store";
import { clearUser, setUser } from "../redux/userSlice";

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

// ─── Automatic Token Refresh Interceptor ──────────────────────────────────────
//
// When any API call returns 401:
//   1. If this is the refresh endpoint itself → don't retry (prevents infinite loop)
//   2. If already refreshing → queue the request and wait
//   3. Otherwise → call /auth/refresh, then replay all queued requests
//   4. If refresh fails → clear auth state, redirect to login
//
// Guards:
//   - `isRefreshing` — ensures only one refresh request at a time
//   - `failedQueue`  — holds pending requests while refresh is in progress
//   - `_retry` flag  — prevents retrying the same request more than once

let isRefreshing = false;
let failedQueue = [];

/**
 * Resolve or reject all queued requests after a refresh attempt.
 * @param {Error|null} error — null if refresh succeeded
 */
const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

/**
 * Force logout: clear Redux state, show message, redirect.
 * Called when refresh fails or is not possible.
 */
const forceLogout = () => {
  store.dispatch(clearUser());
  // Use a small delay so the toast has time to render before navigation
  window.location.href = "/login";
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── Only handle 401 Unauthorized ────────────────────────────────────────
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ── Never retry the refresh endpoint itself (infinite loop guard) ───────
    if (originalRequest.url?.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // ── Never retry a request more than once ────────────────────────────────
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    // ── Bootstrap protection: don't redirect if user was never logged in ────
    const { user } = store.getState().user;
    if (!user) {
      // No user in state → silent fail (bootstrapping or public page)
      return Promise.reject(error);
    }

    // ── If a refresh is already in progress, queue this request ─────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    // ── Initiate token refresh ──────────────────────────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await apiClient.post("/api/v1/auth/refresh");

      // Update Redux user state with fresh data from the server
      if (res.data?.success && res.data?.user) {
        store.dispatch(setUser(res.data.user));
      }

      // Refresh succeeded — replay all queued requests
      processQueue(null);

      // Retry the original request (new cookies are already set by the server)
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — reject all queued requests and force logout
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
