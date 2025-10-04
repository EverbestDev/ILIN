import Quote from "../models/Quote.js";
import Subscriber from "../models/Subscriber.js";
import Contact from "../models/Contact.js";

export const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const totalQuotes = await Quote.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();
    const totalContacts = await Contact.countDocuments();

    const quotesLastMonth = await Quote.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    const subscribersLastMonth = await Subscriber.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    const contactsLastMonth = await Contact.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    const calcChange = (current, prev) =>
      prev === 0 ? 100 : (((current - prev) / prev) * 100).toFixed(1);

    res.json({
      quotes: {
        total: totalQuotes,
        change: calcChange(totalQuotes, quotesLastMonth),
        trend: totalQuotes >= quotesLastMonth ? "up" : "down",
      },
      subscribers: {
        total: totalSubscribers,
        change: calcChange(totalSubscribers, subscribersLastMonth),
        trend: totalSubscribers >= subscribersLastMonth ? "up" : "down",
      },
      contacts: {
        total: totalContacts,
        change: calcChange(totalContacts, contactsLastMonth),
        trend: totalContacts >= contactsLastMonth ? "up" : "down",
      },
      lastUpdated: now,
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({ message: "Failed to fetch admin overview" });
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
