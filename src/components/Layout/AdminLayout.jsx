import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

const COLLAPSE_KEY = "sidebar:collapsed";

/**
 * Application shell.
 *
 * The sidebar behaves differently per breakpoint: on desktop it is a docked
 * rail that can collapse to icons (a preference that survives reloads), and
 * below `lg` it becomes an overlay drawer so it never eats a phone screen.
 */
const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "true"
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    // Persist outside the updater — updaters must stay pure, since React may
    // invoke them twice in StrictMode.
    const next = !isCollapsed;
    localStorage.setItem(COLLAPSE_KEY, String(next));
    setIsCollapsed(next);
  };

  // Note: the drawer is dismissed by the nav links themselves (see Sidebar),
  // which keeps that state change on the click rather than in an effect.

  // The drawer is modal on mobile: lock the page behind it and close on Escape
  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Backdrop for the mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        collapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Content sits to the right of the docked rail on desktop */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <Header
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapsed}
          onOpenMobileNav={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
