import express from "express";
import sendEmail from "../utils/email.js";

const router = express.Router();

// Test email route
router.post("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "theeverbeststudios@gmail.com", //  receiver inbox
      "Test Email from ILI Backend ",
      "<p>This is a <strong>test email</strong> using Brevo + Nodemailer</p>"
    );
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "❌ Failed to send email" });
  }
});

export default router;
