import Subscriber from "../models/Subscriber.js";
import sendEmail from "../utils/email.js";

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

    const subscriber = await Subscriber.create({ email });

    // Send Welcome Email with HTML template
    try {
      await sendEmail(
        email,
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
      console.log("Subscription confirmation email sent to", email);
    } catch (err) {
      console.error("Failed to send subscription email:", err);
    }

    // Send Admin Notification with HTML template
    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }
      await sendEmail(
        [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"],
        `New Subscriber: ${email}`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2f855a;">ILI Nigeria</h1>
              <p style="color: #718096;">New Subscriber Added</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subscribed On:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
              ILI Nigeria | official.intlng@gmail.com | +23481067382
            </div>
          </div>
        `
      );
      console.log("Admin notification sent for new subscriber");
    } catch (err) {
      console.error("Failed to send admin notification:", err);
    }

    res.json({ message: "Subscribed successfully" });
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
