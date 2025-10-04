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
    subject: "Update on Order #1012: Document Missing",
    status: "Open",
    lastUpdate: "2025-10-18T14:30:00Z",
    isNew: true,
    orderId: "1012",
    messages: [
      {
        sender: MOCK_ADMIN_EMAIL,
        text: "Hello, we noticed the source document for Order #1012 seems corrupted. Can you please re-upload or send it to us via this thread?",
        date: "2025-10-18T14:30:00Z",
      },
    ],
  },
  {
    id: 3,
    subject: "Feedback on recent translation delivery",
    status: "Closed",
    lastUpdate: "2025-10-10T09:00:00Z",
    isNew: false,
    orderId: null,
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "The translation was excellent, thank you!",
        date: "2025-10-09T17:00:00Z",
      },
      {
        sender: MOCK_ADMIN_EMAIL,
        text: "That's wonderful to hear! We've closed this thread. Please open a new one if you need anything else.",
        date: "2025-10-10T09:00:00Z",
      },
    ],
  },
];

// Helper functions
const formatLastUpdate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getThreadStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "text-red-600 bg-red-100 border-red-300";
    case "Replied":
      return "text-blue-600 bg-blue-100 border-blue-300";
    case "Closed":
      return "text-gray-600 bg-gray-100 border-gray-300";
    default:
      return "text-gray-600 bg-gray-100 border-gray-300";
  }
};

