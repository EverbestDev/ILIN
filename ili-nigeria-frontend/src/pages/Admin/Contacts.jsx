import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utility/firebase";
import {
  Send,
  MessageSquare,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Search,
  Filter,
} from "lucide-react";
import Spinner from "../../components/UI/Spinner";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

export default function Contacts() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const threadsPerPage = 10;

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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  // Initialize WebSocket
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    socketRef.current = io(API_URL);

    // Join user-specific room
    socketRef.current.emit("join_room", {
      userId: auth.currentUser.uid,
      isAdmin: true,
    });

    // Listen for client replies
    socketRef.current.on("new_client_reply", (reply) => {
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.threadId === reply.threadId) {
            return {
              ...thread,
              messages: [...thread.messages, reply],
              latestMessage: reply,
              unreadCount: thread.unreadCount + 1,
            };
          }
          return thread;
        })
      );

      // Always update thread messages if it matches
      setThreadMessages((prev) => {
        if (prev.length > 0 && prev[0].threadId === reply.threadId) {
          return [...prev, reply];
        }
        return prev;
      });

      showNotification("New reply from admin", "success");
    });

    // Listen for message status updates
    socketRef.current.on("message_status_updated", (update) => {
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.threadId === update.threadId) {
            return {
              ...thread,
              messages: thread.messages.map((msg) =>
                msg._id === update.id ? { ...msg, isRead: update.isRead } : msg
              ),
            };
          }
          return thread;
        })
      );

      setThreadMessages((prev) =>
        prev.map((msg) =>
          msg._id === update.id ? { ...msg, isRead: update.isRead } : msg
        )
      );
    });

    // Listen for thread deletion
    socketRef.current.on("thread_deleted", (data) => {
      setThreads((prev) => prev.filter((t) => t.threadId !== data.threadId));
      if (selectedThread === data.threadId) {
        setSelectedThread(null);
        setThreadMessages([]);
      }
      showNotification("Thread was deleted by admin", "info");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [navigate]);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/messages`, { headers });

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setThreads(data.data || []);
        setFilteredThreads(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        showNotification(error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchThreads();
  }, []);

  // Filter and sort threads
  useEffect(() => {
    let filtered = [...threads];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (thread) =>
          thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.latestMessage.senderEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          thread.latestMessage.senderName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.latestMessage.createdAt);
      const dateB = new Date(b.latestMessage.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredThreads(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortOrder, threads]);

  // Load thread messages
  const handleViewThread = async (threadId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/messages/threads/${threadId}`, {
        headers,
      });

      if (!res.ok) throw new Error("Failed to load thread");

      const data = await res.json();
      setThreadMessages(data.data.messages || []);
      setSelectedThread(threadId);

      // Mark unread messages as read
      const unreadMessages = data.data.messages.filter(
        (msg) => !msg.isRead && msg.sender === "client"
      );

      for (const msg of unreadMessages) {
        await fetch(`${API_URL}/api/messages/${msg._id}/read`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ isRead: true }),
        });
      }
    } catch (error) {
      console.error("Load thread error:", error);
      showNotification(error.message, "error");
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyText.trim()) {
      showNotification("Reply cannot be empty", "error");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_URL}/api/messages/threads/${selectedThread}/reply`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ message: replyText }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reply");

      const result = await res.json();

      setThreadMessages((prev) => [...prev, result.data]);
      setThreads((prev) =>
        prev.map((thread) =>
          thread.threadId === selectedThread
            ? {
                ...thread,
                messages: [...thread.messages, result.data],
                latestMessage: result.data,
              }
            : thread
        )
      );

      setReplyText("");
      showNotification("Reply sent successfully", "success");
    } catch (error) {
      console.error("Reply error:", error);
      showNotification(error.message, "error");
    }
  };

  // Delete thread
  const handleDeleteThread = async (threadId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/messages/threads/${threadId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete thread");

      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      setDeleteConfirm(null);
      if (selectedThread === threadId) {
        setSelectedThread(null);
        setThreadMessages([]);
      }
      showNotification("Thread deleted successfully", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification(error.message, "error");
    }
  };

  // Pagination
  const indexOfLast = currentPage * threadsPerPage;
  const indexOfFirst = indexOfLast - threadsPerPage;
  const currentThreads = filteredThreads.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

  // Stats
  const stats = {
    total: threads.length,
    unread: threads.reduce((sum, t) => sum + t.unreadCount, 0),
    today: threads.filter((t) => {
      const diff = Date.now() - new Date(t.latestMessage.createdAt);
      return diff < 24 * 60 * 60 * 1000;
    }).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading messages...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Client Messages</h1>
          <p className="mt-1 text-gray-600">Manage client communications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-500">TOTAL</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600">All Threads</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-xs font-medium text-gray-500">UNREAD</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.unread}
            </p>
            <p className="text-xs text-gray-600">Needs Response</p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500">TODAY</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.today}
            </p>
            <p className="text-xs text-gray-600">Last 24 Hours</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by subject, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
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

        {/* Threads Table */}
        {filteredThreads.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No messages found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search"
                : "No client messages yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full overflow-x-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Latest Message
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
                  {currentThreads.map((thread) => (
                    <tr
                      key={thread.threadId}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-green-600 rounded-lg">
                            {(
                              thread.latestMessage?.senderName?.charAt(0) ||
                              thread.latestMessage?.senderEmail?.charAt(0) ||
                              "?"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {thread.latestMessage?.senderName ||
                                "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {thread.latestMessage?.senderEmail || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {thread.subject}
                          </span>
                          {thread.unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {thread.latestMessage.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          thread.latestMessage.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewThread(thread.threadId)}
                            className="p-2 text-green-600 transition-all rounded-lg hover:bg-green-50"
                            title="View & Reply"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(thread)}
                            className="p-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
                            title="Delete Thread"
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
                  {Math.min(indexOfLast, filteredThreads.length)} of{" "}
                  {filteredThreads.length} threads
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

      {/* Thread View Modal */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {threadMessages[0]?.subject}
                </h2>
                <p className="text-sm text-gray-600">
                  {threadMessages[0]?.senderName} (
                  {threadMessages[0]?.senderEmail})
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedThread(null);
                  setThreadMessages([]);
                  setReplyText("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {threadMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      msg.sender === "admin"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">
                        {msg.sender === "admin"
                          ? "You (Admin)"
                          : msg.senderName}
                      </span>
                      <span className="text-xs opacity-75">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows="3"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <button
                  onClick={handleSendReply}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
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
                Delete Thread?
              </h3>
              <p className="mb-2 text-center text-gray-600">
                You're about to delete the entire conversation with:
              </p>
              <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {deleteConfirm.latestMessage.senderName}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {deleteConfirm.latestMessage.senderEmail}
                  </span>
                  <br />
                  <span className="text-sm font-medium text-gray-700">
                    Subject: {deleteConfirm.subject}
                  </span>
                </p>
              </div>
              <p className="mb-6 text-sm font-medium text-center text-red-600">
                ⚠️ This will delete all {deleteConfirm.messages.length} messages
                in this thread. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteThread(deleteConfirm.threadId)}
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
