import React, { useEffect, useState, useMemo } from "react";
import { auth } from "../../utility/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Globe,
  PlusCircle,
  X,
  AlertCircle,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

const QUOTES_API_URL = `${BASE_URL}/api/quotes`;
const SETTINGS_API_URL = `${BASE_URL}/api/settings/user`;

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    currency: "NGN",
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    service: "",
    sourceLanguage: "",
    targetLanguages: [],
    urgency: "standard",
    certification: false,
    documents: [],
    wordCount: "",
    pageCount: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    specialInstructions: "",
    industry: "",
    glossary: false,
  });
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const user = auth.currentUser;
  const userName = user ? user.displayName || user.email.split("@")[0] : "User";

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = await getAuthHeaders();
        const [quotesRes, settingsRes] = await Promise.all([
          fetch(`${QUOTES_API_URL}/client`, {
            headers,
            credentials: "include",
          }),
          fetch(SETTINGS_API_URL, { headers, credentials: "include" }),
        ]);

        if (!quotesRes.ok)
          throw new Error(`Failed to fetch quotes: ${quotesRes.status}`);
        if (!settingsRes.ok)
          throw new Error(`Failed to fetch settings: ${settingsRes.status}`);

        const [quotesData, settingsData] = await Promise.all([
          quotesRes.json(),
          settingsRes.json(),
        ]);

        setOrders(quotesData);
        setAdminSettings(settingsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        showNotification("Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const clientStats = useMemo(() => {
    const totalOrders = orders.length;
    const inProgress = orders.filter(
      (order) =>
        order.status === "In Progress" || order.status === "in progress"
    ).length;
    const completed = orders.filter(
      (order) => order.status === "Completed" || order.status === "complete"
    ).length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.price || 0),
      0
    );
    const recentActivity = orders
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      )
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        type: "Order",
        description: `Status: ${order.status} - ${order.service}`,
        time: new Date(order.date || order.createdAt).toLocaleString(),
        icon:
          order.status === "Completed" || order.status === "complete"
            ? CheckCircle
            : Clock,
        color:
          order.status === "Completed" || order.status === "complete"
            ? "text-green-600"
            : "text-yellow-600",
        path: `/client/orders/${order._id}`,
      }));

    return {
      totalOrders: { total: totalOrders, change: 15.0, trend: "up" },
      inProgress: { total: inProgress, change: -5.0, trend: "down" },
      completed: { total: completed, change: 25.0, trend: "up" },
      totalSpent: {
        total: `${adminSettings.currency} ${totalSpent.toLocaleString()}`,
        change: 8.5,
        trend: "up",
      },
      recentActivity,
    };
  }, [orders, adminSettings]);

  // Inside Client Dashboard component

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      let token = null;

      // ✅ Ensure logged in
      if (currentUser) {
        token = await currentUser.getIdToken();
      } else {
        showNotification("You must be logged in to submit a quote", "error");
        setSubmitting(false);
        return;
      }

      // ✅ Prepare form data
      const formData = new FormData();

      formData.append(
        "name",
        quoteFormData.name || currentUser.displayName || "Unknown"
      );
      formData.append("email", quoteFormData.email || currentUser.email || "");
      formData.append("phone", quoteFormData.phone || "");
      formData.append("company", quoteFormData.company || "");
      formData.append(
        "service",
        quoteFormData.service?.toLowerCase() || "translation"
      );
      formData.append(
        "sourceLanguage",
        quoteFormData.sourceLanguage || "english"
      );
      formData.append("urgency", quoteFormData.urgency || "standard");

      if (quoteFormData.targetLanguages?.length > 0) {
        quoteFormData.targetLanguages.forEach((lang) =>
          formData.append("targetLanguages[]", lang)
        );
      }

      formData.append("certification", quoteFormData.certification);
      formData.append("glossary", quoteFormData.glossary);
      formData.append("wordCount", quoteFormData.wordCount || "");
      formData.append("pageCount", quoteFormData.pageCount || "");
      formData.append("industry", quoteFormData.industry || "");
      formData.append(
        "specialInstructions",
        quoteFormData.specialInstructions || ""
      );

      if (quoteFormData.documents?.length > 0) {
        quoteFormData.documents.forEach((file) =>
          formData.append("documents", file)
        );
      }

      // ✅ Submit to protected route
      const response = await fetch(
        "https://ilin-backend.onrender.com/api/quotes/user",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit quote");
      }

      showNotification("Quote submitted successfully!", "success");

      // ✅ Reset form after success
      setQuoteFormData({
        service: "",
        sourceLanguage: "",
        targetLanguages: [],
        urgency: "standard",
        certification: false,
        documents: [],
        wordCount: "",
        pageCount: "",
        name: "",
        email: "",
        phone: "",
        company: "",
        specialInstructions: "",
        industry: "",
        glossary: false,
      });

      setShowQuoteModal(false);
    } catch (error) {
      showNotification(error.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuoteInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuoteFileUpload = (files) => {
    setQuoteFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const handleQuoteFileRemove = (index) => {
    setQuoteFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <p className="font-medium">Error loading dashboard</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
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
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userName}
        </h1>

        <p className="mt-1 text-gray-600">Here's an overview of your account</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientStats.totalOrders.total}
              </p>
              <p
                className={`text-sm flex items-center gap-1 ${
                  clientStats.totalOrders.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {clientStats.totalOrders.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {clientStats.totalOrders.change}% from last period
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientStats.inProgress.total}
              </p>
              <p
                className={`text-sm flex items-center gap-1 ${
                  clientStats.inProgress.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {clientStats.inProgress.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(clientStats.inProgress.change)}% from last period
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientStats.completed.total}
              </p>
              <p
                className={`text-sm flex items-center gap-1 ${
                  clientStats.completed.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {clientStats.completed.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {clientStats.completed.change}% from last period
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientStats.totalSpent.total}
              </p>
              <p
                className={`text-sm flex items-center gap-1 ${
                  clientStats.totalSpent.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {clientStats.totalSpent.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {clientStats.totalSpent.change}% from last period
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {clientStats.recentActivity.length > 0 ? (
                clientStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your order history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

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
            onClick={() => setShowQuoteModal(true)}
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

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl p-6 mx-4 bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Quote
              </h2>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitQuote} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Service
                </label>
                <select
                  name="service"
                  value={quoteFormData.service}
                  onChange={handleQuoteInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select service</option>
                  <option value="translation">Translation</option>
                  <option value="interpretation">Interpretation</option>
                  <option value="localization">Localization</option>
                  <option value="transcription">Transcription</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Source Language
                </label>
                <select
                  name="sourceLanguage"
                  value={quoteFormData.sourceLanguage}
                  onChange={handleQuoteInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select language</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Target Languages
                </label>
                <input
                  type="text"
                  name="targetLanguages"
                  value={quoteFormData.targetLanguages.join(", ")}
                  onChange={(e) =>
                    setQuoteFormData({
                      ...quoteFormData,
                      targetLanguages: e.target.value
                        .split(",")
                        .map((lang) => lang.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., Spanish, French"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={quoteFormData.urgency}
                  onChange={handleQuoteInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="standard">Standard</option>
                  <option value="rush">Rush</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="certification"
                  checked={quoteFormData.certification}
                  onChange={handleQuoteInputChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Certification Required
                </label>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleQuoteFileUpload(Array.from(e.target.files))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                {quoteFormData.documents.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {quoteFormData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                      >
                        <span className="text-sm text-gray-600">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuoteFileRemove(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={quoteFormData.specialInstructions}
                  onChange={handleQuoteInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Any specific requirements or notes..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 font-medium text-white transition-all rounded-lg ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Quote"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
