import { Inbox, RefreshCw, CheckCircle2, Bell } from "lucide-react";

/**
 * Presentation for each notification type.
 * `type` values mirror the enum in server/models/Notification.js.
 */
export const NOTIFICATION_TYPES = {
  enquiry_created: {
    label: "New enquiry",
    icon: Inbox,
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },
  enquiry_status_changed: {
    label: "Status update",
    icon: RefreshCw,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  },
  enquiry_converted: {
    label: "Converted",
    icon: CheckCircle2,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
};

/** Fallback for a type the frontend does not know about yet. */
export const DEFAULT_NOTIFICATION_TYPE = {
  label: "Notification",
  icon: Bell,
  iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export const getNotificationType = (type) =>
  NOTIFICATION_TYPES[type] || DEFAULT_NOTIFICATION_TYPE;

/** How often the bell re-checks the server, in milliseconds. */
export const POLL_INTERVAL = 30000;

/** Page size used by the full notifications page. */
export const NOTIFICATIONS_PAGE_SIZE = 20;
