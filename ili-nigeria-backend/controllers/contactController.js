import Contact from "../models/Contact.js";
import sendEmail from "../utils/email.js";

// Helper functions for formatting
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

function titleCase(str) {
  return str
    ? str
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "";
}

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, service, urgency, message } = req.body;

    // Format fields
    const formattedName = capitalize(name);
    const formattedCompany = company ? capitalize(company) : "N/A";
    const formattedService = service ? titleCase(service) : "N/A";
    const formattedUrgency = urgency ? capitalize(urgency) : "Standard";

    // Save to DB
    await Contact.create({
      name: formattedName,
      email,
      phone,
      company: formattedCompany,
      service: formattedService,
      urgency: formattedUrgency,
      message,
    });

    // Admin Email - Detailed Inquiry
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #2f855a;">ILI Nigeria</h1>
          <p style="color: #718096;">New Contact Inquiry Received</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p><strong>Name:</strong> ${formattedName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Company:</strong> ${formattedCompany}</p>
          <p><strong>Service:</strong> ${formattedService}</p>
          <p><strong>Urgency:</strong> ${formattedUrgency}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color:#f0f0f0; padding:10px; border-radius:5px;">${message}</p>
        </div>
        <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
          ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
        </div>
      </div>
    `;

    await sendEmail(
      "olawooreusamahabidemi@gmail.com", // Admin email
      `New Contact Inquiry from ${formattedName}`,
      adminEmailContent
    );

    // User Email - Confirmation
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #2b6cb0;">ILI Nigeria</h1>
          <span style="display:inline-block; background-color:#38a169; color:#fff; font-weight:600; padding:6px 18px; border-radius:16px; font-size:16px; margin-bottom:10px;">
            Thank You
          </span>
          <p style="color: #718096;">Thank You for Contacting Us</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p>Hi <strong>${formattedName}</strong>,</p>
          <p>We have received your inquiry and our team will get back to you shortly.</p>
          <h3 style="color: #2b6cb0;">Summary of Your Submission</h3>
          <ul>
            <li><strong>Service:</strong> ${formattedService}</li>
            <li><strong>Urgency:</strong> ${formattedUrgency}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>We appreciate your interest and look forward to assisting you!</p>
        </div>
        <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
          ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
        </div>
      </div>
    `;

    await sendEmail(
      email, // User email
      "Thank You for Contacting ILI Nigeria",
      userEmailContent
    );

    res.json({ message: "✅ Inquiry submitted successfully" });
  } catch (error) {
    console.error("❌ Failed to submit inquiry:", error);
    res.status(500).json({ message: "❌ Failed to submit inquiry" });
  }
};
