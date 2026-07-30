import express from "express";

import {
  addDigitalBook,
  getAllDigitalBooks,
  updateDigitalBook,
  deleteDigitalBook,
} from "../controllers/digitalBookController.js";
import uploadDigitalBook from "../middleware/uploadDigitalBook.js";

const router = express.Router();

router.get("/", getAllDigitalBooks);

router.post(
  "/add",
  uploadDigitalBook.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  addDigitalBook
);
router.put(
  "/update/:id",
  uploadDigitalBook.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  updateDigitalBook
);

router.delete(
  "/delete/:id",
  deleteDigitalBook
);

export default router;