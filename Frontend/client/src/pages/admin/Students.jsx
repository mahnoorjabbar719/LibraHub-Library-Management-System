import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "../../services/userService";

const Students = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("student");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load users",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading users.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.registrationNo?.toLowerCase().includes(searchValue) ||
        user.department?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const studentCount = users.filter(
    (user) => user.role === "student"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const librarianCount = users.filter(
    (user) => user.role === "librarian"
  ).length;

  const openEditModal = (user) => {
    setEditingUser({
      ...user,
      phone: user.phone || "",
      registrationNo: user.registrationNo || "",
      department: user.department || "",
    });

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    if (!editingUser) {
      return;
    }

    if (
      !editingUser.name.trim() ||
      !editingUser.email.trim() ||
      !editingUser.role
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Name, email, and role are required.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setUpdatingUser(true);

      const data = await updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        phone: editingUser.phone,
        registrationNo: editingUser.registrationNo,
        department: editingUser.department,
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === editingUser._id ? data.user : user
        )
      );

      closeEditModal();

      await Swal.fire({
        icon: "success",
        title: "User updated",
        text: "The user was updated successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message ||
          "Unable to update this user.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this user?",
      text: `${user.name} will be permanently removed.`,
      showCancelButton: true,
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(user._id);

      await deleteUser(user._id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) => currentUser._id !== user._id
        )
      );

      await Swal.fire({
        icon: "success",
        title: "User deleted",
        text: "The user was deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.message ||
          "Unable to delete this user.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          User Management
        </span>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Students & Users
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage students, librarians, and administrator accounts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Students
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {studentCount}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
              <FiUsers />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Librarians
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {librarianCount}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-xl text-blue-600">
              <FiUser />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Administrators
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {adminCount}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-xl text-violet-600">
              <FiUser />
            </div>
          </div>
        </article>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
            <FiSearch className="text-lg text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, registration no..."
              className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="student">Students</option>
            <option value="librarian">Librarians</option>
            <option value="admin">Administrators</option>
            <option value="all">All Roles</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="grid min-h-72 place-items-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                  <FiUsers />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No users found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or role filter.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-[1100px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "User",
                    "Role",
                    "Registration No",
                    "Department",
                    "Phone",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const firstLetter =
                    user.name?.charAt(0)?.toUpperCase() || "U";

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-white">
                            {firstLetter}
                          </div>

                          <div>
                            <strong className="block text-sm text-slate-900">
                              {user.name}
                            </strong>

                            <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <FiMail />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-violet-100 text-violet-700"
                              : user.role === "librarian"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.registrationNo || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.department || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <FiPhone />
                          {user.phone || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                            aria-label={`Edit ${user.name}`}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={deletingId === user._id}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Delete ${user.name}`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/20 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  User Management
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Update User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Edit the selected user&apos;s information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close edit modal"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editingUser.name}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={editingUser.phone}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Registration No
                  </label>

                  <input
                    type="text"
                    name="registrationNo"
                    value={editingUser.registrationNo}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={editingUser.department}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingUser}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiEdit2 />
                  {updatingUser ? "Updating User..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Students;