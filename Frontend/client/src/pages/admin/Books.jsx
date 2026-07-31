import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiBookOpen,
  FiEdit2,
  FiImage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../../services/bookService";

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

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);

  // Sirf ek search state
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [savingBook, setSavingBook] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [updatingBook, setUpdatingBook] = useState(false);

  const [newCoverFile, setNewCoverFile] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState("");
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState("");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
    availableCopies: "",
    description: "",
  });

  // =========================
  // Load Books
  // =========================

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

  // URL search and Add Book modal
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";

    setSearch(searchFromUrl);

    if (searchParams.get("add") === "true") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  // =========================
  // Close Add Modal
  // =========================

 const closeAddModal = () => {
  if (newCoverPreview.startsWith("blob:")) {
    URL.revokeObjectURL(newCoverPreview);
  }

  setShowAddModal(false);
  setNewCoverFile(null);
  setNewCoverPreview("");

  setNewBook({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
    availableCopies: "",
    description: "",
  });

  const updatedParams = new URLSearchParams(searchParams);
  updatedParams.delete("add");

  setSearchParams(updatedParams, {
    replace: true,
  });
};

  // =========================
  // Categories
  // =========================

  const categories = useMemo(() => {
    const uniqueCategories = books
      .map((book) => book.category)
      .filter(Boolean);

    return [...new Set(uniqueCategories)];
  }, [books]);

  // =========================
  // Filter Books
  // =========================

  const filteredBooks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

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

  // =========================
  // Search Change
  // =========================

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

  // =========================
  // Add Book Change
  // =========================

  const handleNewBookChange = (event) => {
    const { name, value } = event.target;

    setNewBook((currentBook) => ({
      ...currentBook,
      [name]: value,
    }));
  };

 const handleNewCoverChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    event.target.value = "";

    await Swal.fire({
      icon: "warning",
      title: "Invalid image",
      text: "Please select a JPG, PNG, or WEBP image.",
      confirmButtonColor: "#059669",
    });

    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    event.target.value = "";

    await Swal.fire({
      icon: "warning",
      title: "Image too large",
      text: "Book cover must be 5 MB or smaller.",
      confirmButtonColor: "#059669",
    });

    return;
  }

  if (newCoverPreview.startsWith("blob:")) {
    URL.revokeObjectURL(newCoverPreview);
  }

  setNewCoverFile(file);
  setNewCoverPreview(URL.createObjectURL(file));
};

  // =========================
  // Add Book
  // =========================

  const handleAddBook = async (event) => {
    event.preventDefault();

    const {
      title,
      author,
      isbn,
      category: bookCategory,
      quantity,
      availableCopies,
    } = newBook;

    if (
      !title.trim() ||
      !author.trim() ||
      !isbn.trim() ||
      !bookCategory.trim() ||
      quantity === "" ||
      availableCopies === ""
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (Number(quantity) < 1) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid quantity",
        text: "Quantity must be at least 1.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (
      Number(availableCopies) < 0 ||
      Number(availableCopies) > Number(quantity)
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid available copies",
        text: "Available copies must be between 0 and total quantity.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setSavingBook(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("isbn", isbn.trim());
      formData.append("category", bookCategory.trim());
      formData.append("quantity", String(Number(quantity)));
      formData.append("availableCopies", String(Number(availableCopies)));
      formData.append("description", newBook.description || "");

      if (newCoverFile) {
        formData.append("coverImage", newCoverFile);
      }

      const data = await addBook(formData);

      setBooks((currentBooks) => [
        data.book,
        ...currentBooks,
      ]);

      setNewBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        quantity: "",
        availableCopies: "",
        description: "",
      });
      setNewCoverFile(null);
