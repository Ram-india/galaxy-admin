import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Newspaper,
  Users,
  ArrowRight,
  Plus,
  RefreshCw,
  Bell,
  CheckCircle2,
  Clock,
} from "lucide-react";

import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../context/authStore";
import { useNotifications } from "../context/notificationStore";
import { PERMISSIONS } from "../constants/permissions";
import { formatDate } from "../utils/format";
import { timeAgo } from "../utils/timeAgo";
import { getInitials } from "../utils/initials";

import StatusBadge from "../components/enquiry/StatusBadge";

/** Greeting keyed to the local hour. */
const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const KPI_CARDS = [
  {
    key: "projects",
    permission: PERMISSIONS.PROJECT_VIEW,
    label: "Projects",
    icon: Briefcase,
    to: "/projects",
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    sub: (s) => `${s.completedProjects} completed`,
  },
  {
    key: "enquiries",
    permission: PERMISSIONS.ENQUIRY_VIEW,
    label: "Enquiries",
    icon: FileText,
    to: "/enquiries",
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    sub: (s) => `${s.newEnquiries} new`,
  },
  {
    key: "publishedPosts",
    permission: PERMISSIONS.BLOG_VIEW,
    label: "Published posts",
    icon: Newspaper,
    to: "/blogs",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    sub: (s) => `${s.draftPosts} drafts`,
  },
  {
    key: "teamMembers",
    permission: PERMISSIONS.TEAM_VIEW,
    label: "Team members",
    icon: Users,
    to: "/users/all-users",
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    sub: () => "Active workspace",
  },
];

const QUICK_ACTIONS = [
  {
    label: "New project",
    to: "/projects?new=1",
    permission: PERMISSIONS.PROJECT_CREATE,
    icon: Briefcase,
  },
  {
    label: "Write a post",
    to: "/blogs/new",
    permission: PERMISSIONS.BLOG_CREATE,
    icon: Newspaper,
  },
  {
    label: "View enquiries",
    to: "/enquiries",
    permission: PERMISSIONS.ENQUIRY_VIEW,
    icon: FileText,
  },
  {
    label: "Invite a member",
    to: "/users/all-users",
    permission: PERMISSIONS.TEAM_INVITE,
    icon: Users,
  },
];

/** Card shell used across the dashboard. */
const Panel = ({ title, action, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    {title && (
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        {action}
      </header>
    )}
    <div className="p-5">{children}</div>
  </section>
);

const SkeletonBar = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />
);

/** "View all →" link used in several panel headers. */
const ViewAll = ({ to }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
  >
    View all <ArrowRight className="h-3.5 w-3.5" />
  </Link>
);

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const { data, isLoading, isRefreshing, refresh } = useDashboard();

  const visibleCards = KPI_CARDS.filter((card) => hasPermission(card.permission));
  const visibleActions = QUICK_ACTIONS.filter((action) =>
    hasPermission(action.permission)
  );

  const stats = data?.stats || {};
  const pipelineMax = Math.max(
    1,
    ...(data?.enquiryByStatus || []).map((item) => item.count)
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {greeting()}, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening across your workspace today.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: visibleCards.length || 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <SkeletonBar className="h-2.5 w-24" />
                <SkeletonBar className="mt-4 h-7 w-16" />
                <SkeletonBar className="mt-3 h-2.5 w-20" />
              </div>
            ))
          : visibleCards.map((card) => (
              <Link
                key={card.key}
                to={card.to}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {stats[card.key] ?? 0}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${card.iconClass}`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  {card.sub(stats)}
                </p>
              </Link>
            ))}
      </div>

      {/* MAIN + WIDGETS */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* ---------------------------------------------- main content */}
        <div className="space-y-6 xl:col-span-2">
          {/* Enquiry pipeline */}
          {data?.permissions?.enquiries && (
            <Panel title="Enquiry pipeline" action={<ViewAll to="/enquiries" />}>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonBar key={index} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {data.enquiryByStatus.map((item) => (
                    <div key={item.status} className="flex items-center gap-3">
                      <div className="w-28 shrink-0">
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                          style={{ width: `${(item.count / pipelineMax) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {/* Recent enquiries */}
          {data?.permissions?.enquiries && (
            <Panel title="Recent enquiries" action={<ViewAll to="/enquiries" />}>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBar key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : data.recentEnquiries.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No enquiries yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentEnquiries.map((enquiry) => (
                    <li key={enquiry._id}>
                      <Link
                        to={`/enquiries/${enquiry._id}`}
                        className="flex items-center gap-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                          {getInitials(enquiry.fullName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                            {enquiry.fullName}
                          </p>
                          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                            {enquiry.projectType || "—"} · {formatDate(enquiry.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={enquiry.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {/* Recent projects */}
          {data?.permissions?.projects && (
            <Panel title="Recent projects" action={<ViewAll to="/projects" />}>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonBar key={index} className="h-24 w-full" />
                  ))}
                </div>
              ) : data.recentProjects.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No projects yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.recentProjects.slice(0, 3).map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="group overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    >
                      <div className="h-20 bg-slate-100 dark:bg-slate-800">
                        {project.images?.[0] && (
                          <img
                            src={project.images[0]}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <p className="truncate px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {project.projectName}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* -------------------------------------------- right widgets */}
        <div className="space-y-6">
          {/* Quick actions */}
          {visibleActions.length > 0 && (
            <Panel title="Quick actions">
              <div className="grid grid-cols-1 gap-2">
                {visibleActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <action.icon className="h-4 w-4" />
                    </span>
                    {action.label}
                    <Plus className="ml-auto h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* Recent activity — from the notification feed */}
          <Panel
            title="Recent activity"
            action={
              unreadCount > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">
                  {unreadCount} new
                </span>
              )
            }
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Bell className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-sm text-slate-400">You're all caught up.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {notifications.slice(0, 5).map((item) => (
                  <li key={item._id} className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.isRead ? "bg-slate-300 dark:bg-slate-600" : "bg-blue-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/notifications"
              className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View all notifications
            </Link>
          </Panel>

          {/* Workspace summary */}
          <Panel title="At a glance">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Completed projects
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-white">
                  {stats.completedProjects ?? 0}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-amber-500" />
                  New enquiries
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-white">
                  {stats.newEnquiries ?? 0}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Newspaper className="h-4 w-4 text-blue-500" />
                  Draft posts
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-white">
                  {stats.draftPosts ?? 0}
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
