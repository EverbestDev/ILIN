import React, { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Mail,
  TrendingUp,
  Globe,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";
import { Line, Pie, Bar } from "react-chartjs-2";

const Dashboard = () => {
  const BASE_URL =
    "https://ilin-backend.onrender.com" || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [stats, setStats] = useState({
    quotes: { total: 0, change: 0, trend: "up" },
    subscribers: { total: 0, change: 0, trend: "up" },
    contacts: { total: 0, change: 0, trend: "up" },
  });
  const [rawTasks, setRawTasks] = useState([]);
  const [rawQuotes, setRawQuotes] = useState([]);
  const [rawSubscribers, setRawSubscribers] = useState([]);
  const [rawContacts, setRawContacts] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [monthlyQuotes, setMonthlyQuotes] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [weeklyQuotes, setWeeklyQuotes] = useState([]);

  // Calculate date range for filtering
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    return startDate;
  };

  // Fetch data once on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, quotesRes, subscribersRes, contactsRes, tasksRes] =
          await Promise.all([
            fetch(`${BASE_URL}/api/admin/overview`).then((res) =>
              res.ok
                ? res.json()
                : Promise.reject(new Error("Failed to fetch stats"))
            ),
            fetch(`${BASE_URL}/api/quotes`).then((res) =>
              res.ok
                ? res.json()
                : Promise.reject(new Error("Failed to fetch quotes"))
            ),
            fetch(`${BASE_URL}/api/subscribe`).then((res) =>
              res.ok
                ? res.json()
                : Promise.reject(new Error("Failed to fetch subscribers"))
            ),
            fetch(`${BASE_URL}/api/contact`).then((res) =>
              res.ok
                ? res.json()
                : Promise.reject(new Error("Failed to fetch contacts"))
            ),
            fetch(`${BASE_URL}/api/tasks`).then((res) =>
              res.ok
                ? res.json()
                : Promise.reject(new Error("Failed to fetch tasks"))
            ),
          ]);

        console.log("Stats Response:", statsRes);
        console.log("Quotes:", quotesRes.length);
        console.log("Subscribers:", subscribersRes.length);
        console.log("Contacts:", contactsRes.length);
        console.log("Tasks:", tasksRes.length);

        setStats({
          quotes: statsRes.quotes || {
            total: quotesRes.length,
            change: 0,
            trend: "up",
          },
          subscribers: statsRes.subscribers || {
            total: subscribersRes.length,
            change: 0,
            trend: "up",
          },
          contacts: statsRes.contacts || {
            total: contactsRes.length,
            change: 0,
            trend: "up",
          },
        });

        setRawQuotes(
          quotesRes.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setRawSubscribers(
          subscribersRes.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setRawContacts(
          contactsRes.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setRawTasks(
          tasksRes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load some data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [BASE_URL]);

  // Process data for charts and snippets
 

  useEffect(() => {
    // Log for debugging
    console.log("Raw Quotes:", rawQuotes.length, rawQuotes);
    console.log("Raw Subscribers:", rawSubscribers.length, rawSubscribers);
    console.log("Raw Contacts:", rawContacts.length, rawContacts);
    console.log("Raw Tasks:", rawTasks.length, rawTasks);

    const startDate = getDateRange();

    // Filter data
    const filteredQuotes = rawQuotes.filter(
      (q) => new Date(q.createdAt) >= startDate
    );
    const filteredSubscribers = rawSubscribers.filter(
      (s) => new Date(s.createdAt) >= startDate
    );
    const filteredContacts = rawContacts.filter(
      (c) => new Date(c.createdAt) >= startDate
    );

    console.log("Filtered Quotes:", filteredQuotes.length, filteredQuotes);
    console.log("Filtered Subscribers:", filteredSubscribers.length);
    console.log("Filtered Contacts:", filteredContacts.length);

    // Recent snippets (use rawContacts for contacts to show recent ones)
    setRecentQuotes(filteredQuotes.slice(0, 4));
    setRecentSubscribers(filteredSubscribers.slice(0, 4));
    setRecentContacts(rawContacts.slice(0, 2)); // Fix: Use rawContacts to show newest

    // Monthly Quotes
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const numMonths = timeRange === "year" ? 12 : 6;
    const monthlyData = Array(numMonths)
      .fill()
      .map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (numMonths - 1 - i));
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const count = filteredQuotes.filter(
          (q) =>
            new Date(q.createdAt) >= monthStart &&
            new Date(q.createdAt) <= monthEnd
        ).length;
        return { month: months[date.getMonth()], quotes: count };
      });
    setMonthlyQuotes(monthlyData);

    // Service Distribution
    const services = filteredQuotes.reduce((acc, q) => {
      acc[q.service] = (acc[q.service] || 0) + 1;
      return acc;
    }, {});
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];
    setServiceDistribution(
      Object.entries(services).map(([name, value], i) => ({
        name: name || "General Inquiry",
        value,
        color: colors[i % colors.length],
      }))
    );

    // Weekly Quotes (last 7 days from today, account for WAT timezone)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const weeklyData = Array(7)
      .fill()
      .map((_, i) => {
        const dayDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - (6 - i)
        );
        const dayStart = new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate()
        );
        const dayEnd = new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate() + 1
        );
        // Adjust for WAT (UTC+1) by shifting dates to local time
        const count = rawQuotes.filter((q) => {
          const quoteDate = new Date(q.createdAt);
          // Convert UTC to WAT for comparison
          const quoteDateWAT = new Date(
            quoteDate.getTime() + 1 * 60 * 60 * 1000
          );
          return quoteDateWAT >= dayStart && quoteDateWAT < dayEnd;
        }).length;
        return { day: days[dayDate.getDay()], requests: count };
      });
    setWeeklyQuotes(weeklyData);
    console.log("Weekly Quotes Data:", weeklyData);
  }, [timeRange, rawQuotes, rawSubscribers, rawContacts, rawTasks]);

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

  // Static urgent tasks
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chart data and options
  const monthlyQuotesChartData = {
    labels: monthlyQuotes.map((item) => item.month),
    datasets: [
      {
        label: "Quotes",
        data: monthlyQuotes.map((item) => item.quotes),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#10b981",
      },
    ],
  };

  const monthlyQuotesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
      y: { grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280" } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#374151" },
    },
  };

  const serviceDistributionChartData = {
    labels: serviceDistribution.map((item) => item.name),
    datasets: [
      {
        data: serviceDistribution.map((item) => item.value),
        backgroundColor: serviceDistribution.map((item) => item.color),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const serviceDistributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#6b7280" } },
      tooltip: { backgroundColor: "#374151" },
    },
  };

  const weeklyQuotesChartData = {
    labels: weeklyQuotes.map((item) => item.day),
    datasets: [
      {
        label: "Requests",
        data: weeklyQuotes.map((item) => item.requests),
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  const weeklyQuotesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: { color: "#6b7280" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#374151" },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
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
              {Math.abs(stats.quotes.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.quotes.total}
          </h3>
          <p className="mt-1 text-sm text-gray-600">Quote Requests</p>
        </div>
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
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
              {Math.abs(stats.subscribers.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.subscribers.total}
          </h3>
          <p className="mt-1 text-sm text-gray-600">Subscribers</p>
        </div>
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
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
          <p className="mt-1 text-sm text-gray-600">Contact Messages</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Quotes Chart */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quote Trends
              </h3>
              <p className="mt-1 text-sm text-gray-600">Quotes over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div style={{ height: 300 }}>
            <Line
              data={monthlyQuotesChartData}
              options={monthlyQuotesChartOptions}
            />
          </div>
        </div>

        {/* Service Distribution */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              <p className="mt-1 text-sm text-gray-600">Distribution by type</p>
            </div>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div style={{ height: 200 }}>
            <Pie
              data={serviceDistributionChartData}
              options={serviceDistributionChartOptions}
            />
          </div>
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

      {/* Weekly Quotes Chart */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Quotes
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Quote requests this week
            </p>
          </div>
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <div style={{ height: 250 }}>
          <Bar
            data={weeklyQuotesChartData}
            options={weeklyQuotesChartOptions}
          />
        </div>
      </div>

      {/* Snippets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Quote Requests
            </h3>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentQuotes.length ? (
              recentQuotes.map((quote) => (
                <div
                  key={quote._id}
                  className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-lg bg-gradient-to-br from-green-600 to-green-700">
                      {quote.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {quote.service || "General Inquiry"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        quote.status || "pending"
                      )}`}
                    >
                      {quote.status || "pending"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                No quotes in this range
              </div>
            )}
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Subscribers
            </h3>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentSubscribers.length ? (
              recentSubscribers.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                      {sub.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sub.email || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-600">Subscribed</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                No subscribers in this range
              </div>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Contacts
            </h3>
            <button className="text-sm font-medium text-green-600 hover:text-green-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentContacts.length ? (
              recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-lg bg-gradient-to-br from-purple-600 to-purple-700">
                      {contact.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {contact.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {contact.service || "General Inquiry"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                No contacts in this range
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700">Add New Task</h4>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const task = e.target.task.value;
            const priority = e.target.priority.value;
            const due = e.target.due.value;
            try {
              const res = await fetch(`${BASE_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task, priority, due }),
              });
              if (res.ok) {
                const { task: newTask } = await res.json();
                setRawTasks((prev) => [newTask, ...prev]);
                e.target.reset();
              }
            } catch (error) {
              console.error("Failed to create task:", error);
            }
          }}
          className="flex gap-2 mt-2"
        >
          <input
            name="task"
            type="text"
            placeholder="Task description"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <select
            name="priority"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            name="due"
            type="datetime-local"
            className="px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </form>
      </div>
      {/* Urgent Tasks */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Urgent Tasks</h3>
          <Award className="w-5 h-5 text-green-600" />
        </div>
        <div className="space-y-3">
          {rawTasks.length ? (
            rawTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-start gap-3 p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={async () => {
                    try {
                      const res = await fetch(
                        `${BASE_URL}/api/tasks/${task._id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ completed: !task.completed }),
                        }
                      );
                      if (res.ok) {
                        setRawTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id
                              ? { ...t, completed: !t.completed }
                              : t
                          )
                        );
                      }
                    } catch (error) {
                      console.error("Failed to update task:", error);
                    }
                  }}
                  className="w-4 h-4 mt-1 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }`}
                  >
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
            ))
          ) : (
            <div className="text-center text-gray-600">No tasks available</div>
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
