import React, { useEffect, useState } from "react";

const API_URL = "https://ilin-backend.onrender.com/api/quotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // ✅ Fetch all quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch quotes");
        const data = await res.json();
        setQuotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // ✅ Delete a quote
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      alert("Quote deleted successfully ✅");
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // ✅ Fetch single quote details
  const handleView = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setSelectedQuote(data);
    } catch (err) {
      alert("Error fetching details: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">📋 Admin Quotes</h1>

      {loading && <p>Loading quotes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{q.name}</td>
                <td className="p-3">{q.service}</td>
                <td className="p-3">{q.email}</td>
                <td className="p-3">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>
                <td className="flex justify-center gap-2 p-3">
                  <button
                    onClick={() => handleView(q._id)}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal for details */}
      {selectedQuote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
            <h2 className="mb-3 text-xl font-bold">Quote Details</h2>
            <p>
              <strong>Client:</strong> {selectedQuote.name} (
              {selectedQuote.email})
            </p>
            <p>
              <strong>Service:</strong> {selectedQuote.service}
            </p>
            <p>
              <strong>Languages:</strong> {selectedQuote.sourceLanguage} →{" "}
              {selectedQuote.targetLanguages?.join(", ")}
            </p>
            <p>
              <strong>Urgency:</strong> {selectedQuote.urgency}
            </p>
            <p>
              <strong>Certification:</strong>{" "}
              {selectedQuote.certification ? "Yes" : "No"}
            </p>
            <p>
              <strong>Industry:</strong> {selectedQuote.industry || "N/A"}
            </p>
            <p>
              <strong>Documents:</strong>{" "}
              {selectedQuote.documents?.length > 0 ? (
                <ul className="ml-5 list-disc">
                  {selectedQuote.documents.map((doc) => (
                    <li key={doc.url}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "No documents uploaded"
              )}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedQuote._id);
                  setSelectedQuote(null);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
