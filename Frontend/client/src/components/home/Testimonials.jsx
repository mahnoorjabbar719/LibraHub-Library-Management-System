import {
  FiMessageCircle,
  FiStar,
} from "react-icons/fi";

const testimonials = [
  {
    name: "Mahnoor Jabbar",
    role: "Student",
    initials: "MJ",
    quote:
      "LibraHub makes it very easy to search books, track due dates, and manage borrowing history from one place.",
  },
  {
    name: "Ali Hassan",
    role: "Librarian",
    initials: "AH",
    quote:
      "The dashboard is clean, fast, and practical. Managing books and borrow records now feels much more organized.",
  },
  {
    name: "Sara Ahmed",
    role: "Administrator",
    initials: "SA",
    quote:
      "Role-based access, reports, and user management make LibraHub a strong solution for modern libraries.",
  },
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Trusted Experience
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Loved by students and library teams
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            LibraHub is designed to make everyday library tasks simpler,
            faster, and more organized for everyone.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
                  <FiMessageCircle />
                </div>

                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                      key={index}
                      className="fill-current"
                    />
                  ))}
                </div>
              </div>

              <p className="mt-6 text-base leading-8 text-slate-600">
                “{testimonial.quote}”
              </p>

              <div className="mt-7 flex items-center gap-4 border-t border-slate-100 pt-5">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-600/20">
                  {testimonial.initials}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;