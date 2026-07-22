import { useCallback, useEffect, useState } from "react";

import { AuthContext } from "./authStore";
import * as authApi from "../services/authService";

const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Reads the cached user so the first paint is not blank on reload.
 *
 * A session cached by an older build of the app has no `permissions` array.
 * Trusting it would gate the whole UI on an empty permission set — every
 * action button would silently disappear with no error to explain why — so
 * such a cache is discarded and /auth/me is awaited instead.
 */
const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const cached = raw ? JSON.parse(raw) : null;

    if (!cached || !Array.isArray(cached.permissions)) return null;

    return cached;
  } catch {
    // Corrupted cache is not worth crashing over
    return null;
  }
};

/**
 * Session state for the whole panel.
 *
 * The cached user in localStorage is only a paint optimisation — on every load
 * the session is re-validated against /auth/me, so a disabled account, changed
 * role or revoked token is caught immediately rather than trusted from storage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readCachedUser);
  const [isLoading, setIsLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  /** Persists (or refreshes) the session in both state and storage. */
  const persistSession = useCallback((admin, token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);

    if (admin) {
      localStorage.setItem(USER_KEY, JSON.stringify(admin));
      setUser(admin);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  /* ------------------------------------------------- session revalidation */

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return undefined;

    let isStale = false;

    const revalidateSession = async () => {
      try {
        const res = await authApi.getMe();
        if (isStale) return;

        localStorage.setItem(USER_KEY, JSON.stringify(res.data.admin));
        setUser(res.data.admin);
      } catch (error) {
        if (isStale) return;

        // 401/403 means the token is dead or the account is disabled. Anything
        // else (network blip, server restart) keeps the cached session rather
        // than signing the user out for a transient failure.
        const status = error?.response?.status;
        if (status === 401 || status === 403) clearSession();
      } finally {
        if (!isStale) setIsLoading(false);
      }
    };

    revalidateSession();

    return () => {
      isStale = true;
    };
  }, [clearSession]);

  // The axios interceptor dispatches this when any request comes back 401
  useEffect(() => {
    const handleUnauthorized = () => clearSession();

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearSession]);

  /* -------------------------------------------------------------- actions */

  /** @returns {Promise<{ok: boolean, message?: string}>} */
  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      persistSession(res.data.admin, res.data.token);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message ||
          "Unable to sign in. Please try again.",
      };
    }
  };

  /** Creates the first Owner account and signs straight in. */
  const register = async (payload) => {
    try {
      const res = await authApi.register(payload);
      persistSession(res.data.admin, res.data.token);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const acceptInvite = async (token, payload) => {
    try {
      const res = await authApi.acceptInvite(token, payload);
      persistSession(res.data.admin, res.data.token);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message || "Could not accept this invitation.",
      };
    }
  };

  const logout = () => clearSession();

  /** Applies an updated profile without a second round-trip. */
  const applyUser = (admin) => persistSession(admin);

  /** Re-reads the profile from the server. */
  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      persistSession(res.data.admin);
    } catch (error) {
      console.error("Could not refresh profile", error);
    }
  };

  /* ---------------------------------------------------------- permissions */

  const hasPermission = (permission) =>
    Boolean(user?.permissions?.includes(permission));

  const hasAnyPermission = (permissions = []) =>
    permissions.some((permission) => hasPermission(permission));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        acceptInvite,
        logout,
        refreshUser,
        applyUser,
        // Change-password hands back a fresh token for the current tab
        setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
