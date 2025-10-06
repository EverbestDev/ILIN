import Quote from "../models/Quote.js";
import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

export const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    const prevWeek = new Date(now);
    prevWeek.setDate(now.getDate() - 14);

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      const change = ((current - previous) / previous) * 100;
      return parseFloat(change.toFixed(1));
    };

    const currentQuotes = await Quote.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const prevQuotes = await Quote.countDocuments({
      createdAt: { $gte: prevWeek, $lt: lastWeek },
    });
    const quoteChange = calculateChange(currentQuotes, prevQuotes);

    const currentContacts = await Contact.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const prevContacts = await Contact.countDocuments({
      createdAt: { $gte: prevWeek, $lt: lastWeek },
    });
    const contactChange = calculateChange(currentContacts, prevContacts);

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

    const totalQuotes = await Quote.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();

    res.json({
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
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    res.status(500).json({ message: "Failed to fetch admin overview" });
  }
};

export const getClientOverview = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const quotes = await Quote.countDocuments({ email });
    const tasks = await Task.find({ email, completed: false });

    res.json({
      user: { name: user.name, email: user.email, role: user.role },
      quotes: { total: quotes },
      tasks: tasks.map((task) => ({
        id: task._id,
        task: task.task,
        due: task.due,
      })),
    });
  } catch (error) {
    console.error("Error fetching client overview:", error);
    res.status(500).json({ message: "Failed to fetch client overview" });
  }
};
