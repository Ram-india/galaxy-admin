import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "../context/authStore";

/**
 * Wraps the auth screens: a signed-in admin who lands on /login or /register
 * is sent straight to the dashboard instead of seeing a sign-in form.
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PublicOnlyRoute;
