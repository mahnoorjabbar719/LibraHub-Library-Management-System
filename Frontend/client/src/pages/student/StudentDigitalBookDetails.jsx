import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiGlobe,
  FiTag,
  FiUser,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { getAllDigitalBooks } from "../../services/digitalBookService";

const StudentDigitalBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);

        const data = await getAllDigitalBooks();

        const selectedBook = data.books?.find(
          (item) => item._id === id
        );

        if (!selectedBook) {
          await Swal.fire({
            icon: "error",
            title: "Book not found",
            text: "The selected digital book could not be found.",
            confirmButtonColor: "#059669",
          });

          navigate("/student/digital-library");
          return;
        }

        setBook(selectedBook);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Unable to load book",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading the book.",
          confirmButtonColor: "#059669",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);

  const coverUrl = useMemo(() => {
    return book?.coverImage?.url || book?.coverImage || "";
  }, [book]);

  const pdfUrl = useMemo(() => {
    return book?.pdf?.url || book?.pdfUrl || book?.pdf || "";
  }, [book]);

  const handleRead = () => {
    if (!pdfUrl) {
      Swal.fire({
        icon: "warning",
        title: "PDF not available",
        text: "This book does not have a PDF file.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!pdfUrl) {
      Swal.fire({
        icon: "warning",
        title: "PDF not available",
        text: "This book does not have a downloadable PDF.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (book.allowDownload === false) {
      Swal.fire({
        icon: "info",
        title: "Download disabled",
        text: "The administrator has disabled downloading for this book.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.target = "_blank";
    downloadLink.rel = "noopener noreferrer";
    downloadLink.download = `${book.title || "digital-book"}.pdf`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center rounded-3xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading book details...
          </p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <section className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/student/digital-library")}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <FiArrowLeft />
        Back to Digital Library
      </button>

      {/* Book details */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[360px_1fr]">
          {/* Cover */}
          <div className="flex min-h-[500px] items-center justify-center bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-8">
            <div className="w-full max-w-[260px] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-300/70">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={`${book.title || "Digital book"} cover`}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[3/4] w-full place-items-center bg-emerald-50">
                  <div className="text-center">
                    <FiBookOpen className="mx-auto text-6xl text-emerald-600" />

                    <p className="mt-4 px-4 text-sm font-bold text-slate-500">
                      No cover available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col p-7 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                <FiFileText />
                Digital Book
              </span>

              {book.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700">
                  <FiTag />
                  {book.category}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {book.title || "Untitled Book"}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-emerald-600">
              <FiUser />
              {book.author || "Unknown Author"}
            </p>

            {/* Information cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
                    <FiGlobe />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Language
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {book.language || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
                    <FiFileText />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total Pages
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {book.pages || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                    <FiCalendar />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Added On
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {book.publisher && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-500">
                  Publisher
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {book.publisher}
                </p>
              </div>
            )}

            <div className="mt-7">
              <h2 className="text-lg font-bold text-slate-900">
                About this book
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {book.description ||
                  "No description is available for this digital book."}
              </p>
            </div>

            {/* Student actions */}
            <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row">
              <button
                type="button"
                onClick={handleRead}
                disabled={!pdfUrl}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiBookOpen className="text-lg" />
                Read Book
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!pdfUrl || book.allowDownload === false}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiDownload className="text-lg" />

                {book.allowDownload === false
                  ? "Download Disabled"
                  : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDigitalBookDetails;