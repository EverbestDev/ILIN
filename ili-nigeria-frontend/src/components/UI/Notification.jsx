import React, { useEffect } from "react";

export default function Notification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [notification, onClose]);

  if (!notification) return null;

  const { message, type = "success" } = notification;
  const base = "px-4 py-2 rounded shadow-md text-sm font-medium";
  const bg =
    type === "error"
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";

  return (
    <div className="fixed top-6 right-6 z-50 app-toaster">
      <div className={`${base} ${bg}`}>{message}</div>
    </div>
  );
}
