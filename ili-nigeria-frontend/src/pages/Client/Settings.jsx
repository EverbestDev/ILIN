import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { auth } from "../../utility/firebase";

const API_URL =
  "https://ilin-backend.onrender.com/api/settings/user" ||
  import.meta.env.VITE_API_URL + "/api/settings/user" ||
  "http://localhost:5000/api/settings/user";

const ClientSettings = () => {
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    email: "sarah@client.com",
    phone: "+1 (555) 987-6543",
  });

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    emailUpdates: true,
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: false,
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    const fetchUserSettings = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(API_URL, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: auth.currentUser.email,
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Fetch user settings error:", err);
        showNotification("Failed to load settings", "error");
      }
    };
    fetchUserSettings();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      if (!res.ok) throw new Error(`Failed to update profile: ${res.status}`);
      await auth.currentUser.updateProfile({ displayName: profile.name });
      showNotification("Profile updated successfully", "success");
    } catch (err) {
      console.error("Update profile error:", err);
      showNotification("Failed to update profile", "error");
    }
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    try {
      const user = auth.currentUser;
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        security.currentPassword
      );
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(security.newPassword);
      showNotification("Password updated successfully", "success");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      showNotification("Failed to update password", "error");
    }
  };

  const handlePreferenceSave = () => {
    showNotification("Preferences saved successfully", "success");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Bell },
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
          Manage your personal details, preferences, and security
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
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              <p className="text-gray-600">
                Customize your notification settings
              </p>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailUpdates: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Email Updates</p>
                    <p className="text-sm text-gray-500">
                      Receive order status updates via email
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Email Notifications
                    </p>
                    <p className="text-sm text-gray-500">
                      Get notified about new messages
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Push Notifications
                    </p>
                    <p className="text-sm text-gray-500">
                      Browser push notifications for important updates
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.smsAlerts}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        smsAlerts: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">SMS Alerts</p>
                    <p className="text-sm text-gray-500">
                      Text messages for urgent notifications
                    </p>
                  </div>
                </label>
              </div>
              <button
                onClick={handlePreferenceSave}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Save Preferences
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
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
