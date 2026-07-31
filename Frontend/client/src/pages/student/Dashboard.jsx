import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import { getMyBorrowedBooks } from "../../services/borrowService";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyBooks = async () => {
      try {
        setLoading(true);

        const data = await getMyBorrowedBooks();

        setRecords(data.borrowedBooks || []);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load dashboard",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading your books.",
          confirmButtonColor: "#059669",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMyBooks();
  }, []);

  const currentDate = new Date();

  const borrowedCount = records.filter(
    (record) => record.status === "Borrowed"
  ).length;

  const returnedCount = records.filter(
    (record) => record.status === "Returned"
  ).length;

  const dueSoonCount = records.filter((record) => {
    if (record.status === "Returned" || !record.dueDate) {
      return false;
    }

    const dueDate = new Date(record.dueDate);
    const difference = dueDate - currentDate;
    const daysLeft = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return daysLeft >= 0 && daysLeft <= 3;
  }).length;

  const recentRecords = useMemo(
    () => records.slice(0, 5),
    [records]
  );

  const cards = [
    {
      title: "Total Borrowed",
      value: records.length,
      subtitle: "All borrowing records",
      icon: FiBookOpen,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Currently Borrowed",
      value: borrowedCount,
      subtitle: "Books with you now",
      icon: FiClock,
      iconStyle: "bg-amber-100 text-amber-600",
    },
    {
      title: "Returned Books",
      value: returnedCount,
      subtitle: "Successfully returned",
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Due Soon",
      value: dueSoonCount,
      subtitle: "Due within 3 days",
      icon: FiClock,
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
    <section className="space-y-7">
      {/* Welcome section */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Student Dashboard
          </span>

      <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "Student"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your borrowed books and explore the library
            collection.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/student/search-books")}
           className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <FiSearch />
            Search Books
          </button>

          <button
            type="button"
            onClick={() => navigate("/student/my-books")}
           className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <FiBookOpen />
            My Books
          </button>
        </div>
      </div>

      {/* Statistics cards */}
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

      {/* Extra student modules */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Digital Library */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Digital Library
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Read Anywhere
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse ebooks, PDFs and digital learning
                resources.
              </p>
            </div>

            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-2xl text-violet-600">
              <FiBookOpen />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/student/digital-library")
            }
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Open Digital Library
          </button>
        </article>

        {/* Due Reminder */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Due Reminder
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {dueSoonCount}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {dueSoonCount === 0
                  ? "You have no books due within the next 3 days."
                  : `${dueSoonCount} ${
                      dueSoonCount === 1 ? "book is" : "books are"
                    } due within 3 days.`}
              </p>
            </div>

            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-2xl text-amber-600">
              <FiCalendar />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/my-books")}
            className="mt-6 w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
          >
            View Borrowed Books
          </button>
        </article>

        {/* Quick Actions */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access important student features.
          </p>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() =>
                navigate("/student/search-books")
              }
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <FiSearch className="text-lg" />
              Search Books
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/student/digital-library")
              }
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <FiBookOpen className="text-lg" />
              Digital Library
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/my-books")}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <FiBook className="text-lg" />
              My Books
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/profile")}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FiUser className="text-lg" />
              My Profile
            </button>
          </div>
        </article>
      </div>

      {/* Recent Borrow Activity */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Borrow Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest borrowed and returned books.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/my-books")}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentRecords.length === 0 ? (
            <div className="grid min-h-64 place-items-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                  <FiBookOpen />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No borrowed books yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Search the library and borrow your first book.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-[900px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Book",
                    "Borrow Date",
                    "Due Date",
                    "Return Date",
                    "Status",
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
                {recentRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <strong className="block text-sm text-slate-900">
                          {record.book?.title || "Unknown book"}
                        </strong>

                        <span className="mt-1 block text-xs text-slate-500">
                          {record.book?.author ||
                            "Unknown author"}
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          record.status === "Returned"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;