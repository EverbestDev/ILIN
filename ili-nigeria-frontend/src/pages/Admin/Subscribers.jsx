import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Filter,
  Users,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/subscribe" ||
  import.meta.env.VITE_API_URL + "/api/subscribe" ||
  "http://localhost:5000/api/subscribe";

export default function AdminSubscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 10;

  // Get Firebase auth headers
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

  // Check authentication
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(API_URL, {
          headers,
          credentials: "include",
        });
        if (!res.ok)
          throw new Error(`Failed to fetch subscribers: ${res.status}`);
        const data = await res.json();
        setSubscribers(data);
        setFilteredSubscribers(data);
      } catch (err) {
        console.error("Fetch subscribers error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (auth.currentUser) fetchSubscribers();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...subscribers];

    if (search.trim()) {
      results = results.filter((s) =>
        s.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      results = results.filter((s) => {
        const subDate = new Date(s.createdAt);
        const diffDays = Math.floor((now - subDate) / (1000 * 60 * 60 * 24));

        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "week") return diffDays <= 7;
        if (dateRange === "month") return diffDays <= 30;
        return true;
      });
    }

    results.sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      else return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFilteredSubscribers(results);
    setCurrentPage(1);
  }, [search, dateRange, sortOrder, subscribers]);

  const handleDelete = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      setDeleteConfirm(null);
      showNotification("Subscriber removed successfully", "success");
    } catch (err) {
      console.error("Delete subscriber error:", err);
      showNotification("Error removing subscriber: " + err.message, "error");
    }
  };

  const handleResendEmail = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/resend/${id}`, {
        method: "POST",
        headers,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to resend email: ${res.status}`);
      showNotification("Welcome email resent successfully", "success");
    } catch (err) {
      console.error("Resend email error:", err);
      showNotification(`Error resending email: ${err.message}`, "error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Email", "Subscribed Date"];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ilin_subscribers_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("CSV exported successfully", "success");
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}?subject=ILIN Newsletter Update`;
  };

  const clearFilters = () => {
    setSearch("");
    setDateRange("all");
    setSortOrder("newest");
  };

  const indexOfLast = currentPage * subscribersPerPage;
  const indexOfFirst = indexOfLast - subscribersPerPage;
  const currentSubscribers = filteredSubscribers.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const stats = {
    total: subscribers.length,
    active: subscribers.length,
    thisWeek: subscribers.filter((s) => {
      const diffDays = Math.floor(
        (new Date() - new Date(s.createdAt)) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 7;
    }).length,
    thisMonth: subscribers.filter((s) => {
      const diffDays = Math.floor(
        (new Date() - new Date(s.createdAt)) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 30;
    }).length,
  };

  const activeFiltersCount = [dateRange !== "all" ? dateRange : null].filter(
    Boolean
  ).length;

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your email subscriber list
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-500">TOTAL</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="mt-1 text-xs text-gray-600">All Subscribers</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-gray-500">ACTIVE</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          <p className="mt-1 text-xs text-gray-600">Active Subscribers</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-gray-500">THIS WEEK</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
          <p className="mt-1 text-xs text-gray-600">New This Week</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-gray-500">
              THIS MONTH
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
          <p className="mt-1 text-xs text-gray-600">New This Month</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                showFilters || activeFiltersCount > 0
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-3 pt-4 mt-4 border-t border-gray-200 md:grid-cols-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-red-600 transition-all rounded-lg hover:bg-red-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subscribers Table */}
      {loading && (
        <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="inline-block w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading subscribers...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <p className="font-medium">Error loading subscribers</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Subscriber
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-600">
                          No subscribers found
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your filters or search criteria
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white rounded-full shadow-sm bg-gradient-to-br from-green-600 to-green-700">
                              {subscriber.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {subscriber.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Subscriber
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-medium text-green-700 border border-green-200 rounded-full bg-green-50">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(subscriber.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSendEmail(subscriber.email)}
                              className="p-2 text-green-600 transition-all rounded-lg hover:bg-green-50"
                              title="Send Email"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedSubscriber(subscriber)}
                              className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(subscriber)}
                              className="p-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirst + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLast, filteredSubscribers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredSubscribers.length}
                  </span>{" "}
                  subscribers
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            currentPage === pageNum
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* View Details Modal */}
      {selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-white/20 rounded-xl">
                  {selectedSubscriber.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Subscriber Details
                  </h2>
                  <p className="text-sm text-green-100">Complete information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubscriber(null)}
                className="p-2 transition-all rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                  <Mail className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="block mb-1 text-sm text-gray-600">
                      Email Address
                    </span>
                    <span className="font-medium text-gray-900">
                      {selectedSubscriber.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Subscription Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="px-3 py-1 text-xs font-medium text-green-700 border border-green-200 rounded-full bg-green-100">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subscribed:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(
                        selectedSubscriber.createdAt
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => handleResendEmail(selectedSubscriber._id)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resend Email
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSubscriber(null)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedSubscriber);
                    setSelectedSubscriber(null);
                  }}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-red-500 to-red-600">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-center text-gray-900">
                Remove Subscriber?
              </h3>
              <p className="mb-2 text-center text-gray-600">
                You're about to remove this subscriber:
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="font-semibold text-gray-900">
                    {deleteConfirm.email}
                  </span>
                </p>
              </div>
              <p className="mb-6 text-sm font-medium text-center text-red-600">
                ⚠️ This action cannot be undone
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  className="flex-1 px-4 py-3 font-medium text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  Remove Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
