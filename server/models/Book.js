import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
    coverImage: {
  type: String,
  default: "",
},
coverImagePublicId: {
  type: String,
  default: "",
},
pdfUrl: {
  type: String,
  default: "",
},

pdfPublicId: {
  type: String,
  default: "",
},

allowDownload: {
  type: Boolean,
  default: true,
},

pages: {
  type: Number,
  default: 0,
},

language: {
  type: String,
  default: "English",
},

publisher: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;