import React, { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Mail,
  Calendar,
  TrendingUp,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Award,
  Clock,
  Sparkles,
  BarChart3,
  Inbox,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    quotes: { total: 0, change: 0, trend: "up" },
    subscribers: { total: 0, change: 0, trend: "up" },
    contacts: { total: 0, change: 0, trend: "up" },
  });

  const [recentQuotes, setRecentQuotes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [quotesRes, subscribersRes, contactsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/quotes`),
          fetch(`${BASE_URL}/api/subscribe`),
          fetch(`${BASE_URL}/api/contact`),
        ]);

        const [quotesData, subscribersData, contactsData] = await Promise.all([
          quotesRes.json(),
          subscribersRes.json(),
          contactsRes.json(),
        ]);

        const totalQuotes = quotesData.length;
        const totalSubs = subscribersData.length;
        const totalContacts = contactsData.length;

        setStats({
          quotes: { total: totalQuotes, change: 12.5, trend: "up" },
          subscribers: { total: totalSubs, change: 8.3, trend: "up" },
          contacts: { total: totalContacts, change: 3.2, trend: "up" },
        });

        const sortedQuotes = quotesData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setRecentQuotes(sortedQuotes);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-500/20 blur-3xl"></div>

        <div className="relative z-10 p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Dashboard Overview
                  </h1>
                  <p className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Real-time insights from your ILI platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg">
              <Clock className="w-4 h-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quotes */}
        <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-lg group rounded-2xl hover:shadow-xl hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-2xl group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                <FileText className="text-white w-7 h-7" />
              </div>
              <span
                className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${
                  stats.quotes.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stats.quotes.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stats.quotes.change}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.quotes.total}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-600">
              Total Quote Requests
            </p>
          </div>
        </div>

        {/* Subscribers */}
        <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-lg group rounded-2xl hover:shadow-xl hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-2xl group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                <Users className="text-white w-7 h-7" />
              </div>
              <span className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                <ArrowUpRight className="w-4 h-4" /> {stats.subscribers.change}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.subscribers.total}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-600">
              Active Subscribers
            </p>
          </div>
        </div>

        {/* Contacts */}
        <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-lg group rounded-2xl hover:shadow-xl hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-2xl group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                <Mail className="text-white w-7 h-7" />
              </div>
              <span className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                <ArrowUpRight className="w-4 h-4" /> {stats.contacts.change}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.contacts.total}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-600">
              Contact Messages
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Quotes Section */}
      <div className="relative overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Quote Requests
                </h3>
                <p className="text-sm text-gray-600">
                  {recentQuotes.length > 0
                    ? `Latest ${recentQuotes.length} quote submissions`
                    : "No quote requests yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {recentQuotes.length > 0 ? (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <div
                  key={quote._id}
                  className="flex items-center justify-between p-4 transition-all duration-200 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-green-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white shadow-md bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      {quote.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {quote.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {quote.service || "General Inquiry"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${getStatusColor(
                        quote.status || "pending"
                      )}`}
                    >
                      {quote.status || "pending"}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-2xl"></div>
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <Inbox className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">
                No Quote Requests Yet
              </h4>
              <p className="max-w-md mb-6 text-sm text-gray-600">
                When clients submit quote requests through your website, they'll
                appear here. You'll be able to track and manage all incoming
                requests in real-time.
              </p>
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-lg bg-green-50">
                <Sparkles className="w-4 h-4" />
                Ready to receive your first request
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Mission Banner */}
      <div className="relative overflow-hidden shadow-xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700"></div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-white/20 backdrop-blur-sm rounded-2xl">
                <Globe className="text-white w-9 h-9" />
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-white">
                  Our Mission in Action
                </h3>
                <p className="text-lg text-green-50">
                  Connecting{" "}
                  <span className="font-bold text-white">
                    {stats.subscribers.total.toLocaleString()}+
                  </span>{" "}
                  users worldwide through ILI translations
                </p>
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
