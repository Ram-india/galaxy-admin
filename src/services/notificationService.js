import API from "./api";

/**
 * @param {Object} params
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {"all"|"unread"} [params.filter]
 * @param {string} [params.module]
 */
export const getNotifications = (params = {}) =>
  API.get("/notifications", { params });

export const getUnreadCount = () => API.get("/notifications/unread-count");

export const markNotificationRead = (id) =>
  API.patch(`/notifications/${id}/read`);

export const markNotificationUnread = (id) =>
  API.patch(`/notifications/${id}/unread`);

export const markAllNotificationsRead = () =>
  API.patch("/notifications/read-all");

export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const clearAllNotifications = () => API.delete("/notifications");
