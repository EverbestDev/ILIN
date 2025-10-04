import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- ADDED: useNavigate
import {
  FileText,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight, // <-- ADDED: for StatCard component
  TrendingUp,
  Mail,
  CheckCircle,
  Globe,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

// Helper component for the stats cards (reused from Admin design)
const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const isUp = trend === "up";
  const trendColor = isUp ? "text-green-600" : "text-red-600";
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`p-5 bg-white rounded-xl shadow-sm border ${color}-200`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className={`w-5 h-5 ${trendColor}`} />
      </div>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-xs font-medium ${trendColor}`}>{change}%</span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

// --- START OF CLIENT DASHBOARD COMPONENT ---
const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const userName = "Sarah Chen"; // Mock Client Data

  // <-- ADDED: Initialize useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate data loading from API
    setTimeout(() => setLoading(false), 800);
    // In a real app: fetchClientStats(), fetchRecentActivity()
  }, []);

  // Mock data - replace with real API calls for the logged-in user
  const clientStats = {
    totalOrders: { total: 12, change: 15.0, trend: "up" },
    inProgress: { total: 3, change: -5.0, trend: "down" },
    completed: { total: 9, change: 25.0, trend: "up" },
    totalSpent: { total: "$1,850", change: 8.5, trend: "up" },
  };

  const recentActivity = [
    {
      id: 5,
      type: "Order Complete",
      description: "Translation for Quote #1012 is complete.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
      path: "/client/orders/1012",
    },
    {
      id: 4,
      type: "Payment Received",
      description: "Payment of $450 for Quote #1011 processed.",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-blue-600",
      path: "/client/orders/1011",
    },
    {
      id: 3,
      type: "Order Update",
      description: "Quote #1012 status changed to 'In Progress'.",
      time: "3 days ago",
      icon: Clock,
      color: "text-yellow-600",
      path: "/client/orders/1012",
    },
    {
      id: 2,
      type: "New Message",
      description: "Admin replied to your inquiry about certified translation.",
      time: "1 week ago",
      icon: Mail,
      color: "text-purple-600",
      path: "/client/messages",
    },
  ];

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <div className="text-center text-gray-500">Loading client data...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
      {/* Header and Greeting */}
      <header className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="mt-1 text-gray-600">
          Manage your translation projects and account settings here.
        </p>
      </header>

      {/* 1. Client Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={clientStats.totalOrders.total}
          change={clientStats.totalOrders.change}
          trend={clientStats.totalOrders.trend}
          icon={FileText}
          color="border-green"
        />
        <StatCard
          title="Orders In-Progress"
          value={clientStats.inProgress.total}
          change={clientStats.inProgress.change}
          trend={clientStats.inProgress.trend}
          icon={Clock}
          color="border-yellow"
        />
        <StatCard
          title="Orders Completed"
          value={clientStats.completed.total}
          change={clientStats.completed.change}
          trend={clientStats.completed.trend}
          icon={CheckCircle}
          color="border-blue"
        />
        <StatCard
          title="Total Spending"
          value={clientStats.totalSpent.total}
          change={clientStats.totalSpent.change}
          trend={clientStats.totalSpent.trend}
          icon={DollarSign}
          color="border-purple"
        />
      </div>

      {/* 2. Main Content: Recent Activity and Quick Action */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity Feed (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  // <-- ADDED: onClick for navigation
                  onClick={() => navigate(activity.path)}
                  className="flex items-start gap-4 p-3 transition-colors duration-200 border-b border-gray-100 rounded-lg cursor-pointer last:border-b-0 hover:bg-gray-50"
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.type}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <time className="flex-shrink-0 text-xs text-gray-400">
                    {activity.time}
                  </time>
                </div>
              ))}
            </div>
            <div className="pt-4 text-right">
              <button
                // <-- ADDED: Navigation to Orders list
                onClick={() => navigate("/client/orders")}
                className="flex items-center gap-1 ml-auto text-sm font-medium text-green-600 hover:text-green-700"
              >
                View All Orders <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Card (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="flex flex-col justify-between h-full p-6 shadow-lg bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
            <div>
              <PlusCircle className="w-8 h-8 mb-4 text-white" />
              <h3 className="mb-2 text-xl font-bold text-white">
                Need a New Translation?
              </h3>
              <p className="text-sm text-green-100">
                Start a new project or request a free quote in seconds.
              </p>
            </div>
            <button
              // <-- ADDED: Navigation to the Quote Submission page
              onClick={() => navigate("/request-quote")} // Assuming this is outside the dashboard layout
              className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 text-lg font-bold text-green-700 transition-colors bg-white shadow-md rounded-xl hover:bg-gray-100"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mission Banner */}
      <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
        <div className="items-center justify-between block md:flex">
          {/* Mobile/MD: Icon and text always stay inline (flex) */}
          <div className="items-center block gap-4 md:flex">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <Globe className="text-white w-7 h-7" />
            </div>
            <div>
              <h3 className="my-1 text-xl font-bold">We're Here to Help</h3>
              <p className="text-blue-100">
                Have a question? Contact our dedicated support team directly.
              </p>
            </div>
          </div>
          <button
            // <-- ADDED: Navigation to the Messages/Contact page
            onClick={() => navigate("/client/messages")}
            // Mobile: Full width, top margin (mt-4). MD: auto width (md:w-auto), no margin (md:mt-0).
            className="w-full px-4 py-3 mt-4 font-semibold text-blue-700 transition-colors bg-white rounded-lg md:w-auto md:mt-0 hover:bg-gray-100"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
