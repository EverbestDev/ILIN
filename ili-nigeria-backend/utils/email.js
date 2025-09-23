import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("USER:", process.env.BREVO_USER);
console.log("KEY:", process.env.BREVO_API_KEY ? "Loaded....." : "Missing....");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"ILI Nigeria" <olawooreusamahabidemi@gmail.com>`, //  verified sender
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
