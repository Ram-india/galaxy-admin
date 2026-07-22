import { createContext, useContext } from "react";

/**
 * Context object and consumer hook, kept out of the provider file so that file
 * only exports a component (Fast Refresh requirement).
 */
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
};
