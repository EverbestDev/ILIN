import { io } from "socket.io-client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Filter,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const socket = io(
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com"
);

const API_URL =
  "https://ilin-backend.onrender.com/api/contact" ||
  import.meta.env.VITE_API_URL + "/api/contact" ||
  "http://localhost:5000/api/contact";
const MESSAGE_API_URL =
  "https://ilin-backend.onrender.com/api/messages" ||
  import.meta.env.VITE_API_URL + "/api/messages" ||
  "http://localhost:5000/api/messages";

export default function AdminContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState("");
  const contactsPerPage = 10;

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
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(API_URL, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch contacts: ${res.status}`);
        const data = await res.json();
        // Normalize source: treat undefined/null source as "public"
        const normalizedData = data.map((contact) => ({
          ...contact,
          source: contact.source || "public",
        }));
        setContacts(normalizedData);
        setFilteredContacts(normalizedData);
      } catch (err) {
        console.error("Fetch contacts error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (auth.currentUser) fetchContacts();
  }, []);

  //websocket
  useEffect(() => {
    // New message from client
    socket.on("newMessage", (data) => {
      setContacts((prev) => {
        const exists = prev.find((c) => c.threadId === data.threadId);
        if (exists) {
          return prev.map((c) =>
            c.threadId === data.threadId
              ? {
                  ...c,
                  threadMessages: [...(c.threadMessages || []), data],
                }
              : c
          );
        }
        return [data, ...prev];
      });

      showNotification(
        `New message from ${data.name || data.userId || "Unknown Sender"}`,
        "success"
      );
    });

    // New reply from either admin or client
    socket.on("newReply", (data) => {
      setContacts((prev) =>
        prev.map((c) =>
          c.threadId === data.threadId
            ? {
                ...c,
                threadMessages: [...(c.threadMessages || []), data],
              }
            : c
        )
      );
    });

    // Message status update
    socket.on("messageStatusUpdated", (update) => {
      setContacts((prev) =>
        prev.map((m) =>
          m._id === update.id ? { ...m, isRead: update.isRead } : m
        )
      );
    });

    // Message deleted
    socket.on("messageDeleted", (update) => {
      setContacts((prev) => prev.filter((m) => m._id !== update.id));
    });

    return () => {
      socket.off("newMessage");
      socket.off("newReply");
      socket.off("messageStatusUpdated");
      socket.off("messageDeleted");
    };
  }, []);

  useEffect(() => {
    let results = [...contacts];
    if (search.trim()) {
      results = results.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sourceFilter !== "all") {
      results = results.filter((c) => c.source === sourceFilter);
    }
    results.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    setFilteredContacts(results);
    setCurrentPage(1);
  }, [search, sortOrder, sourceFilter, contacts]);

  const handleDelete = async (id, source) => {
    try {
      const headers = await getAuthHeaders();

      // Dynamically choose correct endpoint
      const endpoint =
        source === "public" ? `${API_URL}/${id}` : `${MESSAGE_API_URL}/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);

      // Update UI
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
      showNotification("Message deleted successfully", "success");
    } catch (err) {
      console.error("Delete contact error:", err);
      showNotification(`Error deleting contact: ${err.message}`, "error");
    }
  };

  const handleStartThread = async (contact) => {
    if (!replyText.trim()) {
      showNotification("Message cannot be empty", "error");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(MESSAGE_API_URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          subject: `Re: ${contact.subject}`,
          message: replyText,
          userId: contact.email, // Use email as userId for public contacts
        }),
      });

      if (!res.ok) throw new Error(`Failed to start thread: ${res.status}`);

      const data = await res.json();

      setContacts((prev) => [
        { ...data.data, source: "client" },
        ...prev.filter((c) => c._id !== data.data._id),
      ]);

      setSelectedContact({
        ...contact,
        threadId: data.data.threadId,
        threadMessages: [data.data],
        source: "client",
        replyMode: true,
      });

      setReplyText("");
      showNotification("Thread started successfully", "success");
    } catch (err) {
      console.error("Start thread error:", err);
      showNotification(`Error starting thread: ${err.message}`, "error");
    }
  };

  const handleReply = async (threadId) => {
    if (!replyText.trim()) {
      showNotification("Reply cannot be empty", "error");
      return;
    }
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${MESSAGE_API_URL}/${threadId}/reply`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ message: replyText }),
      });
      if (!res.ok) throw new Error(`Failed to send reply: ${res.status}`);
      const data = await res.json();
      setContacts((prev) => [
        { ...data.data, source: "client" },
        ...prev.filter((c) => c._id !== data.data._id),
      ]);
      setSelectedContact((prev) => ({
        ...prev,
        threadMessages: [...(prev.threadMessages || []), data.data],
      }));
      setReplyText("");
      showNotification("Reply sent successfully", "success");
    } catch (err) {
      console.error("Reply error:", err);
      showNotification(`Error sending reply: ${err.message}`, "error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Source", "Name", "Email", "Subject", "Submitted On"];
    const rows = filteredContacts.map((c) => [
      c.source,
      c.name || "N/A",
      c.email || "N/A",
      c.subject,
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ilin_contacts_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("CSV exported successfully", "success");
  };

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("all");
    setSortOrder("newest");
  };

  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const stats = {
    total: contacts.length,
    public: contacts.filter((c) => c.source === "public").length,
    client: contacts.filter((c) => c.source === "client").length,
    lastWeek: contacts.filter((c) => {
      const diffDays = Math.floor(
        (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 7;
    }).length,
  };

  const activeFiltersCount = [
    search.trim(),
    sourceFilter !== "all" ? sourceFilter : null,
    sortOrder !== "newest" ? sortOrder : null,
  ].filter(Boolean).length;

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
          <div className="z-20 flex items-center gap-3">
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
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="mt-1 text-gray-600">
          Manage and respond to customer inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-500">TOTAL</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="mt-1 text-xs text-gray-600">All Messages</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-gray-500">PUBLIC</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.public}</p>
          <p className="mt-1 text-xs text-gray-600">Public Contacts</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-gray-500">CLIENT</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.client}</p>
          <p className="mt-1 text-xs text-gray-600">Client Messages</p>
        </div>

        <div className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-gray-500">RECENT</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.lastWeek}</p>
          <p className="mt-1 text-xs text-gray-600">Last 7 Days</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
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
          <div className="grid grid-cols-1 gap-3 pt-4 mt-4 border-t border-gray-200 md:grid-cols-4">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Sources</option>
              <option value="public">Public Contacts</option>
              <option value="client">Client Messages</option>
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

      {/* Messages Table */}
      {loading && (
        <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="inline-block w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <p className="font-medium">Error loading messages</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Source
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
                  {currentContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="transition-colors hover:bg-green-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-lg bg-gradient-to-br from-green-600 to-green-700">
                            {(
                              contact.name?.charAt(0) ||
                              contact.email?.charAt(0) ||
                              "?"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {contact.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {contact.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {contact.subject}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                            contact.source === "public"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-purple-100 text-purple-700 border-purple-200"
                          }`}
                        >
                          {contact.source === "public" ? "Public" : "Client"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(contact.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              if (contact.source === "client") {
                                const threadMessages = contacts
                                  .filter(
                                    (c) => c.threadId === contact.threadId
                                  )
                                  .sort(
                                    (a, b) =>
                                      new Date(a.createdAt) -
                                      new Date(b.createdAt)
                                  );
                                setSelectedContact({
                                  ...contact,
                                  threadMessages,
                                });
                              } else {
                                setSelectedContact(contact);
                              }
                            }}
                            className="p-2 text-purple-600 transition-all rounded-lg hover:bg-purple-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (contact.source === "client") {
                                const threadMessages = contacts
                                  .filter(
                                    (c) => c.threadId === contact.threadId
                                  )
                                  .sort(
                                    (a, b) =>
                                      new Date(a.createdAt) -
                                      new Date(b.createdAt)
                                  );
                                setSelectedContact({
                                  ...contact,
                                  threadMessages,
                                  replyMode: true,
                                });
                              } else {
                                setSelectedContact({
                                  ...contact,
                                  replyMode: true,
                                });
                              }
                            }}
                            className="p-2 text-green-600 transition-all rounded-lg hover:bg-green-50"
                            title="Start Thread"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
                            }}
                            className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                            title="Email Reply"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(contact)}
                            className="p-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentContacts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-600">
                          No contact messages found
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your filters or search criteria
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
                  Showing{" "}
                  <span className="font-medium">{indexOfFirst + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLast, filteredContacts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredContacts.length}</span>{" "}
                  messages
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 transition-all border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
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
                    className="flex items-center gap-1 px-3 py-2 transition-all border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
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
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-white/20 rounded-xl">
                  {(
                    selectedContact.name?.trim()?.charAt(0) ||
                    selectedContact.email?.trim()?.charAt(0) ||
                    selectedContact.userId?.trim()?.charAt(0) ||
                    "?"
                  ).toUpperCase()}

                  {/* to be removed */}
                  <p className="font-medium text-gray-900">
                    {selectedContact.name ||
                      selectedContact.userId ||
                      "Unnamed User"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedContact.email || "No email"}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedContact.source === "public" &&
                    !selectedContact.threadId
                      ? "Contact Message"
                      : "Message Thread"}
                  </h2>
                  <p className="text-sm text-green-100">
                    {selectedContact.source === "public" &&
                    !selectedContact.threadId
                      ? "Public contact form submission"
                      : "Client messaging conversation"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  setReplyText("");
                }}
                className="p-2 transition-all rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedContact.source === "public" &&
              !selectedContact.threadId ? (
                <>
                  {/* Contact Info */}
                  <div className="p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                      <User className="w-5 h-5 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <span className="block mb-1 text-sm text-gray-600">
                          Full Name
                        </span>
                        <span className="font-medium text-gray-900">
                          {selectedContact.name}
                        </span>
                      </div>
                      <div>
                        <span className="block mb-1 text-sm text-gray-600">
                          Email Address
                        </span>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="font-medium text-green-600 hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="p-5 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Subject
                    </h3>
                    <p className="font-medium text-gray-900">
                      {selectedContact.subject}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="p-5 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                      <Mail className="w-5 h-5 text-purple-600" />
                      Message
                    </h3>
                    <div className="p-4 bg-white border border-purple-200 rounded-lg">
                      <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {/* Start Thread */}
                  {selectedContact.replyMode && (
                    <div className="p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                      <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                        <Send className="w-5 h-5 text-green-600" />
                        Start Message Thread
                      </h4>
                      <textarea
                        placeholder="Type your message to start a thread..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="4"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleStartThread(selectedContact)}
                          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Start Thread
                        </button>
                        <button
                          onClick={() =>
                            setSelectedContact({
                              ...selectedContact,
                              replyMode: false,
                            })
                          }
                          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Thread Messages */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      Conversation Thread
                    </h3>
                    {selectedContact.threadMessages?.map((msg) => (
                      <div
                        key={msg._id}
                        className={`p-4 rounded-xl ${
                          msg.sender === "client"
                            ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 ml-8"
                            : "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold ${
                                msg.sender === "client"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                              }`}
                            >
                              {msg.sender === "client" ? "C" : "A"}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {msg.sender === "client" ? "Client" : "Admin"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="leading-relaxed text-gray-700">
                          {msg.message}
                        </p>
                      </div>
                    ))}

                    {/* Reply Box */}
                    {selectedContact.replyMode && (
                      <div className="p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                        <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                          <Send className="w-5 h-5 text-green-600" />
                          Send Reply
                        </h4>
                        <textarea
                          placeholder="Type your reply message here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows="4"
                        />
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() =>
                              handleReply(selectedContact.threadId)
                            }
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Reply
                          </button>
                          <button
                            onClick={() =>
                              setSelectedContact({
                                ...selectedContact,
                                replyMode: false,
                              })
                            }
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Date */}
              <div className="p-5 border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Received On
                </h3>
                <p className="text-gray-900">
                  {new Date(selectedContact.createdAt).toLocaleDateString(
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

            <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              {selectedContact.source === "public" &&
              !selectedContact.threadId ? (
                <button
                  onClick={() =>
                    setSelectedContact({
                      ...selectedContact,
                      replyMode: !selectedContact.replyMode,
                    })
                  }
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {selectedContact.replyMode
                    ? "Hide Thread"
                    : "Start Message Thread"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setSelectedContact({
                      ...selectedContact,
                      replyMode: !selectedContact.replyMode,
                    })
                  }
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {selectedContact.replyMode ? "Hide Reply" : "Reply to Thread"}
                </button>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    setReplyText("");
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedContact);
                    setSelectedContact(null);
                    setReplyText("");
                  }}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
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
                Delete Contact Message?
              </h3>
              <p className="mb-2 text-center text-gray-600">
                You're about to delete the message from:
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {deleteConfirm.name || "Client"}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {deleteConfirm.email || "N/A"}
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
                  onClick={() =>
                    handleDelete(deleteConfirm._id, deleteConfirm.source)
                  }
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
