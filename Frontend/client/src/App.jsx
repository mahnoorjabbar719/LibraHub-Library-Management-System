import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import StudentLayout from "./components/layout/StudentLayout";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import DigitalLibrary from "./pages/admin/DigitalLibrary";
import DigitalBookDetails from "./pages/admin/DigitalBookDetails";
import Students from "./pages/admin/Students";
import BorrowRecords from "./pages/admin/BorrowRecords";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentDigitalLibrary from "./pages/student/StudentDigitalLibrary";
import StudentDigitalBookDetails from "./pages/student/StudentDigitalBookDetails";
import SearchBooks from "./pages/student/SearchBooks";
import MyBooks from "./pages/student/MyBooks";
import StudentProfile from "./pages/student/Profile";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin and Librarian protected routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]} />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route path="books" element={<Books />} />

          <Route
            path="digital-library"
            element={<DigitalLibrary />}
          />

          <Route
            path="digital-library/:id"
            element={<DigitalBookDetails />}
          />

          <Route path="students" element={<Students />} />

          <Route
            path="borrow-records"
            element={<BorrowRecords />}
          />

          <Route path="reports" element={<Reports />} />

          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Student protected routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["student"]} />
        }
      >
        <Route path="/student" element={<StudentLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="digital-library"
            element={<StudentDigitalLibrary />}
          />

          <Route
            path="digital-library/:id"
            element={<StudentDigitalBookDetails />}
          />

          <Route
            path="search-books"
            element={<SearchBooks />}
          />

          <Route path="my-books" element={<MyBooks />} />

          <Route
            path="profile"
            element={<StudentProfile />}
          />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;