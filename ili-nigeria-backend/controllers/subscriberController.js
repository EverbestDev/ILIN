import Subscriber from "../models/Subscriber.js";
import sendEmail from "../utils/email.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    await Subscriber.create({ email });

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
      console.log("📧 Subscription confirmation email sent to", email);
    } catch (err) {
      console.error("❌ Failed to send subscription email:", err);
    }

    try {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }
      await sendEmail(
        [process.env.ADMIN_EMAIL, "official.intlng@gmail.com"],
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
      console.log("📧 Admin notification sent for new subscriber");
    } catch (err) {
      console.error("❌ Failed to send admin notification:", err);
    }

    res.json({ message: "✅ Successfully subscribed" });
  } catch (error) {
    console.error("❌ Failed to subscribe:", error);
    res.status(500).json({ message: "❌ Failed to subscribe", error: error.message });
  }
};