import { createContext, useContext } from "react";

/**
 * Context object and consumer hook live in their own module so
 * NotificationContext.jsx only exports a component (keeps Fast Refresh working).
 */
export const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside a <NotificationProvider>"
    );
  }

  return context;
};
