import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";

import { getAllBooks } from "../../services/bookService";

const API_ROOT =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_ROOT = API_ROOT.replace(/\/api\/?$/, "");

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (
    coverImage.startsWith("http://") ||
    coverImage.startsWith("https://")
  ) {
    return coverImage;
  }

  return `${SERVER_ROOT}${coverImage}`;
};

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);

        const data = await getAllBooks();

        setBooks((data.books || []).slice(0, 8));
      } catch (error) {
        console.error("Unable to load popular books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <section
      id="books"
      className="relative overflow-hidden bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
              Featured Collection
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Discover books worth reading
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Browse popular titles available in LibraHub and find your next
              great read.
            </p>
          </div>

          <Link
            to="/register"
            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            Explore Library
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-72 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <FiBookOpen className="mx-auto text-5xl text-emerald-600" />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No books available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Books added by the administrator will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => {
              const coverUrl = getCoverUrl(book.coverImage);
              const availableCopies =
                book.availableCopies ?? book.quantity ?? 0;

              return (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative h-[330px] overflow-hidden bg-slate-200">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-emerald-100 via-slate-100 to-cyan-100">
                        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/80 text-5xl text-emerald-600 shadow-xl backdrop-blur">
                          <FiBookOpen />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                      {book.category || "General"}
                    </span>

                    <span
                      className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur ${
                        availableCopies > 0
                          ? "bg-emerald-500/90 text-white"
                          : "bg-rose-500/90 text-white"
                      }`}
                    >
                      <FiCheckCircle />

                      {availableCopies > 0
                        ? `${availableCopies} Available`
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-bold text-slate-950">
                      {book.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                      by {book.author || "Unknown Author"}
                    </p>

                    {book.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                        {book.description}
                      </p>
                    )}

                    <Link
                      to="/login"
                      className="mt-5 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-emerald-600 hover:text-white"
                    >
                      View in Library
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularBooks;