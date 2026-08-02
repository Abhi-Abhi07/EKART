// Shared Axios client for consistent API and cookie-based auth handling.

import axios from "axios";
import store from "../redux/store";
import { clearUser } from "../redux/userSlice";

/**
 * Axios instance with unified base URL.
 * In production: baseURL is "/" so all API calls go to the same origin
 * (ekart-psi-lilac.vercel.app/api/...) and Vercel rewrites proxy them to
 * the backend. This avoids cross-origin cookie blocking in modern browsers.
 * In local dev: points directly to localhost:8000 backend.
 * `withCredentials: true` sends HttpOnly cookies automatically.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL || "/",
  withCredentials: true, // Required for HttpOnly cookies to be sent cross-origin
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
