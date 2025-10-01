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
    subject: "Question regarding Order #1012 files",
    status: "New",
    lastUpdate: "2025-10-20T14:30:00Z",
    isNew: true,
    orderId: "1012",
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "I uploaded the wrong version of the source file for Order #1012. Can I replace it or send the correct one via email?",
        date: "2025-10-20T14:30:00Z",
      },
    ],
  },
  {
    id: 3,
    subject: "Feedback on Website Localization Project",
    status: "Closed",
    lastUpdate: "2025-09-01T12:00:00Z",
    isNew: false,
    orderId: "0987",
    messages: [
      {
        sender: MOCK_CLIENT_EMAIL,
        text: "The German localization was fantastic! We launched the site successfully. Just wanted to say thank you.",
        date: "2025-08-31T10:00:00Z",
      },
      {
        sender: "Admin",
        text: "That is wonderful to hear! We've closed this thread now, but don't hesitate to reach out with your next project.",
        date: "2025-09-01T12:00:00Z",
      },
    ],
  },
];

// --- START OF MESSAGES COMPONENT ---
const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation(); // State for messages
  const [threads, setThreads] = useState(mockThreads);
  const [activeThread, setActiveThread] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [newThreadOrderLink, setNewThreadOrderLink] = useState("");
  const [newThreadBody, setNewThreadBody] = useState(""); // Check URL for linked order ID (e.g., from OrderDetails page)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicId = params.get("topic");
    if (topicId) {
      setNewThreadOrderLink(
        topicId.startsWith("#") ? topicId.substring(1) : topicId
      );
      setShowNewThreadModal(true);
    }
  }, [location.search]); // Load the first thread by default if no thread is active

  useEffect(() => {
    if (!activeThread && threads.length > 0) {
      setActiveThread(threads[0]);
    }
  }, [threads, activeThread]);

  const handleSendMessage = () => {
    if (activeThread && newMessageText.trim()) {
      const updatedThreads = threads.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  sender: MOCK_CLIENT_EMAIL,
                  text: newMessageText.trim(),
                  date: new Date().toISOString(),
                },
              ],
              lastUpdate: new Date().toISOString(),
              status: "Awaiting Reply",
              isNew: false,
            }
          : thread
      );
      setThreads(updatedThreads);
      setActiveThread(updatedThreads.find((t) => t.id === activeThread.id));
      setNewMessageText(""); // In a real app: call API to send message
    }
  };

  const handleCreateNewThread = () => {
    if (!newThreadSubject.trim() || !newThreadBody.trim()) return;
    const newThread = {
      id: threads.length + 1,
      subject: newThreadSubject.trim(),
      status: "Submitted",
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

    setThreads([newThread, ...threads]); // Add new thread to the top
    setActiveThread(newThread);
    setShowNewThreadModal(false);
    setNewThreadSubject("");
    setNewThreadBody("");
    setNewThreadOrderLink(""); // In a real app: call API to create new thread
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-green-100 text-green-700 border-green-200";
      case "Replied":
        return "bg-green-100 text-green-700 border-green-200"; // CHANGED: blue -> green
      case "Awaiting Reply":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }; // --- Thread List Item Component ---

  const ThreadItem = ({ thread }) => (
    <div
      onClick={() => setActiveThread(thread)}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
        activeThread?.id === thread.id
          ? "bg-green-50 border-green-200 shadow-inner" // CHANGED: blue -> green
          : "bg-white hover:bg-gray-50"
      }`}
    >
           {" "}
      <div className="flex items-center justify-between">
               {" "}
        <h3 className="pr-2 text-base font-semibold text-gray-900 truncate">
                    {thread.subject}       {" "}
        </h3>
               {" "}
        {thread.isNew && (
          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            New            {" "}
          </span>
        )}
             {" "}
      </div>
           {" "}
      <div className="flex items-center gap-2 mt-1">
               {" "}
        {thread.orderId && (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
                            <FileText className="w-3 h-3 text-gray-500" />     
                      Order #{thread.orderId}           {" "}
          </span>
        )}
               {" "}
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(
            thread.status
          )}`}
        >
                      {thread.status}       {" "}
        </span>
             {" "}
      </div>
           {" "}
      <p className="mt-2 text-xs text-gray-500">
               {" "}
        {new Date(thread.lastUpdate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
             {" "}
      </p>
         {" "}
    </div>
  ); // --- Message Bubble Component ---

  const MessageBubble = ({ message }) => {
    const isClient = message.sender === MOCK_CLIENT_EMAIL;
    return (
      <div
        className={`flex ${isClient ? "justify-end" : "justify-start"} mb-4`}
      >
               {" "}
        <div
          className={`max-w-xl p-4 rounded-xl shadow-sm ${
            isClient
              ? "bg-green-600 text-white rounded-br-none" // CHANGED: blue -> green
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
                     {" "}
          <p className="mb-1 text-xs font-semibold opacity-80">
                            {isClient ? "You" : "Support Team"}           {" "}
          </p>
                    <p className="text-sm leading-relaxed">{message.text}</p>   
               {" "}
          <time
            className={`block mt-2 text-xs ${
              isClient ? "text-green-200" : "text-gray-500"
            } text-right`}
          >
            {" "}
            // CHANGED: blue -> green            {" "}
            {new Date(message.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
                     {" "}
          </time>
                 {" "}
        </div>
             {" "}
      </div>
    );
  };
  if (threads.length === 0 && !loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                   {" "}
        <div className="p-10 space-y-4 text-center bg-white border border-gray-200 shadow-lg rounded-xl">
                          <Mail className="w-12 h-12 mx-auto text-gray-400" /> 
                       {" "}
          <h1 className="text-2xl font-bold text-gray-900">No Messages Yet</h1> 
                       {" "}
          <p className="text-gray-600">
            Start a new conversation to connect with our support team.
          </p>
                         {" "}
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 px-6 py-3 mx-auto font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" // CHANGED: blue -> green gradient
          >
                                <Plus className="w-5 h-5" /> Start New Thread  
                         {" "}
          </button>
                     {" "}
        </div>
               {" "}
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
           {" "}
      <header className="flex items-center justify-between pb-6 border-b border-gray-200">
               {" "}
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                    <MessageSquare className="text-green-600 w-7 h-7" /> Support
          Inbox // CHANGED: blue -> green        {" "}
        </h1>
               {" "}
        <button
          onClick={() => setShowNewThreadModal(true)}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" // CHANGED: blue -> green gradient
        >
                    <Plus className="w-5 h-5" /> New Message        {" "}
        </button>
             {" "}
      </header>
            {/* Main Layout: Threads List (Left) and Conversation (Right) */}   
       {" "}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg h-[70vh] flex overflow-hidden">
                       {" "}
        {/* Left Column: Thread List (2/5 width on desktop, full on mobile) */} 
             {" "}
        <div className="w-full overflow-y-auto border-r border-gray-200 lg:w-2/5">
                   {" "}
          {threads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
                 {" "}
        </div>
               {" "}
        {/* Right Column: Conversation View (3/5 width on desktop, hidden on mobile) */}
               {" "}
        <div className="flex flex-col w-full lg:w-3/5">
                   {" "}
          {activeThread ? (
            <>
                            {/* Conversation Header */}             {" "}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
                               {" "}
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                                      {activeThread.subject}               {" "}
                </h2>
                               {" "}
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                    activeThread.status
                  )} flex-shrink-0`}
                >
                                      {activeThread.status}               {" "}
                </span>
                             {" "}
              </div>
                            {/* Message History */}             {" "}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                               {" "}
                {activeThread.messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                             {" "}
              </div>
                            {/* Message Input */}             {" "}
              <div className="p-5 bg-white border-t border-gray-200">
                               {" "}
                <div className="flex gap-3">
                                   {" "}
                  <textarea
                    rows="2"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:border-green-500 focus:ring-green-500" // CHANGED: blue -> green
                    disabled={activeThread.status === "Closed"}
                  />
                                   {" "}
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !newMessageText.trim() || activeThread.status === "Closed"
                    }
                    className="px-6 py-2.5 font-semibold text-white transition-all rounded-lg shadow-md bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center" // CHANGED: blue -> green
                  >
                                        <Send className="w-5 h-5" />           
                         {" "}
                  </button>
                                 {" "}
                </div>
                               {" "}
                {activeThread.status === "Closed" && (
                  <p className="flex items-center gap-1 mt-2 text-sm text-red-600">
                                            <AlertCircle className="w-4 h-4" />{" "}
                    This thread is closed. Please start a new message for
                    further inquiries.                    {" "}
                  </p>
                )}
                             {" "}
              </div>
                         {" "}
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500">
                            Select a thread to view the conversation.          
               {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </div>
                  {/* New Thread Modal */}     {" "}
      {showNewThreadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowNewThreadModal(false)}
        >
                   {" "}
          <div
            className="w-full max-w-lg p-8 m-4 bg-white shadow-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
                       {" "}
            <div className="flex items-center justify-between pb-3 mb-6 border-b">
                           {" "}
              <h2 className="text-2xl font-bold text-gray-900">
                Start New Conversation
              </h2>
                           {" "}
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
                         {" "}
            </div>
                                   {" "}
            <div className="space-y-4">
                             {" "}
              <input
                type="text"
                placeholder="Subject (e.g., Question about my invoice)"
                value={newThreadSubject}
                onChange={(e) => setNewThreadSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500" // CHANGED: blue -> green
              />
                             {" "}
              <input
                type="text"
                placeholder="Link to Order ID (Optional, e.g., #1012)"
                value={newThreadOrderLink}
                onChange={(e) => setNewThreadOrderLink(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500" // CHANGED: blue -> green
              />
                             {" "}
              <textarea
                rows="4"
                placeholder="Your message details..."
                value={newThreadBody}
                onChange={(e) => setNewThreadBody(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-green-500" // CHANGED: blue -> green
              />
                         {" "}
            </div>
                       {" "}
            <button
              onClick={handleCreateNewThread}
              disabled={!newThreadSubject.trim() || !newThreadBody.trim()}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
            >
                            <Send className="w-5 h-5" /> Submit Inquiry        
                 {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default Messages;
