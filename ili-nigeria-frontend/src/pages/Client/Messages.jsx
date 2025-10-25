// ClientMessages.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { auth } from "../../utility/firebase";
import { Send, Eye, MessageSquare } from "lucide-react";

const API =
  (import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com") +
  "/api/messages";

export default function ClientMessages() {
  const [threads, setThreads] = useState([]); // grouped threads
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const getAuthHeaders = async () => {
    const user = auth.currentUser;node 
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(API, { headers, credentials: "include" });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        // group by threadId
        const map = new Map();
        data.forEach((m) => {
          if (!map.has(m.threadId)) map.set(m.threadId, []);
          map.get(m.threadId).push(m);
        });
        const built = [];
        map.forEach((arr, threadId) => {
          arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const latest = arr[arr.length - 1];
          built.push({
            threadId,
            subject: arr[0].subject,
            messages: arr,
            latestMessage: latest,
            name: arr[0].name,
            email: arr[0].email,
          });
        });
        built.sort(
          (a, b) =>
            new Date(b.latestMessage.createdAt) -
            new Date(a.latestMessage.createdAt)
        );
        setThreads(built);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // sockets: join user room
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com",
      { transports: ["websocket"] }
    );
    const socket = socketRef.current;

    const join = async () => {
      const user = auth.currentUser;
      if (!user) return;
      socket.emit("join", { userId: user.uid, admin: false });
    };
    join().catch(console.error);

    socket.on("newReply", (msg) => {
      // only handle replies relevant to this user (server sends to user room only)
      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.threadId === msg.threadId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            messages: [...copy[idx].messages, msg],
            latestMessage: msg,
          };
          return copy.sort(
            (a, b) =>
              new Date(b.latestMessage.createdAt) -
              new Date(a.latestMessage.createdAt)
          );
        } else {
          // create new thread if absent
          const t = {
            threadId: msg.threadId,
            subject: msg.subject || "Thread",
            messages: [msg],
            latestMessage: msg,
            name: msg.name,
            email: msg.email,
          };
          return [t, ...prev];
        }
      });
    });

    socket.on("newThread", (msg) => {
      // newThread emitted for admins, but if a thread gets created and the server emits to this user's room (only when server creates for that user), handle it.
      setThreads((prev) => {
        if (prev.find((t) => t.threadId === msg.threadId)) return prev;
        return [
          {
            threadId: msg.threadId,
            subject: msg.subject,
            messages: [msg],
            latestMessage: msg,
            name: msg.name,
            email: msg.email,
          },
          ...prev,
        ];
      });
    });

    socket.on("messageStatusUpdated", (update) => {
      setThreads((prev) =>
        prev.map((t) => ({
          ...t,
          messages: t.messages.map((m) =>
            m._id === update.id ? { ...m, isRead: update.isRead } : m
          ),
        }))
      );
    });

    return () => socket.disconnect();
  }, []);

  const handleCreateThread = async () => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(API, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ subject: newSubject, message: newMessage }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      setThreads((prev) => [
        {
          threadId: data.data.threadId,
          subject: data.data.subject,
          messages: [data.data],
          latestMessage: data.data,
          name: data.data.name,
          email: data.data.email,
        },
        ...prev,
      ]);
      setNewSubject("");
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (threadId) => {
    if (!replyText.trim()) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API}/${threadId}/reply`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ message: replyText }),
      });
      if (!res.ok) throw new Error("Reply failed");
      const data = await res.json();
      // append locally
      setThreads((prev) =>
        prev.map((t) =>
          t.threadId === threadId
            ? {
                ...t,
                messages: [...t.messages, data.data],
                latestMessage: data.data,
              }
            : t
        )
      );
      setReplyText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">New Message</h2>
        <input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Subject"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          rows={4}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleCreateThread}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          <Send className="inline-block mr-2" />
          Send
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Your Threads</h2>
        {threads.length === 0 && (
          <div className="text-gray-500">No threads yet</div>
        )}
        <div className="space-y-3">
          {threads.map((t) => (
            <div key={t.threadId} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-xs text-gray-500">
                    {t.name || t.email}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(t.latestMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {t.latestMessage.message}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => setSelectedThreadId(t.threadId)}
                >
                  <Eye className="inline-block mr-1" />
                  View
                </button>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => setSelectedThreadId(t.threadId)}
                >
                  <MessageSquare className="inline-block mr-1" />
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Panel for selected thread */}
      {selectedThreadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl bg-white rounded p-4 max-h-[80vh] overflow-y-auto">
            <button
              className="float-right text-gray-600"
              onClick={() => setSelectedThreadId(null)}
            >
              <X />
            </button>
            <div className="mt-4">
              {(() => {
                const t = threads.find((x) => x.threadId === selectedThreadId);
                if (!t) return <div>Thread not found</div>;
                return (
                  <>
                    <h3 className="font-semibold text-lg">{t.subject}</h3>
                    <div className="text-sm text-gray-500 mb-4">
                      {t.name || t.email}
                    </div>
                    <div className="space-y-3 mb-4">
                      {t.messages.map((m) => (
                        <div
                          key={m._id}
                          className={`p-3 rounded ${
                            m.sender === "client"
                              ? "bg-blue-50 self-start"
                              : "bg-green-50 self-end"
                          }`}
                        >
                          <div className="text-xs text-gray-500">
                            {m.sender === "client" ? m.name || "You" : "Admin"}{" "}
                            — {new Date(m.createdAt).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-800">
                            {m.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Type your reply..."
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => handleReply(selectedThreadId)}
                      >
                        Send Reply
                      </button>
                      <button
                        className="px-4 py-2 border rounded"
                        onClick={() => setSelectedThreadId(null)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
