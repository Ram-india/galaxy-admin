import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";

import { useAuth } from "../context/authStore";

/**
 * Gate for authenticated routes.
 *
 * Waits for the session to be revalidated before deciding, so a page refresh
 * does not bounce a signed-in user to /login. When `permission` is given the
 * route also requires that permission — the server enforces it again on every
 * request, this only avoids showing a page the member cannot use.
 */
const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where they were headed so login can send them back
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
          <ShieldAlert className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
          You don't have access to this page
        </h1>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Your role does not include this permission. Ask an owner or admin if
          you need it.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
