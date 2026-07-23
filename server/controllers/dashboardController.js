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