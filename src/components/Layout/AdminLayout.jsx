import { useState } from "react";

import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen overflow-hidden">

        {/* SIDEBAR */}

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() =>
            setSidebarCollapsed(
              !sidebarCollapsed
            )
          }
        />

        {/* RIGHT SIDE */}

        <div className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER */}

          <Header
            sidebarCollapsed={
              sidebarCollapsed
            }
            onToggleSidebar={() =>
              setSidebarCollapsed(
                !sidebarCollapsed
              )
            }
          />

          {/* PAGE CONTENT */}

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>

        </div>

      </div>
    </div>
  );
};

export default AdminLayout;