// Route guard for authenticated and admin-only pages.

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Protects routes from unauthenticated access.
 * Waits for the App.jsx session bootstrap to complete before making auth decisions.
 * This prevents a flash-redirect to /login on page refresh while cookies are being validated.
 *
 * @param {boolean} adminOnly - If true, also requires the user to have the "admin" role.
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, sessionLoading } = useSelector((store) => store.user);

  // Session is still being validated with the server — show a spinner
  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Session check complete — no user means not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
