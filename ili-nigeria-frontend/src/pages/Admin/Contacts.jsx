// AdminMessages.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { auth } from "../../utility/firebase"; // keep your firebase helper
import {
  Eye,
  Trash2,
  Send,
  X,
  MessageSquare,
  Mail,
  Calendar,
} from "lucide-react";

const MESSAGE_API =
  (import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com") +
  "/api/messages";
const CONTACT_API =
  (import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com") +
  "/api/contact";

export default function AdminContacts() {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState([]); // array of { threadId, subject, messages: [], latestMessage, userId, name, email }
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const socketRef = useRef(null);

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        const headers = await getAuthHeaders();
        // fetch messages
        const [msgsRes, contactsRes] = await Promise.all([
          fetch(MESSAGE_API, { headers, credentials: "include" }),
          fetch(CONTACT_API, { headers, credentials: "include" }),
        ]);
        const msgs = msgsRes.ok ? await msgsRes.json() : [];
        const contacts = contactsRes.ok ? await contactsRes.json() : [];

        // group messages by threadId
        const map = new Map();
        msgs.forEach((m) => {
          if (!map.has(m.threadId)) map.set(m.threadId, []);
          map.get(m.threadId).push(m);
        });

        const builtThreads = [];
        map.forEach((msgsArr, threadId) => {
          msgsArr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const latest = msgsArr[msgsArr.length - 1];
          builtThreads.push({
            threadId,
            subject: msgsArr[0].subject,
            messages: msgsArr,
            latestMessage: latest,
            userId: msgsArr[0].userId,
            name: msgsArr[0].name,
            email: msgsArr[0].email,
            source: "client",
          });
        });

        // integrate public contacts as threads (source = public). Ensure they don't collide with message threadIds.
        contacts.forEach((c) => {
          builtThreads.unshift({
            threadId: `contact-${c._id}`,
            subject: c.subject,
            messages: [
              {
                ...c,
                threadId: `contact-${c._id}`,
                sender: "public",
                createdAt: c.createdAt,
                _id: c._id,
              },
            ],
            latestMessage: { ...c, createdAt: c.createdAt },
            userId: null,
            name: c.name,
            email: c.email,
            source: "public",
          });
        });

        // sort threads by latestMessage
        builtThreads.sort(
          (a, b) =>
            new Date(b.latestMessage.createdAt) -
            new Date(a.latestMessage.createdAt)
        );
        setThreads(builtThreads);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Socket: join admins room and handle events
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com",
      {
        transports: ["websocket"],
      }
    );

    const socket = socketRef.current;
    const joinPayload = async () => {
      // get current user uid and admin flag before join
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      socket.emit("join", { userId: user.uid, admin: true });
    };
    joinPayload().catch(console.error);

    socket.on("newThread", (msg) => {
      // insert thread if not exist; if exist update
      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.threadId === msg.threadId);
        if (idx >= 0) {
          // append to messages and update latestMessage
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
        }
        const newThread = {
          threadId: msg.threadId,
          subject: msg.subject,
          messages: [msg],
          latestMessage: msg,
          userId: msg.userId,
          name: msg.name,
          email: msg.email,
          source: "client",
        };
        return [newThread, ...prev].sort(
          (a, b) =>
            new Date(b.latestMessage.createdAt) -
            new Date(a.latestMessage.createdAt)
        );
      });
    });

    socket.on("newReply", (msg) => {
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
          // Unexpected: new reply for unknown thread -> create lightweight thread
          const t = {
            threadId: msg.threadId,
            subject: msg.subject || "Reply",
            messages: [msg],
            latestMessage: msg,
            userId: msg.userId,
            name: msg.name,
            email: msg.email,
            source: "client",
          };
          return [t, ...prev];
        }
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

    socket.on("messageDeleted", ({ id }) => {
      setThreads((prev) =>
        prev
          .map((t) => ({
            ...t,
            messages: t.messages.filter((m) => m._id !== id),
          }))
          .filter((t) => t.messages.length > 0)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleReply = async (threadId) => {
    if (!replyText.trim()) return;
    try {
      const headers = await (async () => {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      })();

      const res = await fetch(`${MESSAGE_API}/${threadId}/reply`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ message: replyText }),
      });
      if (!res.ok) throw new Error("Reply failed");
      const data = await res.json();
      // server emits newReply to admins & user, but append locally for instant UI
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
      console.error("Reply error", err);
    }
  };

  const handleDeleteMessage = async (id, source) => {
    try {
      const headers = await (async () => {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      })();

      // If it's a public contact (source === 'public'), call contact API; else call messages delete
      if (source === "public") {
        await fetch(`${CONTACT_API}/${id}`, {
          method: "DELETE",
          headers,
          credentials: "include",
        });
        // remove local thread
        setThreads((prev) =>
          prev.filter((t) => t.threadId !== `contact-${id}`)
        );
      } else {
        const res = await fetch(`${MESSAGE_API}/${id}`, {
          method: "DELETE",
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Delete failed");
        // server emits messageDeleted; but remove local too
        setThreads((prev) =>
          prev
            .map((t) => ({
              ...t,
              messages: t.messages.filter((m) => m._id !== id),
            }))
            .filter((t) => t.messages.length)
        );
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  if (loading) return <div className="p-6">Loading messages...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thread list */}
        <div className="col-span-1 bg-white border rounded-lg p-4 overflow-auto max-h-[70vh]">
          {threads.map((t) => (
            <div
              key={t.threadId}
              className={`p-3 rounded-md mb-2 cursor-pointer ${
                selected?.threadId === t.threadId
                  ? "bg-green-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelected(t)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{t.subject}</div>
                  <div className="text-xs text-gray-500">
                    {t.name ||
                      t.email ||
                      (t.source === "public" ? "Public" : "Client")}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(t.latestMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                {t.latestMessage.message}
              </div>
            </div>
          ))}
          {threads.length === 0 && (
            <div className="text-gray-500">No messages</div>
          )}
        </div>

        {/* Thread details */}
        <div className="col-span-2 bg-white border rounded-lg p-4 max-h-[70vh] overflow-auto">
          {!selected ? (
            <div className="text-gray-500">
              Select a thread to view messages
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{selected.subject}</h2>
                  <div className="text-xs text-gray-500">
                    {selected.name || selected.email || "Client / Public"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded bg-red-500 text-white"
                    onClick={() => {
                      // delete all messages in this thread? For simplicity, deleting first message id will trigger messageDeleted and cleanup
                      const firstId = selected.messages[0]._id;
                      handleDeleteMessage(firstId, selected.source);
                      setSelected(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {selected.messages.map((m) => (
                  <div
                    key={m._id}
                    className={`p-3 rounded ${
                      m.sender === "client"
                        ? "bg-blue-50 self-start"
                        : "bg-green-50 self-end"
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {m.sender === "client" ? m.name || "Client" : "Admin"} —{" "}
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-800">{m.message}</div>
                  </div>
                ))}
              </div>

              <div>
                <textarea
                  className="w-full p-3 border rounded mb-2"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={() => handleReply(selected.threadId)}
                  >
                    <Send className="w-4 h-4 inline-block mr-2" /> Send Reply
                  </button>
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => {
                      setSelected(null);
                      setReplyText("");
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
