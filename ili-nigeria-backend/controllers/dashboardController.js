import Quote from "../models/Quote.js";
import Subscriber from "../models/Subscriber.js";
import Contact from "../models/Contact.js";

// src/controllers/dashboardController.js
export const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);

    const totalQuotes = await Quote.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();  // This should now be 2
    const totalContacts = await Contact.countDocuments();  // This should be >0 if 20

    const quotesLastMonth = await Quote.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });
    const subscribersLastMonth = await Subscriber.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });
    const contactsLastMonth = await Contact.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });

    const quotesPrevMonth = await Quote.countDocuments({ createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd } });
    const subscribersPrevMonth = await Subscriber.countDocuments({ createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd } });
    const contactsPrevMonth = await Contact.countDocuments({ createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd } });

    const calcChange = (current, prev) => prev === 0 ? (current > 0 ? 100 : 0) : parseFloat(((current - prev) / prev * 100).toFixed(1));

    res.json({
      quotes: { total: totalQuotes, change: calcChange(quotesLastMonth, quotesPrevMonth), trend: quotesLastMonth >= quotesPrevMonth ? "up" : "down" },
      subscribers: { total: totalSubscribers, change: calcChange(subscribersLastMonth, subscribersPrevMonth), trend: subscribersLastMonth >= subscribersPrevMonth ? "up" : "down" },
      contacts: { total: totalContacts, change: calcChange(contactsLastMonth, contactsPrevMonth), trend: contactsLastMonth >= contactsPrevMonth ? "up" : "down" },
      lastUpdated: now,
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ message: "Failed to fetch overview" });
  }
};

export const getClientOverview = async (req, res) => {
  try {
    const { email } = req.params;
    const quotes = await Quote.find({ email }).sort({ createdAt: -1 });
    const totalOrders = quotes.length;
    const inProgress = quotes.filter((q) => q.status === "in-progress").length;
    const completed = quotes.filter((q) => q.status === "completed").length;

    res.json({
      totalOrders,
      inProgress,
      completed,
      recentActivity: quotes.slice(0, 5),
    });
  } catch (err) {
    console.error("Client overview error:", err);
    res.status(500).json({ message: "Failed to fetch client overview" });
  }
};
