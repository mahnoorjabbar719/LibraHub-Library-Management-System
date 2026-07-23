import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

// =======================
// Borrow Book
// =======================

export const borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    // Check required fields
    if (!bookId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Book ID and Due Date are required",
      });
    }

    // Find Book
    const book = await Book.findById(bookId);
    console.log("Book ID received:", bookId);
    console.log("Book found:", book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    // Create Borrow Record
    const borrow = await Borrow.create({
      user: req.user.id,
      book: bookId,
      dueDate,
    });

    // Reduce available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book Borrowed Successfully",
      borrow,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Issue Book By Admin
// =======================

export const issueBookByAdmin = async (req, res) => {
  try {
    const { userId, bookId, dueDate } = req.body;

    if (!userId || !bookId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Student, book, and due date are required",
      });
    }

    const selectedDueDate = new Date(dueDate);

    if (
      Number.isNaN(selectedDueDate.getTime()) ||
      selectedDueDate <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Due date must be after today",
      });
    }

    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "The selected user is not a student",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: "Borrowed",
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: "This student has already borrowed this book",
      });
    }

    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      dueDate: selectedDueDate,
      status: "Borrowed",
    });

    book.availableCopies -= 1;
    await book.save();

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("user", "name email role")
      .populate(
        "book",
        "title author isbn category coverImage quantity availableCopies"
      );

    res.status(201).json({
      success: true,
      message: "Book Issued Successfully",
      borrow: populatedBorrow,
    });
  } catch (error) {
    console.error("Admin issue book error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student or book ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Return Book
// =======================

export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    // Find Borrow Record
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    // Check if already returned
    if (borrow.status === "Returned") {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    // Find Book
    const book = await Book.findById(borrow.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update Borrow Record
    borrow.status = "Returned";
    borrow.returnDate = new Date();
    await borrow.save();

    // Increase available copies
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book Returned Successfully",
      borrow,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Get My Borrowed Books
// =======================

export const getMyBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find({ user: req.user.id })
    .populate(
  "book",
  "title author category isbn coverImage"
)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalBooks: borrowedBooks.length,
      borrowedBooks,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Get All Borrow Records (Admin)
// =======================

export const getAllBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await Borrow.find()
      .populate("user", "name email role")
     .populate(
  "book",
  "title author category isbn coverImage"
)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalRecords: borrowRecords.length,
      borrowRecords,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};