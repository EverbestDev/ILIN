import React, { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Mail,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  Sparkles,
  Inbox,
  Filter,
  TrendingUp,
  Award,
} from "lucide-react";

const Dashboard = () => {
  const BASE_URL = VITE_API_BASE_URL || "http://localhost:5000";
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
        <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="hidden p-3 shadow-lg bg-gradient-to-br from-green-600 to-green-700 rounded-xl md:flex">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-slate-600">
              Real-time summary from your ILI backend
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Matching Quotes.jsx style */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quotes */}
        <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.quotes.trend === "up" ? "text-green-600" : "text-red-600"
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
          <p className="text-2xl font-bold text-slate-900">
            {stats.quotes.total}
          </p>
          <p className="mt-1 text-xs text-slate-600">Total Quote Requests</p>
        </div>

        {/* Subscribers */}
        <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" /> {stats.subscribers.change}%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.subscribers.total}
          </p>
          <p className="mt-1 text-xs text-slate-600">Active Subscribers</p>
        </div>

        {/* Contacts */}
        <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" /> {stats.contacts.change}%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.contacts.total}
          </p>
          <p className="mt-1 text-xs text-slate-600">Contact Messages</p>
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-blue-50/50 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Quote Requests
                </h3>
                <p className="text-sm text-slate-600">
                  {recentQuotes.length > 0
                    ? `Latest ${recentQuotes.length} submissions`
                    : "No requests yet"}
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
                  className="flex items-center justify-between p-4 transition-all duration-200 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-green-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-br from-green-500 to-green-600">
                      {quote.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{quote.name}</p>
                      <p className="text-sm text-slate-600">
                        {quote.service || "General Inquiry"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        quote.status || "pending"
                      )}`}
                    >
                      {quote.status || "pending"}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(quote.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-900">
                No Quote Requests Yet
              </h4>
              <p className="max-w-md mb-4 text-sm text-slate-600">
                When clients submit quote requests through your website, they'll
                appear here. You'll be able to track and manage all incoming
                requests in real-time.
              </p>
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-lg bg-green-50">
                <Sparkles className="w-4 h-4" />
                Ready to receive requests
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mission Banner */}
      <div className="p-6 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <Globe className="text-white w-7 h-7" />
            </div>
            <div>
              <h3 className="mb-1 text-xl font-bold">Our Mission in Action</h3>
              <p className="text-green-100">
                Connecting {stats.subscribers.total.toLocaleString()}+ users
                worldwide through ILI translations
              </p>
            </div>
          </div>
          <CheckCircle className="w-8 h-8 text-white/80" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
