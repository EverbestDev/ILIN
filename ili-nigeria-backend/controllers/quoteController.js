import Quote from "../models/Quote.js";
import sendEmail from "../utils/email.js";
import cloudinary from "cloudinary";

// Get all quotes (Admin)
export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    res.status(500).json({ message: "Failed to fetch quotes" });
  }
};

// NEW: Get quotes for client (filter by userId)
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

// Get single quote by ID (Admin/Client)
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    // Check access: admin can see all, client only own quotes
    if (req.user.role !== "admin" && quote.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(quote);
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    res.status(500).json({ message: "Failed to fetch quote" });
  }
};

// Delete quote by ID (Admin)
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // If there are documents attached, remove them from Cloudinary
    if (quote.documents && quote.documents.length > 0) {
      for (const doc of quote.documents) {
        try {
          // Extract public_id from the Cloudinary URL
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

    // Delete the quote record from DB
    await Quote.findByIdAndDelete(req.params.id);

    res.json({ message: "Quote and files deleted successfully" });
  } catch (error) {
    console.error("Failed to delete quote:", error);
    res.status(500).json({ message: "Failed to delete quote" });
  }
};

// Submit quote (Public/Client)
export const submitQuote = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming files:", req.files);

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
              `Cloudinary upload failed for ${file.originalname}`,
              err
            );
            throw err;
          }
        })
      );
    }

    let formData = req.body;

    // Handle multi-select fields
    if (formData["targetLanguages[]"]) {
      formData.targetLanguages = Array.isArray(formData["targetLanguages[]"])
        ? formData["targetLanguages[]"]
        : [formData["targetLanguages[]"]];
      delete formData["targetLanguages[]"];
    }

    // Convert checkboxes
    formData.certification =
      formData.certification === "true" || formData.certification === true;
    formData.glossary =
      formData.glossary === "true" || formData.glossary === true;

    // Save to DB
    const newQuote = await Quote.create({
      ...formData,
      documents: files,
    });

    console.log("Quote saved to DB:", newQuote._id);

    // Cloudinary config
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Helper to upload a file buffer to Cloudinary
    const uploadToCloudinary = (fileBuffer, filename, mimetype) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "ILI_Nigeria/quotes",
            resource_type: "auto",
            public_id: filename, // keep filename for clarity
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(fileBuffer);
      });
    };

    // ---- Email to admin ----
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }
      await sendEmail(
        [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"], // multiple recipients
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
              <p><strong>Word Count:</strong> ${formData.wordCount || "N/A"}</p>
              <p><strong>Page Count:</strong> ${formData.pageCount || "N/A"}</p>
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
    } catch (err) {
      console.error("Failed to send admin email:", err);
    }

    // ---- Email to client ----
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

console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "Not set");



