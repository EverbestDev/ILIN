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

// Mock Data
const MOCK_CLIENT_EMAIL = "sarah@client.com";

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
        sender: "Admin",
        text: "Yes, we offer certified translations! The fee typically adds 15% to the base price and includes notarization. I recommend submitting a quote request with your document for an exact price. Let us know if you have any documents ready!",
        date: "2025-10-15T10:00:00Z",
      },
    ],
  },
  {
    id: 2,
    subject: "Update on Project #ILIN-2025-101",
    status: "Open",
    lastUpdate: "2025-10-16T14:30:00Z",
    isNew: true,
    orderId: "#ILIN-2025-101",
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "I uploaded the final documents for Project #ILIN-2025-101. Could you confirm receipt and provide an updated delivery timeline?",
        date: "2025-10-16T14:30:00Z",
      },
    ],
  },
  {
    id: 3,
    subject: "Request for a new language pair: Swahili to English",
    status: "Closed",
    lastUpdate: "2025-09-01T12:00:00Z",
    isNew: false,
    orderId: null,
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "I am interested in starting a project that requires Swahili to English translation. Is this a supported language pair?",
        date: "2025-08-30T10:00:00Z",
      },
      {
        sender: "Admin",
        text: "We successfully onboarded a Swahili expert! We're happy to support your project. The thread is now closed, please feel free to start a new one if you have documents ready.",
        date: "2025-09-01T12:00:00Z",
      },
    ],
  },
];

