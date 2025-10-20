import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  FileText,
  Download,
  DollarSign,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  CreditCard,
  MessageSquare,
  Send,
  AlertCircle,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/quotes" ||
  import.meta.env.VITE_API_URL + "/api/quotes" ||
  "http://localhost:5000/api/quotes";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/${orderId}`, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    setPaymentProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPaymentProcessing(false);
    setShowPaymentModal(false);
    // Update order status (in real app, call backend)
    setOrder({ ...order, paymentStatus: "Paid" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        <p className="text-sm text-gray-600">Order ID: {order._id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Status</h3>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
              order.status === "Awaiting Payment"
                ? "bg-red-100 text-red-700 border-red-200"
                : order.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                : "bg-green-100 text-green-700 border-green-200"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment</h3>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
              order.paymentStatus === "Pending"
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-green-100 text-green-700 border-green-200"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Total Price
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            ${order.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Order Timeline
        </h3>
        <div className="space-y-4">
          {order.timeline.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-50 to-green-100">
                <step.icon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{step.step}</p>
                <p className="text-sm text-gray-600">
                  {new Date(step.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {step.completed && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Documents</h3>
        <div className="space-y-4">
          {order.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{file.type}</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Order Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem label="Service" value={order.service} icon={Layers} />
          <InfoItem
            label="Source Language"
            value={order.sourceLang}
            icon={Globe}
          />
          <InfoItem
            label="Target Language"
            value={order.targetLang}
            icon={Globe}
          />
          <InfoItem label="Urgency" value={order.urgency} icon={Clock} />
          <InfoItem
            label="Certification"
            value={order.certification ? "Yes" : "No"}
            icon={Award}
          />
          <InfoItem label="Status" value={order.status} icon={AlertCircle} />
          <InfoItem
            label="Payment Status"
            value={order.paymentStatus}
            icon={CreditCard}
          />
          <InfoItem
            label="Submitted Date"
            value={new Date(order.date).toLocaleDateString()}
            icon={Calendar}
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/client/messages")}
        className="fixed p-4 text-white bg-green-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-green-700"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {showPaymentModal && (
        <PaymentModal
          price={order.price}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePayment}
          processing={paymentProcessing}
        />
      )}
    </div>
  );
};

export default OrderDetails;
