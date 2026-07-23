import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please enter your email and password.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setLoading(true);

      const data = await login(formData);

      await Swal.fire({
        icon: "success",
        title: "Login successful",
        text: `Welcome back, ${data.user.name}!`,
        timer: 1400,
        showConfirmButton: false,
      });

      if (
        data.user.role === "admin" ||
        data.user.role === "librarian"
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login failed",
        text:
          error.response?.data?.message ||
          "Unable to login. Please try again.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* Left Visual Section */}
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_34%),linear-gradient(145deg,#071a18_0%,#0b1724_50%,#07111c_100%)]" />

        {/* Decorative blurred shapes */}
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 flex items-center gap-4 p-12">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-400 shadow-lg shadow-emerald-950/30">
            <FiBookOpen />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              LibraHub
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Smart Library Management System
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl p-12 pb-16">
          <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Discover · Borrow · Learn
          </span>

          <h2 className="mt-7 max-w-xl text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
            Your library,
            <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              beautifully managed.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
            Manage books, students, borrowing activity, returns, reports,
            and library records through one secure and modern platform.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <strong className="block text-2xl text-white">1K+</strong>
              <span className="mt-1 block text-xs text-slate-400">
                Books Managed
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <strong className="block text-2xl text-white">500+</strong>
              <span className="mt-1 block text-xs text-slate-400">
                Active Readers
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <strong className="block text-2xl text-white">24/7</strong>
              <span className="mt-1 block text-xs text-slate-400">
                Easy Access
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-lg shadow-emerald-600/20">
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
                Welcome back
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to LibraHub
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your account details to access your library dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <FiMail className="shrink-0 text-lg text-slate-400 transition group-focus-within:text-emerald-600" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <FiLock className="shrink-0 text-lg text-slate-400 transition group-focus-within:text-emerald-600" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    className="grid shrink-0 place-items-center text-lg text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />
                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>
                  {loading ? "Signing in..." : "Sign In"}
                </span>

                {!loading && (
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">New to LibraHub?</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Create a new account
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 LibraHub. Smart Library Management System.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;