const Messages = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isNewThread, setIsNewThread] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [newThreadBody, setNewThreadBody] = useState("");
  const [newThreadOrderLink, setNewThreadOrderLink] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL state for new thread creation, e.g., from a link in the Quote page
    if (location.state && location.state.createNewThread) {
      handleNewThreadClick();
      if (location.state.subject) {
        setNewThreadSubject(location.state.subject);
      }
      if (location.state.orderId) {
        setNewThreadOrderLink(location.state.orderId);
      }
      // Clear state after use
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleThreadSelect = (threadId) => {
    const thread = threads.find((t) => t.id === threadId);
    setSelectedThread(thread);
    setIsNewThread(false);

    // Mark as read (client-side mock logic)
    setThreads(
      threads.map((t) => (t.id === threadId ? { ...t, isNew: false } : t))
    );
  };

  const handleNewThreadClick = () => {
    setSelectedThread(null);
    setIsNewThread(true);
    setNewThreadSubject("");
    setNewThreadBody("");
    setNewThreadOrderLink("");
  };

  const handleCreateNewThread = () => {
    if (!newThreadSubject.trim() || !newThreadBody.trim()) return;

    const newId =
      threads.length > 0 ? Math.max(...threads.map((t) => t.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newThread = {
      id: newId,
      subject: newThreadSubject.trim(),
      status: "Open",
      lastUpdate: now,
      isNew: false,
      orderId: newThreadOrderLink.trim() || null,
      messages: [
        {
          sender: MOCK_CLIENT_EMAIL,
          text: newThreadBody.trim(),
          date: now,
        },
      ],
    };

    setThreads([newThread, ...threads]);
    setSelectedThread(newThread);
    setIsNewThread(false);
    showNotification("New thread created successfully!", "success");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedThread) return;

    const now = new Date().toISOString();
    const newMessage = {
      sender: MOCK_CLIENT_EMAIL,
      text: messageInput.trim(),
      date: now,
    };

    setThreads(
      threads.map((t) =>
        t.id === selectedThread.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastUpdate: now,
              status: "Open", // Re-open thread on new client message
            }
          : t
      )
    );
    setSelectedThread((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastUpdate: now,
      status: "Open",
    }));

    setMessageInput("");
    showNotification("Message sent!", "success");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Replied":
        return "bg-green-100 text-green-700 border-green-300";
      case "Open":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- RENDERING COMPONENTS ---

  const renderNotification = () => {
    if (!notification) return null;

    const Icon = notification.type === "success" ? CheckCircle : AlertCircle;
    const baseColor =
      notification.type === "success" ? "bg-green-500" : "bg-red-500";

    return (
      <div
        className={`fixed top-20 right-4 p-4 text-white rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 z-[100] ${baseColor}`}
        style={{ animation: "message-slide-in 0.3s forwards" }}
      >
        <Icon className="w-5 h-5" />
        <p className="font-medium">{notification.message}</p>
        <button onClick={() => setNotification(null)}>
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderThreadList = () => (
    <div className="flex-shrink-0 w-full border-r border-gray-200 lg:w-80">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <button
          onClick={handleNewThreadClick}
          className="p-2 text-white transition-all bg-green-600 rounded-full hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="h-[calc(100vh-14rem)] overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No threads yet. Start a new one!
          </div>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleThreadSelect(thread.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                selectedThread?.id === thread.id
                  ? "bg-green-50 border-l-4 border-green-600"
                  : thread.isNew
                  ? "bg-blue-50 hover:bg-blue-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-semibold truncate ${
                    selectedThread?.id === thread.id
                      ? "text-green-800"
                      : "text-gray-900"
                  }`}
                >
                  {thread.subject}
                </p>
                {thread.isNew && (
                  <span className="w-2 h-2 ml-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 truncate">
                {thread.messages[thread.messages.length - 1].text}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                    thread.status
                  )}`}
                >
                  {thread.status}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(thread.lastUpdate)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderThreadView = () => (
    <div className="flex flex-col flex-1 h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedThread(null)}
          className="flex items-center gap-2 p-2 text-gray-600 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {selectedThread.subject}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                selectedThread.status
              )}`}
            >
              {selectedThread.status}
            </span>
            {selectedThread.orderId && (
              <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                <FileText className="w-3 h-3" />
                Order: {selectedThread.orderId}
              </span>
            )}
            <span className="text-xs text-gray-500">
              Last Update: {formatDate(selectedThread.lastUpdate)}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
              className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow ${
                message.sender === MOCK_CLIENT_EMAIL
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="mb-1 text-xs font-semibold">
                {message.sender === MOCK_CLIENT_EMAIL ? "You" : "Admin"}
              </p>
              <p className="text-sm break-words">{message.text}</p>
              <p
                className={`text-xs mt-2 text-right ${
                  message.sender === MOCK_CLIENT_EMAIL
                    ? "text-green-200"
                    : "text-gray-500"
                }`}
              >
                {formatDate(message.date)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <textarea
            rows="2"
            placeholder="Type your reply..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:border-green-500"
            disabled={selectedThread.status === "Closed"}
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !messageInput.trim() || selectedThread.status === "Closed"
            }
            className="flex items-center justify-center p-3 text-white transition-all bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {selectedThread.status === "Closed" && (
          <p className="mt-2 text-sm font-medium text-red-600">
            This thread is closed. Please start a new thread for further
            discussion.
          </p>
        )}
      </div>
    </div>
  );

  const renderNewThreadView = () => (
    <div className="flex flex-col flex-1 h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center flex-shrink-0 p-4 border-b border-gray-200">
        <button
          onClick={() => setIsNewThread(false)}
          className="flex items-center gap-2 p-2 mr-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">New Message Thread</h2>
      </div>

      {/* Form Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject (e.g., Question about Project X)"
            value={newThreadSubject}
            onChange={(e) => setNewThreadSubject(e.target.value)}
            className="w-full p-3 text-lg font-semibold border border-gray-300 rounded-lg focus:border-green-500"
          />
          <input
            type="text"
            placeholder="Link to Order ID (Optional, e.g., #1012)"
            value={newThreadOrderLink}
            onChange={(e) => setNewThreadOrderLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500"
          />
          <textarea
            rows="4"
            placeholder="Your message details..."
            value={newThreadBody}
            onChange={(e) => setNewThreadBody(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Footer Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={handleCreateNewThread}
          disabled={!newThreadSubject.trim() || !newThreadBody.trim()}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          Start Thread
        </button>
      </div>
    </div>
  );

  const renderEmptyView = () => (
    <div className="flex flex-col items-center justify-center flex-1 h-[calc(100vh-10rem)] p-4 text-center">
      <MessageSquare className="w-16 h-16 mb-4 text-green-300" />
      <h2 className="text-2xl font-bold text-gray-700">
        Client Messaging Center
      </h2>
      <p className="mt-2 text-gray-500">
        Select a conversation from the left or start a new one to communicate
        with the Admin team.
      </p>
      <button
        onClick={handleNewThreadClick}
        className="flex items-center gap-2 px-6 py-3 mt-6 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
      >
        <Plus className="w-5 h-5" />
        New Thread
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {renderNotification()}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
        <div className="flex">
          {/* Thread List - Always visible on large screens, conditionally visible on small screens */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              selectedThread || isNewThread
                ? "hidden lg:block lg:w-80"
                : "block w-full"
            }`}
          >
            {renderThreadList()}
          </div>

          {/* Thread View / New Thread / Empty View - Takes up the rest of the space */}
          <div
            className={`flex-1 ${
              selectedThread || isNewThread ? "block" : "hidden lg:block"
            }`}
          >
            {selectedThread
              ? renderThreadView()
              : isNewThread
              ? renderNewThreadView()
              : renderEmptyView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
