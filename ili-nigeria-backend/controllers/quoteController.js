import Quote from "../models/Quote.js";
import sendEmail from "../utils/email.js";
import cloudinary from "cloudinary";

// UPDATED: Restore Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPDATED: Restore uploadToCloudinary helper
const uploadToCloudinary = (fileBuffer, filename, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "ILI_Nigeria/quotes",
        resource_type: "auto",
        public_id: filename,
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          reject(new Error(`Cloudinary upload failed: ${err.message}`));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

// UNCHANGED: Get all quotes (Admin)
export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    res.status(500).json({ message: "Failed to fetch quotes" });
  }
};

// UNCHANGED: Get quotes for client
export const getClientQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user.uid }).sort({
      createdAt: -1,
    });
    res.json(quotes);
  } catch (error) {
    console.error("Failed to fetch client quotes:", error);
    res.status(500).json({ message: "Failed to fetch client quotes" });
  }
};

// UNCHANGED: Get single quote by ID
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    if (req.user.role !== "admin" && quote.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(quote);
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    res.status(500).json({ message: "Failed to fetch quote" });
  }
};

// UNCHANGED: Delete quote by ID (Admin)
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    if (quote.documents && quote.documents.length > 0) {
      for (const doc of quote.documents) {
        try {
          const publicId = doc.url
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.[^/.]+$/, "");
          await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: "raw",
          });
          console.log(`Deleted from Cloudinary: ${publicId}`);
        } catch (err) {
          console.error(`Failed to delete ${doc.url} from Cloudinary`, err);
        }
      }
    }
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: "Quote and files deleted successfully" });
  } catch (error) {
    console.error("Failed to delete quote:", error);
    res.status(500).json({ message: "Failed to delete quote" });
  }
};

// UPDATED: Submit quote with improved error handling
// CLEANED & FINAL submitQuote
export const submitQuote = async (req, res) => {
  try {
    // Log summary only (no sensitive data)
    console.log(`📥 Quote submission received from ${req.user?.uid || "guest"}`);

    // Validate required fields
    const requiredFields = ["name", "email", "service", "sourceLanguage", "urgency"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Upload documents (if any)
    let files = [];
    if (req.files?.length > 0) {
      files = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await uploadToCloudinary(file.buffer, file.originalname, file.mimetype);
          return {
            name: file.originalname,
            url: uploaded.secure_url,
            size: file.size,
            type: file.mimetype,
          };
        })
      );
    }

    // Normalize formData
    let formData = req.body;
    if (formData["targetLanguages[]"]) {
      formData.targetLanguages = Array.isArray(formData["targetLanguages[]"])
        ? formData["targetLanguages[]"]
        : [formData["targetLanguages[]"]];
      delete formData["targetLanguages[]"];
    }

    formData.certification =
      formData.certification === "true" || formData.certification === true;
    formData.glossary =
      formData.glossary === "true" || formData.glossary === true;

    const userId = req.user?.uid || null;

    // Save to DB
    const newQuote = await Quote.create({
      ...formData,
      documents: files,
      userId,
      status: "submitted",
      paymentStatus: "pending",
      price: 0,
    });

    console.log(`✅ Quote saved: ${newQuote._id} (user: ${userId || "guest"})`);

    // Helper: Safe email send with retry
    const sendWithRetry = async (to, subject, html) => {
      try {
        await sendEmail(to, subject, html);
      } catch (err) {
        console.warn(`Email send failed, retrying once: ${subject}`);
        try {
          await sendEmail(to, subject, html);
        } catch (retryErr) {
          console.error(`Second attempt failed for "${subject}":`, retryErr.message);
        }
      }
    };

    // --- 📧 Send Admin Notification ---
    if (process.env.ADMIN_EMAIL) {
      const adminEmails = process.env.ADMIN_EMAIL.split(",").map((e) => e.trim());
      await sendWithRetry(
        adminEmails,
        `New Quote Request from ${formData.name}`,
        `
          <div style="font-family: Arial; background-color: #f9fafb; padding: 20px;">
            <h2 style="color:#2f855a;">New Quote Request</h2>
            <p><strong>Service:</strong> ${formData.service}</p>
            <p><strong>Languages:</strong> ${formData.sourceLanguage} → ${formData.targetLanguages?.join(", ") || "N/A"}</p>
            <p><strong>Urgency:</strong> ${formData.urgency}</p>
            <p><strong>Client:</strong> ${formData.name} (${formData.email})</p>
            <p><strong>Company:</strong> ${formData.company || "N/A"}</p>
            <p><strong>Special Instructions:</strong> ${formData.specialInstructions || "N/A"}</p>
            <p><strong>Documents:</strong><br>
              ${files.length > 0 ? files.map((f) => `<a href="${f.url}">${f.name}</a>`).join("<br>") : "No documents uploaded"}
            </p>
          </div>
        `
      );
      console.log("📩 Admin notification sent");
    } else {
      console.warn("⚠️ ADMIN_EMAIL not configured in environment");
    }

    // --- 📧 Send Client Confirmation ---
    await sendWithRetry(
      formData.email,
      "Thank You for Your Quote Request - ILI Nigeria",
      `
        <div style="font-family: Arial; background-color: #f9fafb; padding: 20px;">
          <h2 style="color:#2b6cb0;">Your Quote Request Has Been Received</h2>
          <p>Hi ${formData.name},</p>
          <p>We’ve received your quote request and will get back to you soon.</p>
          <p><strong>Service:</strong> ${formData.service}</p>
          <p><strong>Reference ID:</strong> ${newQuote._id}</p>
          <p>Thank you for choosing ILI Nigeria.</p>
        </div>
      `
    );
    console.log("📩 Client confirmation sent");

    res.json({
      message: "Quote submitted successfully",
      quoteId: newQuote._id,
    });
  } catch (error) {
    console.error("❌ Failed to submit quote:", error.message);
    res.status(500).json({ message: "Failed to submit quote", error: error.message });
  }
};


