import React, { useState } from "react";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  ChevronDown,
  Globe,
} from "lucide-react";

const AdminNavbar = ({ onMenuToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock data - replace with real data later
  const adminName = "John Doe";
  const adminEmail = "admin@ilin.com";
  const adminRole = "Super Admin";
  const unreadNotifications = 3;

  const notifications = [
    {
      id: 1,
      text: "New quote request from Sarah Chen",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      text: "3 new subscribers this week",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      text: "Contact form submission received",
      time: "1 day ago",
      unread: true,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle Button - Now functional */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">ILIN</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Welcome Text - Hidden on mobile */}
            <div className="hidden lg:block text-right mr-2">
              <p className="text-sm font-medium text-gray-700">Welcome back,</p>
              <p className="text-xs text-gray-500">{adminName}</p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setDropdownOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          {unreadNotifications} new
                        </span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                            notif.unread ? "bg-green-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notif.unread && (
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">
                                {notif.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-2 sm:px-3 py-2 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200 shadow-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {adminName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {adminName}
                  </p>
                  <p className="text-xs text-gray-500">{adminRole}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform hidden sm:block ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                    {/* User Info Section */}
                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {adminName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {adminName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {adminEmail}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                            {adminRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">My Profile</p>
                          <p className="text-xs text-gray-500">
                            View and edit profile
                          </p>
                        </div>
                      </button>

                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Settings className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Settings</p>
                          <p className="text-xs text-gray-500">
                            Preferences & security
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <LogOut className="h-4 w-4 text-red-600" />
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
