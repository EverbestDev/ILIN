import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Spinner from "../../components/UI/Spinner";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/quotes" ||
  import.meta.env.VITE_API_URL + "/api/quotes" ||
  "http://localhost:5000/api/quotes";

export default function ClientOrders() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

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

  // Fetch client-specific quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/client`, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch quotes: ${res.status}`);
        const data = await res.json();
        const updatedQuotes = data.map(quote => ({
          ...quote,
          price: (quote.wordCount || 0) * 0.1 + (quote.pageCount || 0) * 5 + (quote.certification ? 50 : 0)
        }));
        setQuotes(updatedQuotes);
        setFilteredQuotes(updatedQuotes);
      } catch (err) {
        console.error("Fetch quotes error:", err);
        setError(err.message);
        showNotification("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let results = [...quotes];

    // Search filter
    if (search.trim()) {
      results = results.filter(
        (q) =>
          q.name?.toLowerCase().includes(search.toLowerCase()) ||
          q.email?.toLowerCase().includes(search.toLowerCase()) ||
          q.service?.toLowerCase().includes(search.toLowerCase()) ||
          q._id?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Service filter
    if (filterService) {
      results = results.filter((q) => q.service === filterService);
    }

    // Status filter
    if (filterStatus) {
      results = results.filter((q) => q.status === filterStatus);
    }

    // Sort by date
    results.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFilteredQuotes(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, filterService, filterStatus, sortOrder, quotes]);

  // Helper functions for styling
  const getServiceColor = (service) => {
    switch (service?.toLowerCase()) {
      case "translation":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "interpretation":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "localization":
        return "bg-green-100 text-green-700 border-green-200";
      case "transcription":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-700 border-green-200";
      case "in progress":
      case "paid":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "awaiting payment":
      case "quoted":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "submitted":
      case "reviewed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return <CheckCircle className="w-4 h-4" />;
      case "in progress":
      case "paid":
        return <Clock className="w-4 h-4" />;
      case "awaiting payment":
        return <DollarSign className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = [
      ["Order ID", "Service", "Status", "Source Language", "Target Languages", "Date", "Price"],
      ...filteredQuotes.map((q) => [
        q._id || "",
        q.service || "",
        q.status || "",
        q.sourceLanguage || "",
        q.targetLanguages?.join("; ") || "",
        new Date(q.createdAt).toLocaleDateString(),
        q.price ? `${q.price}` : "0",
      ]),
    ]
      .map((row) => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification("Orders exported successfully!");
  };

  // Pagination
  const indexOfLast = currentPage * quotesPerPage;
  const indexOfFirst = indexOfLast - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Error loading orders</p>
          </div>
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
          className={`fixed top-6 right-6 app-toaster px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-gray-600">
          Manage and track your translation orders
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, email, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                showFilters
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredQuotes.length === 0}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-3 pt-4 mt-4 border-t border-gray-200 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Service
              </label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Services</option>
                <option value="translation">Translation</option>
                <option value="interpretation">Interpretation</option>
                <option value="localization">Localization</option>
                <option value="transcription">Transcription</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="quoted">Quoted</option>
                <option value="awaiting payment">Awaiting Payment</option>
                <option value="paid">Paid</option>
                <option value="in progress">In Progress</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Languages
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentQuotes.map((quote) => (
                <tr
                  key={quote._id}
                  className="transition-colors hover:bg-green-50/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-900">
                        {quote._id.slice(-8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border capitalize ${getServiceColor(
                        quote.service
                      )}`}
                    >
                      {quote.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {getStatusIcon(quote.status)}
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium">{quote.sourceLanguage}</span>
                      <span className="text-xs text-gray-500">
                        → {quote.targetLanguages?.join(", ") || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quote.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/client/orders/${quote._id}`)}
                        className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentQuotes.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-600">No orders found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {search || filterService || filterStatus
                        ? "Try adjusting your filters or search criteria"
                        : "You haven't placed any orders yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{indexOfFirst + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLast, filteredQuotes.length)}
              </span>{" "}
              of <span className="font-medium">{filteredQuotes.length}</span>{" "}
              orders
            </p>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  aria-current={currentPage === index + 1 ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === index + 1
                      ? "z-10 bg-green-50 border-green-500 text-green-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } border`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}