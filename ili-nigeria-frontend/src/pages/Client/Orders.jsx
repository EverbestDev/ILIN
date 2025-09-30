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
  PlusCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock API URL - replace with your actual client-filtered endpoint
const API_URL = "https://ilin-backend.onrender.com/api/quotes/client";

// --- START OF ORDERS COMPONENT ---
const Orders = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null); // Used for Detail Sidebar

  // Filters
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  // Mock data for the client (only showing Sarah Chen's orders)
  const clientMockQuotes = [
    {
      _id: "65e2b0a1d4b6c3f0e8a7b9c1",
      name: "Sarah Chen",
      email: "sarah@client.com",
      service: "Legal Translation",
      sourceLang: "English",
      targetLang: "French",
      urgency: "Standard",
      certification: true,
      status: "Complete",
      paymentStatus: "Paid",
      date: "2025-09-25T10:30:00Z",
    },
    {
      _id: "65e2b0a1d4b6c3f0e8a7b9c2",
      name: "Sarah Chen",
      email: "sarah@client.com",
      service: "Technical Manual",
      sourceLang: "English",
      targetLang: "German",
      urgency: "Urgent",
      certification: false,
      status: "In Progress",
      paymentStatus: "Paid",
      date: "2025-09-28T14:45:00Z",
    },
    {
      _id: "65e2b0a1d4b6c3f0e8a7b9c3",
      name: "Sarah Chen",
      email: "sarah@client.com",
      service: "Website Localization",
      sourceLang: "English",
      targetLang: "Spanish",
      urgency: "Standard",
      certification: false,
      status: "Awaiting Payment",
      paymentStatus: "Pending",
      date: "2025-10-01T09:00:00Z",
    },
    {
      _id: "65e2b0a1d4b6c3f0e8a7b9c4",
      name: "Sarah Chen",
      email: "sarah@client.com",
      service: "Medical Record",
      sourceLang: "English",
      targetLang: "Japanese",
      urgency: "Urgent",
      certification: true,
      status: "Submitted",
      paymentStatus: "N/A",
      date: "2025-10-02T16:20:00Z",
    },
  ];

  useEffect(() => {
    // In a real app, you would fetch data for the logged-in client
    // fetchData();
    setQuotes(clientMockQuotes);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFiltersAndSorting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes, search, filterService, filterStatus, sortOrder]);

  const applyFiltersAndSorting = () => {
    let tempQuotes = [...quotes];

    // 1. Filtering
    if (search) {
      tempQuotes = tempQuotes.filter(
        (q) =>
          q.service.toLowerCase().includes(search.toLowerCase()) ||
          q._id.includes(search)
      );
    }
    if (filterService) {
      tempQuotes = tempQuotes.filter((q) => q.service === filterService);
    }
    if (filterStatus) {
      tempQuotes = tempQuotes.filter((q) => q.status === filterStatus);
    }

    // 2. Sorting
    tempQuotes.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredQuotes(tempQuotes);
    setCurrentPage(1); // Reset to first page after filter/sort
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Awaiting Payment":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Submitted":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return {
          text: "Paid",
          color: "bg-green-600 text-white",
          icon: CheckCircle,
        };
      case "Pending":
        return {
          text: "Pending",
          color: "bg-yellow-500 text-white",
          icon: DollarSign,
        };
      case "N/A":
      default:
        return {
          text: "N/A",
          color: "bg-gray-300 text-gray-800",
          icon: null,
        };
    }
  };

  // Pagination logic
  const indexOfLastQuote = currentPage * quotesPerPage;
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(
    indexOfFirstQuote,
    indexOfLastQuote
  );
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to view details (navigates to the new Order Detail page)
  const handleViewDetails = (quote) => {
    // Navigate to the detail page for this specific quote ID
    navigate(`/client/orders/${quote._id}`);
  };

  const availableServices = [
    "Legal Translation",
    "Technical Manual",
    "Website Localization",
    "Medical Record",
    "Certified Documents",
  ];

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center text-gray-500">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
          <AlertCircle className="inline w-5 h-5 mr-2" /> Error loading orders:{" "}
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header and Quick Action */}
      <header className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-gray-600">
            Track the status of your translation requests and manage payments.
          </p>
        </div>
        <button
          onClick={() => navigate("/request-quote")} // Assuming external quote page
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-md whitespace-nowrap bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <PlusCircle className="w-5 h-5" />
          Request New Quote
        </button>
      </header>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
        <div className="p-6">
          {/* Top Bar: Search and Filters */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by ID or Service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
              />
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="p-4 mt-4 space-y-4 transition-all duration-300 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Status Filter */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Order Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Payment">Awaiting Payment</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Service Type
                  </label>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">All Services</option>
                    {availableServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Service & Language
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentQuotes.length > 0 ? (
                  currentQuotes.map((quote) => {
                    const paymentBadge = getPaymentBadge(quote.paymentStatus);
                    return (
                      <tr key={quote._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{quote._id.slice(-4)}
                          </div>
                          {quote.certification && (
                            <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                              Certified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {quote.service}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quote.sourceLang} → {quote.targetLang}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(quote.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              quote.status
                            )}`}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${paymentBadge.color}`}
                          >
                            {paymentBadge.icon && (
                              <paymentBadge.icon className="w-3 h-3 mr-1" />
                            )}
                            {paymentBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(quote)}
                            className="flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstQuote + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastQuote, filteredQuotes.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredQuotes.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  {/* Page numbers (simplified) */}
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      aria-current={
                        currentPage === index + 1 ? "page" : undefined
                      }
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
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
