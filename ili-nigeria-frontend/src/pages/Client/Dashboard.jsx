import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Mail,
  CheckCircle,
  Globe,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminSettings, setAdminSettings] = useState({
    currency: "NGN",
  });
  const userName = "Sarah Chen";

  const navigate = useNavigate();

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };
  };

  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          "https://ilin-backend.onrender.com/api/settings/admin",
          {
            headers,
            credentials: "include",
          }
        );
        if (!res.ok)
          throw new Error(`Failed to fetch admin settings: ${res.status}`);
        const data = await res.json();
        setAdminSettings(data);
      } catch (err) {
        console.error("Fetch admin settings error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminSettings();
  }, []);

  const clientStats = {
    totalOrders: { total: 12, change: 15.0, trend: "up" },
    inProgress: { total: 3, change: -5.0, trend: "down" },
    completed: { total: 9, change: 25.0, trend: "up" },
    totalSpent: {
      total: `${adminSettings.currency} 1,850`,
      change: 8.5,
      trend: "up",
    },
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
    {
      id: 1,
      type: "New Quote",
      description: "Quote #1012 submitted successfully.",
      time: "1 week ago",
      icon: FileText,
      color: "text-indigo-600",
      path: "/client/orders/1012",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userName}
        </h1>
        <p className="mt-1 text-gray-600">Here's an overview of your account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={clientStats.totalOrders.total}
          change={clientStats.totalOrders.change}
          trend={clientStats.totalOrders.trend}
          icon={FileText}
          color="bg-green-100 border-green-200"
        />
        <StatCard
          title="In Progress"
          value={clientStats.inProgress.total}
          change={clientStats.inProgress.change}
          trend={clientStats.inProgress.trend}
          icon={Clock}
          color="bg-yellow-100 border-yellow-200"
        />
        <StatCard
          title="Completed"
          value={clientStats.completed.total}
          change={clientStats.completed.change}
          trend={clientStats.completed.trend}
          icon={CheckCircle}
          color="bg-blue-100 border-blue-200"
        />
        <StatCard
          title="Total Spent"
          value={clientStats.totalSpent.total}
          change={clientStats.totalSpent.change}
          trend={clientStats.totalSpent.trend}
          icon={DollarSign}
          color="bg-purple-100 border-purple-200"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 transition-colors border border-gray-100 rounded-xl hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      <button
                        onClick={() => navigate(activity.path)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="flex flex-col justify-between p-6 shadow-lg bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
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
            onClick={() => navigate("/request-quote")}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 text-lg font-bold text-green-700 transition-colors bg-white shadow-md rounded-xl hover:bg-gray-100"
          >
            Request Quote
          </button>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
        <div className="items-center justify-between block md:flex">
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
            onClick={() => navigate("/client/messages")}
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
