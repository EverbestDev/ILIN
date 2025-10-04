import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  MessageSquare,
  X,
  Plus,
  ArrowLeft,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Mock Data - Replace with your actual API calls
const MOCK_CLIENT_EMAIL = "sarah@client.com";
const MOCK_ADMIN_EMAIL = "Admin";

const mockThreads = [
  {
    id: 1,
    subject: "Inquiry about certified translation cost",
    status: "Replied",
    lastUpdate: "2025-10-15T10:00:00Z",
    isNew: false,
    orderId: null,
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "I need to translate a diploma for USCIS. Do you offer certified translation, and what is the typical cost difference?",
        date: "2025-10-14T15:00:00Z",
      },
      {
        sender: MOCK_ADMIN_EMAIL,
        text: "Yes, we offer certified translations! The fee typically adds 15% to the base price and includes notarization. I recommend submitting a quote request with your document for an exact price. Let us know if you have any documents ready!",
        date: "2025-10-15T10:00:00Z",
      },
    ],
  },
  {
    id: 2,
    subject: "Issue with Order #1012: Incorrect language pair",
    status: "Open",
    lastUpdate: "2025-10-16T15:30:00Z",
    isNew: true,
    orderId: "1012",
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "Hi, I just submitted Order #1012, but I realized I selected Spanish-to-English instead of German-to-English. Can someone please correct this for me? The document is attached.",
        date: "2025-10-16T15:30:00Z",
      },
    ],
  },
  {
    id: 3,
    subject: "Follow-up on my recent translation project",
    status: "Closed",
    lastUpdate: "2025-10-10T09:15:00Z",
    isNew: false,
    orderId: "998",
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "Just checking on the status of Order #998. It was due yesterday.",
        date: "2025-10-09T14:00:00Z",
      },
      {
        sender: MOCK_ADMIN_EMAIL,
        text: "Apologies for the delay! The final file was delivered to your email five minutes ago. Please check and confirm receipt. Thank you for your patience.",
        date: "2025-10-10T09:15:00Z",
      },
    ],
  },
];

// Utility functions
const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = (now - date) / (1000 * 60 * 60 * 24);

  if (diffInDays < 1) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getThreadStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "text-green-600 bg-green-100 border-green-200";
    case "Replied":
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    case "Closed":
      return "text-gray-600 bg-gray-100 border-gray-200";
    default:
      return "text-gray-600 bg-gray-100 border-gray-200";
  }
};

