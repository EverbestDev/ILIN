import React, { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Mail,
  Calendar,
  TrendingUp,
  Globe,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock data - replace with real API calls
  const stats = {
    quotes: { total: 248, change: 12.5, trend: "up" },
    subscribers: { total: 1847, change: 8.3, trend: "up" },
    contacts: { total: 89, change: -3.2, trend: "down" },
    schedules: { total: 34, change: 15.7, trend: "up" },
  };

  const revenueData = [
    { month: "Jan", revenue: 45000, target: 40000 },
    { month: "Feb", revenue: 52000, target: 45000 },
    { month: "Mar", revenue: 48000, target: 50000 },
    { month: "Apr", revenue: 61000, target: 55000 },
    { month: "May", revenue: 55000, target: 60000 },
    { month: "Jun", revenue: 67000, target: 65000 },
  ];

  const requestsData = [
    { day: "Mon", requests: 24 },
    { day: "Tue", requests: 31 },
    { day: "Wed", requests: 28 },
    { day: "Thu", requests: 35 },
    { day: "Fri", requests: 42 },
    { day: "Sat", requests: 18 },
    { day: "Sun", requests: 15 },
  ];

  const serviceDistribution = [
    { name: "Document Translation", value: 145, color: "#10b981" },
    { name: "Website Localization", value: 87, color: "#3b82f6" },
    { name: "Interpretation", value: 56, color: "#f59e0b" },
    { name: "Subtitling", value: 34, color: "#8b5cf6" },
  ];

  const recentQuotes = [
    {
      id: 1,
      client: "Sarah Chen",
      service: "Document Translation",
      status: "pending",
      date: "2 hours ago",
    },
    {
      id: 2,
      client: "Michael Rodriguez",
      service: "Website Localization",
      status: "completed",
      date: "5 hours ago",
    },
    {
      id: 3,
      client: "Emma Thompson",
      service: "Interpretation",
      status: "in-progress",
      date: "1 day ago",
    },
    {
      id: 4,
      client: "James Wilson",
      service: "Subtitling",
      status: "pending",
      date: "1 day ago",
    },
  ];

  const urgentTasks = [
    {
      id: 1,
      task: "Review urgent translation request",
      priority: "high",
      due: "Today, 3:00 PM",
    },
    {
      id: 2,
      task: "Follow up with VIP client",
      priority: "high",
      due: "Today, 5:00 PM",
    },
    {
      id: 3,
      task: "Prepare weekly report",
      priority: "medium",
      due: "Tomorrow",
    },
  ];

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
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
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.quotes.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Quote Requests</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.subscribers.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.subscribers.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {stats.subscribers.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.subscribers.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Subscribers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.contacts.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.contacts.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.contacts.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.contacts.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Contact Messages</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.schedules.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.schedules.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {stats.schedules.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.schedules.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Scheduled Events</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Monthly revenue vs target
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              <p className="text-sm text-gray-600 mt-1">Distribution by type</p>
            </div>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {serviceDistribution.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  <span className="text-sm text-gray-700">{service.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {service.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Requests Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Requests
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Quote requests this week
            </p>
          </div>
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={requestsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="requests" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Quote Requests
            </h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-semibold">
                    {quote.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {quote.client}
                    </p>
                    <p className="text-xs text-gray-600">{quote.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                  <span className="text-xs text-gray-500">{quote.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Urgent Tasks
            </h3>
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {task.task}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      Due: {task.due}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Our Mission in Action</h3>
              <p className="text-green-100">
                Breaking language barriers, connecting{" "}
                {stats.subscribers.total.toLocaleString()}+ people worldwide
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
