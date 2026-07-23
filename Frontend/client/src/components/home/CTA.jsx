import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-300">
              <FiBookOpen />
            </div>

            <span className="mt-7 block text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              Start using LibraHub
            </span>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Ready to make library management easier?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Create an account, explore the collection, manage users, track
              borrowing records, and access powerful reports from one modern
              platform.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                "Secure role-based access",
                "Real-time book tracking",
                "Responsive modern dashboard",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/register"
              className="group flex min-w-44 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Get Started
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="flex min-w-44 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;