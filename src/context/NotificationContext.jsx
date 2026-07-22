import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "./authStore";
import { NotificationContext } from "./notificationStore";
import * as notificationApi from "../services/notificationService";
import { POLL_INTERVAL } from "../constants/notifications";

/** Number of items kept in the header dropdown. */
const BELL_LIMIT = 10;

/**
 * Owns the notification state shared across the app: the recent list behind the
 * bell, the unread badge count, and every mutation.
 *
 * Freshness comes from polling (`POLL_INTERVAL`) plus an immediate refetch when
 * the tab regains focus — there is no websocket on the server today, so this is
 * the cheapest way to stay near real-time without new infrastructure.
 */
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guards against overlapping polls and against setting state after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await notificationApi.getNotifications({ limit: BELL_LIMIT });
      if (!isMountedRef.current) return;

      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error loading notifications", err);
      setError("Unable to load notifications.");
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  /* ----------------------------------------------------- polling lifecycle */

  useEffect(() => {
    // Nothing to fetch (and no valid token) until an admin is signed in.
    // Signed-out values are masked below rather than reset here, so the effect
    // stays free of synchronous setState calls.
    if (!user) return undefined;

    const startPolling = async () => {
      await loadNotifications();
    };

    startPolling();

    const intervalId = setInterval(loadNotifications, POLL_INTERVAL);

    // A backgrounded tab misses polls, so catch up as soon as it returns
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") loadNotifications();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", loadNotifications);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", loadNotifications);
    };
  }, [user, loadNotifications]);

  /* ---------------------------------------------------------- mutations */

  /**
   * Applies an optimistic change, calls the API, and reloads from the server
   * on failure so the UI can never drift from the backend.
   */
  const mutate = async (optimisticUpdate, request) => {
    optimisticUpdate();

    try {
      await request();
    } catch (err) {
      console.error("Notification action failed", err);
      loadNotifications();
      throw err;
    }
  };

  const markAsRead = (id) =>
    mutate(
      () => {
        setNotifications((current) =>
          current.map((item) =>
            item._id === id ? { ...item, isRead: true } : item
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      },
      () => notificationApi.markNotificationRead(id)
    );

  const markAsUnread = (id) =>
    mutate(
      () => {
        setNotifications((current) =>
          current.map((item) =>
            item._id === id ? { ...item, isRead: false } : item
          )
        );
        setUnreadCount((count) => count + 1);
      },
      () => notificationApi.markNotificationUnread(id)
    );

  const markAllAsRead = () =>
    mutate(
      () => {
        setNotifications((current) =>
          current.map((item) => ({ ...item, isRead: true }))
        );
        setUnreadCount(0);
      },
      () => notificationApi.markAllNotificationsRead()
    );

  const remove = (id) => {
    // Read the flag before updating — never branch inside a state updater,
    // which React may invoke twice in StrictMode.
    const wasUnread = notifications.some(
      (item) => item._id === id && !item.isRead
    );

    return mutate(
      () => {
        setNotifications((current) =>
          current.filter((item) => item._id !== id)
        );
        // Deleting an unread item also clears its badge contribution
        if (wasUnread) setUnreadCount((count) => Math.max(0, count - 1));
      },
      () => notificationApi.deleteNotification(id)
    );
  };

  const clearAll = () =>
    mutate(
      () => {
        setNotifications([]);
        setUnreadCount(0);
      },
      () => notificationApi.clearAllNotifications()
    );

  return (
    <NotificationContext.Provider
      value={{
        // A signed-out admin sees nothing, whatever is left in memory
        notifications: user ? notifications : [],
        unreadCount: user ? unreadCount : 0,
        isLoading: user ? isLoading : false,
        error: user ? error : null,
        refresh: loadNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        remove,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
