// models/Quote.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
  size: Number,
  type: String,
});

const quoteSchema = new mongoose.Schema(
  {
    // Project Details
    service: { type: String, required: true },
    sourceLanguage: { type: String, required: true },
    targetLanguages: { type: [String], default: [] },
    urgency: {
      type: String,
      enum: ["standard", "rush", "urgent"],
      default: "standard",
    },
    certification: { type: Boolean, default: false },

    // Document Details
    documents: [fileSchema],
    wordCount: { type: Number, default: null },
    pageCount: { type: Number, default: null },

    // Client Details
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },

    // Additional Requirements
    specialInstructions: { type: String },
    industry: { type: String },
    glossary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
