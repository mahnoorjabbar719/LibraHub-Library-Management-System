import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiCheckCircle,
  FiRepeat,
  FiUsers,
} from "react-icons/fi";
import API from "../../services/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalBorrowedBooks: 0,
    availableBooks: 0,
  });
  const navigate = useNavigate();
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardResponse, borrowResponse] = await Promise.all([
          API.get("/dashboard/admin"),
          API.get("/borrow"),
        ]);

        setDashboard(dashboardResponse.data.dashboard);
        setBorrowRecords(
          (borrowResponse.data.borrowRecords || []).slice(0, 5)
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Books",
      value: dashboard.totalBooks,
      subtitle: "Books in the library",
      icon: FiBookOpen,
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      subtitle: "Registered accounts",
      icon: FiUsers,
      iconStyle: "bg-violet-100 text-violet-600",
    },
    {
      title: "Borrowed Books",
      value: dashboard.totalBorrowedBooks,
      subtitle: "Currently issued",
      icon: FiRepeat,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Available Books",
      value: dashboard.availableBooks,
      subtitle: "Ready to borrow",
      icon: FiCheckCircle,
      iconStyle: "bg-amber-100 text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  return (
   <section className="space-y-5 sm:space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Overview
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Library Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor books, users, and borrowing activity.
          </p>
        </div>

       <button
  type="button"
  onClick={() => navigate("/admin/books?add=true")}
  className="w-full sm:w-auto rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
>
  + Add New Book
</button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, subtitle, icon: Icon, iconStyle }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>

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
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Borrow Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest borrowing and return activity.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          {borrowRecords.length === 0 ? (
            <div className="grid min-h-56 place-items-center p-8 text-sm text-slate-500">
              No borrow records found.
            </div>
          ) : (
            <table className="min-w-[850px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Student",
                    "Book",
                    "Borrow Date",
                    "Due Date",
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
                {borrowRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <strong className="text-sm text-slate-900">
                          {record.user?.name || "Unknown user"}
                        </strong>

                        <p className="mt-1 text-xs text-slate-500">
                          {record.user?.email || "No email"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {record.book?.title || "Unknown book"}
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

export default Dashboard;