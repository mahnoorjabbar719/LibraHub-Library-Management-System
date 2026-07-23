import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiBookOpen,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiPrinter,
  FiRepeat,
  FiUsers,
} from "react-icons/fi";
import Swal from "sweetalert2";
import API from "../../services/api";

const Reports = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        const [booksResponse, usersResponse, borrowResponse] =
          await Promise.all([
            API.get("/books"),
            API.get("/users"),
            API.get("/borrow"),
          ]);

        setBooks(booksResponse.data.books || []);
        setUsers(usersResponse.data.users || []);
        setBorrowRecords(borrowResponse.data.borrowRecords || []);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load reports",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading reports.",
          confirmButtonColor: "#059669",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  );

  const availableCopies = books.reduce(
    (total, book) => total + Number(book.availableCopies || 0),
    0
  );

  const returnedCount = borrowRecords.filter(
    (record) => record.status === "Returned"
  ).length;

  const borrowedCount = borrowRecords.filter(
    (record) => record.status === "Borrowed"
  ).length;

  const overdueCount = borrowRecords.filter((record) => {
    if (record.status === "Returned" || !record.dueDate) {
      return false;
    }

    return new Date(record.dueDate) < new Date();
  }).length;

  const categoryData = useMemo(() => {
    const categoryMap = books.reduce((result, book) => {
      const category = book.category || "Uncategorized";

      result[category] = (result[category] || 0) + 1;

      return result;
    }, {});

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [books]);

  const circulationData = [
    {
      name: "Borrowed",
      value: borrowedCount,
    },
    {
      name: "Returned",
      value: returnedCount,
    },
    {
      name: "Overdue",
      value: overdueCount,
    },
  ];

  const userRoleData = [
    {
      role: "Students",
      total: users.filter((user) => user.role === "student").length,
    },
    {
      role: "Librarians",
      total: users.filter((user) => user.role === "librarian").length,
    },
    {
      role: "Admins",
      total: users.filter((user) => user.role === "admin").length,
    },
  ];

  const colors = ["#059669", "#2563EB", "#F59E0B", "#7C3AED", "#DC2626"];

  const summaryCards = [
    {
      title: "Total Books",
      value: books.length,
      subtitle: `${totalCopies} total copies`,
      icon: FiBookOpen,
      classes: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Users",
      value: users.length,
      subtitle: "Registered accounts",
      icon: FiUsers,
      classes: "bg-violet-100 text-violet-600",
    },
    {
      title: "Borrowed Books",
      value: borrowedCount,
      subtitle: "Currently issued",
      icon: FiRepeat,
      classes: "bg-blue-100 text-blue-600",
    },
    {
      title: "Available Copies",
      value: availableCopies,
      subtitle: "Ready to borrow",
      icon: FiCheckCircle,
      classes: "bg-amber-100 text-amber-600",
    },
  ];
  const exportToExcel = () => {
  const reportRows = borrowRecords.map((record) => ({
    Student: record.user?.name || "Unknown",
    Email: record.user?.email || "—",
    Book: record.book?.title || "Unknown",
    Author: record.book?.author || "—",
    ISBN: record.book?.isbn || "—",
    "Borrow Date": record.borrowDate
      ? new Date(record.borrowDate).toLocaleDateString()
      : "—",
    "Due Date": record.dueDate
      ? new Date(record.dueDate).toLocaleDateString()
      : "—",
    "Return Date": record.returnDate
      ? new Date(record.returnDate).toLocaleDateString()
      : "—",
    Status:
      record.status !== "Returned" &&
      record.dueDate &&
      new Date(record.dueDate) < new Date()
        ? "Overdue"
        : record.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(reportRows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Borrow Records"
  );

  XLSX.writeFile(
    workbook,
    `LibraHub-Report-${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`
  );
};
const exportToPDF = () => {
  const document = new jsPDF({
    orientation: "landscape",
  });

  document.setFontSize(18);
  document.text("LibraHub Library Report", 14, 18);

  document.setFontSize(10);
  document.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  autoTable(document, {
    startY: 32,
    head: [
      [
        "Student",
        "Book",
        "Borrow Date",
        "Due Date",
        "Return Date",
        "Status",
      ],
    ],
    body: borrowRecords.map((record) => {
      const isOverdue =
        record.status !== "Returned" &&
        record.dueDate &&
        new Date(record.dueDate) < new Date();

      return [
        record.user?.name || "Unknown",
        record.book?.title || "Unknown",
        record.borrowDate
          ? new Date(record.borrowDate).toLocaleDateString()
          : "—",
        record.dueDate
          ? new Date(record.dueDate).toLocaleDateString()
          : "—",
        record.returnDate
          ? new Date(record.returnDate).toLocaleDateString()
          : "—",
        isOverdue ? "Overdue" : record.status,
      ];
    }),
  });

  document.save(
    `LibraHub-Report-${new Date()
      .toISOString()
      .split("T")[0]}.pdf`
  );
};
const printReport = () => {
  window.print();
};

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
  <div>
    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
      Analytics & Insights
    </span>

    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
      Reports
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Review library collection, users, and borrowing activity.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
   <div className="flex flex-wrap gap-3 print:hidden">
  <button
    type="button"
    onClick={exportToExcel}
    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
  >
    <FiDownload />
    Export Excel
  </button>

  <button
    type="button"
    onClick={exportToPDF}
    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
  >
    <FiFileText />
    Export PDF
  </button>

  <button
    type="button"
    onClick={printReport}
    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
  >
    <FiPrinter />
    Print
  </button>
</div>
  </div>
</div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(
          ({ title, value, subtitle, icon: Icon, classes }) => (
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
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${classes}`}
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

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Books by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of books across library categories.
            </p>
          </div>

          <div className="mt-6 h-[340px]">
            {categoryData.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-slate-500">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={55}
                    paddingAngle={4}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Users by Role
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registered students, librarians, and administrators.
            </p>
          </div>

          <div className="mt-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="role" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#059669"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Circulation Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current borrowing, returns, and overdue activity.
            </p>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={circulationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#2563EB"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Collection Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quick overview of book inventory.
          </p>

          <div className="mt-6 space-y-4">
            {[
              ["Book Titles", books.length],
              ["Total Copies", totalCopies],
              ["Available Copies", availableCopies],
              ["Issued Copies", Math.max(totalCopies - availableCopies, 0)],
              ["Categories", categoryData.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
              >
                <span className="text-sm font-medium text-slate-600">
                  {label}
                </span>

                <strong className="text-lg text-slate-900">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Reports;