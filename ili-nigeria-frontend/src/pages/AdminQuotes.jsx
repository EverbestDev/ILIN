import React, { useEffect, useState } from "react";
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
} from "lucide-react";

const API_URL = "https://ilin-backend.onrender.com/api/quotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterCert, setFilterCert] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  // Fetch all quotes
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

  //Apply search + filters + sort
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

    if (filterService)
      results = results.filter((q) => q.service === filterService);
    if (filterUrgency)
      results = results.filter((q) => q.urgency === filterUrgency);
    if (filterCert) {
      results = results.filter(
        (q) =>
          (filterCert === "yes" && q.certification === true) ||
          (filterCert === "no" && q.certification === false)
      );
    }

    results.sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      else return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFilteredQuotes(results);
    setCurrentPage(1);
  }, [search, filterService, filterUrgency, filterCert, sortOrder, quotes]);

  //Delete a quote
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      alert("Quote deleted successfully");
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  //Fetch single quote details
  const handleView = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setSelectedQuote(data);
    } catch (err) {
      alert("Error fetching details: " + err.message);
    }
  };

  //Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Client Name",
      "Email",
      "Service",
      "Languages",
      "Urgency",
      "Certification",
      "Industry",
      "Date",
    ];

    const rows = quotes.map((q) => [
      q.name,
      q.email,
      q.service,
      `${q.sourceLanguage} → ${q.targetLanguages?.join(", ")}`,
      q.urgency,
      q.certification ? "Yes" : "No",
      q.industry || "N/A",
      new Date(q.createdAt).toLocaleDateString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quotes_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterService("");
    setFilterUrgency("");
    setFilterCert("");
    setSortOrder("newest");
  };

  //Pagination logic
  const indexOfLast = currentPage * quotesPerPage;
  const indexOfFirst = indexOfLast - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "rush":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const activeFiltersCount = [filterService, filterUrgency, filterCert].filter(
    Boolean
  ).length;

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-50 to-slate-100 ">
      <div className="p-6 mx-auto max-w-7xl lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            Quote Requests
          </h1>
          <p className="text-slate-600">
            Manage and review all translation quote requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-600">Total Quotes</p>
                <p className="text-2xl font-bold text-slate-900">
                  {quotes.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-600">Filtered</p>
                <p className="text-2xl font-bold text-slate-900">
                  {filteredQuotes.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-600">Urgent</p>
                <p className="text-2xl font-bold text-slate-900">
                  {quotes.filter((q) => q.urgency === "urgent").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-600">Certified</p>
                <p className="text-2xl font-bold text-slate-900">
                  {quotes.filter((q) => q.certification).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
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
            <div className="grid grid-cols-1 gap-3 pt-4 mt-4 border-t border-slate-200 md:grid-cols-4">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-2 border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                {[...new Set(quotes.map((q) => q.service))].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="px-3 py-2 border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Urgencies</option>
                <option value="standard">Standard</option>
                <option value="rush">Rush</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filterCert}
                onChange={(e) => setFilterCert(e.target.value)}
                className="px-3 py-2 border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Certification</option>
                <option value="yes">Certified</option>
                <option value="no">Not Certified</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border rounded-lg outline-none border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-red-600 transition-all rounded-lg hover:bg-red-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        {loading && (
          <div className="p-12 text-center bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading quotes...</p>
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
                  <thead className="border-b bg-slate-50 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Client
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Service
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                        Urgency
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
                      <tr
                        key={q._id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {q.name}
                            </span>
                            <span className="text-sm text-slate-500">
                              {q.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">
                            {q.service}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(
                              q.urgency
                            )}`}
                          >
                            {q.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(q.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleView(q._id)}
                              className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(q._id)}
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
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium text-slate-600">
                            No quotes found
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your filters
                          </p>
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
                    Showing {indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, filteredQuotes.length)} of{" "}
                    {filteredQuotes.length} results
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
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "border border-slate-300 hover:bg-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
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

        {/* Modal for details */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-slate-900">
                  Quote Details
                </h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 transition-all rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Client Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name:</span>
                      <span className="font-medium text-slate-900">
                        {selectedQuote.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-medium text-slate-900">
                        {selectedQuote.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    Service Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service:</span>
                      <span className="font-medium text-slate-900">
                        {selectedQuote.service}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Languages:</span>
                      <span className="font-medium text-slate-900">
                        {selectedQuote.sourceLanguage} →{" "}
                        {selectedQuote.targetLanguages?.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Urgency:</span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(
                          selectedQuote.urgency
                        )}`}
                      >
                        {selectedQuote.urgency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Certification:</span>
                      <span
                        className={`font-medium ${
                          selectedQuote.certification
                            ? "text-green-600"
                            : "text-slate-900"
                        }`}
                      >
                        {selectedQuote.certification
                          ? "✓ Required"
                          : "Not Required"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Industry:</span>
                      <span className="font-medium text-slate-900">
                        {selectedQuote.industry || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                    <FileText className="w-4 h-4 text-green-600" />
                    Documents
                  </h3>
                  {selectedQuote.documents?.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedQuote.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {doc.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No documents uploaded
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-slate-900">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Submitted
                  </h3>
                  <p className="text-slate-900">
                    {new Date(selectedQuote.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 border-slate-200 rounded-b-2xl">
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedQuote._id);
                    setSelectedQuote(null);
                  }}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
