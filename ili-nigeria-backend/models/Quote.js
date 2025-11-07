import mongoose from "mongoose";

// File schema for documents
const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number },
    type: { type: String },
  },
  { _id: false }
);

// Message schema for client-admin communication
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// Main quote schema
const quoteSchema = new mongoose.Schema(
  {
    // User identification (optional for public submissions)
    userId: {
      type: String,
      required: false,
      index: true, // Index for faster queries
    },

    // Client contact information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },

    // Service details
    service: {
      type: String,
      required: true,
      enum: [
        "translation",
        "interpretation",
        "localization",
        "transcription",
        "document",
        "multimedia",
        "website",
        "certified",
        "subtitling",
        "voiceover",
        "other",
      ],
      lowercase: true,
    },
    sourceLanguage: {
      type: String,
      required: true,
      trim: true,
    },
    targetLanguages: [
      {
        type: String,
        trim: true,
      },
    ],

    // Urgency and special requirements
    urgency: {
      type: String,
      required: true,
      enum: ["standard", "rush", "urgent"],
      default: "standard",
      lowercase: true,
    },
    certification: {
      type: Boolean,
      default: false,
    },
    glossary: {
      type: Boolean,
      default: false,
    },

    // Project metrics
    wordCount: {
      type: Number,
      min: 0,
    },
    pageCount: {
      type: Number,
      min: 0,
    },
    industry: {
      type: String,
      trim: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    // Documents
    documents: [fileSchema],
    translatedDocuments: [fileSchema],
    certificationDocument: {
      name: String,
      url: String,
      size: Number,
      type: String,
    },

    // Status tracking
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
      lowercase: true,
      index: true, // Index for status queries
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },

    // Communication
    messages: [messageSchema],
    unreadMessagesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true, // Index for sorting by date
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Indexes for better query performance
quoteSchema.index({ userId: 1, createdAt: -1 });
quoteSchema.index({ email: 1, createdAt: -1 });
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ isDeleted: 1, status: 1 });

// Virtual for total messages
quoteSchema.virtual("totalMessages").get(function () {
  return this.messages.length;
});

// Virtual for status display
quoteSchema.virtual("statusDisplay").get(function () {
  return this.status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

// Pre-save middleware to update timestamps
quoteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Set completedAt when status changes to complete
  if (
    this.isModified("status") &&
    this.status === "complete" &&
    !this.completedAt
  ) {
    this.completedAt = Date.now();
  }

  // Set paidAt when payment status changes to paid
  if (
    this.isModified("paymentStatus") &&
    this.paymentStatus === "paid" &&
    !this.paidAt
  ) {
    this.paidAt = Date.now();
  }

  // Calculate unread messages for client
  if (this.isModified("messages")) {
    this.unreadMessagesCount = this.messages.filter(
      (msg) => msg.sender === "admin" && !msg.read
    ).length;
  }

  next();
});

// Static methods for common queries
quoteSchema.statics.findByUserId = function (userId) {
  return this.find({ userId, isDeleted: false }).sort({ createdAt: -1 });
};

quoteSchema.statics.findByStatus = function (status) {
  return this.find({ status, isDeleted: false }).sort({ createdAt: -1 });
};

quoteSchema.statics.findPendingQuotes = function () {
  return this.find({
    status: { $in: ["submitted", "reviewed"] },
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

// Instance methods
quoteSchema.methods.addMessage = function (sender, content) {
  this.messages.push({ sender, content });
  return this.save();
};

quoteSchema.methods.markMessagesAsRead = function (sender) {
  this.messages.forEach((msg) => {
    if (msg.sender !== sender) {
      msg.read = true;
    }
  });
  return this.save();
};

quoteSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

quoteSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

// Transform output (remove sensitive/unnecessary fields)
quoteSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Quote", quoteSchema);
