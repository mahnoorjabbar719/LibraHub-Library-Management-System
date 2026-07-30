import mongoose from "mongoose";

const digitalBookSchema = new mongoose.Schema(
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

    category: {
      type: String,
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
      required: true,
    },

    pdfPublicId: {
      type: String,
      default: "",
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

    allowDownload: {
      type: Boolean,
      default: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DigitalBook", digitalBookSchema);