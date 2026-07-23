import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCcw,
  FiSearch,
  FiX,
  FiPlus,
  FiCalendar,
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  getAllBorrowRecords,
  returnBorrowedBook,
  issueBookByAdmin,
} from "../../services/borrowService";
import API from "../../services/api";

const BorrowRecords = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
const [students, setStudents] = useState([]);
const [books, setBooks] = useState([]);
const [issuingBook, setIssuingBook] = useState(false);

const [issueForm, setIssueForm] = useState({
  userId: "",
  bookId: "",
  dueDate: "",
});

  const loadRecords = async () => {
    try {
      setLoading(true);

      const data = await getAllBorrowRecords();
      setRecords(data.borrowRecords || []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to load records",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading borrow records.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };
  const loadIssueOptions = async () => {
  try {
    const [usersResponse, booksResponse] = await Promise.all([
      API.get("/users"),
      API.get("/books"),
    ]);

    const studentUsers = (usersResponse.data.users || []).filter(
      (user) => user.role === "student"
    );

    const availableBooks = (booksResponse.data.books || []).filter(
      (book) => Number(book.availableCopies || 0) > 0
    );

    setStudents(studentUsers);
    setBooks(availableBooks);
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Unable to load options",
      text:
        error.response?.data?.message ||
        "Unable to load students and books.",
      confirmButtonColor: "#059669",
    });

    throw error;
  }
};

const openIssueModal = async () => {
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14);

  setIssueForm({
    userId: "",
    bookId: "",
    dueDate: defaultDueDate.toISOString().split("T")[0],
  });

  try {
    await loadIssueOptions();
    setShowIssueModal(true);
  } catch {
    // Error alert loadIssueOptions mein show ho chuka hai.
  }
};

const closeIssueModal = () => {
  setShowIssueModal(false);

  setIssueForm({
    userId: "",
    bookId: "",
    dueDate: "",
  });
};

const handleIssueFormChange = (event) => {
  const { name, value } = event.target;

  setIssueForm((currentForm) => ({
    ...currentForm,
    [name]: value,
  }));
};

