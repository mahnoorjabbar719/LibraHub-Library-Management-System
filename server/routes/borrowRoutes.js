import express from "express";
import {
  borrowBook,
  issueBookByAdmin,
  returnBook,
  getMyBorrowedBooks,
  getAllBorrowRecords,
} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, borrowBook);
router.post(
  "/admin-issue",
  protect,
  authorizeRoles("admin", "librarian"),
  issueBookByAdmin
);

router.put("/return/:borrowId", protect, returnBook);

router.get("/my-books", protect, getMyBorrowedBooks);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "librarian"),
  getAllBorrowRecords
);

export default router;