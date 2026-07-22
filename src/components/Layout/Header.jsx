import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sun,
  UserCog,
} from "lucide-react";

import { useAuth } from "../../context/authStore";
import { useTheme } from "../../context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";

import NotificationBell from "../notifications/NotificationBell";
import UserAvatar from "../team/UserAvatar";
import GlobalSearch from "./GlobalSearch";

/**
 * True on macOS/iOS, where the palette shortcut reads ⌘K rather than Ctrl+K.
 * `navigator.platform` is deprecated, so prefer userAgentData where available.
 */
const isApplePlatform = () => {
  if (typeof navigator === "undefined") return false;

  const platform = navigator.userAgentData?.platform || navigator.userAgent;
  return /mac|iphone|ipad/i.test(platform);
};

const Header = ({ isCollapsed, onToggleCollapse, onOpenMobileNav }) => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const canCreateProject = hasPermission(PERMISSIONS.PROJECT_CREATE);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // ⌘K / Ctrl+K opens the palette from anywhere
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dismiss the profile menu on outside click / Escape
  useEffect(() => {
    if (!isProfileOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) setIsProfileOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goTo = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  const iconButtonClass =
    "rounded-xl p-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            {/* Opens the drawer on mobile */}
            <button
              onClick={onOpenMobileNav}
              aria-label="Open navigation"
              className={`${iconButtonClass} lg:hidden`}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Collapses the docked rail on desktop */}
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`${iconButtonClass} hidden lg:block`}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>

            <p className="hidden text-sm text-slate-500 dark:text-slate-400 xl:block">
              Welcome back, {user?.name?.split(" ")[0] || "Admin"}
            </p>
          </div>

          {/* SEARCH — a button, since the real input lives in the palette */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group mx-auto hidden w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600 md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search projects, enquiries…</span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-900">
              {isApplePlatform() ? "⌘" : "Ctrl"} K
            </kbd>
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Compact search trigger below md */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className={`${iconButtonClass} md:hidden`}
            >
              <Search className="h-5 w-5" />
            </button>

            {canCreateProject && (
              <button
                onClick={() => navigate("/projects?new=1")}
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-shadow hover:shadow-lg lg:flex"
              >
                <Plus className="h-4 w-4" />
                New project
              </button>
            )}

            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={iconButtonClass}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <NotificationBell />

            {/* PROFILE */}
            <div
              className="relative flex items-center border-l border-slate-200 pl-2 dark:border-slate-700 sm:pl-3"
              ref={profileRef}
            >
              <button
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2.5"
              >
                <UserAvatar
                  name={user?.name}
                  src={user?.avatar}
                  size="sm"
                  className="ring-2 ring-blue-500"
                />

                <span className="hidden text-left md:block">
                  <span className="block text-sm font-medium text-slate-800 dark:text-white">
                    {user?.name || "Admin"}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {user?.role || "Member"}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name || "Admin"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => goTo("/profile")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <UserCog className="h-4 w-4 text-slate-400" />
                      My profile
                    </button>

                    <button
                      onClick={() => goTo("/settings")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Settings
                    </button>

                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
