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
  XCircle,
  Globe,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import Spinner from "../../components/UI/Spinner";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/quotes" ||
  import.meta.env.VITE_API_URL + "/api/quotes" ||
  "http://localhost:5000/api/quotes";

// Payment Modal Component
const PaymentModal = ({ price, onClose, onConfirm, processing }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(cardDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Make Payment</h2>
        <p className="mb-6 text-lg font-semibold text-gray-700">
          Total:{" "}
          <span className="text-green-600">
            NGN {price?.toLocaleString() || "0"}
          </span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Info Item Component for displaying order information
const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
      <Icon className="w-5 h-5 text-green-600" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-900 break-words">
        {value}
      </p>
    </div>
  </div>
);

// Main OrderDetails Component
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
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
    const fetchOrder = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/${orderId}`, {
          headers,
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch order: ${res.status}`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err.message);
        showNotification("Failed to load order details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async (cardDetails) => {
    setPaymentProcessing(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          status: "paid",
          paymentStatus: "paid",
          paymentReference: `PAY-${Date.now()}`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to process payment: ${res.status}`);
      }

      const data = await res.json();
      setOrder(data.quote || data);
      setShowPaymentModal(false);
      showNotification(
        "Payment processed successfully! Your order is now in progress.",
        "success"
      );
    } catch (err) {
      console.error("Payment error:", err);
      showNotification("Failed to process payment. Please try again.", "error");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) {
        throw new Error(`Failed to cancel order: ${res.status}`);
      }

      const data = await res.json();
      setOrder(data.quote || data);
      showNotification("Order cancelled successfully", "success");
    } catch (err) {
      console.error("Cancel error:", err);
      showNotification(
        "Failed to cancel order. Please contact support.",
        "error"
      );
    }
  };

  const timelineSteps = [
    { status: "submitted", label: "Submitted", icon: FileText, color: "blue" },
    { status: "reviewed", label: "Reviewed", icon: CheckCircle, color: "blue" },
    { status: "quoted", label: "Quoted", icon: DollarSign, color: "blue" },
    {
      status: "awaiting payment",
      label: "Awaiting Payment",
      icon: CreditCard,
      color: "yellow",
    },
    { status: "paid", label: "Paid", icon: CheckCircle, color: "green" },
    { status: "in progress", label: "In Progress", icon: Clock, color: "blue" },
    {
      status: "complete",
      label: "Complete",
      icon: CheckCircle,
      color: "green",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Error loading order</p>
          </div>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={() => navigate("/client/orders")}
            className="mt-4 text-sm text-red-600 underline hover:text-red-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="p-4 text-gray-700 border border-gray-200 bg-gray-50 rounded-xl">
          <p className="font-medium">No order found</p>
          <button
            onClick={() => navigate("/client/orders")}
            className="mt-2 text-sm text-green-600 underline hover:text-green-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = timelineSteps.findIndex(
    (s) => s.status === order.status?.toLowerCase()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 app-toaster px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/client/orders")}
        className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Orders</span>
      </button>

      {/* Header */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              Order ID: <span className="font-mono">{order._id}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-3 text-sm font-medium text-gray-600">
            Order Status
          </h3>
          <span
            className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border capitalize ${
              order.status?.toLowerCase() === "complete"
                ? "bg-green-100 text-green-700 border-green-200"
                : order.status?.toLowerCase() === "in progress" ||
                  order.status?.toLowerCase() === "paid"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : order.status?.toLowerCase() === "awaiting payment"
                ? "bg-red-100 text-red-700 border-red-200"
                : order.status?.toLowerCase() === "cancelled"
                ? "bg-gray-100 text-gray-700 border-gray-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-3 text-sm font-medium text-gray-600">
            Payment Status
          </h3>
          <span
            className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border capitalize ${
              order.paymentStatus?.toLowerCase() === "paid"
                ? "bg-green-100 text-green-700 border-green-200"
                : order.paymentStatus?.toLowerCase() === "failed"
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}
          >
            {order.paymentStatus || "Pending"}
          </span>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-3 text-sm font-medium text-gray-600">
            Total Price
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            NGN {order.price?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Order Timeline
        </h3>
        <div className="relative">
          <div className="absolute top-0 w-1 h-full bg-gray-200 left-5"></div>
          {timelineSteps.map((step, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = step.status === order.status?.toLowerCase();
            const isCancelled = order.status?.toLowerCase() === "cancelled";

            return (
              <div
                key={step.status}
                className="relative flex items-start mb-8 last:mb-0"
              >
                <div
                  className={`z-10 flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full transition-all ${
                    isActive && !isCancelled
                      ? "bg-green-600 text-white shadow-lg ring-4 ring-green-100"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && !isCancelled && (
                    <p className="text-xs font-medium text-green-600">
                      Current Status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {order.status?.toLowerCase() === "cancelled" && (
            <div className="relative flex items-start">
              <div className="z-10 flex items-center justify-center flex-shrink-0 w-10 h-10 text-white bg-red-600 rounded-full shadow-lg ring-4 ring-red-100">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Cancelled</p>
                <p className="text-xs font-medium text-red-600">
                  Order was cancelled
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Information */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Order Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Service"
            value={order.service || "N/A"}
            icon={Layers}
          />
          <InfoItem
            label="Source Language"
            value={order.sourceLanguage || "N/A"}
            icon={Globe}
          />
          <InfoItem
            label="Target Languages"
            value={order.targetLanguages?.join(", ") || "N/A"}
            icon={Globe}
          />
          <InfoItem
            label="Urgency"
            value={
              order.urgency
                ? order.urgency.charAt(0).toUpperCase() + order.urgency.slice(1)
                : "Standard"
            }
            icon={Clock}
          />
          <InfoItem
            label="Certification"
            value={order.certification ? "Required" : "Not Required"}
            icon={Award}
          />
          <InfoItem
            label="Word Count"
            value={order.wordCount ? order.wordCount.toLocaleString() : "N/A"}
            icon={FileText}
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoItem label="Name" value={order.name || "N/A"} icon={User} />
          <InfoItem label="Email" value={order.email || "N/A"} icon={Mail} />
          <InfoItem label="Phone" value={order.phone || "N/A"} icon={Phone} />
          <InfoItem
            label="Company"
            value={order.company || "N/A"}
            icon={Building}
          />
        </div>
        {order.specialInstructions && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="mb-2 text-sm font-medium text-gray-600">
              Special Instructions
            </p>
            <p className="text-sm text-gray-900">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Documents</h3>
        {!order.documents || order.documents.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600">No documents uploaded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {order.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center min-w-0 gap-3">
                  <FileText className="flex-shrink-0 w-5 h-5 text-gray-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name || `Document ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.type || "Document"} •{" "}
                      {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(doc.url, "_blank")}
                  className="flex-shrink-0 p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                  title="Download document"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Translated Documents */}
        {order.translatedDocuments && order.translatedDocuments.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Translated Documents
            </h4>
            <div className="space-y-3">
              {order.translatedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 transition-colors rounded-lg bg-green-50 hover:bg-green-100"
                >
                  <div className="flex items-center min-w-0 gap-3">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.name || `Translated Document ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Completed Translation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="flex-shrink-0 p-2 text-green-600 transition-colors rounded-lg hover:bg-green-100"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certification Document */}
        {order.certification && order.certificationDocument && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Certification Document
            </h4>
            <div className="flex items-center justify-between p-4 transition-colors rounded-lg bg-yellow-50 hover:bg-yellow-100">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.certificationDocument.name ||
                      "Official Certification"}
                  </p>
                  <p className="text-xs text-gray-500">Certified Translation</p>
                </div>
              </div>
              <button
                onClick={() =>
                  window.open(order.certificationDocument.url, "_blank")
                }
                className="p-2 text-yellow-600 transition-colors rounded-lg hover:bg-yellow-100"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid gap-4 md:grid-cols-3">
        {order.status?.toLowerCase() === "awaiting payment" && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
          >
            <CreditCard className="w-5 h-5" />
            Make Payment
          </button>
        )}
        {order.status?.toLowerCase() !== "complete" &&
          order.status?.toLowerCase() !== "cancelled" && (
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg shadow-sm hover:bg-red-700"
            >
              <XCircle className="w-5 h-5" />
              Cancel Order
            </button>
          )}
        <button
          onClick={() => navigate("/client/messages")}
          className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
        >
          <MessageSquare className="w-5 h-5" />
          Message Support
        </button>
      </div>

      {/* Payment Modal */}
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
