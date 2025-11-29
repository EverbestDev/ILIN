import Subscriber from "../models/Subscriber.js";
import PendingSubscriber from "../models/PendingSubscriber.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      // Send "Already Subscribed" email with nice HTML
      await sendEmail(
        email,
        "Already Subscribed - ILI Nigeria",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2b6cb0;">ILI Nigeria</h1>
              <span style="display:inline-block; background-color:#ed8936; color:#fff; font-weight:600; padding:6px 18px; border-radius:16px; font-size:16px; margin-bottom:10px;">
                Already Subscribed
              </span>
              <p style="color: #718096;">You're Already Part of Our Community</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p>Hi,</p>
              <p>Good news! You're already subscribed to the ILI Nigeria newsletter.</p>
              <p>You'll continue to receive updates on our services, promotions, and exciting news.</p>
              <p>Thank you for your continued interest!</p>
              <p>Regards,<br>ILI Nigeria Team</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | official.intlng@gmail.com | +23481067382
            </div>
          </div>
        `
      );
      return res.status(400).json({ message: "You are already subscribed" });
    }

    // Check if email is already subscribed
    // Only create subscriber after verification; create pending token and send verification email
    const pendingExists = await PendingSubscriber.findOne({ email });
    if (pendingExists) {
      // Refresh token and resend verification
      await PendingSubscriber.deleteOne({ email });
    }

    // Token
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await PendingSubscriber.create({ email, token, expiresAt });

    // Send verification email with link to verify
    const verifyUrl = `${
      process.env.FRONTEND_URL || "https://ilin-nigeria.vercel.app"
    }/verify-subscribe?token=${token}`;
    try {
      await sendEmail(
        email,
        "Confirm your subscription - ILI Nigeria",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2b6cb0;">Confirm your subscription</h1>
              <p style="color: #718096;">Please confirm your email address to complete your subscription to ILI Nigeria's newsletter.</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; text-align:center;">
              <p>Click the link below to confirm:</p>
              <a href="${verifyUrl}" style="display:inline-block; padding:12px 18px; background-color:#3182ce; color:#fff; border-radius:8px; text-decoration:none;">Confirm Subscription</a>
              <p style="font-size:12px; color:#9CA3AF; margin-top:12px;">This link expires in 24 hours.</p>
            </div>
          </div>
        `
      );
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    // For now, we will only notify admin on verification (handled in verification route)

    res.json({ message: "Verification email sent", pending: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    res
      .status(500)
      .json({ message: "Failed to subscribe", error: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
};

export const resendWelcomeEmail = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    // Send beautifully formatted welcome email
    await sendEmail(
      subscriber.email,
      "Welcome Back to ILI Nigeria Newsletter",
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #2b6cb0;">ILI Nigeria</h1>
            <span style="display:inline-block; background-color:#38a169; color:#fff; font-weight:600; padding:6px 18px; border-radius:16px; font-size:16px; margin-bottom:10px;">
              Welcome Back!
            </span>
            <p style="color: #718096;">We're Glad You're Here</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p>Hi,</p>
            <p>Thank you for being a valued subscriber to ILI Nigeria!</p>
            <p>Stay tuned for our latest updates, services, and exciting promotions.</p>
            <p>We're thrilled to have you with us!</p>
            <p>Regards,<br>ILI Nigeria Team</p>
          </div>
          <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
            ILI Nigeria | official.intlng@gmail.com | +23481067382
          </div>
        </div>
      `
    );

    res.json({ message: "Welcome email resent successfully" });
  } catch (error) {
    console.error("Resend email error:", error);
    res.status(500).json({ message: "Failed to resend welcome email" });
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const pending = await PendingSubscriber.findOne({ token });
    if (!pending) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (pending.expiresAt < new Date()) {
      await PendingSubscriber.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: "Verification token expired" });
    }

    // Ensure not already subscribed
    const already = await Subscriber.findOne({ email: pending.email });
    if (already) {
      await PendingSubscriber.deleteOne({ _id: pending._id });
      return res.status(200).json({ message: "Already subscribed" });
    }

    // Create subscriber record
    const subscriber = await Subscriber.create({ email: pending.email });
    await PendingSubscriber.deleteOne({ _id: pending._id });

    // Send welcome email
    try {
      await sendEmail(
        subscriber.email,
        "Welcome to ILI Nigeria Newsletter",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2b6cb0;">ILI Nigeria</h1>
              <span style="display:inline-block; background-color:#38a169; color:#fff; font-weight:600; padding:6px 18px; border-radius:16px; font-size:16px; margin-bottom:10px;">
                Welcome!
              </span>
              <p style="color: #718096;">Thank You for Subscribing</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p>Hi,</p>
              <p>Thank you for subscribing to the ILI Nigeria newsletter! You'll receive updates on our services, promotions, and more.</p>
              <p>Stay tuned for exciting news!</p>
              <p>Regards,<br>ILI Nigeria Team</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | official.intlng@gmail.com | +23481067382
            </div>
          </div>
        `
      );
    } catch (err) {
      console.error("Failed to send welcome email after verification:", err);
    }

    // Send admin notification
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }
      const adminEmails = process.env.ADMIN_EMAIL.split(",").map((e) =>
        e.trim()
      );
      await sendEmail(
        adminEmails,
        `New Subscriber: ${subscriber.email}`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2f855a;">ILI Nigeria</h1>
              <p style="color: #718096;">New Subscriber Verified</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p><strong>Email:</strong> ${subscriber.email}</p>
              <p><strong>Subscribed On:</strong> ${subscriber.createdAt.toLocaleString()}</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | official.intlng@gmail.com | +23481067382
            </div>
          </div>
        `
      );
      console.log("Admin notification sent for new verified subscriber");
    } catch (err) {
      console.error(
        "Failed to send admin notification after verification:",
        err
      );
    }

    return res.json({ message: "Subscription verified and saved" });
  } catch (error) {
    console.error("Subscription verification error:", error);
    res.status(500).json({ message: "Failed to verify subscription" });
  }
};
