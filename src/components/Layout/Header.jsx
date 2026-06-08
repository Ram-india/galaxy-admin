import {
  Bell,
  ChevronDown,
  Filter,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Header = ({
  onToggleSidebar,
}) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (

    <header
      className="
        sticky
        top-0
        z-30
        bg-white/90
        dark:bg-slate-950/90
        backdrop-blur-xl
        border-b
        border-slate-200/50
        dark:border-slate-800/50
        px-6
        py-4
        shadow-sm
      "
    >

      <div className="flex items-center justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <button
            onClick={onToggleSidebar}
            className="
              p-2
              rounded-lg
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">

            

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Welcome back {user.name}
            </p>

          </div>

        </div>

        {/* SEARCH */}

        <div className="flex-1 max-w-md mx-8 hidden md:block">

          <div className="relative">

            <Search
              className="
                w-4
                h-4
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                pl-10
                pr-10
                py-2.5
                rounded-xl
                bg-slate-100
                dark:bg-slate-800
                border
                border-slate-200
                dark:border-slate-700
                text-slate-800
                dark:text-white
                placeholder-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-all
              "
            />

            <button
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                p-1.5
                text-slate-400
                hover:text-slate-600
              "
            >
              <Filter className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          {/* NEW BUTTON */}

          <button
            className="
              hidden
              lg:flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-violet-600
              text-white
              hover:shadow-xl
              transition-all
            "
          >

            <Plus className="w-4 h-4" />

            <span className="text-sm font-medium">
              New
            </span>

          </button>

          {/* THEME */}

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="
              p-2.5
              rounded-xl
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* NOTIFICATIONS */}

          <button
            className="
              relative
              p-2.5
              rounded-xl
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
          >

            <Bell className="w-5 h-5" />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-red-500
                text-white
                text-xs
                flex
                items-center
                justify-center
              "
            >
              3
            </span>

          </button>

          {/* SETTINGS */}

          <button
            className="
              p-2.5
              rounded-xl
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* PROFILE */}

          <div
            className="
              relative
              flex
              items-center
              gap-3
              pl-3
              border-l
              border-slate-200
              dark:border-slate-700
            "
          >

            <button
              onClick={() =>
                setShowDropdown(
                  !showDropdown
                )
              }
              className="
                flex
                items-center
                gap-3
              "
            >

              <img
                src="https://i.pravatar.cc/100"
                alt="user"
                className="
                  w-8
                  h-8
                  rounded-full
                  ring-2
                  ring-blue-500
                "
              />

              <div className="hidden md:block">

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-800
                    dark:text-white
                  "
                >
                  {user?.name || "Admin"}
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Administrator
                </p>

              </div>

              <ChevronDown
                className={`
                  w-4
                  h-4
                  text-slate-400
                  transition-transform
                  ${
                    showDropdown
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>

            {/* DROPDOWN */}

            {/* DROPDOWN */}

{showDropdown && (

<div
  className="
    absolute
    right-0
    top-14
    w-56
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    dark:border-slate-700
    bg-white
    dark:bg-slate-900
    shadow-2xl
    z-50
    animate-in
    fade-in
    slide-in-from-top-2
    duration-200
  "
>

  {/* USER INFO */}

  <div
    className="
      px-4
      py-4
      border-b
      border-slate-200
      dark:border-slate-700
    "
  >

    <p
      className="
        text-sm
        font-semibold
        text-slate-800
        dark:text-white
      "
    >
      {user?.name || "Admin"}
    </p>

    <p
      className="
        text-xs
        text-slate-500
        dark:text-slate-400
      "
    >
      {user?.email || "admin@gmail.com"}
    </p>

  </div>

  {/* MENU ITEMS */}

  <div className="p-2">

    <button
      className="
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        text-sm
        text-slate-700
        dark:text-slate-200
        hover:bg-slate-100
        dark:hover:bg-slate-800
        transition-all
      "
    >
      Profile
    </button>

    <button
      className="
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        text-sm
        text-slate-700
        dark:text-slate-200
        hover:bg-slate-100
        dark:hover:bg-slate-800
        transition-all
      "
    >
      Settings
    </button>

    <button
      onClick={handleLogout}
      className="
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        text-sm
        text-red-500
        hover:bg-red-50
        dark:hover:bg-red-900/20
        transition-all
      "
    >
      Logout
    </button>

  </div>

</div>
)}

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;