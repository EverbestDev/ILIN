import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useNavigate } from "react-router-dom";
import {
  Send,
  Eye,
  X,
  Filter,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const MESSAGE_API_URL =
  "https://ilin-backend.onrender.com/api/messages" ||
  import.meta.env.VITE_API_URL + "/api/messages" ||
  "http://localhost:5000/api/messages";
const CONTACT_API_URL =
  "https://ilin-backend.onrender.com/api/contact" ||
  import.meta.env.VITE_API_URL + "/api/contact" ||
  "http://localhost:5000/api/contact";

export default function ClientMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState({ subject: "", message: "" });
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com"
    );

    socketRef.current.on("newReply", (data) => {
      if (auth.currentUser && data.userId === auth.currentUser.uid) {
        setMessages((prev) => [data, ...prev]);
        setFilteredMessages((prev) => [data, ...prev]);
      }
    });

    socketRef.current.on("messageStatusUpdated", (update) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === update.id ? { ...m, isRead: update.isRead } : m
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const messagesPerPage = 10;

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    console.log("Current user:", user ? user.uid : "No user");
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    console.log("ID Token:", idToken);
    const idTokenResult = await user.getIdTokenResult();
    console.log("Token claims:", idTokenResult.claims);
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
      console.log("No user logged in, redirecting to login");
      navigate("/login");
    }
  }, [navigate]);

  //Websocket
  useEffect(() => {
    if (auth.currentUser && socketRef.current) {
      socketRef.current.emit("joinRoom", auth.currentUser.uid);
      console.log("Joined room:", auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const headers = await getAuthHeaders();
        const [messagesRes, contactsRes] = await Promise.all([
          fetch(MESSAGE_API_URL, { headers, credentials: "include" }),
          fetch(CONTACT_API_URL, { headers, credentials: "include" }),
        ]);
        if (!messagesRes.ok)
          throw new Error(`Failed to fetch messages: ${messagesRes.status}`);
        if (!contactsRes.ok)
          throw new Error(`Failed to fetch contacts: ${contactsRes.status}`);
        const messagesData = await messagesRes.json();
        const contactsData = await contactsRes.json();
        const combined = [
          ...messagesData,
          ...contactsData.map((c) => ({
            ...c,
            threadId: c._id, // Treat each contact as a single-message thread
            userId: auth.currentUser.uid,
            sender: "client",
            isRead: true, // Public contacts are read by default
          })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(combined);
        setFilteredMessages(combined);
      } catch (err) {
        console.error("Fetch messages error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (auth.currentUser) fetchMessages();
  }, []);

  //websocket
  useEffect(() => {
    socket.on("newReply", (data) => {
      // If this reply belongs to a thread the client is part of, update messages
      if (auth.currentUser && data.userId === auth.currentUser.uid) {
        setMessages((prev) => [data, ...prev]);
        setFilteredMessages((prev) => [data, ...prev]);
      }
    });

    socket.on("messageStatusUpdated", (update) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === update.id ? { ...m, isRead: update.isRead } : m
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let results = [...messages];
    if (search.trim()) {
      results = results.filter((m) =>
        m.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sourceFilter !== "all") {
      results = results.filter((m) => m.source === sourceFilter);
    }
    results.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    setFilteredMessages(results);
    setCurrentPage(1);
  }, [search, sortOrder, sourceFilter, messages]);

  const handleSendMessage = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(MESSAGE_API_URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(newMessage),
      });
      if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [data.data, ...prev]);
      setNewMessage({ subject: "", message: "" });
      showNotification("Message sent successfully", "success");
    } catch (err) {
      console.error("Send message error:", err);
      showNotification(`Error sending message: ${err.message}`, "error");
    }
  };

  const handleReply = async (threadId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${MESSAGE_API_URL}/${threadId}/reply`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ message: replyMessage }),
      });
      if (!res.ok) throw new Error(`Failed to send reply: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [data.data, ...prev]);
      setReplyMessage("");
      setSelectedThread(null);
      showNotification("Reply sent successfully", "success");
    } catch (err) {
      console.error("Reply error:", err);
      showNotification(`Error sending reply: ${err.message}`, "error");
    }
  };

  const handleMarkReadUnread = async (id, isRead) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${MESSAGE_API_URL}/${id}`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) throw new Error(`Failed to update message: ${res.status}`);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead } : m))
      );
      showNotification(
        `Message marked as ${isRead ? "read" : "unread"}`,
        "success"
      );
    } catch (err) {
      console.error("Mark read/unread error:", err);
      showNotification(`Error updating message: ${err.message}`, "error");
    }
  };

  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const threads = [];
  const threadMap = new Map();
  filteredMessages.forEach((msg) => {
    if (!threadMap.has(msg.threadId)) {
      threadMap.set(msg.threadId, []);
    }
    threadMap.get(msg.threadId).push(msg);
  });
  threadMap.forEach((msgs) => {
    threads.push({
      threadId: msgs[0].threadId,
      subject: msgs[0].subject,
      latestMessage: msgs[msgs.length - 1],
      isRead: msgs.every((m) => m.isRead),
      source: msgs[0].source,
    });
  });
  const currentThreads = threads.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(threads.length / messagesPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Messages</h1>

        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            New Message
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) =>
                setNewMessage({ ...newMessage, subject: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Message"
              value={newMessage.message}
              onChange={(e) =>
                setNewMessage({ ...newMessage, message: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="4"
            />
            <button
              onClick={handleSendMessage}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>

        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Messages
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Search by subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Sources</option>
              <option value="public">Public Contacts</option>
              <option value="client">Client Messages</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : currentThreads.length === 0 ? (
          <div className="py-10 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-600">No messages found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Source
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Latest Message
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentThreads.map((thread) => (
                    <tr key={thread.threadId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {thread.source === "public" ? "Public" : "Client"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {thread.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {thread.latestMessage.message.substring(0, 50)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(
                          thread.latestMessage.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedThread(thread.threadId)}
                          className="mr-4 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {thread.source === "client" && (
                          <button
                            onClick={() =>
                              handleMarkReadUnread(
                                thread.latestMessage._id,
                                !thread.isRead
                              )
                            }
                            className={
                              thread.isRead
                                ? "text-gray-600 hover:text-gray-800"
                                : "text-green-600 hover:text-green-800"
                            }
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, threads.length)} of {threads.length}{" "}
                threads
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedThread && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Message Thread
                </h2>
                <button
                  onClick={() => setSelectedThread(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {messages
                  .filter((m) => m.threadId === selectedThread)
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-4 rounded-lg ${
                        msg.source === "public"
                          ? "bg-gray-50"
                          : msg.sender === "client"
                          ? "bg-blue-50"
                          : "bg-green-50"
                      }`}
                    >
                      <p className="text-sm text-gray-600">
                        {msg.source === "public"
                          ? "Public"
                          : msg.sender === "client"
                          ? "You"
                          : "Admin"}{" "}
                        - {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <p className="font-medium text-gray-900">{msg.message}</p>
                    </div>
                  ))}
                {messages.find(
                  (m) => m.threadId === selectedThread && m.source === "client"
                ) && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="4"
                    />
                    <button
                      onClick={() => handleReply(selectedThread)}
                      className="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