const Messages = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // New thread state
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [newThreadBody, setNewThreadBody] = useState("");
  const [newThreadOrderLink, setNewThreadOrderLink] = useState("");

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const isMobile = window.innerWidth < 1024; // Tailwind's 'lg' breakpoint

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;

    const newMessage = {
      sender: MOCK_CLIENT_EMAIL,
      text: messageText.trim(),
      date: new Date().toISOString(),
    };

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === selectedThreadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastUpdate: new Date().toISOString(),
              status: "Open", // Client reply makes status 'Open'
              isNew: false, // User has seen it/replied
            }
          : thread
      )
    );

    setMessageText("");
    showNotification("Message sent successfully", "success");
  };

  const handleCreateNewThread = () => {
    if (!newThreadSubject.trim() || !newThreadBody.trim()) return;

    const newId = threads.length > 0 ? Math.max(...threads.map(t => t.id)) + 1 : 1;

    const newThread = {
      id: newId,
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

    setThreads((prevThreads) => [newThread, ...prevThreads]);

    // Reset state and close modal
    setNewThreadSubject("");
    setNewThreadBody("");
    setNewThreadOrderLink("");
    setShowNewThreadModal(false);
    setSelectedThreadId(newId); // Immediately show the new thread

    showNotification("New thread created successfully!", "success");
  };

  const ThreadListItem = ({ thread }) => (
    <button
      key={thread.id}
      onClick={() => {
        setSelectedThreadId(thread.id);
        // Mark as old when selected
        setThreads(prevThreads => prevThreads.map(t => t.id === thread.id ? {...t, isNew: false} : t));
      }}
      className={`w-full p-3 text-left border rounded-lg transition-all ${
        selectedThreadId === thread.id
          ? "bg-green-50 border-green-300 shadow-md"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getThreadStatusColor(
                thread.status
              )}`}
            >
              {thread.status}
            </span>
            {thread.isNew && (
                <span className="text-xs font-bold text-red-600">NEW</span>
            )}
        </div>
        <span className="text-xs text-gray-500">
          {formatLastUpdate(thread.lastUpdate)}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900 truncate">
        {thread.subject}
      </p>
      <p className="mt-1 text-xs text-gray-500 truncate">
        {thread.messages[thread.messages.length - 1].text}
      </p>
    </button>
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg h-full max-h-[calc(100vh-10rem)] overflow-hidden flex min-h-[calc(100vh-10rem)]">
      {/* Messages Main Container */}
      <div className="flex w-full">
        {/* Left Sidebar - Thread List (Hidden on mobile when a thread is selected) */}
        <div
          className={`w-full lg:w-80 border-r border-gray-200 bg-white flex-shrink-0 transition-transform duration-300 ease-in-out ${
            selectedThreadId !== null
              ? "-translate-x-full lg:translate-x-0"
              : "translate-x-0"
          }`}
        >
          {/* Header & Filter */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Client Messages
            </h2>
            {/* Filter/Sort button can go here if needed */}
          </div>

          {/* New Thread Button (Desktop Only) */}
          <div className="p-4 border-b border-gray-100 **hidden lg:block**"> 
            <button
              onClick={() => {
                setSelectedThreadId(null); // Clear selection
                setShowNewThreadModal(true); // Open the modal
              }}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-md hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              New Thread
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-grow p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-15rem)]">
            {threads.length === 0 ? (
              <p className="py-12 text-sm text-center text-gray-500">
                No active message threads.
              </p>
            ) : (
              threads.map((thread) => (
                <ThreadListItem key={thread.id} thread={thread} />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message View (Hidden on mobile when list is shown) */}
        <div
          className={`flex-grow bg-white flex flex-col ${
            selectedThreadId === null ? "hidden lg:flex" : "flex"
          } transition-all duration-300 ease-in-out`}
        >
          {selectedThreadId === null ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-xl font-semibold">Select a message</h3>
                <p className="text-sm">
                  Choose a thread from the left or create a new one.
                </p>
              </div>
            </div>
          ) : (
            // Message Thread Detail
            <div className="flex flex-col h-full overflow-hidden">
              {/* Thread Header */}
              <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-100 bg-gray-50">
                <button
                  onClick={() => setSelectedThreadId(null)}
                  className="flex items-center gap-2 text-gray-700 transition-colors hover:text-green-600 lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0 lg:ml-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {selectedThread.subject}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Order ID:{" "}
                    <span className="font-medium text-gray-700">
                      {selectedThread.orderId || "N/A"}
                    </span>
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ml-4 ${getThreadStatusColor(
                    selectedThread.status
                  )}`}
                >
                  {selectedThread.status}
                </span>
              </div>

              {/* Message History */}
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {selectedThread.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === MOCK_CLIENT_EMAIL
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-lg shadow-sm ${
                        message.sender === MOCK_CLIENT_EMAIL
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.sender === MOCK_CLIENT_EMAIL
                            ? "text-green-200"
                            : "text-gray-500"
                        } text-right`}
                      >
                        {formatLastUpdate(message.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 p-4 border-t border-gray-100">
                <div className="flex items-end gap-3">
                  <textarea
                    rows="1"
                    placeholder="Type your reply..."
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

      {/* FIX 2: Floating Action Button (FAB) for Mobile Only */}
      {selectedThreadId === null && !showNewThreadModal && (
        <button
          onClick={() => setShowNewThreadModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:bg-green-700 **lg:hidden z-40**" // <-- Key Fix: High z-index and mobile-only
        >
          <Plus className="w-6 h-6" />
        </button>
      )}


      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg p-6 mx-4 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Start a New Thread
              </h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject (e.g., Question about Invoice #1234)"
                value={newThreadSubject}
                onChange={(e) => setNewThreadSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500" // CHANGED: blue -> green
              />
              <input
                type="text"
                placeholder="Link to Order ID (Optional, e.g., #1012)"
                value={newThreadOrderLink}
                onChange={(e) => setNewThreadOrderLink(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500" // CHANGED: blue -> green
              />
              <textarea
                rows="4"
                placeholder="Your message details..."
                value={newThreadBody}
                onChange={(e) => setNewThreadBody(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-green-500" // CHANGED: blue -> green
              />
            </div>
            <button
              onClick={handleCreateNewThread}
              disabled={!newThreadSubject.trim() || !newThreadBody.trim()}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              Create Thread
            </button>
          </div>
        </div>
      )}

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