const Messages = () => {
  const [threads, setThreads] = useState(mockThreads);
  // View states: "list" (default), "thread", "new"
  const [view, setView] = useState("list");
  const [selectedThread, setSelectedThread] = useState(null);

  // New Thread State
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [newThreadOrderLink, setNewThreadOrderLink] = useState("");
  const [newThreadBody, setNewThreadBody] = useState("");

  // Message Sending State
  const [messageText, setMessageText] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNewThread = () => {
    if (!newThreadSubject.trim() || !newThreadBody.trim()) {
      showNotification("Subject and message body cannot be empty.", "error");
      return;
    }

    const newThread = {
      id: threads.length + 1,
      subject: newThreadSubject.trim(),
      status: "Open",
      lastUpdate: new Date().toISOString(),
      isNew: true,
      orderId: newThreadOrderLink.trim() || null,
      messages: [
        {
          sender: MOCK_CLIENT_EMAIL,
          text: newThreadBody.trim(),
          date: new Date().toISOString(),
        },
      ],
    };

    setThreads([newThread, ...threads.map((t) => ({ ...t, isNew: false }))]);
    setSelectedThread(newThread);
    setView("thread");

    // Clear form
    setNewThreadSubject("");
    setNewThreadOrderLink("");
    setNewThreadBody("");

    showNotification("New thread created and message sent!", "success");
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;

    const newMessage = {
      sender: MOCK_CLIENT_EMAIL,
      text: messageText.trim(),
      date: new Date().toISOString(),
    };

    const updatedThreads = threads.map((thread) => {
      if (thread.id === selectedThread.id) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastUpdate: newMessage.date,
          status: thread.status === "Closed" ? "Open" : thread.status, // Re-open if sending to a closed thread
          isNew: true,
        };
      }
      return { ...thread, isNew: false };
    });

    setThreads(updatedThreads);
    setSelectedThread((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastUpdate: newMessage.date,
      status: prev.status === "Closed" ? "Open" : prev.status,
    }));
    setMessageText("");

    showNotification("Message sent successfully!", "success");
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    setView("thread");
    // Mark as read immediately on selection
    setThreads((prevThreads) =>
      prevThreads.map((t) => (t.id === thread.id ? { ...t, isNew: false } : t))
    );
    setSelectedThread((prev) => (prev ? { ...prev, isNew: false } : thread));
  };

  const handleStatusChange = (status) => {
    if (!selectedThread) return;

    const updatedThreads = threads.map((thread) => {
      if (thread.id === selectedThread.id) {
        return {
          ...thread,
          status: status,
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    setSelectedThread((prev) => (prev ? { ...prev, status } : null));

    showNotification(`Thread status updated to "${status}"`, "success");
  };

  // Helper component for the message bubble
  const MessageBubble = ({ message }) => {
    const isClient = message.sender === MOCK_CLIENT_EMAIL;
    const senderName = isClient ? "You" : "Support Team";

    return (
      <div
        className={`flex ${isClient ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-3/4 p-3 rounded-lg shadow-sm ${
            isClient
              ? "bg-green-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <div
            className={`text-xs font-semibold mb-1 ${
              isClient ? "text-green-200" : "text-gray-600"
            }`}
          >
            {senderName}
          </div>
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.text}
          </p>
          <div className="mt-2 text-xs text-right opacity-70">
            {formatTime(message.date)}
          </div>
        </div>
      </div>
    );
  };

  // Main Component Return
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="flex items-center gap-3 mb-6 text-3xl font-bold text-gray-900">
        <MessageSquare className="w-8 h-8 text-green-600" />
        My Messages
      </h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[70vh] flex">
        {/* Thread List Sidebar (Left) */}
        <div
          className={`flex-shrink-0 w-full lg:w-80 border-r border-gray-200 transition-all duration-300 ${
            view === "thread" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Active Threads ({threads.length})
            </h2>
            <button
              onClick={() => setView("new")}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white transition-all bg-green-600 rounded-lg shadow-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Thread
            </button>
          </div>

          {threads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No active message threads.
            </div>
          ) : (
            <div className="overflow-y-auto h-[calc(70vh-5rem)]">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedThread && selectedThread.id === thread.id
                      ? "bg-green-50"
                      : "hover:bg-gray-50"
                  } ${thread.isNew ? "bg-green-50/50 font-medium" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">
                      {thread.subject}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${getThreadStatusColor(
                        thread.status
                      )}`}
                    >
                      {thread.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <p className="mr-2 truncate">
                      {thread.messages[thread.messages.length - 1]?.text}
                    </p>
                    <span className="flex-shrink-0">
                      {formatDate(thread.lastUpdate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Content / New Thread Form (Right) */}
        <div
          className={`flex-grow w-full transition-all duration-300 ${
            view === "thread" || view === "new"
              ? "block"
              : "hidden lg:block md:flex items-center justify-center"
          }`}
        >
          {/* Default/Empty View */}
          {view === "list" && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mb-4 text-gray-300" />
              <p className="mb-2 text-xl font-semibold text-gray-700">
                Select a thread to view messages
              </p>
              <p>Or click "New Thread" to start a new conversation.</p>
            </div>
          )}

          {/* New Thread Form (CLEANED) */}
          {view === "new" && (
            <div className="flex flex-col h-full p-6">
              <div className="flex-grow">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                  <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                    <Plus className="w-6 h-6 text-green-600" />
                    Start a New Message Thread
                  </h2>
                  <button
                    onClick={() => {
                      setView("list");
                      setSelectedThread(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* Form Fields - Cleaned and with green focus */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Subject of your new thread..."
                    value={newThreadSubject}
                    onChange={(e) => setNewThreadSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Link to Order ID (Optional, e.g., #1012)"
                    value={newThreadOrderLink}
                    onChange={(e) => setNewThreadOrderLink(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 focus:border-green-500"
                  />
                  <textarea
                    rows="4"
                    placeholder="Your message details..."
                    value={newThreadBody}
                    onChange={(e) => setNewThreadBody(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-2 focus:border-green-500"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateNewThread}
                disabled={!newThreadSubject.trim() || !newThreadBody.trim()}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                Create Thread & Send Message
              </button>
            </div>
          )}

          {/* Thread View */}
          {view === "thread" && selectedThread && (
            <div className="flex flex-col h-full">
              {/* Thread Header */}
              <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView("list")}
                    className="text-gray-500 lg:hidden hover:text-gray-700"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {selectedThread.subject}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${getThreadStatusColor(
                          selectedThread.status
                        )}`}
                      >
                        {selectedThread.status}
                      </span>
                      {selectedThread.orderId && (
                        <span className="flex items-center gap-1 text-green-600">
                          <FileText className="w-3 h-3" />
                          Order #{selectedThread.orderId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Status Dropdown/Actions (Mocked) */}
                <div className="relative">
                  <select
                    value={selectedThread.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`px-3 py-2 text-sm font-medium border rounded-lg appearance-none cursor-pointer focus:outline-none ${getThreadStatusColor(
                      selectedThread.status
                    )}`}
                  >
                    <option value="Open">Open</option>
                    <option value="Replied">Awaiting Reply</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-grow p-4 overflow-y-auto">
                {selectedThread.messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
              </div>

              {/* Message Input Area */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <textarea
                    rows="1"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-2 focus:border-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="flex-shrink-0 p-3 text-white transition-colors bg-green-600 rounded-full shadow-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white flex items-center gap-3 transition-opacity duration-300 z-50 ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <Mail className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
