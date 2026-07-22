import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";

import { useNotifications } from "../context/notificationStore";
import * as notificationApi from "../services/notificationService";
import { NOTIFICATIONS_PAGE_SIZE } from "../constants/notifications";
import { getDayGroup } from "../utils/timeAgo";

import PageHeader from "../components/ui/PageHeader";
import NotificationItem from "../components/notifications/NotificationItem";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

/** Splits a sorted list into [{ label, items }] buckets by day. */
const groupByDay = (notifications) =>
  notifications.reduce((groups, notification) => {
    const label = getDayGroup(notification.createdAt);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.label === label) {
      lastGroup.items.push(notification);
    } else {
      groups.push({ label, items: [notification] });
    }

    return groups;
  }, []);

/**
 * Full-page notification centre.
 *
 * Keeps its own paginated list (the context only holds the recent items behind
 * the bell) but routes every mutation through the context so the header badge
 * and this page never disagree.
 */
const Notifications = () => {
  const navigate = useNavigate();
  const {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    remove,
    clearAll,
    refresh: refreshBell,
  } = useNotifications();

  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async () => {
    try {
      const res = await notificationApi.getNotifications({
        page,
        limit: NOTIFICATIONS_PAGE_SIZE,
        filter,
      });

      setNotifications(res.data.notifications || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setError(null);
    } catch (err) {
      console.error("Error loading notifications", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    const loadNotifications = async () => {
      await loadPage();
    };

    loadNotifications();
  }, [loadPage]);

  /* ------------------------------------------------------------- actions */

  /**
   * Applies an optimistic tweak to this page, runs the context mutation
   * (which owns the badge), then reconciles against the server.
   */
  const runAction = async (action, optimistic) => {
    optimistic?.();

    try {
      await action();
    } finally {
      loadPage();
    }
  };

  const handleOpen = (notification) => {
    if (!notification.isRead) markAsRead(notification._id);
    if (notification.link) navigate(notification.link);
  };

  const handleToggleRead = (notification) =>
    runAction(
      () =>
        notification.isRead
          ? markAsUnread(notification._id)
          : markAsRead(notification._id),
      () =>
        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: !item.isRead }
              : item
          )
        )
    );

  const handleDelete = (notification) =>
    runAction(
      () => remove(notification._id),
      () =>
        setNotifications((current) =>
          current.filter((item) => item._id !== notification._id)
        )
    );

  const handleMarkAllRead = () => runAction(markAllAsRead);

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Delete all notifications? This cannot be undone."
    );
    if (!confirmed) return;

    runAction(clearAll, () => {
      setNotifications([]);
      setTotal(0);
    });
  };

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1); // a new filter invalidates the current page
  };

  const groups = groupByDay(notifications);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Notifications" },
        ]}
        title="Notifications"
        subtitle="Activity from across your admin panel, newest first."
        onRefresh={() => {
          loadPage();
          refreshBell();
        }}
        actions={
          <>
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>

            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </>
        }
      />

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 sm:w-fit">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => changeFilter(value)}
            className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              filter === value
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* LIST */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <BellOff className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications"}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {filter === "unread"
                ? "You're all caught up."
                : "New enquiries and status changes will appear here."}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.label}>
              {/* Sticky day heading, e.g. "Today" */}
              <h2 className="sticky top-0 z-10 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {group.label}
              </h2>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.items.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onOpen={handleOpen}
                    onToggleRead={handleToggleRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {totalPages}
            </span>{" "}
            · {total} total
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
