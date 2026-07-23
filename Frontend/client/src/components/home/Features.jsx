import {
  FiBarChart2,
  FiBookOpen,
  FiRepeat,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const features = [
  {
    title: "Book Management",
    description:
      "Add, update, search, categorize, and manage your complete library collection.",
    icon: FiBookOpen,
    iconStyle: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Student Management",
    description:
      "Manage students, librarians, and administrators from one secure dashboard.",
    icon: FiUsers,
    iconStyle: "bg-blue-100 text-blue-600",
  },
  {
    title: "Borrow & Return",
    description:
      "Track borrowed books, due dates, returns, availability, and overdue records.",
    icon: FiRepeat,
    iconStyle: "bg-amber-100 text-amber-600",
  },
  {
    title: "Reports & Analytics",
    description:
      "Review library activity using real-time statistics, summaries, and visual reports.",
    icon: FiBarChart2,
    iconStyle: "bg-violet-100 text-violet-600",
  },
  {
    title: "Role-Based Security",
    description:
      "Provide separate protected access for administrators, librarians, and students.",
    icon: FiShield,
    iconStyle: "bg-rose-100 text-rose-600",
  },
  {
    title: "Fast & Responsive",
    description:
      "Enjoy a smooth experience across desktop, tablet, and mobile devices.",
    icon: FiZap,
    iconStyle: "bg-cyan-100 text-cyan-600",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Powerful Features
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything you need to manage a modern library
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            LibraHub combines book management, user control, borrowing,
            reporting, and secure access in one simple platform.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(
            ({ title, description, icon: Icon, iconStyle }) => (
              <article
                key={title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${iconStyle}`}
                >
                  <Icon />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>

                <div className="mt-6 h-1 w-12 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-20" />
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;