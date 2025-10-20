import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utility/firebase";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  ChevronDown,
  Globe,
  X,
} from "lucide-react";

const DashboardNavbar = ({
  onMenuToggle,
  brandName = "ILIN",
  portalTitle = "Portal",
  userRole,
  onLogout,
  unreadNotificationCount = 0,
  notificationsList = [],
  showNotifications = true,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    photoURL: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
      }
    });
    return unsubscribe;
  }, []);

  const closeAllDropdowns = () => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setShowProfileModal(false);
  };

  const handleSettingsNavigate = () => {
    const path =
      userRole === "Super Admin" ? "/admin/settings" : "/client/settings";
    navigate(path);
    closeAllDropdowns();
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center gap-4">
              {/* Menu Toggle Button */}
              <button
                onClick={onMenuToggle}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                type="button"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="items-center justify-center hidden w-10 h-10 shadow-md bg-gradient-to-br from-green-600 to-green-700 rounded-xl md:flex">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    {brandName}
                  </h1>
                  <p className="text-xs text-gray-500">{portalTitle}</p>
                </div>
              </div>
            </div>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Welcome Text */}
              <div className="hidden mr-2 text-right lg:block">
                <p className="text-sm font-medium text-gray-700">
                  Welcome back,
                </p>
                <p className="text-xs text-gray-500">{user.name}</p>
              </div>

              {/* Notifications */}
              {showNotifications && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setDropdownOpen(false);
                      setShowProfileModal(false);
                    }}
                    className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
                    type="button"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-red-600 rounded-full">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg sm:w-80 right-0 rounded-xl">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          Notifications
                        </p>
                      </div>
                      <div className="py-2 max-h-80 overflow-y-auto">
                        {notificationsList.length ? (
                          notificationsList.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                                notification.unread
                                  ? "bg-blue-50 hover:bg-blue-100"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              <p
                                className={`${
                                  notification.unread
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotificationsOpen(false);
                    setShowProfileModal(false);
                  }}
                  className="flex items-center gap-2 p-2 transition-colors rounded-lg hover:bg-gray-100"
                  type="button"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg right-0 rounded-xl">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                            {userRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                        type="button"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">My Profile</p>
                          <p className="text-xs text-gray-500">
                            View profile details
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={handleSettingsNavigate}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                        type="button"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Settings</p>
                          <p className="text-xs text-gray-500">
                            Preferences & security
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="py-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          onLogout && onLogout();
                          closeAllDropdowns();
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                        type="button"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Logout</p>
                          <p className="text-xs text-red-500">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                My Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
                type="button"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                    {userRole}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This is your profile information. To edit your details, go to
                Settings.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
