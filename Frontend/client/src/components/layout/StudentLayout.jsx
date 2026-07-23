import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 hidden transition-all duration-300 lg:block ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <StudentSidebar
          collapsed={sidebarCollapsed}
          closeSidebar={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <StudentSidebar
          collapsed={false}
          closeSidebar={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <StudentNavbar
          openSidebar={() => setMobileSidebarOpen(true)}
          toggleSidebar={() =>
            setSidebarCollapsed((currentValue) => !currentValue)
          }
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="p-5 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;