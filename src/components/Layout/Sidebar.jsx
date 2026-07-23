import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Sun, X } from "lucide-react";

import { menuItems } from "../../data/menuItems";
import { useAuth } from "../../context/authStore";
import { useNotifications } from "../../context/notificationStore";
import { useBranding } from "../../context/brandingStore";
import UserAvatar from "../team/UserAvatar";

/**
 * Label shown on hover when the rail is collapsed. Declared at module scope so
 * it is not recreated (and remounted) on every render.
 */
const Tooltip = ({ collapsed, children }) =>
  collapsed ? (
    <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block dark:bg-slate-700">
      {children}
    </span>
  ) : null;

/** Small red counter used for live badges. */
const Badge = ({ value }) =>
  value > 0 ? (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
      {value > 99 ? "99+" : value}
    </span>
  ) : null;

const Sidebar = ({ collapsed, isMobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { unreadCount } = useNotifications();
  const { logoUrl, siteName } = useBranding();

  /** Live values a menu entry can reference through `badge`. */
  const badgeValues = { unreadNotifications: unreadCount };

  // Hide sections this role cannot open at all
  const visibleItems = useMemo(
    () =>
      menuItems.filter(
        (item) => !item.permission || hasPermission(item.permission)
      ),
    [hasPermission]
  );

  const isSectionActive = (item) =>
    item.submenu
      ? item.submenu.some((child) => location.pathname.startsWith(child.path))
      : false;

  // A section containing the current route starts open, so a reload or a deep
  // link never lands the user in a collapsed section.
  const [manuallyToggled, setManuallyToggled] = useState({});

  const isExpanded = (item) =>
    manuallyToggled[item.id] ?? isSectionActive(item);

  const toggleSection = (item) =>
    setManuallyToggled((current) => ({
      ...current,
      [item.id]: !isExpanded(item),
    }));

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${
        collapsed ? "lg:w-20" : "lg:w-72"
      } w-72 ${
        // Off-canvas on mobile until opened; always docked from lg up
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* BRAND — the logo uploaded in Website Settings, or a fallback mark */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
              <Sun className="h-5 w-5 text-white" />
            </div>
          )}

          {!collapsed && (
            <div className="lg:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {siteName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Console
              </p>
            </div>
          )}
        </div>

        {/* Drawer close — mobile only */}
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const badgeValue = item.badge ? badgeValues[item.badge] : 0;

          /* ---------------------------------------------- leaf entry */
          if (!item.submenu) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onCloseMobile}
                className={linkClass}
              >
                <item.icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    <Badge value={badgeValue} />
                  </>
                )}

                {/* Collapsed rail still needs to signal unread items */}
                {collapsed && badgeValue > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                )}

                <Tooltip collapsed={collapsed}>{item.label}</Tooltip>
              </NavLink>
            );
          }

          /* ------------------------------------------ section + children */
          const expanded = isExpanded(item);
          const sectionActive = isSectionActive(item);

          return (
            <div key={item.id}>
              <button
                onClick={() => toggleSection(item)}
                aria-expanded={expanded}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  sectionActive
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left">
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}

                <Tooltip collapsed={collapsed}>{item.label}</Tooltip>
              </button>

              {/* Children are unreadable in a 20px rail, so only render them
                  when the sidebar is expanded. */}
              {expanded && !collapsed && (
                <div className="mt-1 space-y-0.5 border-l border-slate-200 pl-3 ml-5 dark:border-slate-700">
                  {item.submenu.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                        }`
                      }
                    >
                      {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* CURRENT USER */}
      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl p-2 transition-colors ${
              isActive
                ? "bg-slate-100 dark:bg-slate-800"
                : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`
          }
        >
          <UserAvatar name={user?.name} src={user?.avatar} size="sm" />

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.role || "Member"}
              </p>
            </div>
          )}

          <Tooltip collapsed={collapsed}>{user?.name || "My profile"}</Tooltip>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
