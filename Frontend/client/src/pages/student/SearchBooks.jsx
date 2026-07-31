import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { getAllBooks } from "../../services/bookService";
import { borrowBook } from "../../services/borrowService";
const API_ROOT =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_ROOT = API_ROOT.replace(/\/api\/?$/, "");

const getBookCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (
    coverImage.startsWith("http://") ||
    coverImage.startsWith("https://")
  ) {
    return coverImage;
  }

  return `${SERVER_ROOT}${coverImage}`;
};
const SearchBooks = () => {
  // Pehle searchParams declare hoga
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);

  // Ab searchParams safely use ho sakta hai
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowModalBook, setBorrowModalBook] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  const loadBooks = async () => {
    try {
      setLoading(true);

      const data = await getAllBooks();
      setBooks(data.books || []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load books",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading books.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearch(searchFromUrl);
  }, [searchParams]);

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    const updatedParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      updatedParams.set("search", value);
    } else {
      updatedParams.delete("search");
    }

    setSearchParams(updatedParams, {
      replace: true,
    });
  };

  const categories = useMemo(() => {
    return [
      ...new Set(
        books
          .map((book) => book.category)
          .filter(Boolean)
      ),
    ];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchValue) ||
        book.author?.toLowerCase().includes(searchValue) ||
        book.isbn?.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "all" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const openBorrowModal = (book) => {
    setBorrowModalBook(book);

    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);

    setDueDate(defaultDueDate.toISOString().split("T")[0]);
  };

  const closeBorrowModal = () => {
    setBorrowModalBook(null);
    setDueDate("");
  };

  const handleBorrowBook = async (event) => {
    event.preventDefault();

    if (!borrowModalBook || !dueDate) {
      await Swal.fire({
        icon: "warning",
        title: "Due date required",
        text: "Please select a due date.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (new Date(dueDate) <= new Date()) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid due date",
        text: "Due date must be after today.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setBorrowing(true);

      await borrowBook({
        bookId: borrowModalBook._id,
        dueDate,
      });

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book._id === borrowModalBook._id
            ? {
                ...book,
                availableCopies: Number(book.availableCopies) - 1,
              }
            : book
        )
      );

      closeBorrowModal();

      await Swal.fire({
        icon: "success",
        title: "Book borrowed",
        text: "The book was borrowed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Borrow failed",
        text:
          error.response?.data?.message ||
          "Unable to borrow this book.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Library Collection
        </span>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Search Books
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Browse available books and borrow your next read.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
            <FiSearch className="text-lg text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by title, author, or ISBN..."
              className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
           className="w-full md:w-60 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10">
            <option value="all">All Categories</option>

            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid min-h-[50vh] place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
              <FiBookOpen />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No books found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or category filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => {
            const availableCopies = Number(book.availableCopies || 0);
            const isAvailable = availableCopies > 0;

            return (
              <article
                key={book._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
               <div className="relative aspect-[3/4] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_40%),linear-gradient(135deg,#eefbf5,#e8f1ff)]">
  {book.coverImage ? (
    <img
      src={getBookCoverUrl(book.coverImage)}
      alt={`${book.title} cover`}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling.style.display = "grid";
      }}
    />
  ) : null}

  <div
    className={`h-full w-full place-items-center ${
      book.coverImage ? "hidden" : "grid"
    }`}
  >
    <FiBookOpen className="text-6xl text-emerald-600" />
  </div>

                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "Available" : "Out of stock"}
                  </span>
                </div>

                <div className="p-5">
                  <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    {book.category}
                  </span>

                  <h2 className="mt-4 line-clamp-1 text-xl font-bold text-slate-900">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    by {book.author}
                  </p>

                  <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                    {book.description || "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Available
                      </p>

                      <strong className="mt-1 block text-lg text-slate-900">
                        {availableCopies}
                      </strong>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Copies
                      </p>

                      <strong className="mt-1 block text-lg text-slate-900">
                        {book.quantity}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBook(book)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      <FiEye />
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => openBorrowModal(book)}
                      disabled={!isAvailable}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                      <FiCheckCircle />
                      Borrow
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Book Details
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedBook.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6">
             <div className="mx-auto h-72 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50 shadow-lg">
  {selectedBook.coverImage ? (
    <img
      src={getBookCoverUrl(selectedBook.coverImage)}
      alt={`${selectedBook.title} cover`}
     className="h-full w-full object-contain  transition-transform duration-500 group-hover:scale-105"
    />
  ) : (
    <div className="grid h-full w-full place-items-center">
      <FiBookOpen className="text-7xl text-emerald-600" />
    </div>
  )}
</div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Author", selectedBook.author],
                  ["ISBN", selectedBook.isbn],
                  ["Category", selectedBook.category],
                  ["Total Copies", selectedBook.quantity],
                  ["Available Copies", selectedBook.availableCopies],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>

                    <strong className="mt-2 block text-sm text-slate-800">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {selectedBook.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {borrowModalBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Borrow Book
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {borrowModalBook.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeBorrowModal}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleBorrowBook} className="p-6">
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Select the date by which you will return this book.
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Due Date
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <FiCalendar className="text-slate-400" />

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBorrowModal}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiCheckCircle />
                  {borrowing ? "Borrowing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchBooks;