import {
  FiBookOpen,
  FiDownload,
  FiEdit2,
  FiFileText,
  FiGlobe,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DigitalBookCard = ({
  book,
  onEdit,
  onDelete,
  deletingId,
  isAdmin = false,
  portal = "admin",
}) => {
  const coverUrl =
    book.coverImage?.url ||
    book.coverImage ||
    "";

  const pdfUrl =
    book.pdf?.url ||
    book.pdfUrl ||
    book.pdf ||
    "";

  const openPdf = () => {
    if (!pdfUrl) return;

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = () => {
    if (!pdfUrl || book.allowDownload === false) return;

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };
const navigate = useNavigate();
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Cover section */}
      <div className="relative flex h-56 sm:h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4">
        <div className="h-full w-[170px] overflow-hidden rounded-lg bg-white shadow-md">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`${book.title || "Digital book"} cover`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-emerald-50">
              <div className="text-center">
                <FiBookOpen className="mx-auto text-5xl text-emerald-600" />

                <p className="mt-3 px-3 text-xs font-semibold text-slate-500">
                  No cover available
                </p>
              </div>
            </div>
          )}
        </div>

        <span className="absolute right-12 top-4 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-red-600 shadow-sm">
          <FiFileText />
          PDF
        </span>

        <button
          type="button"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="More options"
        >
          <FiMoreVertical />
        </button>
      </div>

      {/* Book details */}
      <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
        <h2
          className="truncate text-base font-bold text-slate-900"
          title={book.title}
        >
          {book.title || "Untitled Book"}
        </h2>

        <p
          className="mt-1 truncate text-sm font-medium text-emerald-600"
          title={book.author}
        >
          {book.author || "Unknown Author"}
        </p>

        {book.category && (
          <div className="mt-3">
            <span className="inline-flex max-w-full truncate rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              {book.category}
            </span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          {book.language && (
            <span className="inline-flex items-center gap-1.5">
              <FiGlobe />
              {book.language}
            </span>
          )}

          {book.pages && (
            <span className="inline-flex items-center gap-1.5">
              <FiBookOpen />
              {book.pages} pages
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-4">
         <button
  type="button"
  onClick={() =>
  navigate(`/${portal}/digital-library/${book._id}`)
}
  className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-emerald-700"
>
  <FiBookOpen />
  Details
</button>

          <button
            type="button"
            onClick={downloadPdf}
            disabled={!pdfUrl || book.allowDownload === false}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload />
            Download
          </button>

  
         {isAdmin && (
  <>
    <button
      type="button"
      onClick={() => onEdit?.(book)}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
      aria-label={`Edit ${book.title}`}
      title="Edit book"
    >
      <FiEdit2 />
    </button>

    <button
      type="button"
      onClick={() => onDelete?.(book)}
      disabled={deletingId === book._id}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={`Delete ${book.title}`}
      title="Delete book"
    >
      {deletingId === book._id ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
      ) : (
        <FiTrash2 />
      )}
    </button>
  </>
)}

        </div>
      </div>
    </article>
  );
};

export default DigitalBookCard;