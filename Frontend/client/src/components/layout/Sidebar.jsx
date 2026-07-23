import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBookOpen,
  FiGrid,
  FiLogOut,
  FiRepeat,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: FiGrid,
  },
  {
    label: "Books",
    path: "/admin/books",
    icon: FiBookOpen,
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: FiUsers,
  },
  {
    label: "Borrow Records",
    path: "/admin/borrow-records",
    icon: FiRepeat,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: FiBarChart2,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: FiUser,
  },
];

const Sidebar = ({ closeSidebar, collapsed = false }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`flex h-full flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),linear-gradient(180deg,#0f1d29_0%,#09141f_100%)] py-6 text-white transition-all duration-300 ${
        collapsed ? "px-3" : "px-4"
      }`}
    >
      {/* Logo */}
      <div
        className={`mb-9 flex items-center ${
          collapsed
            ? "justify-center"
            : "gap-3 px-2"
        }`}
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-400">
          <FiBookOpen />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-xl font-bold">LibraHub</h1>

            <p className="mt-1 text-[11px] text-slate-400">
              Smart Library System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={closeSidebar}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl py-3.5 text-sm font-medium transition ${
                collapsed
                  ? "justify-center px-3"
                  : "gap-3 px-4"
              } ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
              }`
            }
          >
            <Icon className="shrink-0 text-lg" />

            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        title={collapsed ? "Logout" : undefined}
        className={`mt-auto flex items-center rounded-xl py-3.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 ${
          collapsed
            ? "justify-center px-3"
            : "gap-3 px-4"
        }`}
      >
        <FiLogOut className="shrink-0 text-lg" />

        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;