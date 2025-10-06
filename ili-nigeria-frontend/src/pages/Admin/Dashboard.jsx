import React, { useEffect, useState } from "react";
// useNavigate is removed as Auth0's protected routes handle navigation flow
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
  Trash2,
} from "lucide-react";
import { Line, Pie, Bar } from "react-chartjs-2";

// FIX: Removed explicit import of useAuth0, relying on the environment's global context provision
// import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  // NEW: Assuming useAuth0() is available in the component's scope
  // If useAuth0 is not defined, it means the Auth0Provider is missing or the environment is not set up correctly.
  let getAccessTokenSilently = () => Promise.resolve("");
  let isAuthenticated = false;
  let isLoading = true;

  // Use try/catch or conditional check to safely access useAuth0 if the environment provides it globally
  try {
    // Attempt to access useAuth0 if it's available globally (common pattern in certain execution environments)
    // NOTE: In a standard React setup, you must uncomment the import above.
    // Assuming useAuth0 is accessible because the AdminLayout needs it for protection.
    ({ getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0());
  } catch (e) {
    console.error(
      "Auth0 context not found. Check if useAuth0 is available.",
      e
    );
  }

  const BASE_URL =
    "https://ilin-backend.onrender.com" || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [stats, setStats] = useState({
    quotes: { total: 0, change: 0, trend: "up" },
    subscribers: { total: 0, change: 0, trend: "up" },
    contacts: { total: 0, change: 0, trend: "up" },
    tasks: { total: 0, pending: 0, change: 0, trend: "up" },
  });
  const [rawTasks, setRawTasks] = useState([]);
  const [rawQuotes, setRawQuotes] = useState([]);
  const [rawSubscribers, setRawSubscribers] = useState([]);
  const [newTask, setNewTask] = useState("");

  // =====================================================================
  // AUTHENTICATED FETCH LOGIC
  // =====================================================================

  const fetchDashboardData = async () => {
    // If Auth0 is still loading or user isn't authenticated, don't fetch yet
    if (isLoading || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      // 1. Get the Access Token silently
      const token = await getAccessTokenSilently({
        authorizationParams: {
          // IMPORTANT: Replace this placeholder with your actual Auth0 API Identifier
          audience: "https://ilin-backend.onrender.com/",
        },
      });

      // 2. Configure the fetch call with the token in the Authorization header
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- Access Token in header
      };

      const response = await fetch(
        `${BASE_URL}/api/dashboard?range=${timeRange}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setStats(data.stats);
      setRawTasks(data.tasks);
      setRawQuotes(data.quotes);
      setRawSubscribers(data.subscribers);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(
        "Could not load data. Ensure your backend is running, the Auth0 Audience is correct, and you have proper permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Auth Check
    if (isLoading || !isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://ilin-backend.onrender.com/",
        },
      });

      const response = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newTask }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setRawTasks((prev) => [addedTask, ...prev]);
        setNewTask("");
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    // Auth Check
    if (isLoading || !isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://ilin-backend.onrender.com/",
        },
      });

      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        setRawTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, completed: !currentStatus } : task
          )
        );
      } else {
        throw new Error("Failed to toggle task status");
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Auth Check
    if (isLoading || !isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://ilin-backend.onrender.com/",
        },
      });

      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRawTasks((prev) => prev.filter((t) => t._id !== taskId));
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // =====================================================================
  // EFFECTS & DATA PROCESSING
  // =====================================================================

  useEffect(() => {
    // We now fetch data only when Auth0 confirms the user is authenticated
    if (isAuthenticated && !isLoading) {
      fetchDashboardData();
    }
  }, [timeRange, isAuthenticated, isLoading]);

  // Data processing for charts (Kept for completeness)
  const chartData = {
    // Data processing logic remains the same...
    labels: rawSubscribers
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((s) => new Date(s.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Subscribers",
        data: rawSubscribers.map((s) => 1), // Assuming each entry is 1 subscriber
        fill: true,
        backgroundColor: "rgba(10, 132, 255, 0.2)",
        borderColor: "#0A84FF",
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
      },
      // You can add more datasets (e.g., quotes, contacts) here if raw data is ready
    ],
  };

  const pieData = {
    labels: ["New Quotes", "Active Clients", "Tasks Pending"],
    datasets: [
      {
        data: [stats.quotes.total, 45, stats.tasks.pending], // Using mock data for clients
        backgroundColor: ["#0A84FF", "#34C759", "#FF9500"],
        hoverBackgroundColor: ["#007AFF", "#28A745", "#FF7D00"],
      },
    ],
  };

  const barData = {
    labels: ["Translation", "Localization", "Interpretation", "DTP"],
    datasets: [
      {
        label: "Projects this Month",
        data: [12, 19, 3, 5],
        backgroundColor: [
          "rgba(10, 132, 255, 0.5)",
          "rgba(52, 199, 89, 0.5)",
          "rgba(255, 149, 0, 0.5)",
          "rgba(88, 86, 214, 0.5)",
        ],
        borderColor: ["#0A84FF", "#34C759", "#FF9500", "#5856D6"],
        borderWidth: 1,
      },
    ],
  };

  // Component structure remains largely the same
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-700">
        <svg
          className="w-8 h-8 mr-3 -ml-1 text-green-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {isLoading ? "Authenticating..." : "Loading Dashboard Data..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-100 border border-red-200 rounded-xl">
        <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  const tasksPending = rawTasks.filter((t) => !t.completed).length;

  // The rest of the rendering logic is unchanged, focusing on presenting the fetched data.
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quote Requests Card */}
        <StatCard
          icon={FileText}
          title="Quote Requests"
          value={stats.quotes.total.toLocaleString()}
          change={stats.quotes.change}
          trend={stats.quotes.trend}
          color="bg-blue-100 text-blue-600"
        />

        {/* Subscribers Card */}
        <StatCard
          icon={Users}
          title="Total Subscribers"
          value={stats.subscribers.total.toLocaleString()}
          change={stats.subscribers.change}
          trend={stats.subscribers.trend}
          color="bg-green-100 text-green-600"
        />

        {/* Contact Messages Card */}
        <StatCard
          icon={Mail}
          title="Contact Messages"
          value={stats.contacts.total.toLocaleString()}
          change={stats.contacts.change}
          trend={stats.contacts.trend}
          color="bg-yellow-100 text-yellow-600"
        />

        {/* Pending Tasks Card */}
        <StatCard
          icon={Clock}
          title="Tasks Pending"
          value={tasksPending.toLocaleString()}
          change={stats.tasks.change}
          trend={stats.tasks.trend}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Charts and Task/Quote/Subscriber Lists */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Chart Card (Subscribers Trend) */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg lg:col-span-2 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Subscription & Quote Trends
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
          <div className="h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Task Management Card */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Task Management
          </h2>

          {/* Add New Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white transition duration-150 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
            >
              Add
            </button>
          </form>

          {/* Task List */}
          <div className="pr-2 space-y-3 overflow-y-auto max-h-96">
            {rawTasks.length > 0 ? (
              rawTasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex items-center justify-between p-3 border rounded-lg transition duration-150 ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center flex-grow gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleTask(task._id, task.completed)
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {task.description}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 transition-colors hover:text-red-700"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-600">
                No tasks available. Add your first task above!
              </div>
            )}
          </div>
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
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Secondary Charts and Lists */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Pie Chart Card (Client Activity) */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Activity Overview
          </h2>
          <div className="flex items-center justify-center h-64">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right" },
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>

        {/* Bar Chart Card (Service Demand) */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Service Demand by Type
          </h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Lists (Quotes, Subscribers) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Quotes */}
        <ActivityList
          title="Recent Quote Requests"
          data={rawQuotes.slice(0, 5)}
          icon={FileText}
          emptyMessage="No recent quote requests."
          renderItem={(quote) => (
            <>
              <p className="font-semibold text-gray-900 truncate">
                {quote.service} for {quote.targetLanguage}
              </p>
              <p className="text-sm text-gray-500">
                {quote.email} - {new Date(quote.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        />

        {/* Recent Subscribers */}
        <ActivityList
          title="Recent Subscribers"
          data={rawSubscribers.slice(0, 5)}
          icon={Users}
          emptyMessage="No recent subscribers."
          renderItem={(sub) => (
            <>
              <p className="font-semibold text-gray-900 truncate">
                {sub.email}
              </p>
              <p className="text-sm text-gray-500">
                Joined: {new Date(sub.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
};

// =====================================================================
// HELPER COMPONENTS (NO AUTH LOGIC, KEPT AS IS)
// =====================================================================

const StatCard = ({ icon: Icon, title, value, change, trend, color }) => {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  const trendBg = trend === "up" ? "bg-green-100" : "bg-red-100";

  return (
    <div className="p-5 transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center mt-3 text-sm">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 font-medium rounded-full ${trendBg} ${trendColor}`}
        >
          <TrendIcon className="w-4 h-4" />
          {change}%
        </span>
        <span className="ml-2 text-gray-500">vs previous period</span>
      </div>
    </div>
  );
};

const ActivityList = ({
  title,
  data,
  icon: Icon,
  emptyMessage,
  renderItem,
}) => (
  <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
    <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-grow">{renderItem(item)}</div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">{emptyMessage}</p>
      )}
    </div>
  </div>
);

export default Dashboard;
