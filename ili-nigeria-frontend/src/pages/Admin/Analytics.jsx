import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Globe,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30days");

  // Mock data - replace with real API data
  const revenueData = [
    { month: "Jan", revenue: 45000, quotes: 89, clients: 45 },
    { month: "Feb", revenue: 52000, quotes: 102, clients: 51 },
    { month: "Mar", revenue: 48000, quotes: 95, clients: 48 },
    { month: "Apr", revenue: 61000, quotes: 118, clients: 59 },
    { month: "May", revenue: 55000, quotes: 108, clients: 54 },
    { month: "Jun", revenue: 67000, quotes: 131, clients: 66 },
  ];

  const serviceData = [
    { name: "Document Translation", value: 245, color: "#10b981" },
    { name: "Website Localization", value: 187, color: "#3b82f6" },
    { name: "Interpretation", value: 112, color: "#f59e0b" },
    { name: "Subtitling", value: 89, color: "#8b5cf6" },
    { name: "Transcreation", value: 67, color: "#ec4899" },
  ];

  const languagePairs = [
    { pair: "English → Spanish", count: 234, change: 12.5 },
    { pair: "English → French", count: 198, change: 8.3 },
    { pair: "English → German", count: 176, change: -3.2 },
    { pair: "English → Chinese", count: 145, change: 15.7 },
    { pair: "Spanish → English", count: 123, change: 6.9 },
  ];

  const conversionData = [
    { week: "Week 1", quotes: 45, conversions: 38 },
    { week: "Week 2", quotes: 52, conversions: 44 },
    { week: "Week 3", quotes: 48, conversions: 41 },
    { week: "Week 4", quotes: 61, conversions: 52 },
  ];

  const stats = {
    totalRevenue: { value: 328000, change: 15.3, trend: "up" },
    totalQuotes: { value: 643, change: 8.7, trend: "up" },
    conversionRate: { value: 84.2, change: 3.2, trend: "up" },
    avgProjectValue: { value: 510, change: -2.1, trend: "down" },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your business performance and insights
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.totalRevenue.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.totalRevenue.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stats.totalRevenue.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ${stats.totalRevenue.value.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.totalQuotes.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.totalQuotes.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stats.totalQuotes.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalQuotes.value}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Total Quotes</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.conversionRate.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.conversionRate.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stats.conversionRate.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.conversionRate.value}%
          </h3>
          <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.avgProjectValue.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.avgProjectValue.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(stats.avgProjectValue.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ${stats.avgProjectValue.value}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Avg Project Value</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-600 mt-1">
              Monthly revenue performance
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Service Distribution
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Requests by service type
              </p>
            </div>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {serviceData.map((service) => (
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

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Conversion Rate
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Quotes vs conversions
              </p>
            </div>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="quotes"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                name="Quotes Sent"
              />
              <Bar
                dataKey="conversions"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="Converted"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Language Pairs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Top Language Pairs
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Most requested translation directions
            </p>
          </div>
          <Globe className="w-5 h-5 text-green-600" />
        </div>
        <div className="space-y-4">
          {languagePairs.map((pair, index) => (
            <div
              key={pair.pair}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center font-bold text-green-700">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{pair.pair}</p>
                  <p className="text-sm text-gray-600">{pair.count} requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    pair.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pair.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(pair.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Peak Performance</h3>
          </div>
          <p className="text-sm text-gray-700">
            June was your best month with $67,000 in revenue and 131 quotes
            processed.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Client Growth</h3>
          </div>
          <p className="text-sm text-gray-700">
            Your client base grew by 46% over the past 6 months with 323 unique
            clients.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Global Reach</h3>
          </div>
          <p className="text-sm text-gray-700">
            Document Translation remains your top service, accounting for 35% of
            all requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
