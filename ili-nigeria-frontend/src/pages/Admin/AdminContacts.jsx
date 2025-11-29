import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Building,
  Clock,
  Trash2,
  Eye,
  MessageSquare,
  Archive,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  User,
  Calendar,
} from "lucide-react";
import Spinner from "../../components/UI/Spinner";

import { auth } from "../../utility/firebase";
const API_URL =
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

export default function AdminContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [archiveConfirm, setArchiveConfirm] = useState(null);
  const [convertConfirm, setConvertConfirm] = useState(null);

  const socketRef = useRef(null);
  const contactsPerPage = 10;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Initialize WebSocket
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    socketRef.current = io(API_URL);

    socketRef.current.emit("join_room", {
      userId: auth.currentUser.uid,
      isAdmin: true,
    });

    // Listen for new public contacts
    socketRef.current.on("new_public_contact", (contact) => {
      setContacts((prev) => [contact, ...prev]);
      showNotification("New contact submission received", "success");
    });

    // Listen for contact status updates
    socketRef.current.on("contact_status_updated", (update) => {
      setContacts((prev) =>
        prev.map((c) =>
          c._id === update.id ? { ...c, status: update.status } : c
        )
      );
    });

    // Listen for contact deletion
    socketRef.current.on("contact_deleted", (data) => {
      setContacts((prev) => prev.filter((c) => c._id !== data.id));
      if (selectedContact?._id === data.id) {
        setSelectedContact(null);
      }
      showNotification("Contact deleted", "info");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [navigate]);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/contact`, { headers });

        if (!res.ok) throw new Error("Failed to fetch contacts");

        const data = await res.json();

        // Ensure data is always an array
        const contactsArray = Array.isArray(data) ? data : [];

        setContacts(contactsArray);
        setFilteredContacts(contactsArray);
      } catch (error) {
        console.error("Fetch error:", error);
        showNotification(error.message, "error");
        // Set empty arrays on error
        setContacts([]);
        setFilteredContacts([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchContacts();
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let filtered = [...contacts];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder, contacts]);

  // Convert to thread
  const handleConvertToThread = async (contactId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/contact/${contactId}/convert`, {
        method: "POST",
        headers,
      });

      if (!res.ok) throw new Error("Failed to convert contact");

      const result = await res.json();

      setContacts((prev) =>
        prev.map((c) =>
          c._id === contactId
            ? { ...c, status: "converted", convertedThreadId: result.threadId }
            : c
        )
      );

      setConvertConfirm(null);
      setSelectedContact(null);
      showNotification("Contact converted to message thread", "success");

      // Navigate to messages page
      setTimeout(() => {
        navigate("/admin/messages");
      }, 1500);
    } catch (error) {
      console.error("Convert error:", error);
      showNotification(error.message, "error");
    }
  };

  // Archive contact
  const handleArchiveContact = async (contactId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/contact/${contactId}/archive`, {
        method: "PATCH",
        headers,
      });

      if (!res.ok) throw new Error("Failed to archive contact");

      setContacts((prev) =>
        prev.map((c) =>
          c._id === contactId ? { ...c, status: "archived" } : c
        )
      );

      setArchiveConfirm(null);
      setSelectedContact(null);
      showNotification("Contact archived successfully", "success");
    } catch (error) {
      console.error("Archive error:", error);
      showNotification(error.message, "error");
    }
  };

  // Delete contact
  const handleDeleteContact = async (contactId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/contact/${contactId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c._id !== contactId));
      setDeleteConfirm(null);
      setSelectedContact(null);
      showNotification("Contact deleted successfully", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification(error.message, "error");
    }
  };

  // Pagination
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Stats
  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    converted: contacts.filter((c) => c.status === "converted").length,
    archived: contacts.filter((c) => c.status === "archived").length,
    thisWeek: contacts.filter((c) => {
      const diff = Date.now() - new Date(c.createdAt);
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length,
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        text: "New",
      },
      converted: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Converted",
      },
      archived: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Archived",
      },
    };
    const badge = badges[status] || badges.new;
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold border rounded-full ${badge.color}`}
      >
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-80 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Submissions
          </h1>
          <p className="mt-1 text-gray-600">
            Manage public contact form submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500">TOTAL</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600">All Contacts</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-500">NEW</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stats.new}</p>
            <p className="text-xs text-gray-600">Needs Attention</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-500">
                CONVERTED
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.converted}
            </p>
            <p className="text-xs text-gray-600">To Threads</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <Archive className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-500">
                ARCHIVED
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.archived}
            </p>
            <p className="text-xs text-gray-600">Resolved</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-500">
                THIS WEEK
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.thisWeek}
            </p>
            <p className="text-xs text-gray-600">Last 7 Days</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="converted">Converted</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        {filteredContacts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg shadow-sm">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No contacts found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No contact submissions yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Company & Service
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Message
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-green-600 rounded-lg">
                            {(
                              contact.name?.charAt(0) ||
                              contact.email?.charAt(0) ||
                              "?"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {contact.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {contact.email || "No email"}
                            </p>
                            {contact.phone && (
                              <p className="text-xs text-gray-500">
                                {contact.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.company || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {contact.service || "No service selected"}
                        </p>
                        {contact.urgency && (
                          <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            {contact.urgency}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {contact.message || "No message"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(contact.status || "new")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {contact.status !== "converted" && (
                            <button
                              onClick={() => setConvertConfirm(contact)}
                              className="p-2 text-green-600 transition-all rounded-lg hover:bg-green-50"
                              title="Convert to Thread"
                            >
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          )}
                          {contact.status !== "archived" && (
                            <button
                              onClick={() => setArchiveConfirm(contact)}
                              className="p-2 text-gray-600 transition-all rounded-lg hover:bg-gray-100"
                              title="Archive"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(contact)}
                            className="p-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirst + 1} to{" "}
                  {Math.min(indexOfLast, filteredContacts.length)} of{" "}
                  {filteredContacts.length} contacts
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Contact Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    {selectedContact.email}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Phone
                    </label>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      {selectedContact.phone}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {selectedContact.company && (
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Company
                    </label>
                    <p className="text-gray-900">{selectedContact.company}</p>
                  </div>
                )}
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Service
                  </label>
                  <p className="text-gray-900">
                    {selectedContact.service || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Urgency
                  </label>
                  <p className="text-gray-900">
                    {selectedContact.urgency || "Standard"}
                  </p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  {getStatusBadge(selectedContact.status || "new")}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Submitted
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Message
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <a
                href={`mailto:${selectedContact.email}`}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <Mail className="w-4 h-4" />
                Email Reply
              </a>
              {selectedContact.status !== "converted" && (
                <button
                  onClick={() => {
                    setConvertConfirm(selectedContact);
                    setSelectedContact(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  Convert to Thread
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Convert Confirmation Modal */}
      {convertConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
                Convert to Message Thread?
              </h3>
              <p className="mb-4 text-center text-gray-600">
                This will create a message thread for ongoing conversation with:
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {convertConfirm.name}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {convertConfirm.email}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConvertConfirm(null)}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConvertToThread(convertConfirm._id)}
                  className="flex-1 px-4 py-3 font-medium text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {archiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <Archive className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
                Archive Contact?
              </h3>
              <p className="mb-4 text-center text-gray-600">
                This will mark the contact as archived but keep it in the
                database.
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {archiveConfirm.name}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {archiveConfirm.email}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setArchiveConfirm(null)}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleArchiveContact(archiveConfirm._id)}
                  className="flex-1 px-4 py-3 font-medium text-white transition-all bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
                Delete Contact?
              </h3>
              <p className="mb-4 text-center text-gray-600">
                This will permanently delete the contact. This action cannot be
                undone.
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {deleteConfirm.name}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
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
                  onClick={() => handleDeleteContact(deleteConfirm._id)}
                  className="flex-1 px-4 py-3 font-medium text-white transition-all bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
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
