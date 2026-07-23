import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import API from "../../services/api";

const AdminNotifications = ({ onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await API.get("/borrow");
        setRecords(response.data.borrowRecords || []);
      } catch (error) {
        console.error("Notification error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const notifications = useMemo(() => {
    const currentDate = new Date();

    const overdue = records
      .filter(
        (record) =>
          record.status !== "Returned" &&
          record.dueDate &&
          new Date(record.dueDate) < currentDate
      )
      .map((record) => ({
        id: `overdue-${record._id}`,
        title: "Overdue book",
        message: `${record.user?.name || "A student"} has not returned ${
          record.book?.title || "a book"
        }.`,
        type: "overdue",
      }));

    const borrowed = records
      .filter((record) => record.status === "Borrowed")
      .slice(0, 4)
      .map((record) => ({
        id: `borrowed-${record._id}`,
        title: "Book currently borrowed",
        message: `${record.user?.name || "A student"} borrowed ${
          record.book?.title || "a book"
        }.`,
        type: "borrowed",
      }));

    const returned = records
      .filter((record) => record.status === "Returned")
      .slice(0, 3)
      .map((record) => ({
        id: `returned-${record._id}`,
        title: "Book returned",
        message: `${record.book?.title || "A book"} was returned successfully.`,
        type: "returned",
      }));

    return [...overdue, ...borrowed, ...returned].slice(0, 8);
  }, [records]);

  const getIcon = (type) => {
    if (type === "overdue") {
      return {
        icon: FiAlertTriangle,
        classes: "bg-red-100 text-red-600",
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
      classes: "bg-amber-100 text-amber-600",
    };
  };

  return (
    <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:w-[390px]">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">Notifications</h3>

          <p className="mt-1 text-xs text-slate-500">
            Recent library activity
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

      <div className="max-h-[420px] overflow-y-auto">
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
                All caught up
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                There are no recent notifications.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const {
                icon: Icon,
                classes,
              } = getIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className="flex gap-3 px-5 py-4 transition hover:bg-slate-50"
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${classes}`}
                  >
                    <Icon />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {notification.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;