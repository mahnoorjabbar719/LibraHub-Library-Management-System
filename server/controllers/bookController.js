import fs from "fs/promises";
import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";
const removeLocalFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Temporary file removal error:", error.message);
  }
};

const uploadCoverToCloudinary = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "librahub/books",
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

export const addBook = async (req, res) => {
  let uploadedCover = null;

  try {
    const {
      title,
      author,
      isbn,
      category,
      quantity,
      availableCopies,
      description,
    } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !isbn?.trim() ||
      !category?.trim() ||
      quantity === undefined ||
      quantity === "" ||
      availableCopies === undefined ||
      availableCopies === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const totalQuantity = Number(quantity);
    const totalAvailableCopies = Number(availableCopies);

    if (Number.isNaN(totalQuantity) || totalQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (
      Number.isNaN(totalAvailableCopies) ||
      totalAvailableCopies < 0 ||
      totalAvailableCopies > totalQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Available copies must be between 0 and total quantity",
      });
    }

    const existingBook = await Book.findOne({
      isbn: isbn.trim(),
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    let coverImage = "";
    let coverImagePublicId = "";

    if (req.file) {
      uploadedCover = await uploadCoverToCloudinary(req.file.path);

      coverImage = uploadedCover.secure_url;
      coverImagePublicId = uploadedCover.public_id;
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      quantity: totalQuantity,
      availableCopies: totalAvailableCopies,
      description: description?.trim() || "",
      coverImage,
      coverImagePublicId,
    });

    return res.status(201).json({
      success: true,
      message: "Book Added Successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error);

    // Cloudinary par upload ho gayi lekin database save fail hua
    if (uploadedCover?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedCover.public_id);
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary cleanup error:",
          cloudinaryError.message
        );
      }
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  } finally {
    await removeLocalFile(req.file?.path);
  }
};

// =======================
// Get All Books
// =======================

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      totalBooks: books.length,
      books,
    });
  } catch (error) {
    console.error("Get all books error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Get Single Book
// =======================

export const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get single book error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================
// Update Book
// =======================

export const updateBook = async (req, res) => {
  let newUploadedCover = null;

  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const {
      title,
      author,
      isbn,
      category,
      quantity,
      availableCopies,
      description,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      book.title = title.trim();
    }

    if (author !== undefined) {
      if (!author.trim()) {
        return res.status(400).json({
          success: false,
          message: "Author cannot be empty",
        });
      }

      book.author = author.trim();
    }

    if (isbn !== undefined) {
      if (!isbn.trim()) {
        return res.status(400).json({
          success: false,
          message: "ISBN cannot be empty",
        });
      }

      const existingBook = await Book.findOne({
        isbn: isbn.trim(),
        _id: { $ne: id },
      });

      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: "Book with this ISBN already exists",
        });
      }

      book.isbn = isbn.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }

      book.category = category.trim();
    }

    let updatedQuantity = book.quantity;
    let updatedAvailableCopies = book.availableCopies;

    if (quantity !== undefined && quantity !== "") {
      updatedQuantity = Number(quantity);

      if (Number.isNaN(updatedQuantity) || updatedQuantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }
    }

    if (availableCopies !== undefined && availableCopies !== "") {
      updatedAvailableCopies = Number(availableCopies);

      if (
        Number.isNaN(updatedAvailableCopies) ||
        updatedAvailableCopies < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Available copies cannot be less than 0",
        });
      }
    }

    if (updatedAvailableCopies > updatedQuantity) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies cannot be greater than total quantity",
      });
    }

    book.quantity = updatedQuantity;
    book.availableCopies = updatedAvailableCopies;

    if (description !== undefined) {
      book.description = description.trim();
    }

    const oldPublicId = book.coverImagePublicId;

    if (req.file) {
      newUploadedCover = await uploadCoverToCloudinary(req.file.path);

      book.coverImage = newUploadedCover.secure_url;
      book.coverImagePublicId = newUploadedCover.public_id;
    }

    await book.save();

    // New image successfully save hone ke baad old Cloudinary image delete
    if (
      req.file &&
      oldPublicId &&
      oldPublicId !== book.coverImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (cloudinaryError) {
        console.error(
          "Old Cloudinary image deletion error:",
          cloudinaryError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);

    // New image uploaded but database update failed
    if (newUploadedCover?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          newUploadedCover.public_id
        );
      } catch (cloudinaryError) {
        console.error(
          "New Cloudinary image cleanup error:",
          cloudinaryError.message
        );
      }
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  } finally {
    await removeLocalFile(req.file?.path);
  }
};

// =======================
// Delete Book
// =======================

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          book.coverImagePublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete error:",
          cloudinaryError.message
        );
      }
    }

    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};