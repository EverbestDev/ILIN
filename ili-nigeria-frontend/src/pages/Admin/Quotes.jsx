import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Filter,
  FileText,
  Calendar,
  Mail,
  Briefcase,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Globe,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Send,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

// Base URL for API calls
const BASE_URL = "https://ilin-backend.onrender.com" || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/quotes`;

/**
 * Utility function to get the authorization token.
 * Assumes the token is stored in localStorage for backend access.
 */
const getToken = () => localStorage.getItem("token");

// =========================================================================
// Custom Notification Component
// =========================================================================
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-xl max-w-sm ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <span className="flex-grow text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className={`ml-4 p-1 rounded-full hover:bg-opacity-50 ${
            type === "success" ? "hover:bg-green-200" : "hover:bg-red-200"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// Quote Detail Modal Component
// =========================================================================
const QuoteDetailModal = ({ quote, onClose }) => {
  if (!quote) return null;

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start mb-4">
      <Icon className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-green-600" />
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl max-h-[90vh] p-6 bg-white rounded-xl shadow-2xl overflow-y-auto transform transition-all">
        <div className="flex items-start justify-between pb-4 mb-4 border-b">
          <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <FileText className="w-6 h-6 text-green-700" />
            Quote Request Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Column 1: Core Details */}
          <div>
            <h4 className="pb-1 mb-3 text-lg font-bold text-green-700 border-b">
              Contact & Request Info
            </h4>
            <DetailItem icon={Users} label="Client Name" value={quote.name} />
            <DetailItem
              icon={Mail}
              label="Email"
              value={
                <a
                  href={`mailto:${quote.email}`}
                  className="flex items-center gap-1 font-medium text-green-600 hover:text-green-700 hover:underline"
                >
                  {quote.email} <ExternalLink className="w-3 h-3" />
                </a>
              }
            />
            <DetailItem
              icon={Briefcase}
              label="Company / Organization"
              value={quote.company || "N/A"}
            />
            <DetailItem
              icon={Calendar}
              label="Date Submitted"
              value={format(new Date(quote.createdAt), "PPP - h:mm a")}
            />
          </div>

          {/* Column 2: Service & Urgency */}
          <div>
            <h4 className="pb-1 mb-3 text-lg font-bold text-green-700 border-b">
              Service Specifications
            </h4>
            <DetailItem
              icon={Globe}
              label="Service Type"
              value={quote.serviceType}
            />
            <DetailItem icon={Clock} label="Urgency" value={quote.urgency} />
            <DetailItem
              icon={Award}
              label="Certified Translation"
              value={quote.certifiedTranslation ? "Yes" : "No"}
            />
            <DetailItem
              icon={FileText}
              label="Source Language"
              value={quote.sourceLanguage}
            />
            <DetailItem
              icon={FileText}
              label="Target Language"
              value={quote.targetLanguage}
            />
          </div>
        </div>

        {/* Message and Files */}
        <div className="pt-4 mt-6 border-t">
          <h4 className="mb-3 text-lg font-bold text-green-700">
            Client Message
          </h4>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-800 whitespace-pre-wrap">{quote.message}</p>
          </div>
        </div>

        {/* Attachment Mock (Since files are not stored locally in this front-end) */}
        <div className="pt-4 mt-6 border-t">
          <h4 className="mb-3 text-lg font-bold text-green-700">Attachments</h4>
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <AlertCircle className="inline w-4 h-4 mr-2 text-yellow-700" />
            <span className="text-sm text-yellow-800">
              File handling is disabled in this front-end component. In a real
              setup, files would be accessed here.
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-3 font-medium text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// Main Admin Quotes Component
// =========================================================================

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters and Pagination
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterCert, setFilterCert] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  // --- Data Fetching ---
  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quotes. Check server status.");
      }

      const data = await response.json();
      // Sort by newest by default (createdAt descending)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuotes(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // --- Filtering and Sorting Logic ---
  const filteredQuotes = useMemo(() => {
    let currentQuotes = [...quotes];

    // 1. Filter by Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      currentQuotes = currentQuotes.filter(
        (q) =>
          q.name.toLowerCase().includes(lowerSearch) ||
          q.email.toLowerCase().includes(lowerSearch) ||
          q.serviceType.toLowerCase().includes(lowerSearch) ||
          q.sourceLanguage.toLowerCase().includes(lowerSearch) ||
          q.targetLanguage.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Filter by Service Type
    if (filterService) {
      currentQuotes = currentQuotes.filter(
        (q) => q.serviceType === filterService
      );
    }

    // 3. Filter by Urgency
    if (filterUrgency) {
      currentQuotes = currentQuotes.filter((q) => q.urgency === filterUrgency);
    }

    // 4. Filter by Certified Translation
    if (filterCert) {
      const isCertified = filterCert === "Yes";
      currentQuotes = currentQuotes.filter(
        (q) => q.certifiedTranslation === isCertified
      );
    }

    // 5. Sort
    currentQuotes.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "newest") return dateB.getTime() - dateA.getTime();
      if (sortOrder === "oldest") return dateA.getTime() - dateB.getTime();
      return 0; // Default: no change
    });

    return currentQuotes;
  }, [quotes, search, filterService, filterUrgency, filterCert, sortOrder]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const paginatedQuotes = filteredQuotes.slice(
    startIndex,
    startIndex + quotesPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // --- Deletion Handler ---
  const handleDelete = async (quoteId) => {
    setDeleteConfirm(null); // Close the modal
    setNotification(null); // Clear any previous notification
    setLoading(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch(`${API_URL}/${quoteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete quote on the server.");
      }

      // Remove the quote from the local state
      setQuotes((prevQuotes) => prevQuotes.filter((q) => q._id !== quoteId));

      setNotification({
        message: "Quote request successfully deleted.",
        type: "success",
      });
    } catch (err) {
      console.error("Delete Error:", err);
      setNotification({
        message: `Deletion failed: ${err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- UI Reset ---
  const handleClearFilters = () => {
    setSearch("");
    setFilterService("");
    setFilterUrgency("");
    setFilterCert("");
    setSortOrder("newest");
    setCurrentPage(1);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 bg-white shadow-lg rounded-xl">
        <div className="flex items-center text-lg font-medium text-green-600">
          <svg
            className="w-6 h-6 mr-3 text-green-500 animate-spin"
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
          Loading translation requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-100 border border-red-400 shadow-lg rounded-xl">
        <p className="text-xl font-semibold text-red-700">Error loading data</p>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          onClick={fetchQuotes}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Translation Quote Requests
      </h2>
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div className="p-6 bg-white shadow-lg rounded-xl">
        {/* --- Top Bar: Search & Filters --- */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-grow">
            <Search className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or language..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="w-full py-3 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 font-medium text-gray-700 transition-all border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filters (
              {
                [filterService, filterUrgency, filterCert].filter(Boolean)
                  .length
              }
              )
            </button>
            <a
              href="#" // Mock download functionality
              className="flex items-center gap-2 px-4 py-3 font-medium text-white transition-all bg-green-600 shadow-md rounded-xl hover:bg-green-700"
            >
              <Download className="w-5 h-5" />
              Export
            </a>
          </div>
        </div>

        {/* --- Filter Dropdown --- */}
        {showFilters && (
          <div className="p-5 mb-6 border border-gray-200 rounded-xl bg-gray-50">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All Services</option>
                <option value="Translation">Translation</option>
                <option value="Interpretation">Interpretation</option>
                <option value="Localization">Localization</option>
                <option value="Proofreading">Proofreading</option>
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All Urgency</option>
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Rush">Rush</option>
              </select>

              <select
                value={filterCert}
                onChange={(e) => setFilterCert(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All Certification</option>
                <option value="Yes">Certified Only</option>
                <option value="No">Non-Certified Only</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* --- Quotes Table --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Client Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Language Pair
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Urgency
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuotes.length > 0 ? (
                paginatedQuotes.map((quote) => (
                  <tr
                    key={quote._id}
                    className="transition-colors hover:bg-green-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(quote.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(quote.createdAt), "h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.name}
                      </div>
                      <div className="text-xs text-gray-500">{quote.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        {quote.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {quote.sourceLanguage} to {quote.targetLanguage}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold leading-5 rounded-full ${
                          quote.urgency === "Rush"
                            ? "text-red-800 bg-red-100"
                            : quote.urgency === "Urgent"
                            ? "text-yellow-800 bg-yellow-100"
                            : "text-blue-800 bg-blue-100"
                        }`}
                      >
                        {quote.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-green-600 transition-colors rounded-full hover:bg-green-100 hover:text-green-700"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(quote)}
                          className="p-2 text-red-600 transition-colors rounded-full hover:bg-red-100 hover:text-red-700"
                          title="Delete Request"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    No quote requests found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        {filteredQuotes.length > quotesPerPage && (
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4 text-sm text-gray-700">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(startIndex + quotesPerPage, filteredQuotes.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredQuotes.length}</span>{" "}
              results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center p-2 text-sm font-medium text-gray-500 transition-colors border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-green-600 rounded-full">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center p-2 text-sm font-medium text-gray-500 transition-colors border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <QuoteDetailModal
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm p-6 transition-all transform bg-white shadow-2xl rounded-xl">
            <div className="text-center">
              <Trash2 className="w-12 h-12 mx-auto text-red-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Confirm Deletion
              </h3>
              <p className="mt-2 text-gray-600">
                You're about to permanently delete the translation request from:
              </p>
              <div className="p-3 my-4 rounded-lg bg-red-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-red-900">
                    {deleteConfirm.name}
                  </span>
                  <br />
                  <span className="text-sm text-red-600">
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
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
