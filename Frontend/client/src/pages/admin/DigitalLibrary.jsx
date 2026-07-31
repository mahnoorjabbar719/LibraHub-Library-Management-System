import { useEffect, useMemo, useState } from "react";
import {
  FiBook,
  FiBookOpen,
  FiDownload,
  FiFileText,
  FiGrid,
  FiList,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  getAllDigitalBooks,
  updateDigitalBook,
  deleteDigitalBook,
} from "../../services/digitalBookService";

import DigitalBookCard from "../../components/digital/DigitalBookCard";
import AddDigitalBookModal from "../../components/digital/AddDigitalBookModal";
const DigitalLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState("");
const [editingBook, setEditingBook] = useState(null);
  // =========================
  // Load digital books
  // =========================

  const loadBooks = async () => {
    try {
      setLoading(true);

      const data = await getAllDigitalBooks();

      setBooks(data.books || []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load digital books",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading digital books.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // =========================
  // Categories
  // =========================

  const categories = useMemo(() => {
    const allCategories = books
      .map((book) => book.category)
      .filter(Boolean);

    return [...new Set(allCategories)];
  }, [books]);

  // =========================
  // Statistics
  // =========================

  const totalPages = useMemo(() => {
    return books.reduce(
      (total, book) => total + Number(book.pages || 0),
      0
    );
  }, [books]);

  const totalDownloads = useMemo(() => {
    return books.reduce(
      (total, book) => total + Number(book.downloads || 0),
      0
    );
  }, [books]);

  // =========================
  // Filter books
  // =========================

  const filteredBooks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchValue) ||
        book.author?.toLowerCase().includes(searchValue) ||
        book.category?.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "all" ||
        book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  // =========================
  // Edit
  // =========================

 const handleEdit = (book) => {
  setEditingBook(book);
  setShowAddModal(true);
};

  // =========================
  // Delete placeholder
  // =========================

 const handleDelete = async (book) => {
  const result = await Swal.fire({
    title: "Delete Digital Book?",
    text: `"${book.title}" will be permanently deleted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    setDeletingId(book._id);

    await deleteDigitalBook(book._id);

    setBooks((prev) =>
      prev.filter((item) => item._id !== book._id)
    );

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Digital book deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
  console.log("DELETE ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);

  Swal.fire({
    icon: "error",
    title: "Delete Failed",
    text:
      error.response?.data?.message ||
      error.message,
  });
}
};

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Digital Collection
          </span>

         <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Digital Library
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your digital books, PDFs and learning resources.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          <FiPlus className="text-lg" />
          Add Digital Book
        </button>
      </div>

      {/* Statistics */}
      <div className= "grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
              <FiBookOpen />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Books
              </p>

              <strong className="mt-1 block text-2xl font-bold text-slate-900">
                {books.length}
              </strong>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500" />
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-xl text-violet-600">
              <FiGrid />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Categories
              </p>

              <strong className="mt-1 block text-2xl font-bold text-slate-900">
                {categories.length}
              </strong>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-violet-500" />
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-xl text-amber-600">
              <FiFileText />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Pages
              </p>

              <strong className="mt-1 block text-2xl font-bold text-slate-900">
                {totalPages.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-amber-500" />
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-xl text-blue-600">
              <FiDownload />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Downloads
              </p>

              <strong className="mt-1 block text-2xl font-bold text-slate-900">
                {totalDownloads.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-500" />
        </article>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
          <FiSearch className="shrink-0 text-lg text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search digital books by title, author or category..."
            className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full lg:w-56 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
        >
          <option value="all">All Categories</option>

          {categories.map((categoryName) => (
            <option
              key={categoryName}
              value={categoryName}
            >
              {categoryName}
            </option>
          ))}
        </select>

        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`grid h-10 w-10 place-items-center rounded-lg transition ${
              viewMode === "grid"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-400 hover:text-slate-700"
            }`}
            aria-label="Grid view"
          >
            <FiGrid />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`grid h-10 w-10 place-items-center rounded-lg transition ${
              viewMode === "list"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-400 hover:text-slate-700"
            }`}
            aria-label="List view"
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Books */}
      {loading ? (
        <div className="grid min-h-80 place-items-center rounded-2xl border border-slate-200 bg-white">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
              <FiBook />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No digital books found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters or add a new digital book.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              : "grid gap-5 md:grid-cols-2"
          }
        >
          {filteredBooks.map((book) => (
            <DigitalBookCard
              key={book._id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}

      {/* Footer information */}
      {!loading && filteredBooks.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <strong className="text-slate-700">
              {filteredBooks.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {books.length}
            </strong>{" "}
            digital books
          </p>

          <p>
            Categories:{" "}
            <strong className="text-slate-700">
              {categories.length}
            </strong>
          </p>
        </div>
      )}

   <AddDigitalBookModal
  isOpen={showAddModal}
  editingBook={editingBook}
  onClose={() => {
    setShowAddModal(false);
    setEditingBook(null);
  }}
  onBookAdded={(newBook) => {
    setBooks((currentBooks) => [
      newBook,
      ...currentBooks,
    ]);
  }}
  onBookUpdated={(updatedBook) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book._id === updatedBook._id
          ? updatedBook
          : book
      )
    );
  }}
/>
    </section>
  );
};

export default DigitalLibrary;