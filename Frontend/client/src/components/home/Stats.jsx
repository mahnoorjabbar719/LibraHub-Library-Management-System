import {
  FiBookOpen,
  FiRepeat,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    label: "Books Managed",
    value: "1,200+",
    description: "Organized across multiple categories",
    icon: FiBookOpen,
  },
  {
    label: "Active Students",
    value: "850+",
    description: "Using the platform securely",
    icon: FiUsers,
  },
  {
    label: "Borrow Records",
    value: "3,500+",
    description: "Tracked with complete details",
    icon: FiRepeat,
  },
  {
    label: "System Efficiency",
    value: "99%",
    description: "Fast, reliable, and responsive",
    icon: FiTrendingUp,
  },
];

const Stats = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
              Built for better libraries
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              One system for your entire library workflow
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              LibraHub reduces manual work by bringing books, students,
              borrowing, returns, reports, and profiles into one connected
              platform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map(({ label, value, description, icon: Icon }) => (
              <article
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.09]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <strong className="text-4xl font-bold text-white">
                      {value}
                    </strong>

                    <h3 className="mt-3 text-sm font-bold text-emerald-300">
                      {label}
                    </h3>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/10 text-xl text-emerald-300">
                    <Icon />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;