import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Key,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/settings/admin" ||
  import.meta.env.VITE_API_URL + "/api/settings/admin" ||
  "http://localhost:5000/api/settings/admin";

const Settings = () => {
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "admin@ilin.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNewQuote: true,
    emailUrgent: true,
    emailNewSubscriber: false,
    emailContact: true,
    emailWeekly: true,
  });

  // Business settings state
  const [business, setBusiness] = useState({
    companyName: "International Language Institute, Nigeria",
    timezone: "Africa/Lagos",
    currency: "NGN",
    workingHours: "9:00 AM - 5:00 PM",
  });

  // Working hours options
  const workingHoursOptions = [
    "8:00 AM - 4:00 PM",
    "9:00 AM - 5:00 PM",
    "10:00 AM - 6:00 PM",
    "8:00 AM - 6:00 PM",
    "9:00 AM - 6:00 PM",
  ];

  // Currency options
  const currencyOptions = ["USD", "EUR", "NGN", "GBP"];

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
    const fetchAdminSettings = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(API_URL, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const data = await res.json();
        setBusiness({
          companyName: data.companyName,
          timezone: data.timezone,
          currency: data.currency,
          workingHours: data.workingHours,
        });
      } catch (err) {
        console.error("Fetch admin settings error:", err);
        showNotification("Failed to load settings", "error");
      }
    };
    fetchAdminSettings();
  }, []);

  const handleSaveProfile = () => {
    showNotification("Profile updated successfully", "success");
  };

  const handleSaveNotifications = () => {
    showNotification("Notification preferences saved", "success");
  };

  const handleSaveBusiness = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(business),
      });
      if (!res.ok) throw new Error(`Failed to update settings: ${res.status}`);
      showNotification("Business settings updated", "success");
    } catch (err) {
      console.error("Update business settings error:", err);
      showNotification("Failed to update business settings", "error");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "business", label: "Business", icon: Globe },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="px-6 border-b border-gray-200">
          <nav className="flex gap-8 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-600">Choose what updates you receive</p>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNewQuote}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailNewQuote: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      New Quote Requests
                    </p>
                    <p className="text-sm text-gray-500">
                      Email when a new quote is submitted
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailUrgent}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailUrgent: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Urgent Requests</p>
                    <p className="text-sm text-gray-500">
                      Immediate email for urgent quotes
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNewSubscriber}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailNewSubscriber: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">New Subscribers</p>
                    <p className="text-sm text-gray-500">
                      Email when someone subscribes to newsletter
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailContact}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailContact: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Contact Form Messages
                    </p>
                    <p className="text-sm text-gray-500">
                      Email for new contact form submissions
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailWeekly}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailWeekly: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Weekly Summary</p>
                    <p className="text-sm text-gray-500">
                      Email weekly performance reports
                    </p>
                  </div>
                </label>
              </div>
              <button
                onClick={handleSaveNotifications}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Save Notification Preferences
              </button>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Business</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="company"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={business.companyName}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={business.timezone}
                    onChange={(e) =>
                      setBusiness({ ...business, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="America/New_York">America/New_York</option>
                    <option value="Africa/Lagos">Africa/Lagos</option>
                    <option value="UTC">UTC</option>
                    {/* Add more timezones as needed */}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="currency"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    value={business.currency}
                    onChange={(e) =>
                      setBusiness({ ...business, currency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    {currencyOptions.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="workingHours"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Working Hours
                  </label>
                  <select
                    id="workingHours"
                    value={business.workingHours}
                    onChange={(e) =>
                      setBusiness({ ...business, workingHours: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    {workingHoursOptions.map((hours) => (
                      <option key={hours} value={hours}>
                        {hours}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSaveBusiness}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Save Business Settings
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900">Security</h2>

              {/* Change Password */}
              <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                  <Lock className="w-5 h-5 text-green-600" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() =>
                      showNotification(
                        "Password updated successfully",
                        "success"
                      )
                    }
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* API Keys */}
              <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                  <Key className="w-5 h-5 text-blue-600" />
                  API Keys
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Manage API keys for integrations
                </p>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all">
                  Generate New API Key
                </button>
              </div>

              {/* Data Export */}
              <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Data Export
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Download all your data in JSON format
                </p>
                <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all">
                  Export All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
