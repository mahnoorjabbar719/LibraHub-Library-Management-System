import { useEffect, useState } from "react";
import {
  FiFileText,
  FiImage,
  FiPlus,
  FiUpload,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  addDigitalBook,
  updateDigitalBook,
} from "../../services/digitalBookService";

const initialForm = {
  title: "",
  author: "",
  category: "",
  language: "English",
  pages: "",
  publisher: "",
  description: "",
  allowDownload: true,
};

const AddDigitalBookModal = ({
  isOpen,
  editingBook,
  onClose,
  onBookAdded,
  onBookUpdated,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setFormData(initialForm);
    setCoverFile(null);
    setCoverPreview("");
    setPdfFile(null);
    setUploadProgress(0);
  };

  const closeModal = () => {
    if (saving) return;

    resetForm();
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editingBook) {
      setFormData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        category: editingBook.category || "",
        language: editingBook.language || "English",
        pages: editingBook.pages ?? "",
        publisher: editingBook.publisher || "",
        description: editingBook.description || "",
        allowDownload: editingBook.allowDownload !== false,
      });

      setCoverPreview(
        editingBook.coverImage?.url ||
          editingBook.coverImage ||
          ""
      );

      setCoverFile(null);
      setPdfFile(null);
      setUploadProgress(0);
    } else {
      resetForm();
    }
  }, [isOpen, editingBook]);

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, saving]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";

      await Swal.fire({
        icon: "warning",
        title: "Invalid cover image",
        text: "Please select a JPG, PNG or WEBP image.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";

      await Swal.fire({
        icon: "warning",
        title: "Cover image too large",
        text: "The cover image must be 5 MB or smaller.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handlePdfChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      event.target.value = "";

      await Swal.fire({
        icon: "warning",
        title: "Invalid PDF file",
        text: "Please select a valid PDF document.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      event.target.value = "";

      await Swal.fire({
        icon: "warning",
        title: "PDF file too large",
        text: "The PDF must be 25 MB or smaller.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    setPdfFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const author = formData.author.trim();
    const category = formData.category.trim();
    const language = formData.language.trim();

    if (!title || !author || !category || !language) {
      await Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (!editingBook && !coverFile) {
      await Swal.fire({
        icon: "warning",
        title: "Cover image required",
        text: "Please select a cover image.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (!editingBook && !pdfFile) {
      await Swal.fire({
        icon: "warning",
        title: "PDF required",
        text: "Please select the digital book PDF.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    if (
      formData.pages !== "" &&
      (Number.isNaN(Number(formData.pages)) ||
        Number(formData.pages) < 1)
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid page count",
        text: "Page count must be at least 1.",
        confirmButtonColor: "#059669",
      });

      return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);

      const payload = new FormData();

      payload.append("title", title);
      payload.append("author", author);
      payload.append("category", category);
      payload.append("language", language);
      payload.append("publisher", formData.publisher.trim());
      payload.append("description", formData.description.trim());
      payload.append(
        "allowDownload",
        String(formData.allowDownload)
      );

      if (formData.pages !== "") {
        payload.append("pages", String(Number(formData.pages)));
      }

      if (coverFile) {
        payload.append("coverImage", coverFile);
      }

      if (pdfFile) {
        payload.append("pdf", pdfFile);
      }

      let data;

      if (editingBook) {
        data = await updateDigitalBook(
          editingBook._id,
          payload
        );

        onBookUpdated?.(data.book);
      } else {
        data = await addDigitalBook(
          payload,
          setUploadProgress
        );

        onBookAdded?.(data.book);
      }

      resetForm();
      onClose?.();

      await Swal.fire({
        icon: "success",
        title: editingBook
          ? "Digital book updated"
          : "Digital book added",
        text: editingBook
          ? "The digital book was updated successfully."
          : "The digital book was uploaded successfully.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("DIGITAL BOOK ERROR:", error);
      console.error("RESPONSE DATA:", error.response?.data);
      console.error("STATUS:", error.response?.status);
      console.error("REQUEST URL:", error.config?.url);

      await Swal.fire({
        icon: "error",
        title: editingBook
          ? "Update failed"
          : "Upload failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/20 bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Digital Collection
            </span>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {editingBook
                ? "Edit Digital Book"
                : "Add Digital Book"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingBook
                ? "Update the selected digital book details."
                : "Upload the cover, PDF and complete book details."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50"
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-5">
              <label className="mb-4 block text-sm font-bold text-slate-700">
                Cover Image
                {!editingBook && (
                  <span className="text-red-500"> *</span>
                )}
              </label>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-48 w-36 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white text-4xl text-emerald-600 shadow-sm">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Digital book cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiImage />
                  )}
                </div>

                <div className="flex-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
                    <FiUpload />
                    {editingBook
                      ? "Change Cover"
                      : "Choose Cover"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    JPG, PNG or WEBP. Maximum size 5 MB.
                  </p>

                  {coverFile && (
                    <p className="mt-2 break-all text-xs font-semibold text-emerald-700">
                      {coverFile.name}
                    </p>
                  )}

                  {editingBook && !coverFile && coverPreview && (
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Current cover will be kept.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-5">
              <label className="mb-4 block text-sm font-bold text-slate-700">
                PDF Document
                {!editingBook && (
                  <span className="text-red-500"> *</span>
                )}
              </label>

              <div className="grid min-h-48 place-items-center rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                    <FiFileText />
                  </div>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    <FiUpload />
                    {editingBook
                      ? "Change PDF"
                      : "Choose PDF"}

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-3 text-xs text-slate-500">
                    PDF only. Maximum size 25 MB.
                  </p>

                  {pdfFile && (
                    <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3">
                      <p className="break-all text-xs font-bold text-blue-700">
                        {pdfFile.name}
                      </p>

                      <p className="mt-1 text-xs text-blue-500">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  {editingBook && !pdfFile && (
                    <p className="mt-4 text-xs font-semibold text-slate-500">
                      Current PDF will be kept.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Book Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter digital book title"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Author <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Programming, Science, History..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Language <span className="text-red-500">*</span>
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Total Pages
              </label>

              <input
                type="number"
                min="1"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                placeholder="Enter total pages"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Publisher
              </label>

              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Write a short description about the digital book..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              name="allowDownload"
              checked={formData.allowDownload}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-emerald-600"
            />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Allow PDF download
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Users will be able to download this PDF. Disable it to make
                the book read-only.
              </p>
            </div>
          </label>

          {saving && !editingBook && uploadProgress > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Uploading PDF and cover</span>
                <span>{uploadProgress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                  {editingBook
                    ? "Updating Book..."
                    : uploadProgress > 0 && uploadProgress < 100
                      ? `Uploading... ${uploadProgress}%`
                      : "Processing Book..."}
                </>
              ) : (
                <>
                  <FiPlus />

                  {editingBook
                    ? "Update Digital Book"
                    : "Save Digital Book"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDigitalBookModal;