import Book from "../models/Book.js";

// =======================
// Add New Book
// =======================

export const addBook = async (req, res) => {
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

    // Check required fields
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

    // Validate numbers
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
        message:
          "Available copies must be between 0 and total quantity",
      });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({
      isbn: isbn.trim(),
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    // Save uploaded cover path
    const coverImage = req.file
      ? `/uploads/books/${req.file.filename}`
      : "";

    // Create Book
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      quantity: totalQuantity,
      availableCopies: totalAvailableCopies,
      description: description?.trim() || "",
      coverImage,
    });

    res.status(201).json({
      success: true,
      message: "Book Added Successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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

      if (
        Number.isNaN(updatedQuantity) ||
        updatedQuantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }
    }

    if (
      availableCopies !== undefined &&
      availableCopies !== ""
    ) {
      updatedAvailableCopies = Number(availableCopies);

      if (
        Number.isNaN(updatedAvailableCopies) ||
        updatedAvailableCopies < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Available copies cannot be less than 0",
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

    // New image uploaded ho to cover update hoga
    // New image na ho to old cover safe rahega
    if (req.file) {
      book.coverImage = `/uploads/books/${req.file.filename}`;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);

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

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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

    await Book.findByIdAndDelete(id);

    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};