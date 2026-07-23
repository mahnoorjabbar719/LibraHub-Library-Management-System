import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiPlayCircle,
} from "react-icons/fi";

const Hero = () => {
  const highlights = [
    "Manage books and users",
    "Track borrow and return records",
    "Role-based secure dashboards",
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-slate-950 px-5 pb-20 pt-32 text-white sm:px-8 lg:px-10 lg:pb-28 lg:pt-40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_32%)]" />

      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            <FiBookOpen />
            Smart Library Management
          </span>

          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl xl:text-7xl">
            Manage your library
            <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              smarter and faster.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            LibraHub helps administrators, librarians, and students manage
            books, users, borrowing records, returns, reports, and profiles
            through one secure platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Get Started
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              <FiPlayCircle />
              Sign In
            </Link>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
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

        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative rounded-[32px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Dashboard Preview
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Library Overview
                  </h2>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/15 text-2xl text-emerald-400">
                  <FiBookOpen />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  ["Total Books", "1,248"],
                  ["Students", "856"],
                  ["Borrowed", "320"],
                  ["Available", "928"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                  >
                    <p className="text-xs text-slate-400">{label}</p>

                    <strong className="mt-2 block text-2xl text-white">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Recent Borrow Activity
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Latest library transactions
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    ["Mahnoor", "Clean Code", "Borrowed"],
                    ["Ali", "Atomic Habits", "Returned"],
                    ["Sara", "Deep Work", "Borrowed"],
                  ].map(([name, book, status]) => (
                    <div
                      key={`${name}-${book}`}
                      className="flex items-center justify-between rounded-xl bg-slate-950/40 px-3 py-3"
                    >
                      <div>
                        <strong className="block text-sm text-white">
                          {name}
                        </strong>

                        <span className="text-xs text-slate-400">
                          {book}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          status === "Returned"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;