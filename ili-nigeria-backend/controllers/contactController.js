// controllers/contactController.js
import Contact from "../models/Contact.js";
import Message from "../models/Message.js";
import sendEmail from "../utils/email.js";
import mongoose from "mongoose";
import admin from "firebase-admin";

// Helper functions
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

// PUBLIC: Submit contact form (no auth)
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, service, urgency, message } = req.body;

    const formattedName = titleCase(name);
    const formattedCompany = company ? titleCase(company) : "N/A";
    const formattedService = service ? titleCase(service) : "N/A";
    const formattedUrgency = urgency ? capitalize(urgency) : "Standard";

    // Save to DB
    const newContact = await Contact.create({
      name: formattedName,
      email: email.toLowerCase(),
      phone,
      company: formattedCompany,
      service: formattedService,
      urgency: formattedUrgency,
      message,
      status: "new",
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
      [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"],
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
      email,
      "Thank You for Contacting ILI Nigeria",
      userEmailContent
    );

    // WebSocket notification to admin
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("new_public_contact", newContact);
    }

    res.json({
      success: true,
      message: "✅ Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("❌ Submit contact error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Failed to submit inquiry",
    });
  }
};

// ADMIN: Get all contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    // IMPORTANT: Return as array directly for compatibility
    res.json(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

// ADMIN: Get single contact
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
    });
  }
};

// ADMIN: Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("contact_deleted", { id: req.params.id });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};

// ADMIN: Archive contact
export const archiveContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("contact_status_updated", {
        id: contact._id,
        status: "archived",
      });
    }

    res.json({
      success: true,
      message: "Contact archived successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Archive contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to archive contact",
    });
  }
};

// ADMIN: Convert contact to message thread
export const convertToThread = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    if (contact.status === "converted") {
      return res.status(400).json({
        success: false,
        message: "Contact already converted to thread",
        threadId: contact.convertedThreadId,
      });
    }

    // Check if email matches registered Firebase user
    let firebaseUser = null;
    try {
      firebaseUser = await admin.auth().getUserByEmail(contact.email);
    } catch (err) {
      console.log("User not registered in Firebase:", contact.email);
    }

    // Create new thread
    const threadId = new mongoose.Types.ObjectId().toString();
    const userId = firebaseUser ? firebaseUser.uid : `guest_${contact.email}`;

    // Create first message in thread (from client perspective)
    await Message.create({
      threadId,
      userId: firebaseUser ? firebaseUser.uid : userId,
      subject: contact.service || "General Inquiry",
      message: contact.message,
      sender: "client",
      senderName: contact.name,
      senderEmail: contact.email,
      originType: "client_initiated",
    });

    // Update contact status
    contact.status = "converted";
    contact.convertedThreadId = threadId;
    await contact.save();

    // Send email to contact
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #2f855a;">ILI Nigeria</h1>
          <p style="color: #718096;">Your Inquiry Has Been Converted to a Conversation</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p>Hi <strong>${contact.name}</strong>,</p>
          <p>Great news! Our team wants to have a detailed conversation about your inquiry.</p>
          ${
            firebaseUser
              ? `<p>You can track and reply to this conversation by logging into your account at <a href="https://ilin-nigeria.vercel.app/client/messages" style="color: #2f855a; font-weight: bold;">ILI Nigeria Dashboard</a></p>`
              : `<p>To continue this conversation and track responses, please <a href="https://ilin-nigeria.vercel.app/register?email=${contact.email}" style="color: #2f855a; font-weight: bold;">create a free account</a>.</p>`
          }
          <p>We'll be responding to your inquiry shortly!</p>
        </div>
        <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
          ILI Nigeria | hello@ili-nigeria.com | +234 803 123 4567
        </div>
      </div>
    `;

    await sendEmail(
      contact.email,
      "Your Inquiry - Let's Continue the Conversation",
      emailContent
    );

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("contact_converted", {
        contactId: contact._id,
        threadId,
      });
      if (firebaseUser) {
        io.to(`user-${firebaseUser.uid}`).emit("new_admin_message", {
          threadId,
          message: "Your contact inquiry has been converted to a conversation",
        });
      }
    }

    res.json({
      success: true,
      message: "Contact converted to thread successfully",
      threadId,
      data: {
        threadId,
        isRegisteredUser: !!firebaseUser,
      },
    });
  } catch (error) {
    console.error("Convert to thread error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to convert contact",
      error: error.message,
    });
  }
};