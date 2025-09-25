import Quote from "../models/Quote.js";
import sendEmail from "../utils/email.js";

export const submitQuote = async (req, res) => {
  try {
    // Handle file uploads (if any)
    const files = req.files
      ? req.files.map((f) => ({
          name: f.originalname,
          path: f.path,
          size: f.size,
          type: f.mimetype,
        }))
      : [];

    let formData = req.body;

    // ✅ Fix: Parse targetLanguages (if sent as string or array)
    if (formData["targetLanguages[]"]) {
      formData.targetLanguages = Array.isArray(formData["targetLanguages[]"])
        ? formData["targetLanguages[]"]
        : [formData["targetLanguages[]"]];
      delete formData["targetLanguages[]"];
    }

    // ✅ Convert checkboxes (certification, glossary) to booleans
    formData.certification =
      formData.certification === "true" || formData.certification === true;
    formData.glossary =
      formData.glossary === "true" || formData.glossary === true;

    // Save to DB
    const newQuote = await Quote.create({
      ...formData,
      documents: files,
    });

    // Send email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL && "olawooreusamahabidemi@gmail.com",
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
      `
    );

    // Send confirmation email to client
    await sendEmail(
      formData.email,
      "Thank you for requesting a quote - ILI Nigeria",
      `
        <p>Hi ${formData.name},</p>
        <p>Thank you for your request. Our team will review your details and get back to you shortly.</p>
        <p>Regards,<br>ILI Nigeria Team</p>
      `
    );

    res.json({
      message: "Quote submitted successfully....",
      quoteId: newQuote._id,
    });
  } catch (error) {
    console.error("❌ Failed to submit quote:", error);
    res.status(500).json({ message: "❌ Failed to submit quote" });
  }
};
