import React, { useState, useEffect, useRef } from "react";
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
  Mail,
  Shield,
  ArrowRight,
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
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);

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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside profile dropdown
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      // Check if click is outside notifications dropdown
      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, notificationsOpen]);

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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
              <div className="hidden mr-2 text-right lg:block max-w-[200px]">
                <p className="text-sm font-medium text-gray-700">
                  Welcome back,
                </p>
                <p className="text-xs text-gray-500 truncate">{user.name}</p>
              </div>

              {/* Notifications */}
              {showNotifications && (
                <div className="relative">
                  <button
                    ref={notificationButtonRef}
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setDropdownOpen(false);
                    }}
                    className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
                    type="button"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium text-white bg-red-600 rounded-full">
                        {unreadNotificationCount > 99
                          ? "99+"
                          : unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div
                      ref={notificationsRef}
                      className="absolute z-50 w-[calc(100vw-6rem)] sm:w-80 md:w-96 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl right-0 sm:right-0 rounded-xl"
                    >
                      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            Notifications
                          </p>
                          {unreadNotificationCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">
                              {unreadNotificationCount} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="py-1 max-h-80 overflow-y-auto">
                        {notificationsList.length ? (
                          notificationsList.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${
                                notification.unread
                                  ? "bg-blue-50 hover:bg-blue-100"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              <p
                                className={`text-sm line-clamp-2 ${
                                  notification.unread
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">
                              No notifications yet
                            </p>
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
                  ref={profileButtonRef}
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 transition-colors rounded-lg hover:bg-gray-100"
                  type="button"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 text-white text-sm font-semibold rounded-full">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-700 hidden sm:block" />
                </button>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-72 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl right-0 rounded-xl"
                  >
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                      <div className="flex items-start gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="User"
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold rounded-full flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                            {userRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                        type="button"
                      >
                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-lg flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            My Profile
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            View profile details
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={handleSettingsNavigate}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                        type="button"
                      >
                        <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Settings
                          </p>
                          <p className="text-xs text-gray-500 truncate">
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
                        <div className="flex items-center justify-center w-9 h-9 bg-red-100 rounded-lg flex-shrink-0">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Logout</p>
                          <p className="text-xs text-red-500 truncate">
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

      {/* Enhanced Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-in-out]">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 sm:py-8">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 transition-colors rounded-full hover:bg-white/20 text-white"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white text-green-600 text-2xl sm:text-3xl font-bold rounded-full border-4 border-white shadow-lg">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <div className="text-center -mt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words px-2">
                  {user.name}
                </h2>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm rounded-full font-medium">
                  {userRole}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Email Address
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 break-words">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex-shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Account Role
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 font-medium">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info message */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-900">
                  <span className="font-medium">Need to make changes?</span>
                  <br />
                  <span className="text-blue-700">
                    You can edit your profile information and manage your
                    account preferences in Settings.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSettingsNavigate();
                  setShowProfileModal(false);
                }}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Go to Settings
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
