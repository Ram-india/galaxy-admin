import { Check, Trash2, Undo2 } from "lucide-react";
import { getNotificationType } from "../../constants/notifications";
import { timeAgo } from "../../utils/timeAgo";

/**
 * One notification row, shared by the header dropdown and the full page.
 * `compact` trims the padding for the dropdown.
 */
const NotificationItem = ({
  notification,
  onOpen,
  onToggleRead,
  onDelete,
  compact = false,
}) => {
  const { icon: Icon, iconClass, label } = getNotificationType(notification.type);
  const { isRead } = notification;

  return (
    <div
      className={`group relative flex gap-3 transition-colors ${
        compact ? "px-3 py-3" : "px-4 py-4"
      } ${
        isRead
          ? "hover:bg-slate-50 dark:hover:bg-slate-800/50"
          : "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-500/5 dark:hover:bg-blue-500/10"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Clicking the body opens the linked record */}
      <button
        onClick={() => onOpen(notification)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-start gap-2">
          <p
            className={`text-sm ${
              isRead
                ? "font-medium text-slate-700 dark:text-slate-200"
                : "font-semibold text-slate-900 dark:text-white"
            }`}
          >
            {notification.title}
          </p>
          {!isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {notification.message}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{label}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{timeAgo(notification.createdAt)}</span>
          {notification.actor?.name && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="truncate">by {notification.actor.name}</span>
            </>
          )}
        </div>
      </button>

      {/* Row actions — revealed on hover, always visible on touch devices */}
      <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100">
        <button
          onClick={() => onToggleRead(notification)}
          title={isRead ? "Mark as unread" : "Mark as read"}
          aria-label={isRead ? "Mark as unread" : "Mark as read"}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          {isRead ? (
            <Undo2 className="h-3.5 w-3.5" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          onClick={() => onDelete(notification)}
          title="Delete"
          aria-label="Delete notification"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
