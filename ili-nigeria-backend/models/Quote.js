// // models/Quote.js
// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   name: String,
//   url: String, // ✅ replaced path with url
//   size: Number,
//   type: String,
// });

// const quoteSchema = new mongoose.Schema(
//   {
//     // Project Details
//     service: { type: String, required: true },
//     sourceLanguage: { type: String, required: true },
//     targetLanguages: { type: [String], default: [] },
//     urgency: {
//       type: String,
//       enum: ["standard", "rush", "urgent"],
//       default: "standard",
//     },
//     certification: { type: Boolean, default: false },

//     // Document Details
//     documents: [fileSchema],
//     wordCount: { type: Number, default: null },
//     pageCount: { type: Number, default: null },

//     // Client Details
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String },
//     company: { type: String },

//     // Additional Requirements
//     specialInstructions: { type: String },
//     industry: { type: String },
//     glossary: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Quote", quoteSchema);


import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // Optional for public submissions
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  service: { type: String, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguages: [{ type: String }],
  urgency: { type: String, required: true },
  certification: { type: Boolean, default: false },
  glossary: { type: Boolean, default: false },
  wordCount: { type: Number },
  pageCount: { type: Number },
  industry: { type: String },
  specialInstructions: { type: String },
  documents: [
    {
      name: String,
      url: String,
      size: Number,
      type: String,
    },
  ],
  translatedDocuments: [
    {
      name: String,
      url: String,
      size: Number,
      type: String,
    },
  ],
  certificationDocument: {
    name: String,
    url: String,
    size: Number,
    type: String,
  },
  status: {
    type: String,
    enum: [
      "submitted",
      "reviewed",
      "quoted",
      "awaiting payment",
      "paid",
      "in progress",
      "complete",
      "cancelled",
    ],
    default: "submitted",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  price: { type: Number, default: 0 },
  messages: [
    {
      sender: { type: String, enum: ["client", "admin"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quote", quoteSchema);