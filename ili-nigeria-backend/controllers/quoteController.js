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
export const submitQuote = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming files:", req.files);

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "service",
      "sourceLanguage",
      "urgency",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    let files = [];
    if (req.files && req.files.length > 0) {
      files = await Promise.all(
        req.files.map(async (file) => {
          try {
            console.log(`⬆Uploading to Cloudinary: ${file.originalname}`);
            const uploaded = await uploadToCloudinary(
              file.buffer,
              file.originalname,
              file.mimetype
            );
            console.log(`Uploaded: ${uploaded.secure_url}`);
            return {
              name: file.originalname,
              url: uploaded.secure_url,
              size: file.size,
              type: file.mimetype,
            };
          } catch (err) {
            console.error(
              `Cloudinary upload failed for ${file.originalname}:`,
              err
            );
            throw new Error(`Cloudinary upload failed: ${err.message}`);
          }
        })
      );
    }

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

    // Save to DB
    const newQuote = await Quote.create({
      ...formData,
      documents: files,
      userId: req.user?.uid || null,
      status: "submitted",
      paymentStatus: "pending",
      price: 0,
    });

    console.log("Quote saved to DB:", newQuote._id);

    // UNCHANGED: Email to admin
    try {
      if (!process.env.ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL not set");
      } else {
        await sendEmail(
          [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"],
          `New Quote Request from ${formData.name}`,
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
              <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #2f855a;">ILI Nigeria</h1>
                <p style="color: #718096;">New Quote Request Received</p>
              </div>
              <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="color: #2f855a;">Quote Details</h3>
                <p><strong>Service:</strong> ${formData.service}</p>
                <p><strong>Languages:</strong> ${formData.sourceLanguage} → ${
            formData.targetLanguages?.join(", ") || "N/A"
          }</p>
                <p><strong>Urgency:</strong> ${formData.urgency}</p>
                <p><strong>Certification:</strong> ${
                  formData.certification ? "Yes" : "No"
                }</p>
                <p><strong>Word Count:</strong> ${
                  formData.wordCount || "N/A"
                }</p>
                <p><strong>Page Count:</strong> ${
                  formData.pageCount || "N/A"
                }</p>
                <p><strong>Industry:</strong> ${formData.industry || "N/A"}</p>
                <p><strong>Special Instructions:</strong> ${
                  formData.specialInstructions || "N/A"
                }</p>
                <p><strong>Client:</strong> ${formData.name} (${
            formData.email
          })</p>
                <p><strong>Phone:</strong> ${formData.phone || "N/A"}</p>
                <p><strong>Company:</strong> ${formData.company || "N/A"}</p>
                <p><strong>Documents:</strong> ${
                  files.length > 0
                    ? files
                        .map(
                          (f) =>
                            `<a href="${f.url}" style="color: #2f855a;">${f.name}</a>`
                        )
                        .join("<br>")
                    : "No documents uploaded"
                }</p>
              </div>
              <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
                ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
              </div>
            </div>
          `
        );
        console.log("Admin email sent");
      }
    } catch (err) {
      console.error("Failed to send admin email:", err);
    }

    // UNCHANGED: Email to client
    try {
      await sendEmail(
        formData.email,
        "Thank You for Requesting a Quote - ILI Nigeria",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2b6cb0;">ILI Nigeria</h1>
              <span style="display:inline-block; background-color:#38a169; color:#fff; font-weight:600; padding:6px 18px; border-radius:16px; font-size:16px; margin-bottom:10px;">
                Thank You
              </span>
              <p style="color: #718096;">Your Quote Request Has Been Received</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p>Hi <strong>${formData.name}</strong>,</p>
              <p>We have received your quote request and our team will review your details and get back to you shortly.</p>
              <h3 style="color: #2b6cb0;">Summary of Your Request</h3>
              <ul>
                <li><strong>Service:</strong> ${formData.service}</li>
                <li><strong>Languages:</strong> ${formData.sourceLanguage} → ${
          formData.targetLanguages?.join(", ") || "N/A"
        }</li>
                <li><strong>Urgency:</strong> ${formData.urgency}</li>
                <li><strong>Certification:</strong> ${
                  formData.certification ? "Yes" : "No"
                }</li>
                <li><strong>Word Count:</strong> ${
                  formData.wordCount || "N/A"
                }</li>
                <li><strong>Page Count:</strong> ${
                  formData.pageCount || "N/A"
                }</li>
                <li><strong>Industry:</strong> ${
                  formData.industry || "N/A"
                }</li>
              </ul>
              <p><strong>Reference ID:</strong> ${newQuote._id}</p>
              <p>We appreciate your interest and look forward to assisting you!</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
            </div>
          </div>
        `
      );
      console.log("Client email sent");
    } catch (err) {
      console.error("Failed to send client email:", err);
    }

    res.json({
      message: "Quote submitted successfully",
      quoteId: newQuote._id,
    });
  } catch (error) {
    console.error("Failed to submit quote:", error);
    res
      .status(500)
      .json({ message: "Failed to submit quote", error: error.message });
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
        return res
          .status(403)
          .json({
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
