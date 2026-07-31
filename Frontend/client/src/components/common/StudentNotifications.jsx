import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiX,
} from "react-icons/fi";
import { getMyBorrowedBooks } from "../../services/borrowService";

const StudentNotifications = ({ onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getMyBorrowedBooks();
        setRecords(data.borrowedBooks || []);
      } catch (error) {
        console.error("Student notification error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const notifications = useMemo(() => {
    const today = new Date();

    return records
      .map((record) => {
        const dueDate = record.dueDate
          ? new Date(record.dueDate)
          : null;

        const daysLeft = dueDate
          ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
          : null;

        if (
          record.status !== "Returned" &&
          dueDate &&
          dueDate < today
        ) {
          return {
            id: `overdue-${record._id}`,
            type: "overdue",
            title: "Book overdue",
            message: `${record.book?.title || "Your book"} is overdue.`,
          };
        }

        if (
          record.status !== "Returned" &&
          daysLeft !== null &&
          daysLeft >= 0 &&
          daysLeft <= 3
        ) {
          return {
            id: `due-${record._id}`,
            type: "due",
            title: "Due soon",
            message: `${record.book?.title || "Your book"} is due in ${
              daysLeft === 0 ? "today" : `${daysLeft} day(s)`
            }.`,
          };
        }

        if (record.status === "Returned") {
          return {
            id: `returned-${record._id}`,
            type: "returned",
            title: "Book returned",
            message: `${record.book?.title || "A book"} was returned successfully.`,
          };
        }

        return {
          id: `borrowed-${record._id}`,
          type: "borrowed",
          title: "Book borrowed",
          message: `${record.book?.title || "A book"} is currently borrowed.`,
        };
      })
      .slice(0, 8);
  }, [records]);

  const getIconData = (type) => {
    if (type === "overdue") {
      return {
        icon: FiAlertTriangle,
        classes: "bg-red-100 text-red-600",
      };
    }

    if (type === "due") {
      return {
        icon: FiClock,
        classes: "bg-amber-100 text-amber-600",
      };
    }

    if (type === "returned") {
      return {
        icon: FiCheckCircle,
        classes: "bg-emerald-100 text-emerald-600",
      };
    }

    return {
      icon: FiBookOpen,
      classes: "bg-blue-100 text-blue-600",
    };
  };

  return createPortal(
    <div className="fixed left-3 right-3 top-20 z-[9999] max-h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:left-auto sm:right-6 sm:w-[390px]">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">Notifications</h3>
          <p className="mt-1 text-xs text-slate-500">
            Your recent library activity
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Close notifications"
        >
          <FiX />
        </button>
      </div>

      <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto">
        {loading ? (
          <div className="grid min-h-48 place-items-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="grid min-h-48 place-items-center p-6 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
                <FiCheckCircle />
              </div>

              <h4 className="mt-4 font-bold text-slate-900">
                No notifications
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                You have no recent library updates.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const {
                icon: Icon,
                classes,
              } = getIconData(notification.type);

              return (
                <div
                  key={notification.id}
                  className="flex gap-3 px-4 py-4 transition hover:bg-slate-50"
                >
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${classes}`}
                  >
                    <Icon />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {notification.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 break-words text-slate-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default StudentNotifications;