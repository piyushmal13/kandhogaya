import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Redirect to this path when unauthenticated. Defaults to /login */
  redirectTo?: string;
  /** If true, ONLY admin users may access this route */
  adminOnly?: boolean;
}


/**
 * ProtectedRoute — wraps a route element to require authentication.
 * - Shows a centered spinner while the auth state is initialising
 * - Redirects to /login (or a custom path) when no user is present
 * - Optionally restricts to admin-role users only
 *
 * Usage in App.tsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *   <Route path="/admin"     element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  // Auth is still initialising — show full-screen loader to prevent content flash
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Admin guard
  if (adminOnly) {
    const isAdmin = userProfile?.role === "admin" || userProfile?.role === "superadmin";

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
