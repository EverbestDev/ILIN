import React, { useState, useCallback } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
  Phone,
  Building,
  Globe,
  X,
} from "lucide-react";

// --- START OF CLIENT SETTINGS COMPONENT ---
const ClientSettings = () => {
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // 1. Profile state (Client-specific fields)
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah@client.com",
    phone: "+1 (555) 987-6543",
    company: "Acme Global Co.",
    country: "United States",
  });

  // 2. Security state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 3. Notification preferences state
  const [preferences, setPreferences] = useState({
    emailOrderComplete: true,
    emailQuoteReady: true,
    emailPaymentConfirmation: true,
    emailNewsletter: false,
    smsAlerts: false,
  });

  // FIXED: Memoized handlers to prevent re-renders
  const handleProfileChange = useCallback((field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityChange = useCallback((field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePreferenceChange = useCallback((field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleProfileSave = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        console.log("Profile Saved:", profile);
        showNotification("Profile updated successfully!");
        setLoading(false);
      }, 1000);
    },
    [profile, showNotification]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      e.preventDefault();
      if (security.newPassword !== security.confirmPassword) {
        showNotification(
          "New password and confirmation do not match.",
          "error"
        );
        return;
      }
      if (security.newPassword.length < 8) {
        showNotification(
          "New password must be at least 8 characters long.",
          "error"
        );
        return;
      }

      setLoading(true);
      setTimeout(() => {
        console.log(
          "Password Change attempt with new password:",
          security.newPassword
        );
        setSecurity({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        showNotification(
          "Password changed successfully. Please log in again if prompted.",
          "success"
        );
        setLoading(false);
      }, 1000);
    },
    [security, showNotification]
  );

  const handlePreferenceSave = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        console.log("Preferences Saved:", preferences);
        showNotification("Communication preferences updated.", "success");
        setLoading(false);
      }, 1000);
    },
    [preferences, showNotification]
  );

  // --- Profile Tab Content ---
  const ProfileTab = () => (
    <form onSubmit={handleProfileSave} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={profile.firstName}
            onChange={(e) => handleProfileChange("firstName", e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={profile.lastName}
            onChange={(e) => handleProfileChange("lastName", e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="flex items-center p-3 mt-1 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
            <Mail className="w-4 h-4 mr-2" />
            {profile.email}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed directly here. Contact support to update.
          </p>
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={profile.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            value={profile.company}
            onChange={(e) => handleProfileChange("company", e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country/Region
          </label>
          <input
            type="text"
            id="country"
            value={profile.country}
            onChange={(e) => handleProfileChange("country", e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );

  // --- Security Tab Content ---
  const SecurityTab = () => (
    <form onSubmit={handlePasswordChange} className="max-w-lg space-y-6">
      <h3 className="pb-3 mb-4 text-lg font-semibold text-gray-900 border-b">
        Change Password
      </h3>

      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          value={security.currentPassword}
          onChange={(e) =>
            handleSecurityChange("currentPassword", e.target.value)
          }
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={security.newPassword}
          onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={security.confirmPassword}
          onChange={(e) =>
            handleSecurityChange("confirmPassword", e.target.value)
          }
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
        >
          <Lock className="w-5 h-5" />
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );

  // --- Preferences Tab Content ---
  const PreferencesTab = () => (
    <form onSubmit={handlePreferenceSave} className="space-y-6">
      <h3 className="pb-3 mb-4 text-lg font-semibold text-gray-900 border-b">
        Email Notifications
      </h3>

      <div className="max-w-xl space-y-4">
        {[
          {
            key: "emailQuoteReady",
            label: "Quote Ready for Review",
            description:
              "Notify me when my requested quote has been prepared and is ready to be paid.",
          },
          {
            key: "emailOrderComplete",
            label: "Order Completion",
            description:
              "Send an email notification when my translation files are ready for download.",
          },
          {
            key: "emailPaymentConfirmation",
            label: "Payment Confirmation",
            description:
              "Receive confirmation after successfully making a payment.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="relative flex items-start p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center h-5">
              <input
                id={item.key}
                name={item.key}
                type="checkbox"
                checked={preferences[item.key]}
                onChange={(e) =>
                  handlePreferenceChange(item.key, e.target.checked)
                }
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={item.key} className="font-medium text-gray-900">
                {item.label}
              </label>
              <p className="text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="pt-6 pb-3 mb-4 text-lg font-semibold text-gray-900 border-b">
        Other Communication
      </h3>
      <div className="max-w-xl space-y-4">
        {[
          {
            key: "emailNewsletter",
            label: "Newsletter & Promotions",
            description:
              "Get updates on new services, discounts, and company news.",
            color: "text-blue-600",
          },
          {
            key: "smsAlerts",
            label: "SMS Alerts (Urgent Only)",
            description:
              "Receive text messages for urgent status changes (e.g., payment failure). Requires phone number verification.",
            color: "text-yellow-600",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="relative flex items-start p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center h-5">
              <input
                id={item.key}
                name={item.key}
                type="checkbox"
                checked={preferences[item.key]}
                onChange={(e) =>
                  handlePreferenceChange(item.key, e.target.checked)
                }
                className={`w-4 h-4 ${item.color
                  .replace("text-", "text-")
                  .replace(
                    "600",
                    "600"
                  )} border-gray-300 rounded focus:ring-current`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={item.key} className={`font-medium ${item.color}`}>
                {item.label}
              </label>
              <p className="text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <header className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your personal details, security, and communication preferences.
        </p>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center justify-between ${
            notification.type === "success"
              ? "bg-green-100 border-green-200 text-green-700"
              : "bg-red-100 border-red-200 text-red-700"
          }`}
        >
          <p className="flex items-center gap-2 font-medium">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className="text-current hover:opacity-80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-col mt-8 lg:flex-row lg:space-x-8">
        <nav className="flex flex-shrink-0 pb-6 space-x-4 overflow-x-auto border-b lg:flex-col lg:space-x-0 lg:space-y-2 lg:w-48 lg:border-b-0 lg:overflow-x-visible scrollbar-hide">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Lock },
            { id: "preferences", label: "Preferences", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Settings Content */}
        <div className="flex-1 p-6 mt-6 bg-white border border-gray-200 shadow-lg rounded-xl lg:mt-0">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "preferences" && <PreferencesTab />}
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
