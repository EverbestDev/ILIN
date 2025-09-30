import React, { useState } from "react";
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
    companyName: "ILIN Translation Services",
    timezone: "America/New_York",
    currency: "USD",
    responseTime: "24",
    workingHours: "9:00 AM - 6:00 PM",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProfile = () => {
    showNotification("Profile updated successfully", "success");
  };

  const handleSaveNotifications = () => {
    showNotification("Notification preferences saved", "success");
  };

  const handleSaveBusiness = () => {
    showNotification("Business settings updated", "success");
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
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                  Update your personal information and contact details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                  Choose what updates you want to receive
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        New Quote Requests
                      </p>
                      <p className="text-sm text-gray-600">
                        Get notified when someone requests a quote
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNewQuote}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNewQuote: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Urgent Requests
                      </p>
                      <p className="text-sm text-gray-600">
                        Instant alerts for urgent translation requests
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailUrgent}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailUrgent: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        New Subscribers
                      </p>
                      <p className="text-sm text-gray-600">
                        Updates when someone subscribes to newsletter
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNewSubscriber}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNewSubscriber: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Contact Messages
                      </p>
                      <p className="text-sm text-gray-600">
                        Notifications for new contact form submissions
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailContact}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailContact: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Weekly Summary
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive weekly performance reports
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailWeekly}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailWeekly: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveNotifications}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Business Settings
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                  Configure your business preferences and operational settings
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={business.companyName}
                    onChange={(e) =>
                      setBusiness({ ...business, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="items-center block gap-1 mb-2 text-sm font-medium text-gray-700 md:flex">
                    <Clock className="w-4 h-4" />
                    Timezone
                  </label>
                  <select
                    value={business.timezone}
                    onChange={(e) =>
                      setBusiness({ ...business, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="items-center block gap-1 mb-2 text-sm font-medium text-gray-700 md:flex">
                    <DollarSign className="w-4 h-4" />
                    Default Currency
                  </label>
                  <select
                    value={business.currency}
                    onChange={(e) =>
                      setBusiness({ ...business, currency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Response Time Goal (hours)
                  </label>
                  <input
                    type="number"
                    value={business.responseTime}
                    onChange={(e) =>
                      setBusiness({ ...business, responseTime: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={business.workingHours}
                    onChange={(e) =>
                      setBusiness({ ...business, workingHours: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveBusiness}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Security Settings
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                  Manage your password and security preferences
                </p>
              </div>

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
