import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = path.join(process.cwd(), "uploads", "books");

// Folder missing ho to automatically create ho jayega
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadFolder);
  },

  filename: (req, file, callback) => {
    const originalName = path
      .parse(file.originalname)
      .name
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${originalName}${extension}`;

    callback(null, uniqueName);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"),
      false
    );
  }
};

const uploadBookCover = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadBookCover;