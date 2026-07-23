import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";

const books = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    rating: "4.9",
    description:
      "A practical guide to writing cleaner, more maintainable code.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    rating: "4.8",
    description:
      "Learn how small daily habits can create remarkable long-term results.",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    rating: "4.7",
    description:
      "Build focus, eliminate distractions, and produce meaningful work.",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    rating: "4.9",
    description:
      "Timeless lessons for becoming a thoughtful and effective developer.",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    rating: "4.6",
    description:
      "A popular introduction to personal finance and financial thinking.",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    rating: "4.8",
    description:
      "A powerful story about purpose, courage, and following your dreams.",
  },
];

const PopularBooks = () => {
  return (
    <section
      id="books"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
              Popular Collection
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Discover books readers love
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Explore a selection of popular programming, productivity,
              finance, self-development, and fiction books.
            </p>
          </div>

          <Link
            to="/register"
            className="group flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Explore Library
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book, index) => (
            <article
              key={book.title}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative grid h-52 place-items-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_40%),linear-gradient(135deg,#eefbf5,#e8f1ff)]">
                <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(15,23,42,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

                <div className="relative grid h-24 w-24 place-items-center rounded-[26px] border border-white/60 bg-white/70 text-5xl text-emerald-600 shadow-xl backdrop-blur transition-transform duration-300 group-hover:scale-110">
                  <FiBookOpen />
                </div>

                <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur">
                  #{index + 1}
                </span>

                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  <FiStar className="fill-current" />
                  {book.rating}
                </span>
              </div>

              <div className="p-6">
                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                  {book.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {book.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  by {book.author}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {book.description}
                </p>

                <Link
                  to="/login"
                  className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  View in Library
                  <FiArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBooks;