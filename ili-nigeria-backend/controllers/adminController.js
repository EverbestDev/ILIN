import Quote from "../models/Quote.js";
import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";

export const getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    const prevWeek = new Date(now);
    prevWeek.setDate(now.getDate() - 14);

    // Helper function to compute growth rate
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      const change = ((current - previous) / previous) * 100;
      return parseFloat(change.toFixed(1));
    };

    // QUOTES
    const currentQuotes = await Quote.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const prevQuotes = await Quote.countDocuments({
      createdAt: { $gte: prevWeek, $lt: lastWeek },
    });
    const quoteChange = calculateChange(currentQuotes, prevQuotes);

    // CONTACTS
    const currentContacts = await Contact.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const prevContacts = await Contact.countDocuments({
      createdAt: { $gte: prevWeek, $lt: lastWeek },
    });
    const contactChange = calculateChange(currentContacts, prevContacts);

    // SUBSCRIBERS
    const currentSubscribers = await Subscriber.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const prevSubscribers = await Subscriber.countDocuments({
      createdAt: { $gte: prevWeek, $lt: lastWeek },
    });
    const subscriberChange = calculateChange(
      currentSubscribers,
      prevSubscribers
    );

    // Totals
    const totalQuotes = await Quote.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();

    // Build response object
    const stats = {
      quotes: {
        total: totalQuotes,
        change: Math.abs(quoteChange),
        trend: quoteChange >= 0 ? "up" : "down",
      },
      contacts: {
        total: totalContacts,
        change: Math.abs(contactChange),
        trend: contactChange >= 0 ? "up" : "down",
      },
      subscribe: {
        total: totalSubscribers,
        change: Math.abs(subscriberChange),
        trend: subscriberChange >= 0 ? "up" : "down",
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
