import {
  ChevronDown,
  Zap,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import { menuItems } from "../../data/menuItems";

const Sidebar = ({
  collapsed,
}) => {

  const location = useLocation();

  const [expandedItems, setExpandedItems] =
    useState(new Set());

  const toggleExpanded = (itemId) => {

    const newExpanded =
      new Set(expandedItems);

    if (newExpanded.has(itemId)) {

      newExpanded.delete(itemId);

    } else {

      newExpanded.add(itemId);
    }

    setExpandedItems(newExpanded);
  };

  return (

    <aside
      className={`
        ${collapsed ? "w-20" : "w-72"}

        min-h-screen
        bg-white/80
        dark:bg-slate-900/80
        backdrop-blur-xl
        border-r
        border-slate-200/50
        dark:border-slate-700/50
        transition-all
        duration-500
        flex
        flex-col
      `}
    >

      {/* LOGO */}

      <div
        className="
          p-6
          border-b
          border-slate-200/50
          dark:border-slate-700/50
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              flex
              items-center
              justify-center
            "
          >
            <Zap className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (

            <div>

              <h1
                className="
                  text-xl
                  font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                My App
              </h1>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Admin Panel
              </p>

            </div>
          )}

        </div>

      </div>

      {/* NAVIGATION */}

      <nav
        className="
          flex-1
          p-4
          space-y-2
          overflow-y-auto
        "
      >

        {menuItems.map((item) => {

          const isExpanded =
            expandedItems.has(item.id);

          const isActive =
            location.pathname === item.path;

          return (

            <div key={item.id}>

              {/* MENU ITEM */}

              {item.submenu ? (

                <button
                  onClick={() =>
                    toggleExpanded(item.id)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-xl
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-blue-500
                          to-purple-600
                          text-white
                        `
                        : `
                          text-slate-600
                          dark:text-slate-300
                          hover:bg-slate-100
                          dark:hover:bg-slate-800/50
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <item.icon
                      className="w-5 h-5"
                    />

                    {!collapsed && (
                      <span>
                        {item.label}
                      </span>
                    )}

                  </div>

                  {!collapsed && (

                    <ChevronDown
                      className={`
                        w-4
                        h-4
                        transition-transform
                        ${
                          isExpanded
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  )}

                </button>

              ) : (

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-xl
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-blue-500
                          to-purple-600
                          text-white
                        `
                        : `
                          text-slate-600
                          dark:text-slate-300
                          hover:bg-slate-100
                          dark:hover:bg-slate-800/50
                        `
                    }
                  `
                  }
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <item.icon
                      className="w-5 h-5"
                    />

                    {!collapsed && (
                      <span>
                        {item.label}
                      </span>
                    )}

                  </div>

                </NavLink>
              )}

              {/* SUBMENU */}

              {
                item.submenu &&
                isExpanded &&
                !collapsed && (

                  <div
                    className="
                      ml-8
                      mt-2
                      space-y-1
                    "
                  >

                    {item.submenu.map(
                      (subitem) => (

                        <NavLink
                          key={subitem.id}
                          to={subitem.path}
                          className={`
                            block
                            p-2
                            rounded-lg
                            text-sm
                            text-slate-600
                            dark:text-slate-400
                            hover:bg-slate-100
                            dark:hover:bg-slate-800/50
                          `}
                        >

                          {subitem.label}

                        </NavLink>
                      )
                    )}

                  </div>
                )
              }

            </div>
          );
        })}

      </nav>

    </aside>
  );
};

export default Sidebar;