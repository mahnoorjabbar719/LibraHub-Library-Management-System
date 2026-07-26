import express from "express";
import { addBook,getAllBooks,getSingleBook,updateBook,deleteBook } from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import uploadBookCover from "../middleware/upload.js";

const router = express.Router();

// Add New Book (Only Admin & Librarian)
router.post(
  "/add",
  protect,
  authorizeRoles("admin", "librarian"),
   uploadBookCover.single("coverImage"),
  addBook
);
// Get All Books
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "librarian"),
  uploadBookCover.single("coverImage"),
  updateBook
);
// Delete Book (Only Admin & Librarian)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "librarian"),
  deleteBook
);

export default router;