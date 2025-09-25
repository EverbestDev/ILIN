import Quote from "../models/Quote.js";
import sendEmail from "../utils/email.js";
import cloudinary from "cloudinary";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload from buffer using a stream
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

export const submitQuote = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    console.log("📎 Incoming files:", req.files);

    let files = [];
    if (req.files && req.files.length > 0) {
      files = await Promise.all(
        req.files.map(async (file) => {
          try {
            console.log(`⬆️ Uploading to Cloudinary: ${file.originalname}`);
            const uploaded = await uploadToCloudinary(
              file.buffer,
              file.originalname,
              file.mimetype
            );

            console.log(`✅ Uploaded: ${uploaded.secure_url}`);
            return {
              name: file.originalname,
              url: uploaded.secure_url,
              size: file.size,
              type: file.mimetype,
            };
          } catch (err) {
            console.error(
              `❌ Cloudinary upload failed for ${file.originalname}`,
              err
            );
            throw err;
          }
        })
      );
    }

    let formData = req.body;

    // Fix arrays (targetLanguages comes as string[] or single string)
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

    console.log("✅ Quote saved to DB:", newQuote._id);

    // ---- Email to admin ----
    try {
      await sendEmail(
        "olawooreusamahabidemi@gmail.com",
        `New Quote Request from ${formData.name}`,
        `
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
          <p><strong>Client:</strong> ${formData.name} (${formData.email})</p>
          <p><strong>Documents:</strong> ${
            files.length > 0
              ? files
                  .map((f) => `<a href="${f.url}">${f.name}</a>`)
                  .join("<br>")
              : "No documents uploaded"
          }</p>
        `
      );
      console.log("📧 Admin email sent");
    } catch (err) {
      console.error("❌ Failed to send admin email:", err);
    }

    // ---- Email to client ----
    try {
      await sendEmail(
        formData.email,
        "Thank you for requesting a quote - ILI Nigeria",
        `
          <p>Hi ${formData.name},</p>
          <p>Thank you for your request. Our team will review your details and get back to you shortly.</p>
          <p><strong>Reference ID:</strong> ${newQuote._id}</p>
          <p>Regards,<br>ILI Nigeria Team</p>
        `
      );
      console.log("📧 Client email sent");
    } catch (err) {
      console.error("❌ Failed to send client email:", err);
    }

    res.json({
      message: "✅ Quote submitted successfully",
      quoteId: newQuote._id,
    });
  } catch (error) {
    console.error("❌ Failed to submit quote:", error);
    res
      .status(500)
      .json({ message: "❌ Failed to submit quote", error: error.message });
  }
};