const handleIssueBook = async (event) => {
  event.preventDefault();

  const { userId, bookId, dueDate } = issueForm;

  if (!userId || !bookId || !dueDate) {
    await Swal.fire({
      icon: "warning",
      title: "Missing information",
      text: "Please select a student, book, and due date.",
      confirmButtonColor: "#059669",
    });

    return;
  }

  try {
    setIssuingBook(true);

    await issueBookByAdmin({
      userId,
      bookId,
      dueDate,
    });

    closeIssueModal();

    await loadRecords();

    await Swal.fire({
      icon: "success",
      title: "Book Issued",
      text: "The book was issued successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Issue Failed",
      text:
        error.response?.data?.message ||
        "Unable to issue the book.",
      confirmButtonColor: "#059669",
    });
  } finally {
    setIssuingBook(false);
  }
};
  useEffect(() => {
    loadRecords();
  }, []);

  const now = new Date();

  const totalRecords = records.length;

  const returnedRecords = records.filter(
    (record) => record.status === "Returned"
  ).length;

  const borrowedRecords = records.filter(
    (record) => record.status === "Borrowed"
  ).length;

  const overdueRecords = records.filter((record) => {
    if (record.status === "Returned" || !record.dueDate) {
      return false;
    }

    return new Date(record.dueDate) < now;
  }).length;

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return records.filter((record) => {
      const studentName = record.user?.name || "";
      const studentEmail = record.user?.email || "";
      const bookTitle = record.book?.title || "";
      const bookAuthor = record.book?.author || "";

      const isOverdue =
        record.status !== "Returned" &&
        record.dueDate &&
        new Date(record.dueDate) < new Date();

      const displayStatus = isOverdue ? "Overdue" : record.status;

      const matchesSearch =
        studentName.toLowerCase().includes(searchValue) ||
        studentEmail.toLowerCase().includes(searchValue) ||
        bookTitle.toLowerCase().includes(searchValue) ||
        bookAuthor.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        displayStatus.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const getDisplayStatus = (record) => {
    const isOverdue =
      record.status !== "Returned" &&
      record.dueDate &&
      new Date(record.dueDate) < new Date();

    return isOverdue ? "Overdue" : record.status;
  };

  const getStatusClasses = (status) => {
    if (status === "Returned") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Overdue") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const handleReturnBook = async (record) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Return this book?",
      text: `${record.book?.title || "This book"} will be marked as returned.`,
      showCancelButton: true,
      confirmButtonText: "Return Book",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setReturningId(record._id);

      await returnBorrowedBook(record._id);
    

      await Swal.fire({
        icon: "success",
        title: "Book returned",
        text: "The book was returned successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
      await loadRecords();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Return failed",
        text:
          error.response?.data?.message ||
          "Unable to return this book.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setReturningId("");
    }
  };

  return (
    <section className="space-y-6">
  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
        Circulation Management
      </span>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Borrow Records
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Monitor borrowed, returned, and overdue library books.
      </p>
    </div>

    <button
      type="button"
      onClick={openIssueModal}
      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
    >
      <FiPlus className="text-lg" />
      Issue Book
    </button>
  </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Records
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {totalRecords}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-xl text-blue-600">
              <FiBookOpen />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Borrowed
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {borrowedRecords}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-xl text-amber-600">
              <FiClock />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Returned
              </p>

              <strong className="mt-3 block text-3xl font-bold text-slate-900">
                {returnedRecords}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
              <FiCheckCircle />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Overdue
              </p>

              <strong className="mt-3 block text-3xl font-bold text-red-600">
                {overdueRecords}
              </strong>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-xl text-red-600">
              <FiClock />
            </div>
          </div>
        </article>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
            <FiSearch className="text-lg text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, email, book, or author..."
              className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="all">All Statuses</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="grid min-h-72 place-items-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                  <FiBookOpen />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No borrow records found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-[1200px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Student",
                    "Book",
                    "Borrow Date",
                    "Due Date",
                    "Return Date",
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
                {filteredRecords.map((record) => {
                  const status = getDisplayStatus(record);

                  return (
                    <tr
                      key={record._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <strong className="block text-sm text-slate-900">
                            {record.user?.name || "Unknown user"}
                          </strong>

                          <span className="mt-1 block text-xs text-slate-500">
                            {record.user?.email || "No email"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <strong className="block text-sm text-slate-900">
                            {record.book?.title || "Unknown book"}
                          </strong>

                          <span className="mt-1 block text-xs text-slate-500">
                            {record.book?.author || "No author"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.borrowDate
                          ? new Date(
                              record.borrowDate
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.dueDate
                          ? new Date(
                              record.dueDate
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.returnDate
                          ? new Date(
                              record.returnDate
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                            aria-label="View record"
                          >
                            <FiEye />
                          </button>

                          {record.status !== "Returned" && (
                            <button
                              type="button"
                              onClick={() => handleReturnBook(record)}
                              disabled={returningId === record._id}
                              className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Return book"
                            >
                              <FiRefreshCcw />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-white/20 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Borrow Details
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Record Information
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {[
                ["Student", selectedRecord.user?.name || "—"],
                ["Email", selectedRecord.user?.email || "—"],
                ["Book", selectedRecord.book?.title || "—"],
                ["Author", selectedRecord.book?.author || "—"],
                [
                  "Borrow Date",
                  selectedRecord.borrowDate
                    ? new Date(
                        selectedRecord.borrowDate
                      ).toLocaleDateString()
                    : "—",
                ],
                [
                  "Due Date",
                  selectedRecord.dueDate
                    ? new Date(
                        selectedRecord.dueDate
                      ).toLocaleDateString()
                    : "—",
                ],
                [
                  "Return Date",
                  selectedRecord.returnDate
                    ? new Date(
                        selectedRecord.returnDate
                      ).toLocaleDateString()
                    : "—",
                ],
                ["Status", getDisplayStatus(selectedRecord)],
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
          </div>
        </div>
      )}
      {showIssueModal && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Library
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Issue Book
          </h2>
        </div>

        <button
          type="button"
          onClick={closeIssueModal}
          className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
        >
          <FiX />
        </button>
      </div>

      <form onSubmit={handleIssueBook} className="space-y-5 p-6">

        {/* Student */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Student
          </label>

          <select
            name="userId"
            value={issueForm.userId}
            onChange={handleIssueFormChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        {/* Book */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Book
          </label>

          <select
            name="bookId"
            value={issueForm.bookId}
            onChange={handleIssueFormChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Select Book</option>

            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.availableCopies} Available)
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Due Date
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
            <FiCalendar className="text-slate-400" />

            <input
              type="date"
              name="dueDate"
              value={issueForm.dueDate}
              onChange={handleIssueFormChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={closeIssueModal}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={issuingBook}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {issuingBook ? "Issuing..." : "Issue Book"}
          </button>

        </div>

      </form>
    </div>
  </div>
)}
    </section>
  );
};

export default BorrowRecords;