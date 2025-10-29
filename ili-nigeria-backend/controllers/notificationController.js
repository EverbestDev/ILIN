// controllers/notificationController.js
import Contact from "../models/Contact.js";
import Message from "../models/Message.js";
import Quote from "../models/Quote.js";

/**
 * Get Admin Notifications
 * Counts: New contacts + Unread messages + New quotes
 * Returns: Last 5 items
 */
export const getAdminNotifications = async (req, res) => {
  try {
    // Count unread items
    const newContactsCount = await Contact.countDocuments({ status: "new" });
    const unreadMessagesCount = await Message.countDocuments({
      sender: "client",
      isRead: false,
    });
    const newQuotesCount = await Quote.countDocuments({ status: "submitted" });

    const totalUnread = newContactsCount + unreadMessagesCount + newQuotesCount;

    // Get last 5 items
    const recentContacts = await Contact.find({ status: "new" })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    const recentMessages = await Message.find({ sender: "client", isRead: false })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    const recentQuotes = await Quote.find({ status: "submitted" })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    // Format notifications
    const notifications = [
      ...recentContacts.map((c) => ({
        id: c._id,
        type: "contact",
        text: `New contact from ${c.name}`,
        time: getRelativeTime(c.createdAt),
        unread: true,
        link: "/admin/contacts",
      })),
      ...recentMessages.map((m) => ({
        id: m._id,
        type: "message",
        text: `New message from ${m.senderName}`,
        time: getRelativeTime(m.createdAt),
        unread: true,
        link: "/admin/messages",
      })),
      ...recentQuotes.map((q) => ({
        id: q._id,
        type: "quote",
        text: `New quote request from ${q.name}`,
        time: getRelativeTime(q.createdAt),
        unread: true,
        link: "/admin/quotes",
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    res.json({
      success: true,
      unreadCount: totalUnread,
      notifications,
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

/**
 * Get Client Notifications
 * Counts: Unread admin replies
 * Returns: Last 5 admin replies
 */
export const getClientNotifications = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Count unread admin replies
    const unreadCount = await Message.countDocuments({
      userId,
      sender: "admin",
      isRead: false,
    });

    // Get last 5 admin replies
    const recentMessages = await Message.find({
      userId,
      sender: "admin",
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const notifications = recentMessages.map((m) => ({
      id: m._id,
      type: "message",
      text: `New reply from admin: ${m.subject}`,
      time: getRelativeTime(m.createdAt),
      unread: true,
      link: "/client/messages",
    }));

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Get client notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

/**
 * Mark notification as read (when clicked)
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id, type } = req.body;

    if (type === "message") {
      await Message.findByIdAndUpdate(id, { isRead: true });
    } else if (type === "contact") {
      await Contact.findByIdAndUpdate(id, { status: "viewed" });
    } else if (type === "quote") {
      await Quote.findByIdAndUpdate(id, { status: "reviewed" });
    }

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

// Helper: Get relative time
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}