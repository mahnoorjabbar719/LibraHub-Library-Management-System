import User from "../models/User.js";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalBorrowedBooks = await Borrow.countDocuments({
      status: "Borrowed",
    });

    const books = await Book.find();
    const recentBorrows = await Borrow.find()
  .populate("user", "name")
  .populate("book", "title")
  .sort({ createdAt: -1 })
  .limit(3);

    const availableBooks = books.reduce(
      (total, book) => total + book.availableCopies,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalBooks,
        totalBorrowedBooks,
        availableBooks,
        recentBorrows,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const publicDashboard = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalBorrowedBooks = await Borrow.countDocuments({
      status: "Borrowed",
    });

    const books = await Book.find({}, "availableCopies");

    const availableBooks = books.reduce(
      (total, book) => total + Number(book.availableCopies || 0),
      0
    );

    const recentBorrows = await Borrow.find()
      .populate("user", "name")
      .populate("book", "title")
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalBooks,
        totalUsers: totalStudents,
        totalBorrowedBooks,
        availableBooks,
        recentBorrows,
      },
    });
  } catch (error) {
    console.error("Public dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load library statistics",
    });
  }
};