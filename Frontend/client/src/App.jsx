import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import StudentDashboard from "./pages/student/Dashboard";
import Students from "./pages/admin/Students";
import BorrowRecords from "./pages/admin/BorrowRecords";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";
import Register from "./pages/auth/Register";
import StudentLayout from "./components/layout/StudentLayout";
import SearchBooks from "./pages/student/SearchBooks";
import MyBooks from "./pages/student/MyBooks";
import StudentProfile from "./pages/student/Profile";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin / Librarian Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]} />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="students" element={<Students />} />
          <Route path="borrow-records" element={<BorrowRecords />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="search-books" element={<SearchBooks />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;