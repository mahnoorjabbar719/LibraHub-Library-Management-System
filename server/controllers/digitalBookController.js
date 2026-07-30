import fs from "fs/promises";

import DigitalBook from "../models/DigitalBook.js";
import cloudinary from "../config/cloudinary.js";

const removeLocalFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(
      "Temporary file removal error:",
      error.message
    );
  }
};

const uploadCoverToCloudinary = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "librahub/digital-books/covers",
    resource_type: "image",
    transformation: [
      {
        width: 800,
        height: 1100,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
};

const uploadPdfToCloudinary = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "librahub/digital-books/pdfs",
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
    format: "pdf",
  });
};

const deleteCloudinaryFile = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(
      "Cloudinary cleanup error:",
      error.message
    );
  }
};

// ===============================
// Get All Digital Books
// ===============================

export const getAllDigitalBooks = async (req, res) => {
  try {
    const books = await DigitalBook.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      totalBooks: books.length,
      books,
    });
  } catch (error) {
    console.error("Get digital books error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Add Digital Book
// ===============================

export const addDigitalBook = async (req, res) => {
  let uploadedCover = null;
  let uploadedPdf = null;

  const coverFile = req.files?.coverImage?.[0];
  const pdfFile = req.files?.pdf?.[0];

  try {
    const {
      title,
      author,
      category,
      description,
      pages,
      language,
      publisher,
      allowDownload,
    } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author and category are required",
      });
    }

    if (!pdfFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const totalPages =
      pages === undefined || pages === ""
        ? 0
        : Number(pages);

    if (
      Number.isNaN(totalPages) ||
      totalPages < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pages must be a valid positive number",
      });
    }

    let coverImage = "";
    let coverImagePublicId = "";

    if (coverFile) {
      uploadedCover =
        await uploadCoverToCloudinary(
          coverFile.path
        );

      coverImage = uploadedCover.secure_url;
      coverImagePublicId =
        uploadedCover.public_id;
    }

    uploadedPdf = await uploadPdfToCloudinary(
      pdfFile.path
    );

    const uploadedBy =
      req.user?._id || req.user?.id;

    const digitalBookData = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      description: description?.trim() || "",
      publisher: publisher?.trim() || "",
      language: language?.trim() || "English",
      pages: totalPages,

      coverImage,
      coverImagePublicId,

      pdfUrl: uploadedPdf.secure_url,
      pdfPublicId: uploadedPdf.public_id,

      allowDownload:
        allowDownload === true ||
        allowDownload === "true",
    };

    if (uploadedBy) {
      digitalBookData.uploadedBy =
        uploadedBy;
    }

    const book = await DigitalBook.create(
      digitalBookData
    );

    return res.status(201).json({
      success: true,
      message:
        "Digital Book Added Successfully",
      book,
    });
  } catch (error) {
    console.error(
      "Add digital book error:",
      error
    );

    await deleteCloudinaryFile(
      uploadedCover?.public_id,
      "image"
    );

    await deleteCloudinaryFile(
      uploadedPdf?.public_id,
      "image"
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add digital book",
    });
  } finally {
    await Promise.all([
      removeLocalFile(coverFile?.path),
      removeLocalFile(pdfFile?.path),
    ]);
  }
};
// ===============================
// Update Digital Book
// ===============================

export const updateDigitalBook = async (req, res) => {
  let uploadedCover = null;
  let uploadedPdf = null;

  const coverFile = req.files?.coverImage?.[0];
  const pdfFile = req.files?.pdf?.[0];

  try {
    const { id } = req.params;

    const book = await DigitalBook.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    const {
      title,
      author,
      category,
      description,
      pages,
      language,
      publisher,
      allowDownload,
    } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author and category are required",
      });
    }

    const totalPages =
      pages === undefined || pages === ""
        ? 0
        : Number(pages);

    if (
      Number.isNaN(totalPages) ||
      totalPages < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pages must be a valid positive number",
      });
    }

    // Replace Cover Image
    if (coverFile) {
      uploadedCover = await uploadCoverToCloudinary(
        coverFile.path
      );

      if (book.coverImagePublicId) {
        await deleteCloudinaryFile(
          book.coverImagePublicId,
          "image"
        );
      }

      book.coverImage = uploadedCover.secure_url;
      book.coverImagePublicId =
        uploadedCover.public_id;
    }

    // Replace PDF
    if (pdfFile) {
      uploadedPdf = await uploadPdfToCloudinary(
        pdfFile.path
      );

      if (book.pdfPublicId) {
        await deleteCloudinaryFile(
          book.pdfPublicId,
          "image"
        );
      }

      book.pdfUrl = uploadedPdf.secure_url;
      book.pdfPublicId =
        uploadedPdf.public_id;
    }

    book.title = title.trim();
    book.author = author.trim();
    book.category = category.trim();
    book.description = description?.trim() || "";
    book.publisher = publisher?.trim() || "";
    book.language = language?.trim() || "English";
    book.pages = totalPages;

    book.allowDownload =
      allowDownload === true ||
      allowDownload === "true";

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Digital Book Updated Successfully",
      book,
    });
  } catch (error) {
    console.error(
      "Update digital book error:",
      error
    );

    await deleteCloudinaryFile(
      uploadedCover?.public_id,
      "image"
    );

    await deleteCloudinaryFile(
      uploadedPdf?.public_id,
      "image"
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update digital book",
    });
  } finally {
    await Promise.all([
      removeLocalFile(coverFile?.path),
      removeLocalFile(pdfFile?.path),
    ]);
  }
};
// ===============================
// Delete Digital Book
// ===============================

export const deleteDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await DigitalBook.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    await Promise.all([
      deleteCloudinaryFile(
        book.coverImagePublicId,
        "image"
      ),
      deleteCloudinaryFile(
        book.pdfPublicId,
        "image"
      ),
    ]);

    await DigitalBook.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Digital Book Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "Delete digital book error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete digital book",
    });
  }
};