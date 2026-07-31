import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { getMyBorrowedBooks } from "../../services/borrowService";
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

const MyBooks = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const loadMyBooks = async () => {
      try {
        setLoading(true);

        const data = await getMyBorrowedBooks();
        setRecords(data.borrowedBooks || []);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load your books",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading your borrow history.",
          confirmButtonColor: "#059669",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMyBooks();
  }, []);

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

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return records.filter((record) => {
      const bookTitle = record.book?.title || "";
      const author = record.book?.author || "";
      const isbn = record.book?.isbn || "";
      const displayStatus = getDisplayStatus(record);

      const matchesSearch =
        bookTitle.toLowerCase().includes(searchValue) ||
        author.toLowerCase().includes(searchValue) ||
        isbn.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        displayStatus.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalBorrowed = records.length;

  const currentlyBorrowed = records.filter(
    (record) => record.status === "Borrowed"
  ).length;

  const returnedBooks = records.filter(
    (record) => record.status === "Returned"
  ).length;

  const overdueBooks = records.filter(
    (record) => getDisplayStatus(record) === "Overdue"
  ).length;

  const cards = [
    {
      title: "Total Records",
      value: totalBorrowed,
      subtitle: "All borrowed books",
      icon: FiBookOpen,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Currently Borrowed",
      value: currentlyBorrowed,
      subtitle: "Books with you now",
      icon: FiClock,
      iconStyle: "bg-amber-100 text-amber-600",
    },
    {
      title: "Returned Books",
      value: returnedBooks,
      subtitle: "Successfully returned",
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Overdue Books",
      value: overdueBooks,
      subtitle: "Past the due date",
      icon: FiCalendar,
      iconStyle: "bg-red-100 text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Borrow History
        </span>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          My Books
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review your borrowed, returned, and overdue books.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({ title, value, subtitle, icon: Icon, iconStyle }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {title}
                  </p>

                  <strong className="mt-3 block text-3xl font-bold text-slate-900">
                    {value}
                  </strong>
                </div>

                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${iconStyle}`}
                >
                  <Icon />
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                {subtitle}
              </p>
            </article>
          )
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
            <FiSearch className="text-lg text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
           className="w-full md:w-56 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="all">All Statuses</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                  <FiBookOpen />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No books found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-[1050px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Book",
                    "Borrow Date",
                    "Due Date",
                    "Return Date",
                    "Status",
                    "Action",
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
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-emerald-50">
  {record.book?.coverImage ? (
    <img
      src={getBookCoverUrl(record.book.coverImage)}
      alt={`${record.book?.title || "Book"} cover`}
      className="h-full w-full object-contain bg-white"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling.style.display = "grid";
      }}
    />
  ) : null}

  <div
    className={`h-full w-full place-items-center text-xl text-emerald-600 ${
      record.book?.coverImage ? "hidden" : "grid"
    }`}
  >
    <FiBookOpen />
  </div>
</div>

                          <div>
                            <strong className="block text-sm text-slate-900">
                              {record.book?.title || "Unknown book"}
                            </strong>

                            <span className="mt-1 block text-xs text-slate-500">
                              {record.book?.author || "Unknown author"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.borrowDate
                          ? new Date(record.borrowDate).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.dueDate
                          ? new Date(record.dueDate).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.returnDate
                          ? new Date(record.returnDate).toLocaleDateString()
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
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(record)}
                          className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                          aria-label="View book details"
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {filteredRecords.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredRecords.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">{records.length}</strong>{" "}
            records
          </div>
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Borrow Details
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedRecord.book?.title || "Book Record"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
                aria-label="Close details"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6">
              <div className="mx-auto h-72 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50 shadow-lg">
  {selectedRecord.book?.coverImage ? (
    <img
      src={getBookCoverUrl(selectedRecord.book.coverImage)}
      alt={`${selectedRecord.book?.title || "Book"} cover`}
      className="h-full w-full bg-white object-contain p-2"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling.style.display = "grid";
      }}
    />
  ) : null}

  <div
    className={`h-full w-full place-items-center ${
      selectedRecord.book?.coverImage ? "hidden" : "grid"
    }`}
  >
    <FiBookOpen className="text-7xl text-emerald-600" />
  </div>
</div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Title", selectedRecord.book?.title || "—"],
                  ["Author", selectedRecord.book?.author || "—"],
                  ["ISBN", selectedRecord.book?.isbn || "—"],
                  ["Category", selectedRecord.book?.category || "—"],
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
        </div>
      )}
    </section>
  );
};

export default MyBooks;