setNewCoverPreview("");

      closeAddModal();

      await Swal.fire({
        icon: "success",
        title: "Book added",
        text: "The book was added successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to add book",
        text:
          error.response?.data?.message ||
          "Something went wrong while adding the book.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setSavingBook(false);
    }
  };

  // =========================
  // Delete Book
  // =========================

  const handleDelete = async (book) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this book?",
      text: `"${book.title}" will be permanently removed.`,
      showCancelButton: true,
      confirmButtonText: "Delete Book",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(book._id);

      await deleteBook(book._id);

      setBooks((currentBooks) =>
        currentBooks.filter(
          (currentBook) => currentBook._id !== book._id
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Book deleted",
        text: "The book was deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.message ||
          "Unable to delete this book.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setDeletingId("");
    }
  };

  // =========================
  // Edit Book Change
  // =========================

  const handleEditBookChange = (event) => {
    const { name, value } = event.target;

    setEditingBook((currentBook) => ({
      ...currentBook,
      [name]: value,
    }));
  };

  const handleEditCoverChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    event.target.value = "";

    await Swal.fire({
      icon: "warning",
      title: "Invalid image",
      text: "Please select a JPG, PNG, or WEBP image.",
      confirmButtonColor: "#2563eb",
    });

    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    event.target.value = "";

    await Swal.fire({
      icon: "warning",
      title: "Image too large",
      text: "Book cover must be 5 MB or smaller.",
      confirmButtonColor: "#2563eb",
    });

    return;
  }

  if (editCoverPreview.startsWith("blob:")) {
    URL.revokeObjectURL(editCoverPreview);
  }

  setEditCoverFile(file);
  setEditCoverPreview(URL.createObjectURL(file));
};

  const closeEditModal = () => {
  if (editCoverPreview.startsWith("blob:")) {
    URL.revokeObjectURL(editCoverPreview);
  }

  setShowEditModal(false);
  setEditingBook(null);
  setEditCoverFile(null);
  setEditCoverPreview("");
};

  // =========================
  // Update Book
  // =========================

  const handleUpdateBook = async (event) => {
    event.preventDefault();

    if (!editingBook) {
      return;
    }

    const {
      title,
      author,
      isbn,
      category: bookCategory,
      quantity,
      availableCopies,
    } = editingBook;

    if (
      !title.trim() ||
      !author.trim() ||
      !isbn.trim() ||
      !bookCategory.trim() ||
      quantity === "" ||
      availableCopies === ""
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (Number(quantity) < 1) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid quantity",
        text: "Quantity must be at least 1.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (
      Number(availableCopies) < 0 ||
      Number(availableCopies) > Number(quantity)
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid available copies",
        text: "Available copies must be between 0 and total quantity.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setUpdatingBook(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("isbn", isbn.trim());
      formData.append("category", bookCategory.trim());
      formData.append("quantity", String(Number(quantity)));
      formData.append("availableCopies", String(Number(availableCopies)));
      formData.append("description", editingBook.description || "");

      if (editCoverFile) {
        formData.append("coverImage", editCoverFile);
      }

      const data = await updateBook(editingBook._id, formData);

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book._id === editingBook._id
            ? data.book
            : book
        )
      );

      closeEditModal();

      await Swal.fire({
        icon: "success",
        title: "Book updated",
        text: "The book was updated successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message ||
          "Unable to update this book.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setUpdatingBook(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Library Collection
          </span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Books Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add, update, search, and manage all library books.
          </p>
        </div>

        <button
  type="button"
  onClick={() => setShowAddModal(true)}
  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
>
  <FiPlus className="text-lg" />
  Add New Book
</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Books
          </p>

          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {books.length}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Copies
          </p>

          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {books.reduce(
              (total, book) => total + Number(book.quantity || 0),
              0
            )}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available Copies
          </p>

          <strong className="mt-3 block text-3xl font-bold text-emerald-600">
            {books.reduce(
              (total, book) =>
                total + Number(book.availableCopies || 0),
              0
            )}
          </strong>
        </article>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
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
            className="w-full md:w-60 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="all">All Categories</option>

            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="grid min-h-72 place-items-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
              <div>
       <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
  <FiBookOpen />
</div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No books found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or add a new book.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-[1050px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Book",
                    "ISBN",
                    "Category",
                    "Copies",
                    "Available",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => {
                  const availableCopies = Number(
                    book.availableCopies || 0
                  );

                  return (
                    <tr
                      key={book._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-emerald-50">
                            {book.coverImage ? (
                              <img
                                src={getBookCoverUrl(book.coverImage)}
                                alt={`${book.title} cover`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-xl text-emerald-600">
                                <FiBookOpen />
                              </div>
                            )}
                          </div>

                          <div>
                            <strong className="block max-w-60 truncate text-sm text-slate-900">
                              {book.title}
                            </strong>

                            <span className="mt-1 block text-xs text-slate-500">
                              {book.author}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {book.isbn}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {book.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {availableCopies}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            availableCopies > 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {availableCopies > 0
                            ? "Available"
                            : "Out of stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                           onClick={() => {
  setEditingBook({
    ...book,
    quantity: String(book.quantity ?? ""),
    availableCopies: String(book.availableCopies ?? ""),
  });

  setEditCoverFile(null);
  setEditCoverPreview(
    book.coverImage
      ? getBookCoverUrl(book.coverImage)
      : ""
  );

  setShowEditModal(true);
}}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                            aria-label={`Edit ${book.title}`}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(book)}
                            disabled={deletingId === book._id}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Delete ${book.title}`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredBooks.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <strong className="text-slate-700">
                {filteredBooks.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-700">{books.length}</strong>{" "}
              books
            </p>

            <p>
              Categories:{" "}
              <strong className="text-slate-700">
                {categories.length}
              </strong>
            </p>
          </div>
        )}
      </div>
      {showAddModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/20 bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Library Collection
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Add New Book
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the complete details of the new library book.
          </p>
        </div>

        <button
          type="button"
          onClick={closeAddModal}
          className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close modal"
        >
          <FiX />
        </button>
      </div>


      <form onSubmit={handleAddBook} className="p-6">
        <div className="mb-6">
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Book Cover
    </label>

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleNewCoverChange}
      className="w-full rounded-xl border border-slate-200 p-3"
    />

    <div className="mt-4">
      {newCoverPreview ? (
        <img
          src={newCoverPreview}
          alt="Preview"
          className="h-44 w-32 rounded-xl border object-cover"
        />
      ) : (
        <div className="grid h-44 w-32 place-items-center rounded-xl bg-emerald-50 text-4xl text-emerald-600">
          <FiBookOpen />
        </div>
      )}
    </div>
  </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Book Title
            </label>

            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleNewBookChange}
              placeholder="Enter book title"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Author
            </label>

            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleNewBookChange}
              placeholder="Enter author name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ISBN
            </label>

            <input
              type="text"
              name="isbn"
              value={newBook.isbn}
              onChange={handleNewBookChange}
              placeholder="Enter ISBN"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={newBook.category}
              onChange={handleNewBookChange}
              placeholder="Programming, Fiction, Science..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Total Quantity
            </label>

            <input
              type="number"
              min="1"
              name="quantity"
              value={newBook.quantity}
              onChange={handleNewBookChange}
              placeholder="Enter total copies"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Available Copies
            </label>

            <input
              type="number"
              min="0"
              name="availableCopies"
              value={newBook.availableCopies}
              onChange={handleNewBookChange}
              placeholder="Enter available copies"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-32 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-3xl text-emerald-600 shadow-sm">
              {newCoverPreview ? (
                <img
                  src={newCoverPreview}
                  alt="New book cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiImage />
              )}
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Book Cover
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
                <FiUpload />
                Choose Cover Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleNewCoverChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG or WEBP. Maximum size 5 MB.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={newBook.description}
            onChange={handleNewBookChange}
            rows="5"
            placeholder="Write a short description about the book..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
           onClick={closeAddModal}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={savingBook}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiPlus />
            {savingBook ? "Saving Book..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{showEditModal && editingBook && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/20 bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Edit Library Record
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Update Book
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the selected book&apos;s information.
          </p>
        </div>

        <button
          type="button"
          onClick={closeEditModal}
          className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close edit modal"
        >
          <FiX />
        </button>
      </div>

      <form onSubmit={handleUpdateBook} className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Book Title
            </label>

            <input
              type="text"
              name="title"
              value={editingBook.title}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Author
            </label>

            <input
              type="text"
              name="author"
              value={editingBook.author}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ISBN
            </label>

            <input
              type="text"
              name="isbn"
              value={editingBook.isbn}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={editingBook.category}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Total Quantity
            </label>

            <input
              type="number"
              min="1"
              name="quantity"
              value={editingBook.quantity}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Available Copies
            </label>

            <input
              type="number"
              min="0"
              name="availableCopies"
              value={editingBook.availableCopies}
              onChange={handleEditBookChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-32 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-3xl text-blue-600 shadow-sm">
              {editCoverPreview ? (
                <img
                  src={editCoverPreview}
                  alt="Book cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiImage />
              )}
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Replace Book Cover
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                <FiUpload />
                Choose New Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleEditCoverChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-slate-500">
                Leave unchanged to keep the current cover.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={editingBook.description || ""}
            onChange={handleEditBookChange}
            rows="5"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeEditModal}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updatingBook}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiEdit2 />
            {updatingBook ? "Updating Book..." : "Update Book"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </section>
  );
};

export default Books;