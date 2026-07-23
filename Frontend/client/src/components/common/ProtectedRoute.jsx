import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return user?.role === "student" ? (
      <Navigate to="/student/dashboard" replace />
    ) : (
      <Navigate to="/admin/dashboard" replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;