import React, { useEffect, useState } from "react";
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

const API_URL = "https://ilin-backend.onrender.com/api/subscribers"; // Update with your actual endpoint

const Subscribers = () => {
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
  const subscribersPerPage = 12;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData = Array.from({ length: 50 }, (_, i) => ({
          _id: `sub-${i + 1}`,
          email: `subscriber${i + 1}@example.com`,
          name: `Subscriber ${i + 1}`,
          subscribedAt: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: i % 10 === 0 ? "unsubscribed" : "active",
          source: ["website", "landing-page", "blog", "social-media"][
            Math.floor(Math.random() * 4)
          ],
        }));

        setSubscribers(mockData);
        setFilteredSubscribers(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  useEffect(() => {
    let results = [...subscribers];

    if (search.trim()) {
      results = results.filter(
        (s) =>
          s.email?.toLowerCase().includes(search.toLowerCase()) ||
          s.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      results = results.filter((s) => {
        const subDate = new Date(s.subscribedAt);
        const diffDays = Math.floor((now - subDate) / (1000 * 60 * 60 * 24));

        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "week") return diffDays <= 7;
        if (dateRange === "month") return diffDays <= 30;
        return true;
      });
    }

    results.sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.subscribedAt) - new Date(a.subscribedAt);
      else return new Date(a.subscribedAt) - new Date(b.subscribedAt);
    });

    setFilteredSubscribers(results);
    setCurrentPage(1);
  }, [search, dateRange, sortOrder, subscribers]);

  const handleDelete = async (id) => {
    try {
      // Replace with actual API call
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      setDeleteConfirm(null);
      showNotification("Subscriber removed successfully", "success");
    } catch (err) {
      showNotification("Error removing subscriber: " + err.message, "error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Email", "Name", "Status", "Source", "Subscribed Date"];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      s.name || "N/A",
      s.status,
      s.source,
      new Date(s.subscribedAt).toLocaleDateString(),
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
    active: subscribers.filter((s) => s.status === "active").length,
    thisWeek: subscribers.filter((s) => {
      const diffDays = Math.floor(
        (new Date() - new Date(s.subscribedAt)) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 7;
    }).length,
    thisMonth: subscribers.filter((s) => {
      const diffDays = Math.floor(
        (new Date() - new Date(s.subscribedAt)) / (1000 * 60 * 60 * 24)
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
          <p className="text-gray-600 mt-1">
            Manage your email subscriber list
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-500">TOTAL</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-1">All Subscribers</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-gray-500">ACTIVE</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          <p className="text-xs text-gray-600 mt-1">Active Subscribers</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-gray-500">THIS WEEK</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
          <p className="text-xs text-gray-600 mt-1">New This Week</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-gray-500">
              THIS MONTH
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
          <p className="text-xs text-gray-600 mt-1">New This Month</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subscribers Grid */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading subscribers...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-medium">Error loading subscribers</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSubscribers.map((subscriber) => (
              <div
                key={subscriber._id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                      {subscriber.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {subscriber.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {subscriber.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subscriber.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {subscriber.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {subscriber.source}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(subscriber.subscribedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleSendEmail(subscriber.email)}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    onClick={() => setSelectedSubscriber(subscriber)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(subscriber)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {currentSubscribers.length === 0 && (
              <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No subscribers found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{indexOfFirst + 1}</span>{" "}
                to{" "}
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
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all flex items-center gap-1"
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
                        className={`px-3 py-2 rounded-lg transition-all ${
                          currentPage === pageNum
                            ? "bg-green-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Details Modal */}
      {selectedSubscriber && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
                  {selectedSubscriber.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Subscriber Details
                  </h2>
                  <p className="text-green-100 text-sm">Complete information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubscriber(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">
                      Email Address
                    </span>
                    <span className="font-medium text-gray-900">
                      {selectedSubscriber.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">
                      Name
                    </span>
                    <span className="font-medium text-gray-900">
                      {selectedSubscriber.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Subscription Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        selectedSubscriber.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {selectedSubscriber.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Source:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {selectedSubscriber.source}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subscribed:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(
                        selectedSubscriber.subscribedAt
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

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-2xl">
              <button
                onClick={() => handleSendEmail(selectedSubscriber.email)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 mx-auto mb-4 shadow-lg">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Remove Subscriber?
              </h3>
              <p className="text-gray-600 text-center mb-2">
                You're about to remove this subscriber:
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-center">
                  <span className="font-semibold text-gray-900">
                    {deleteConfirm.email}
                  </span>
                </p>
              </div>
              <p className="text-sm text-red-600 text-center mb-6 font-medium">
                ⚠️ This action cannot be undone
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium transition-all shadow-lg"
                >
                  Remove Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Subscribers;
