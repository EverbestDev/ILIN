import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Globe,
  Activity,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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
import { auth } from "../../utility/firebase";

const API_URL = import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Analytics data
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    task: "",
    priority: "medium",
    due: "",
    email: "",
  });
  
  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getAuthHeaders = async () => {
    const token = await auth.currentUser.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/analytics`, { headers });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRevenueData(data.revenueData);
          setServiceData(data.serviceData);
          setLanguagePairs(data.languagePairs);
          setConversionData(data.conversionData);
        }
      } catch (error) {
        console.error("Fetch analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/tasks`, { headers });
        if (res.ok) {
          const data = await res.json();
          setTasks(data || []);
        }
      } catch (error) {
        console.error("Fetch tasks error:", error);
      }
    };

    if (auth.currentUser) {
      fetchAnalytics();
      fetchTasks();
    }
  }, []);

  // Task CRUD
  const handleCreateTask = async () => {
    if (!taskForm.task.trim() || !taskForm.due) {
      showNotification("Task and due date are required", "error");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...taskForm,
          email: taskForm.email || auth.currentUser.email,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks([...tasks, data.task]);
        setShowTaskModal(false);
        setTaskForm({ task: "", priority: "medium", due: "", email: "" });
        showNotification("Task created successfully", "success");
      }
    } catch (error) {
      console.error("Create task error:", error);
      showNotification("Failed to create task", "error");
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(tasks.map(t => t._id === id ? data.task : t));
        showNotification("Task updated", "success");
      }
    } catch (error) {
      console.error("Update task error:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
        showNotification("Task deleted", "success");
      }
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  // Calendar utilities
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    // Previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.due);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-4 space-y-4 sm:space-y-6 sm:p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 sm:px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium sm:text-base">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Real-time business performance insights
        </p>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 sm:w-12 sm:h-12 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600 sm:w-6 sm:h-6" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                  stats.totalRevenue.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalRevenue.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {Math.abs(stats.totalRevenue.change)}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate sm:text-2xl">
              ₦{stats.totalRevenue.value.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">Total Revenue</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 sm:w-12 sm:h-12 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600 sm:w-6 sm:h-6" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                  stats.totalQuotes.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalQuotes.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {Math.abs(stats.totalQuotes.change)}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">{stats.totalQuotes.value}</h3>
            <p className="text-xs text-gray-600 sm:text-sm">Total Quotes</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 sm:w-12 sm:h-12 rounded-xl">
                <Activity className="w-5 h-5 text-purple-600 sm:w-6 sm:h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">{stats.conversionRate.value}%</h3>
            <p className="text-xs text-gray-600 sm:text-sm">Conversion Rate</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 sm:w-12 sm:h-12 rounded-xl">
                <BarChart3 className="w-5 h-5 text-orange-600 sm:w-6 sm:h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate sm:text-2xl">
              ₦{stats.avgProjectValue.value.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">Avg Project Value</p>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-xl">Revenue Trend</h2>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Last 6 months</p>
            </div>
            <TrendingUp className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Service Distribution */}
        {serviceData.length > 0 && (
          <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-xl">Service Distribution</h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">Top services</p>
              </div>
              <Globe className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="flex-shrink-0 w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-xs text-gray-700 truncate sm:text-sm">{service.name}</span>
                  </div>
                  <span className="flex-shrink-0 ml-2 text-xs font-medium text-gray-900 sm:text-sm">
                    {service.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversion Rate */}
        {conversionData.length > 0 && (
          <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-xl">Conversion Rate</h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">Last 4 weeks</p>
              </div>
              <Activity className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="quotes" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Quotes" />
                    <Bar dataKey="conversions" fill="#10b981" radius={[6, 6, 0, 0]} name="Converted" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Pairs */}
      {languagePairs.length > 0 && (
        <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-xl">Top Language Pairs</h2>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Most requested</p>
            </div>
            <Globe className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {languagePairs.map((pair, index) => (
              <div
                key={pair.pair}
                className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3 min-w-0 sm:gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-green-700 bg-green-100 rounded-lg">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate sm:text-base">{pair.pair}</p>
                    <p className="text-xs text-gray-600 sm:text-sm">{pair.count} requests</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar & Tasks */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 sm:text-xl">Calendar</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-sm font-medium text-gray-900 sm:text-base">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 sm:gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs font-semibold text-center text-gray-600 sm:text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, index) => {
              const dayTasks = day ? getTasksForDate(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  disabled={!day}
                  className={`
                    relative aspect-square p-1 text-xs sm:text-sm rounded-lg transition-all
                    ${!day ? "invisible" : ""}
                    ${isToday ? "bg-green-600 text-white font-bold" : ""}
                    ${isSelected && !isToday ? "bg-green-100 text-green-900" : ""}
                    ${!isToday && !isSelected ? "hover:bg-gray-100" : ""}
                    ${dayTasks.length > 0 && !isToday ? "border-2 border-orange-400" : ""}
                  `}
                >
                  {day && (
                    <>
                      <span>{day.getDate()}</span>
                      {dayTasks.length > 0 && (
                        <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-4 mt-4 text-xs border-t sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-orange-400 rounded"></div>
              <span className="text-gray-600">Has Tasks</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm sm:p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-xl">Tasks</h2>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setTaskForm({ task: "", priority: "medium", due: "", email: "" });
                setShowTaskModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-600">No tasks for this day</p>
              </div>
            ) : (
              getTasksForDate(selectedDate).map((task) => {
                const isOverdue = new Date(task.due) < new Date() && !task.completed;

                return (
                  <div
                    key={task._id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      task.completed
                        ? "bg-gray-50 border-gray-200"
                        : isOverdue
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => handleUpdateTask(task._id, { completed: e.target.checked })}
                          className="flex-shrink-0 mt-1"
                        />
                        <div className="min-w-0">
                          <h3
                            className={`text-sm font-medium truncate ${
                              task.completed ? "line-through text-gray-600" : "text-gray-900"
                            }`}
                          >
                            {task.task}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                            <span
                              className={`font-medium ${
                                task.priority === "high"
                                  ? "text-red-600"
                                  : task.priority === "medium"
                                  ? "text-orange-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {task.priority?.toUpperCase()}
                            </span>
                            <span className="text-gray-600">
                              {new Date(task.due).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 text-red-600 transition-colors rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between p-4 border-b sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Add New Task</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 sm:p-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <input
                  type="text"
                  value={taskForm.task}
                  onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                  placeholder="Enter task..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={taskForm.due}
                  onChange={(e) => setTaskForm({ ...taskForm, due: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Reminder (Optional)
                </label>
                <input
                  type="email"
                  value={taskForm.email}
                  onChange={(e) => setTaskForm({ ...taskForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to use your email
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-4 py-4 border-t sm:px-6 bg-gray-50">
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;