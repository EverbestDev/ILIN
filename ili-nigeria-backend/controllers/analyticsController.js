import Quote from "../models/Quote.js";
import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";
import Message from "../models/Message.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const paidQuotes = await Quote.find({ paymentStatus: "paid" });
    const totalRevenue = paidQuotes.reduce((sum, q) => sum + (q.price || 0), 0);

    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const recentRevenue = paidQuotes
      .filter((q) => new Date(q.paidAt) >= threeMonthsAgo)
      .reduce((sum, q) => sum + (q.price || 0), 0);
    const oldRevenue = paidQuotes
      .filter((q) => new Date(q.paidAt) < threeMonthsAgo)
      .reduce((sum, q) => sum + (q.price || 0), 0);
    const revenueChange =
      oldRevenue > 0
        ? (((recentRevenue - oldRevenue) / oldRevenue) * 100).toFixed(1)
        : 0;

    const totalQuotes = await Quote.countDocuments();
    const lastMonthQuotes = await Quote.countDocuments({
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
    });
    const prevMonthQuotes = await Quote.countDocuments({
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        $lt: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      },
    });
    const quotesChange =
      prevMonthQuotes > 0
        ? (
            ((lastMonthQuotes - prevMonthQuotes) / prevMonthQuotes) *
            100
          ).toFixed(1)
        : 0;

    const convertedQuotes = await Quote.countDocuments({
      status: { $in: ["paid", "complete"] },
    });
    const conversionRate =
      totalQuotes > 0 ? ((convertedQuotes / totalQuotes) * 100).toFixed(1) : 0;

    const avgProjectValue =
      paidQuotes.length > 0 ? Math.round(totalRevenue / paidQuotes.length) : 0;

    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthQuotes = await Quote.find({
        paidAt: { $gte: monthStart, $lte: monthEnd },
        paymentStatus: "paid",
      });

      const monthRevenue = monthQuotes.reduce(
        (sum, q) => sum + (q.price || 0),
        0
      );
      const monthQuoteCount = await Quote.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      const uniqueClients = [...new Set(monthQuotes.map((q) => q.email))]
        .length;

      revenueData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthRevenue,
        quotes: monthQuoteCount,
        clients: uniqueClients,
      });
    }

    // === SERVICE DISTRIBUTION ===
    const allQuotes = await Quote.find();
    const serviceCount = {};
    allQuotes.forEach((q) => {
      const service = q.service || "Other";
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    const serviceData = Object.entries(serviceCount)
      .map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"][
          index % 5
        ],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // === LANGUAGE PAIRS ===
    const languagePairs = {};
    allQuotes.forEach((q) => {
      if (
        q.sourceLanguage &&
        q.targetLanguages &&
        q.targetLanguages.length > 0
      ) {
        q.targetLanguages.forEach((target) => {
          const pair = `${q.sourceLanguage} → ${target}`;
          languagePairs[pair] = (languagePairs[pair] || 0) + 1;
        });
      }
    });

    const topLanguagePairs = Object.entries(languagePairs)
      .map(([pair, count]) => ({ pair, count, change: 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // === CONVERSION DATA (Last 4 weeks) ===
    const conversionData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekQuotes = await Quote.countDocuments({
        createdAt: { $gte: weekStart, $lt: weekEnd },
      });

      const weekConversions = await Quote.countDocuments({
        createdAt: { $gte: weekStart, $lt: weekEnd },
        status: { $in: ["paid", "complete"] },
      });

      conversionData.push({
        week: `Week ${4 - i}`,
        quotes: weekQuotes,
        conversions: weekConversions,
      });
    }

    // === RESPONSE ===
    res.json({
      success: true,
      stats: {
        totalRevenue: {
          value: totalRevenue,
          change: parseFloat(revenueChange),
          trend: parseFloat(revenueChange) >= 0 ? "up" : "down",
        },
        totalQuotes: {
          value: totalQuotes,
          change: parseFloat(quotesChange),
          trend: parseFloat(quotesChange) >= 0 ? "up" : "down",
        },
        conversionRate: {
          value: parseFloat(conversionRate),
          change: 0, // Requires historical tracking
          trend: "up",
        },
        avgProjectValue: {
          value: avgProjectValue,
          change: 0, // Requires historical tracking
          trend: "up",
        },
      },
      revenueData,
      serviceData,
      languagePairs: topLanguagePairs,
      conversionData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

// POST /api/analytics/log - receive client-side telemetry for errors/events
export const logEvent = async (req, res) => {
  try {
    const { event, provider, code, message, userAgent, url, timestamp } =
      req.body || {};
    console.log(`Telemetry event received: ${event}`, {
      provider,
      code,
      message,
      userAgent,
      url,
      timestamp,
    });
    // Optionally: persist in DB for later analysis
    // For now: we just respond with success
    res.status(200).json({ success: true, message: "Telemetry logged" });
  } catch (error) {
    console.error("Telemetry log error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to log telemetry" });
  }
};
