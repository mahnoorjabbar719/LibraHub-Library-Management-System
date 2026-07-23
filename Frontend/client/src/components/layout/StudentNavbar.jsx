import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMenu,
  FiSearch,
  FiSidebar,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import StudentNotifications from "../common/StudentNotifications";

const pageTitles = {
  "/student/dashboard": {
    title: "Dashboard",
    subtitle: "Welcome back to LibraHub",
  },
  "/student/search-books": {
    title: "Search Books",
    subtitle: "Explore the complete library collection",
  },
  "/student/my-books": {
    title: "My Books",
    subtitle: "Review your borrowing history",
  },
  "/student/profile": {
    title: "Profile",
    subtitle: "Manage your student account",
  },
};

const StudentNavbar = ({
  openSidebar,
  toggleSidebar,
  sidebarCollapsed,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = pageTitles[location.pathname] || {
    title: "Student Portal",
    subtitle: "Smart Library Management System",
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "S";

  const handleSearch = (event) => {
    const searchValue = event.target.value.trim();

    if (event.key === "Enter" && searchValue) {
      navigate(
        `/student/search-books?search=${encodeURIComponent(searchValue)}`
      );

      event.target.value = "";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[78px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={openSidebar}
          className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl text-slate-700 transition hover:bg-slate-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>

        {/* Desktop collapse */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl text-slate-700 transition hover:bg-slate-200 lg:grid"
          aria-label={
            sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={
            sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          <FiSidebar
            className={`transition-transform duration-300 ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {currentPage.title}
          </h2>

          <p className="mt-1 hidden text-xs text-slate-500 sm:block">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="hidden w-72 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 md:flex">
          <FiSearch className="shrink-0 text-lg text-slate-400" />

          <input
            type="search"
            placeholder="Search books..."
            onKeyDown={handleSearch}
            className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowNotifications((currentValue) => !currentValue)
            }
            className="relative grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-700 transition hover:bg-slate-200"
            aria-label="Notifications"
          >
            <FiBell />

            <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
              !
            </span>
          </button>

          {showNotifications && (
            <StudentNotifications
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate("/student/profile")}
          className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-100"
        >
          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-white shadow-lg shadow-emerald-600/20">
            {firstLetter}
          </div>

          <div className="hidden text-left sm:block">
            <strong className="block text-sm text-slate-900">
              {user?.name || "Student"}
            </strong>

            <span className="text-xs capitalize text-slate-500">
              {user?.role || "student"}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default StudentNavbar;