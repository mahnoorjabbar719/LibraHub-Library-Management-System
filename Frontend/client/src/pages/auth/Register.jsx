import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    registrationNo: "",
    department: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    // Full name: only letters and spaces
    if (name === "name") {
      newValue = value
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\s{2,}/g, " ");
    }

    // Phone number: only digits, maximum 11 digits
    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
    }

    // Registration number: uppercase
    if (name === "registrationNo") {
      newValue = value.toUpperCase();
    }

    // Department: only letters, spaces, hyphens and ampersands
    if (name === "department") {
      newValue = value.replace(/[^A-Za-z\s&-]/g, "");
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedData = {
      ...formData,
      name: formData.name.trim().replace(/\s+/g, " "),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      registrationNo: formData.registrationNo.trim().toUpperCase(),
      department: formData.department.trim().replace(/\s+/g, " "),
    };

    if (
      !cleanedData.name ||
      !cleanedData.email ||
      !cleanedData.password ||
      !cleanedData.phone ||
      !cleanedData.registrationNo ||
      !cleanedData.department
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please complete all required fields.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    const nameLetters = cleanedData.name.replace(/\s/g, "");

    if (nameLetters.length < 3) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid name",
        text: "Full name must contain at least 3 letters.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanedData.email)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (cleanedData.password.length < 6) {
      await Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: "Password must be at least 6 characters long.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (!/^03\d{9}$/.test(cleanedData.phone)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid phone number",
        text: "Enter an 11-digit Pakistani number starting with 03.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    const registrationRegex = /^\d{4}-[A-Z]{2,5}-\d{3}$/;

    if (!registrationRegex.test(cleanedData.registrationNo)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid registration number",
        text: "Use a format like 2026-CS-001.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (cleanedData.department.length < 2) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid department",
        text: "Please enter a valid department name.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setLoading(true);

      await register(cleanedData);

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Registration successful. You can now sign in.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        text:
          error.response?.data?.message ||
          "Unable to create your account.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_34%),linear-gradient(145deg,#071a18_0%,#0b1724_50%,#07111c_100%)]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 flex items-center gap-4 p-12">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-400">
            <FiBookOpen />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              LibraHub
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Smart Library Management System
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl p-12 pb-16">
          <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Join the library
          </span>

          <h2 className="mt-7 text-5xl font-bold leading-tight tracking-tight text-white">
            Create your account and begin your
            <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              reading journey.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-300">
            Search books, track borrowing activity, return books,
            and manage your personal library profile from one
            secure platform.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-2xl text-white">
              <FiBookOpen />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                LibraHub
              </h1>

              <p className="text-xs text-slate-500">
                Smart Library System
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.09)] sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                New account
              </span>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create your LibraHub account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Fill in your details to register as a library
                student.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <FiUser className="shrink-0 text-slate-400" />

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      autoComplete="name"
                      maxLength={50}
                      required
                      className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <FiMail className="shrink-0 text-slate-400" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      autoComplete="email"
                      maxLength={100}
                      required
                      className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <FiLock className="shrink-0 text-slate-400" />

                    <input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={100}
                      required
                      className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (currentValue) => !currentValue
                        )
                      }
                      className="shrink-0 text-lg text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <FiPhone className="shrink-0 text-slate-400" />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={11}
                      required
                      className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="registrationNo"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Registration Number
                  </label>

                  <input
                    id="registrationNo"
                    type="text"
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={handleChange}
                    placeholder="2026-CS-001"
                    autoComplete="off"
                    maxLength={20}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm uppercase text-slate-800 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Department
                  </label>

                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    autoComplete="organization"
                    maxLength={60}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </span>

                {!loading && (
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-emerald-600 transition hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;