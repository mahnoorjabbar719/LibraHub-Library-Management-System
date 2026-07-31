import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { updateUser } from "../../services/userService";

const Profile = () => {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    registrationNo: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        registrationNo: user.registrationNo || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: user?.department || "",
      registrationNo: user?.registrationNo || "",
      role: user?.role || "",
    });

    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Name and email are required.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setSaving(true);

      const data = await updateUser(user._id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        registrationNo: formData.registrationNo,
        role: formData.role,
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile was updated successfully.",
        timer: 1400,
        showConfirmButton: false,
      });

      setEditing(false);
      window.location.reload();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message ||
          "Unable to update your profile.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setSaving(false);
    }
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Account Settings
          </span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal and account information.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <FiEdit2 />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-4xl font-bold text-white shadow-xl shadow-emerald-600/20">
              {firstLetter}
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              {user?.name || "Admin"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user?.email}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold capitalize text-emerald-700">
              <FiShield />
              {user?.role}
            </span>
          </div>

          <div className="mt-7 space-y-3 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <FiPhone />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <strong className="mt-1 block text-sm text-slate-800">
                  {user?.phone || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                <FiUser />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Department
                </p>

                <strong className="mt-1 block text-sm text-slate-800">
                  {user?.department || "Not provided"}
                </strong>
              </div>
            </div>
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your account details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <FiMail className="text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter department"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter registration number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>

                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-sm capitalize text-slate-700"
                />
              </div>
            </div>

            {editing && (
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <FiX />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSave />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </article>
      </div>
    </section>
  );
};

export default Profile;