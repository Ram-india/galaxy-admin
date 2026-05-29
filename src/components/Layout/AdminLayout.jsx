import { useState } from "react";

import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (

    <div className="flex h-screen overflow-hidden">

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

      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
        "
      >

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

        <main
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >

          <Outlet/>

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;