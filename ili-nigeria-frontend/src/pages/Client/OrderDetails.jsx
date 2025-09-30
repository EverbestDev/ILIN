import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  FileText,
  Download,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  CreditCard,
  MessageSquare,
} from "lucide-react";

// Mock API URL - replace with your actual client-filtered endpoint
const API_URL = "https://ilin-backend.onrender.com/api/quotes";

// --- START OF ORDER DETAILS COMPONENT ---
const OrderDetails = () => {
  // Get the quote ID from the URL parameter
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock data for a single order
  const mockOrder = {
    _id: "65e2b0a1d4b6c3f0e8a7b9c3",
    date: "2025-10-01T09:00:00Z",
    service: "Website Localization",
    sourceLang: "English",
    targetLang: "Spanish",
    urgency: "Standard",
    certification: false,
    status: "Awaiting Payment", // Complete, In Progress, Submitted, Awaiting Payment
    price: 1250.0,
    paymentStatus: "Pending", // Paid, Pending, Refunded, N/A
    files: [
      {
        name: "website_content_v1.txt",
        type: "Original",
        url: "/mock/original/1",
      },
      // The translated file is only present if the status is "Complete"
      // { name: "website_content_es.txt", type: "Translated", url: "/mock/translated/1" },
    ],
    timeline: [
      {
        step: "Submitted",
        date: "2025-10-01T09:00:00Z",
        icon: FileText,
        completed: true,
      },
      {
        step: "Reviewed & Quoted",
        date: "2025-10-01T14:30:00Z",
        icon: DollarSign,
        completed: true,
      },
      {
        step: "Awaiting Payment",
        date: "2025-10-02T10:00:00Z",
        icon: CreditCard,
        completed: true,
      },
      {
        step: "Translation In Progress",
        date: null,
        icon: Clock,
        completed: false,
      },
      {
        step: "Complete & Delivered",
        date: null,
        icon: CheckCircle,
        completed: false,
      },
    ],
  };

  useEffect(() => {
    // In a real app: fetchOrderDetails(orderId)
    setLoading(true);
    setTimeout(() => {
      // Simulate finding the order or not (if not found, setOrder(null))
      if (orderId === mockOrder._id.slice(-4)) {
        // Simple check using last 4 digits
        setOrder(mockOrder);
      } else {
        setError(`Order with ID #${orderId} not found.`);
      }
      setLoading(false);
    }, 500);
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePayment = () => {
    setPaymentProcessing(true);
    // Simulate API call for payment processing (e.g., Stripe/PayPal integration)
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      // In a real app, update the order status
      setOrder({
        ...order,
        status: "In Progress",
        paymentStatus: "Paid",
        timeline: order.timeline.map((t) =>
          t.step === "Translation In Progress"
            ? { ...t, date: new Date().toISOString() }
            : t
        ),
      });
      // After success, you might show a notification or redirect
    }, 2000);
  };

  const handleDownload = (file) => {
    console.log(`Downloading file: ${file.name} from ${file.url}`);
    // In a real app, this would trigger a file download from the server
    alert(`Initiating download for "${file.name}"...`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "text-green-600 bg-green-50 border-green-200";
      case "In Progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Awaiting Payment":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center text-gray-500">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-6 text-red-700 bg-red-100 border border-red-200 rounded-xl">
          <AlertCircle className="inline w-5 h-5 mr-2" />{" "}
          {error || "Order not found."}
        </div>
        <button
          onClick={() => navigate("/client/orders")}
          className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <header className="pb-6">
        <button
          onClick={() => navigate("/client/orders")}
          className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </button>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Details{" "}
              <span className="text-gray-400">#{order._id.slice(-4)}</span>
            </h1>
            <p className="mt-1 text-gray-600">
              Submitted on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl border ${getStatusColor(
              order.status
            )}`}
          >
            <FileText className="w-4 h-4 mr-2" />
            {order.status}
          </span>
        </div>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (Details and Files) - 2/3 width */}
        <div className="space-y-8 lg:col-span-2">
          {/* Order Progress Timeline */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Order Progress
            </h2>
            <div className="relative ml-2 border-l border-gray-200">
              {order.timeline.map((item, index) => (
                <div key={index} className="relative flex items-start pb-8">
                  <div
                    className={`-left-2 absolute w-4 h-4 rounded-full border-4 ${
                      item.completed
                        ? "bg-green-500 border-white"
                        : "bg-gray-200 border-white"
                    }`}
                  />
                  <div className="ml-8">
                    <h3
                      className={`text-base font-semibold ${
                        item.completed ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      <item.icon className="inline w-5 h-5 mr-2 -mt-1" />
                      {item.step}
                    </h3>
                    <time className="block mt-1 text-sm text-gray-400">
                      {item.date
                        ? new Date(item.date).toLocaleString()
                        : "Pending..."}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Request Details Card */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Request Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <DetailItem
                icon={Layers}
                label="Service Type"
                value={order.service}
              />
              <DetailItem
                icon={Calendar}
                label="Urgency"
                value={order.urgency}
              />
              <DetailItem
                icon={Globe}
                label="Source Language"
                value={order.sourceLang}
              />
              <DetailItem
                icon={Globe}
                label="Target Language"
                value={order.targetLang}
              />
              <DetailItem
                icon={Award}
                label="Certification"
                value={order.certification ? "Required" : "Not Required"}
              />
              <DetailItem
                icon={FileText}
                label="Total Files"
                value={order.files.length}
              />
            </div>
          </div>

          {/* Files Card */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Order Files
            </h2>
            <div className="space-y-3">
              {order.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          file.type === "Translated"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {file.type} File
                      </p>
                    </div>
                  </div>
                  {/* Download button only for the final translated file */}
                  {file.type === "Translated" || order.status === "Complete" ? (
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Awaiting Translation
                    </span>
                  )}
                </div>
              ))}

              {/* If status is complete but no translated file is mocked */}
              {order.status === "Complete" &&
                !order.files.some((f) => f.type === "Translated") && (
                  <div className="p-3 text-sm text-center text-green-700 rounded-lg bg-green-50">
                    <CheckCircle className="inline w-4 h-4 mr-2" /> Translation
                    is complete. Click the file to download!
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column (Payment/Contact) - 1/3 width */}
        <div className="space-y-8 lg:col-span-1">
          {/* Payment Card (Conditional) */}
          {(order.status === "Awaiting Payment" ||
            order.paymentStatus === "Pending") && (
            <div className="p-6 border border-yellow-300 shadow-md bg-yellow-50 rounded-xl">
              <h3 className="flex items-center gap-2 mb-4 text-2xl font-bold text-yellow-800">
                <DollarSign className="w-6 h-6" /> Payment Required
              </h3>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-yellow-200">
                <p className="text-lg font-medium text-gray-700">
                  Total Price:
                </p>
                <p className="text-3xl font-extrabold text-yellow-800">
                  $
                  {order.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <p className="mb-6 text-sm text-gray-700">
                Your quote has been finalized. Please complete the payment to
                start the translation process immediately.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-70"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Pay Now
                  </>
                )}
              </button>
            </div>
          )}

          {/* Contact Support Card */}
          <div className="p-6 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-blue-800">
              <MessageSquare className="w-5 h-5" /> Need Assistance?
            </h3>
            <p className="mb-4 text-gray-700">
              If you have any questions about this order, pricing, or files,
              please contact our support team directly.
            </p>
            <button
              onClick={() => navigate("/client/messages?topic=" + order._id)}
              className="w-full px-6 py-2.5 font-semibold text-blue-700 transition-colors rounded-lg bg-white hover:bg-blue-100 border border-blue-300"
            >
              Message Support
            </button>
          </div>
        </div>
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

// Simple reusable Detail Item component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

// Mock Payment Modal Component (Simplified)
const PaymentModal = ({ price, onClose, onConfirm, processing }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={onClose}
  >
    <div
      className="w-full max-w-lg p-8 m-4 bg-white shadow-2xl rounded-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-3 mb-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <p className="mb-4 text-lg text-gray-700">
        You are about to pay the total amount of:
      </p>
      <p className="mb-6 text-4xl font-extrabold text-green-700">
        ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:border-green-500"
          />
          <input
            type="text"
            placeholder="CVC"
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:border-green-500"
          />
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={processing}
        className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-6 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? "Processing Secure Payment..." : "Confirm & Pay"}
      </button>
    </div>
  </div>
);

export default OrderDetails;
