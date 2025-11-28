import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { auth, googleProvider, facebookProvider } from "../../utility/firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithPopup,
  unlink,
} from "firebase/auth";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

const ClientSettings = () => {
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
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
  const [linkedProviders, setLinkedProviders] = useState([]);

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
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/api/settings/user`, {
          headers,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const data = await res.json();

        setProfile({
          name: data.name || auth.currentUser.displayName || "",
          username: data.username || "",
          email: data.email || auth.currentUser.email,
          phone: data.phone || "",
        });

        if (data.preferences) {
          setPreferences(data.preferences);
        }
        // initialize linked providers
        try {
          const providers = auth.currentUser?.providerData?.map((p) => p.providerId) || [];
          setLinkedProviders(providers);
        } catch (e) {
          setLinkedProviders([]);
        }
      } catch (err) {
        console.error("Fetch user settings error:", err);
        showNotification("Failed to load settings", "error");
      }
    };
    fetchUserSettings();
  }, []);

  // Save Profile
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/settings/user`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          name: profile.name,
          username: profile.username,
          phone: profile.phone,
        }),
      });

      if (!res.ok) throw new Error(`Failed to update profile: ${res.status}`);

      // Update local auth display name
      await auth.currentUser.reload();

      showNotification("Profile updated successfully", "success");

      // Trigger page reload to update navbar
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Update profile error:", err);
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Save Preferences
  const handlePreferenceSave = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/settings/user`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error("Failed to update preferences");
      showNotification("Preferences saved successfully", "success");
    } catch (err) {
      console.error("Update preferences error:", err);
      showNotification("Failed to save preferences", "error");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (security.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        security.currentPassword
      );

      // Reauthenticate
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, security.newPassword);

      showNotification("Password updated successfully", "success");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      if (err.code === "auth/wrong-password") {
        showNotification("Current password is incorrect", "error");
      } else {
        showNotification("Failed to update password", "error");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const refreshProviders = () => {
    const providers = auth.currentUser?.providerData?.map((p) => p.providerId) || [];
    setLinkedProviders(providers);
  };

  const handleLink = async (provider) => {
    try {
      setLoading(true);
      await linkWithPopup(auth.currentUser, provider);
      refreshProviders();
      showNotification("Account linked successfully", "success");
    } catch (err) {
      console.error("Link provider error:", err);
      showNotification("Failed to link provider", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (providerId) => {
    try {
      setLoading(true);
      await unlink(auth.currentUser, providerId);
      refreshProviders();
      showNotification("Provider unlinked", "success");
    } catch (err) {
      console.error("Unlink error:", err);
      showNotification("Failed to unlink provider", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="p-4 space-y-6 sm:p-6">
      {notification && (
        <div
          className={`fixed top-6 right-6 app-toaster px-4 sm:px-6 py-4 rounded-xl shadow-lg border animate-slide-in ${
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
            <p className="text-sm font-medium sm:text-base">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Manage your personal details, preferences, and security
        </p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="px-4 border-b border-gray-200 sm:px-6 overflow-x-auto">
          <nav className="flex gap-4 sm:gap-8 -mb-px min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

        <div className="p-4 sm:p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Contact support to change your full name
                  </p>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    placeholder="Display name for navbar"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This will appear in your dashboard navbar
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
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
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Profile Changes
              </button>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              <p className="text-gray-600">
                Customize your notification settings
              </p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailUpdates: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Email Updates</p>
                    <p className="text-sm text-gray-500">
                      Receive order status updates via email
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.smsAlerts}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        smsAlerts: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <div className="p-4 border border-gray-200 sm:p-6 bg-gray-50 rounded-xl">
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
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Update Password
                  </button>
                </div>
                <div className="p-4 border border-gray-200 sm:p-6 bg-white rounded-xl">
                  <h3 className="mb-3 text-lg font-semibold">Connected Accounts</h3>
                  <p className="mb-4 text-sm text-gray-600">Link or unlink social providers for easier sign-in.</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLink(googleProvider)}
                        disabled={linkedProviders.includes("google.com") || loading}
                        className={`px-3 py-2 rounded-lg border ${linkedProviders.includes("google.com") ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
                      >
                        {linkedProviders.includes("google.com") ? "Google linked" : "Link Google"}
                      </button>
                      {linkedProviders.includes("google.com") && (
                        <button
                          onClick={() => handleUnlink("google.com")}
                          disabled={loading}
                          className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg"
                        >
                          Unlink
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLink(facebookProvider)}
                        disabled={linkedProviders.includes("facebook.com") || loading}
                        className={`px-3 py-2 rounded-lg border ${linkedProviders.includes("facebook.com") ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
                      >
                        {linkedProviders.includes("facebook.com") ? "Facebook linked" : "Link Facebook"}
                      </button>
                      {linkedProviders.includes("facebook.com") && (
                        <button
                          onClick={() => handleUnlink("facebook.com")}
                          disabled={loading}
                          className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg"
                        >
                          Unlink
                        </button>
                      )}
                    </div>
                  </div>
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
