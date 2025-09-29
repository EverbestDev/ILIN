import React, { useEffect, useState } from "react";
import { Search, Download, Eye, Trash2, X, Filter, FileText, Calendar, Mail, Briefcase, Clock, Award, ChevronLeft, ChevronRight, Globe, CheckCircle, AlertCircle, TrendingUp, Users, Send, ExternalLink } from "lucide-react";

const API_URL = "https://ilin-backend.onrender.com/api/quotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterCert, setFilterCert] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Fetch all quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch quotes");
        const data = await res.json();
        setQuotes(data);
        setFilteredQuotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // ✅ Apply search + filters + sort
  useEffect(() => {
    let results = [...quotes];

    if (search.trim()) {
      results = results.filter(
        (q) =>
          q.name?.toLowerCase().includes(search.toLowerCase()) ||
          q.email?.toLowerCase().includes(search.toLowerCase()) ||
          q.service?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterService) results = results.filter((q) => q.service === filterService);
    if (filterUrgency) results = results.filter((q) => q.urgency === filterUrgency);
    if (filterCert) {
      results = results.filter(
        (q) =>
          (filterCert === "yes" && q.certification === true) ||
          (filterCert === "no" && q.certification === false)
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      results = results.filter((q) => {
        const quoteDate = new Date(q.createdAt);
        const diffDays = Math.floor((now - quoteDate) / (1000 * 60 * 60 * 24));
        
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

    setFilteredQuotes(results);
    setCurrentPage(1);
  }, [search, filterService, filterUrgency, filterCert, sortOrder, dateRange, quotes]);

  // ✅ Delete a quote
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      setDeleteConfirm(null);
      showNotification("Quote deleted successfully", "success");
    } catch (err) {
      showNotification("Error deleting quote: " + err.message, "error");
    }
  };

  // ✅ Fetch single quote details
  const handleView = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setSelectedQuote(data);
    } catch (err) {
      showNotification("Error fetching details: " + err.message, "error");
    }
  };

  // ✅ Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Client Name",
      "Email",
      "Service",
      "Source Language",
      "Target Languages",
      "Urgency",
      "Certification",
      "Industry",
      "Date Submitted",
    ];

    const rows = filteredQuotes.map((q) => [
      q.name,
      q.email,
      q.service,
      q.sourceLanguage,
      q.targetLanguages?.join("; "),
      q.urgency,
      q.certification ? "Yes" : "No",
      q.industry || "N/A",
      new Date(q.createdAt).toLocaleDateString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ilin_quotes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("CSV exported successfully", "success");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterService("");
    setFilterUrgency("");
    setFilterCert("");
    setDateRange("all");
    setSortOrder("newest");
  };

  // Send email to client
  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}?subject=Your Translation Quote Request`;
  };

  // ✅ Pagination logic
  const indexOfLast = currentPage * quotesPerPage;
  const indexOfFirst = indexOfLast - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200";
      case "rush": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  // Get language pair badge
  const getLanguageBadge = (source, targets) => {
    const targetList = targets?.slice(0, 2).join(", ") || "";
    const more = targets?.length > 2 ? ` +${targets.length - 2}` : "";
    return `${source} → ${targetList}${more}`;
  };

  // Calculate stats
  const stats = {
    total: quotes.length,
    filtered: filteredQuotes.length,
    urgent: quotes.filter(q => q.urgency === "urgent").length,
    certified: quotes.filter(q => q.certification).length,
    thisWeek: quotes.filter(q => {
      const diffDays = Math.floor((new Date() - new Date(q.createdAt)) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
    uniqueClients: new Set(quotes.map(q => q.email)).size,
  };

  const activeFiltersCount = [filterService, filterUrgency, filterCert, dateRange !== "all" ? dateRange : null].filter(Boolean).length;

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="p-6 mx-auto max-w-7xl lg:p-8">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
            notification.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Translation Requests</h1>
              <p className="mt-1 text-slate-600">Breaking language barriers, connecting cultures worldwide</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-6">
          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-slate-500">TOTAL</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="mt-1 text-xs text-slate-600">All Requests</p>
          </div>
          
          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Filter className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-slate-500">FILTERED</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.filtered}</p>
            <p className="mt-1 text-xs text-slate-600">Current View</p>
          </div>

          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="text-xs font-medium text-slate-500">URGENT</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.urgent}</p>
            <p className="mt-1 text-xs text-slate-600">Needs Priority</p>
          </div>

          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-slate-500">CERTIFIED</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.certified}</p>
            <p className="mt-1 text-xs text-slate-600">Official Docs</p>
          </div>

          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-slate-500">THIS WEEK</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.thisWeek}</p>
            <p className="mt-1 text-xs text-slate-600">Last 7 Days</p>
          </div>

          <div className="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-medium text-slate-500">CLIENTS</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.uniqueClients}</p>
            <p className="mt-1 text-xs text-slate-600">Unique Emails</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter Toggle & Export */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
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

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-3 pt-4 mt-4 border-t border-slate-200 md:grid-cols-2 lg:grid-cols-5">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                {[...new Set(quotes.map((q) => q.service))].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Urgencies</option>
                <option value="standard">Standard</option>
                <option value="rush">Rush</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filterCert}
                onChange={(e) => setFilterCert(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Certification</option>
                <option value="yes">Certified</option>
                <option value="no">Not Certified</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm font-medium text-red-600 transition-all rounded-lg hover:bg-red-50"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        {loading && (
          <div className="p-12 text-center bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading translation requests...</p>
          </div>
        )}

        {error && (
          <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
            <p className="font-medium">Error loading quotes</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gradient-to-r from-slate-50 to-blue-50/50 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Client
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Service
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Languages
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Date
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentQuotes.map((q) => (
                      <tr key={q._id} className="transition-colors hover:bg-blue-50/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                              {q.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="block font-medium text-slate-900">{q.name}</span>
                              <span className="text-xs text-slate-500">{q.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{q.service}</span>
                            {q.certification && (
                              <span className="flex items-center gap-1 mt-1 text-xs text-green-600">
                                <Award className="w-3 h-3" />
                                Certified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                            {getLanguageBadge(q.sourceLanguage, q.targetLanguages)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(q.urgency)}`}>
                            {q.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(q.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSendEmail(q.email)}
                              className="p-2 text-green-600 transition-all rounded-lg hover:bg-green-50"
                              title="Send Email"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleView(q._id)}
                              className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(q)}
                              className="p-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {currentQuotes.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium text-slate-600">No translation requests found</p>
                          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search criteria</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50 border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-medium">{indexOfFirst + 1}</span> to <span className="font-medium">{Math.min(indexOfLast, filteredQuotes.length)}</span> of <span className="font-medium">{filteredQuotes.length}</span> results
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 transition-all border rounded-lg border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
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
                                ? "bg-blue-600 text-white"
                                : "border border-slate-300 hover:bg-white"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 transition-all border rounded-lg border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
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

        {/* Enhanced Modal for details */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full bg-white/20">
                    {selectedQuote.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Translation Request</h2>
                    <p className="text-sm text-blue-100">Complete details and documents</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 transition-all rounded-lg hover:bg-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div className="p-5 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-4 font-semibold text-slate-900">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Full Name</span>
                      <span className="font-medium text-slate-900">{selectedQuote.name}</span>
                    </div>
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Email Address</span>
                      <a href={`mailto:${selectedQuote.email}`} className="font-medium text-blue-600 hover:underline">
                        {selectedQuote.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-5 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-4 font-semibold text-slate-900">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Translation Service Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Service Type</span>
                      <span className="font-medium text-slate-900">{selectedQuote.service}</span>
                    </div>
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Industry</span>
                      <span className="font-medium text-slate-900">{selectedQuote.industry || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Source Language</span>
                      <span className="font-medium text-slate-900">{selectedQuote.sourceLanguage}</span>
                    </div>
                    <div>
                      <span className="block mb-1 text-sm text-slate-600">Target Languages</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedQuote.targetLanguages?.map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-200 rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority & Requirements */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-5 border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                      <Clock className="w-5 h-5 text-orange-600" />
                      Urgency Level
                    </h3>
                    <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full border ${getUrgencyColor(selectedQuote.urgency)}`}>
                      {selectedQuote.urgency?.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-5 border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                      <Award className="w-5 h-5 text-green-600" />
                      Certification
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedQuote.certification ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-700">Certified Translation Required</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-600">Standard Translation</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-5 border bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border-slate-200">
                  <h3 className="flex items-center gap-2 mb-4 font-semibold text-slate-900">
                    <FileText className="w-5 h-5 text-slate-600" />
                    Uploaded Documents
                  </h3>
                  {selectedQuote.documents?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedQuote.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 transition-all bg-white border rounded-lg border-slate-200 hover:border-blue-300 hover:shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-900 group-hover:text-blue-600">
                              {doc.name}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm text-slate-500">No documents uploaded</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="p-5 border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Request Timeline
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-200 rounded-full">
                      <Calendar className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Submitted on</p>
                      <p className="font-medium text-slate-900">
                        {new Date(selectedQuote.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-slate-600">
                        at {new Date(selectedQuote.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="p-5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Globe className="flex-shrink-0 w-6 h-6 mt-1" />
                    <div>
                      <h4 className="mb-2 font-semibold">Our Commitment</h4>
                      <p className="text-sm leading-relaxed text-blue-100">
                        At ILIN, we're dedicated to breaking language barriers and fostering global understanding. 
                        Every translation request represents a bridge we're building between cultures, enabling 
                        meaningful communication and collaboration across borders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 border-t bg-slate-50 border-slate-200 rounded-b-2xl">
                <button
                  onClick={() => handleSendEmail(selectedQuote.email)}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Contact Client
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(selectedQuote);
                      setSelectedQuote(null);
                    }}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Request
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
                <h3 className="mb-2 text-2xl font-bold text-center text-slate-900">
                  Delete Translation Request?
                </h3>
                <p className="mb-2 text-center text-slate-600">
                  You're about to permanently delete the translation request from:
                </p>
                <div className="p-3 mb-6 rounded-lg bg-slate-50">
                  <p className="text-center">
                    <span className="text-lg font-semibold text-slate-900">{deleteConfirm.name}</span>
                    <br />
                    <span className="text-sm text-slate-600">{deleteConfirm.email}</span>
                  </p>
                </div>
                <p className="mb-6 text-sm font-medium text-center text-red-600">
                  ⚠️ This action cannot be undone
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 font-medium transition-all border-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
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
      

    </div>
  );
}