// UNCHANGED: Update quote status
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    if (req.user.role !== "admin" && quote.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (req.user.role !== "admin") {
      if (!["awaiting payment", "cancelled"].includes(status)) {
        return res.status(403).json({
          message:
            "Clients can only set status to 'awaiting payment' or 'cancelled'",
        });
      }
    }
    if (status) quote.status = status;
    if (paymentStatus) quote.paymentStatus = paymentStatus;
    await quote.save();
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }
      await sendEmail(
        [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"],
        `Quote #${quote._id} Status Updated`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2f855a;">ILI Nigeria</h1>
              <p style="color: #718096;">Quote Status Update</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2f855a;">Quote #${quote._id}</h3>
              <p><strong>Client:</strong> ${quote.name} (${quote.email})</p>
              <p><strong>New Status:</strong> ${quote.status}</p>
              <p><strong>Payment Status:</strong> ${quote.paymentStatus}</p>
              <p><strong>Service:</strong> ${quote.service}</p>
              <p><strong>Languages:</strong> ${quote.sourceLanguage} → ${
          quote.targetLanguages?.join(", ") || "N/A"
        }</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
            </div>
          </div>
        `
      );
      console.log("Admin notification email sent");
    } catch (err) {
      console.error("Failed to send admin notification email:", err);
    }
    res.json({ message: "Quote status updated successfully", quote });
  } catch (error) {
    console.error("Failed to update quote status:", error);
    res
      .status(500)
      .json({ message: "Failed to update quote status", error: error.message });
  }
};

// UNCHANGED: Send message
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    if (req.user.role !== "admin" && quote.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }
    quote.messages.push({
      sender: req.user.role === "admin" ? "admin" : "client",
      content,
      timestamp: new Date(),
    });
    await quote.save();
    try {
      const recipient =
        req.user.role === "admin" ? quote.email : process.env.ADMIN_EMAIL;
      await sendEmail(
        recipient,
        `New Message for Quote #${quote._id}`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2f855a;">ILI Nigeria</h1>
              <p style="color: #718096;">New Message Received</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2f855a;">Quote #${quote._id}</h3>
              <p><strong>From:</strong> ${
                req.user.role === "admin" ? "Admin" : quote.name
              }</p>
              <p><strong>Message:</strong> ${content}</p>
              <p><strong>Service:</strong> ${quote.service}</p>
              <p><strong>Languages:</strong> ${quote.sourceLanguage} → ${
          quote.targetLanguages?.join(", ") || "N/A"
        }</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
            </div>
          </div>
        `
      );
      console.log("Message notification email sent");
    } catch (err) {
      console.error("Failed to send message notification email:", err);
    }
    res.json({ message: "Message sent successfully", quote });
  } catch (error) {
    console.error("Failed to send message:", error);
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};
