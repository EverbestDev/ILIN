import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utility/firebase";
import {
  Send,
  MessageSquare,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

export default function ClientMessages() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: "", message: "" });
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      isAdmin: false,
    });

    // Listen for admin replies
    socketRef.current.on("new_admin_reply", (reply) => {
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

      // Update current thread view if open
      if (selectedThread === reply.threadId) {
        setThreadMessages((prev) => [...prev, reply]);
      }

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

      if (selectedThread === update.threadId) {
        setThreadMessages((prev) =>
          prev.map((msg) =>
            msg._id === update.id ? { ...msg, isRead: update.isRead } : msg
          )
        );
      }
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
  }, [navigate, selectedThread]);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/messages`, { headers });

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setThreads(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        showNotification(error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchThreads();
  }, []);

  // Create new thread
  const handleCreateThread = async () => {
    if (!newMessage.subject.trim() || !newMessage.message.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to create message");

      const result = await res.json();
      const newThread = {
        threadId: result.data.threadId,
        subject: result.data.subject,
        userId: result.data.userId,
        messages: [result.data],
        latestMessage: result.data,
        unreadCount: 0,
      };

      setThreads((prev) => [newThread, ...prev]);
      setNewMessage({ subject: "", message: "" });
      setShowNewMessage(false);
      showNotification("Message sent successfully", "success");
    } catch (error) {
      console.error("Create error:", error);
      showNotification(error.message, "error");
    }
  };

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

  // Pagination
  const indexOfLast = currentPage * threadsPerPage;
  const indexOfFirst = indexOfLast - threadsPerPage;
  const currentThreads = threads.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(threads.length / threadsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
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

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
            <p className="mt-1 text-gray-600">
              Communicate with our support team
            </p>
          </div>
          <button
            onClick={() => setShowNewMessage(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            New Message
          </button>
        </div>

        {/* Threads List */}
        {threads.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No messages yet
            </h3>
            <p className="mb-6 text-gray-600">
              Start a conversation with our team
            </p>
            <button
              onClick={() => setShowNewMessage(true)}
              className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Send Your First Message
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {currentThreads.map((thread) => (
                  <div
                    key={thread.threadId}
                    onClick={() => handleViewThread(thread.threadId)}
                    className="p-4 transition-colors cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {thread.subject}
                          </h3>
                          {thread.unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                              {thread.unreadCount} new
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {thread.latestMessage.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(
                            thread.latestMessage.createdAt
                          ).toLocaleString()}
                        </div>
                      </div>
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirst + 1} to{" "}
                  {Math.min(indexOfLast, threads.length)} of {threads.length}{" "}
                  threads
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessage(false);
                  setNewMessage({ subject: "", message: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  placeholder="Enter subject..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  placeholder="Type your message..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowNewMessage(false);
                  setNewMessage({ subject: "", message: "" });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {threadMessages.length} message
                  {threadMessages.length !== 1 ? "s" : ""}
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
                    msg.sender === "client" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      msg.sender === "client"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">
                        {msg.sender === "client" ? "You" : "Admin"}
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
    </div>
  );
}
