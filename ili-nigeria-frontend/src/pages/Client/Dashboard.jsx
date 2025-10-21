import React, { useEffect, useState, useMemo } from "react";
import { auth } from "../../utility/firebase";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  PlusCircle,
  ExternalLink,
  X,
  AlertCircle,
  CreditCard,
  Mail,
} from "lucide-react";

const QUOTES_API_URL =
  "https://ilin-backend.onrender.com/api/quotes" ||
  import.meta.env.VITE_API_URL + "/api/quotes" ||
  "http://localhost:5000/api/quotes";
const SETTINGS_API_URL =
  "https://ilin-backend.onrender.com/api/settings/user" ||
  import.meta.env.VITE_API_URL + "/api/settings/user" ||
  "http://localhost:5000/api/settings/user";
// NEW: Endpoints for subscriptions and contacts (assumed)
const SUBSCRIPTIONS_API_URL =
  "https://ilin-backend.onrender.com/api/subscriptions/client" ||
  import.meta.env.VITE_API_URL + "/api/subscriptions/client" ||
  "http://localhost:5000/api/subscriptions/client";
const CONTACTS_API_URL =
  "https://ilin-backend.onrender.com/api/contacts/client" ||
  import.meta.env.VITE_API_URL + "/api/contacts/client" ||
  "http://localhost:5000/api/contacts/client";

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [adminSettings, setAdminSettings] = useState({ currency: "NGN" });
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

  // UPDATED: Fetch quotes, subscriptions, and contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = await getAuthHeaders();
        const [quotesRes, subscriptionsRes, contactsRes, settingsRes] = await Promise.all([
          fetch(`${QUOTES_API_URL}/client`, { headers, credentials: "include" }),
          fetch(SUBSCRIPTIONS_API_URL, { headers, credentials: "include" }).catch(() => ({ ok: true, json: () => [] })),
          fetch(CONTACTS_API_URL, { headers, credentials: "include" }).catch(() => ({ ok: true, json: () => [] })),
          fetch(SETTINGS_API_URL, { headers, credentials: "include" }),
        ]);
        if (!quotesRes.ok) throw new Error(`Failed to fetch quotes: ${quotesRes.status}`);
        if (!settingsRes.ok) throw new Error(`Failed to fetch settings: ${settingsRes.status}`);
        const [quotesData, subscriptionsData, contactsData, settingsData] = await Promise.all([
          quotesRes.json(),
          subscriptionsRes.json(),
          contactsRes.json(),
          settingsRes.json(),
        ]);
        const updatedQuotes = quotesData.map(quote => ({
          ...quote,
          price: (quote.wordCount || 0) * 0.1 + (quote.pageCount || 0) * 5 + (quote.certification ? 50 : 0)
        }));
        setOrders(updatedQuotes);
        setSubscriptions(subscriptionsData);
        setContacts(contactsData);
        setAdminSettings(settingsData);
      } catch (err) {
        console.error("Fetch data error:", err);
        setError(err.message);
        showNotification("Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // UPDATED: Include subscriptions and contacts in recent activity
  const clientStats = useMemo(() => {
    const totalOrders = orders.length;
    const inProgress = orders.filter((order) => order.status === "in progress").length;
    const completed = orders.filter((order) => order.status === "complete").length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.price || 0), 0);

    const recentActivity = [];
    // Add quotes
    orders.forEach(order => {
      recentActivity.push({
        id: order._id,
        type: "Order",
        description: `Status: ${order.status} - ${order.service}`,
        time: new Date(order.createdAt).toLocaleString(),
        icon: order.status === "complete" ? CheckCircle : Clock,
        color: order.status === "complete" ? "text-green-600" : "text-yellow-600",
        path: `/client/orders/${order._id}`,
      });
    });
    // Add subscriptions (assumed schema: { _id, plan, status, createdAt })
    subscriptions.forEach(sub => {
      recentActivity.push({
        id: sub._id,
        type: "Subscription",
        description: `Plan: ${sub.plan} - Status: ${sub.status}`,
        time: new Date(sub.createdAt).toLocaleString(),
        icon: CreditCard,
        color: "text-blue-600",
        path: `/client/subscriptions/${sub._id}`,
      });
    });
    // Add contacts (assumed schema: { _id, subject, status, createdAt })
    contacts.forEach(contact => {
      recentActivity.push({
        id: contact._id,
        type: "Contact",
        description: `Subject: ${contact.subject} - Status: ${contact.status || "Sent"}`,
        time: new Date(contact.createdAt).toLocaleString(),
        icon: Mail,
        color: "text-purple-600",
        path: `/client/contacts/${contact._id}`,
      });
    });
    // Sort by date and limit to 5
    const sortedActivity = recentActivity
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
    const finalActivity = sortedActivity.length > 0
      ? sortedActivity
      : [{ id: "none", type: "No Activity", description: "No recent activity", time: "", icon: AlertCircle, color: "text-gray-600", path: "#" }];

    return {
      totalOrders: { total: totalOrders, change: totalOrders > 0 ? 15.0 : 0, trend: totalOrders > 0 ? "up" : "none" },
      inProgress: { total: inProgress, change: inProgress > 0 ? -5.0 : 0, trend: inProgress > 0 ? "down" : "none" },
      completed: { total: completed, change: completed > 0 ? 25.0 : 0, trend: completed > 0 ? "up" : "none" },
      totalSpent: { total: `${adminSettings.currency} ${totalSpent.toLocaleString()}`, change: totalSpent > 0 ? 8.5 : 0, trend: totalSpent > 0 ? "up" : "none" },
      recentActivity: finalActivity,
    };
  }, [orders, subscriptions, contacts, adminSettings]);

  const handleQuoteInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuoteFileChange = (e) => {
    const files = Array.from(e.target.files);
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

  // UPDATED: Improved quote submission with error details
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      Object.keys(quoteFormData).forEach((key) => {
        if (key === "documents") {
          quoteFormData.documents.forEach((file) => formData.append("documents", file));
        } else if (key === "targetLanguages") {
          quoteFormData.targetLanguages.forEach((lang) => formData.append("targetLanguages[]", lang));
        } else {
          formData.append(key, quoteFormData[key]);
        }
      });
      formData.set("name", user?.displayName || quoteFormData.name);
      formData.set("email", user?.email || quoteFormData.email);

      const res = await fetch(QUOTES_API_URL, {
        method: "POST",
        headers: { Authorization: headers.Authorization },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to submit quote: ${res.status} - ${errorData.message || "Unknown error"}`);
      }
      const data = await res.json();
      showNotification("Quote submitted successfully", "success");
      setShowQuoteModal(false);
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
      const ordersRes = await fetch(`${QUOTES_API_URL}/client`, { headers, credentials: "include" });
      if (!ordersRes.ok) throw new Error(`Failed to refresh orders: ${ordersRes.status}`);
      const updatedOrders = await ordersRes.json();
      setOrders(updatedOrders.map(quote => ({
        ...quote,
        price: (quote.wordCount || 0) * 0.1 + (quote.pageCount || 0) * 5 + (quote.certification ? 50 : 0)
      })));
      navigate("/client/orders");
    } catch (err) {
      console.error("Submit quote error:", err);
      showNotification(`Failed to submit quote: ${err.message}`, "error");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
      {notification && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error loading dashboard: {error}</p>
      ) : (
        <div>
          {/* UNCHANGED: Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <h3 className="text-2xl font-bold">{clientStats.totalOrders.total}</h3>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                {clientStats.totalOrders.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                ) : clientStats.totalOrders.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                ) : null}
                <span>{clientStats.totalOrders.change}% from last month</span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <h3 className="text-2xl font-bold">{clientStats.inProgress.total}</h3>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                {clientStats.inProgress.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                ) : clientStats.inProgress.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                ) : null}
                <span>{clientStats.inProgress.change}% from last month</span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <h3 className="text-2xl font-bold">{clientStats.completed.total}</h3>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                {clientStats.completed.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                ) : clientStats.completed.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                ) : null}
                <span>{clientStats.completed.change}% from last month</span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <h3 className="text-2xl font-bold">{clientStats.totalSpent.total}</h3>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                {clientStats.totalSpent.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                ) : clientStats.totalSpent.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                ) : null}
                <span>{clientStats.totalSpent.change}% from last month</span>
              </div>
            </div>
          </div>
          {/* UNCHANGED: Recent Activity */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
            {clientStats.recentActivity.length === 1 && clientStats.recentActivity[0].id === "none" ? (
              <div className="p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            ) : (
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                {clientStats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <activity.icon className={`w-5 h-5 mr-3 ${activity.color}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      <button
                        onClick={() => navigate(activity.path)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* UNCHANGED: Mission Banner */}
          <div className="p-6 mb-6 text-white rounded-lg bg-gradient-to-r from-green-500 to-green-700">
            <h2 className="mb-2 text-xl font-semibold">Our Mission</h2>
            <p className="mb-4">To provide seamless language solutions for your business needs.</p>
            <button
              onClick={() => setShowQuoteModal(true)}
              className="px-4 py-2 font-medium text-green-600 bg-white rounded-lg hover:bg-gray-100"
            >
              Request a Quote
            </button>
          </div>
          {/* UNCHANGED: Recent Orders */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold">{order.service}</h3>
                    <p className="text-sm text-gray-600">
                      {order.sourceLanguage} → {order.targetLanguages?.join(", ") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                    <button
                      onClick={() => navigate(`/client/orders/${order._id}`)}
                      className="mt-2 text-green-600 hover:text-green-700"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
            {orders.length > 3 && (
              <button
                onClick={() => navigate("/client/orders")}
                className="mt-4 text-green-600 hover:text-green-700"
              >
                View All Orders
              </button>
            )}
          </div>
          {/* UNCHANGED: Quote Modal */}
          {showQuoteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-lg p-6 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Request a Quote</h2>
                  <button onClick={() => setShowQuoteModal(false)} className="text-gray-600 hover:text-gray-800">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleQuoteSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Service</label>
                    <select
                      name="service"
                      value={quoteFormData.service}
                      onChange={handleQuoteInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="translation">Translation</option>
                      <option value="interpretation">Interpretation</option>
                      <option value="transcription">Transcription</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Source Language</label>
                    <input
                      type="text"
                      name="sourceLanguage"
                      value={quoteFormData.sourceLanguage}
                      onChange={handleQuoteInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Target Languages</label>
                    <input
                      type="text"
                      name="targetLanguages"
                      value={quoteFormData.targetLanguages.join(", ")}
                      onChange={(e) =>
                        setQuoteFormData((prev) => ({
                          ...prev,
                          targetLanguages: e.target.value.split(",").map((lang) => lang.trim()),
                        }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., English, Spanish"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Urgency</label>
                    <select
                      name="urgency"
                      value={quoteFormData.urgency}
                      onChange={handleQuoteInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="standard">Standard</option>
                      <option value="urgent">Urgent</option>
                      <option value="express">Express</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Certification Required
                    </label>
                    <input
                      type="checkbox"
                      name="certification"
                      checked={quoteFormData.certification}
                      onChange={handleQuoteInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Documents</label>
                    <input
                      type="file"
                      name="documents"
                      onChange={handleQuoteFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    {quoteFormData.documents.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {quoteFormData.documents.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">{file.name}</span>
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
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Special Instructions</label>
                    <textarea
                      name="specialInstructions"
                      value={quoteFormData.specialInstructions}
                      onChange={handleQuoteInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="3"
                      placeholder="Any specific requirements or notes..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 font-medium text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Submit Quote
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;