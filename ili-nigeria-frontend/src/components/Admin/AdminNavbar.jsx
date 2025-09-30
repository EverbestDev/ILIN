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
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle Button - Now functional */}
            <button
              onClick={onMenuToggle}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="items-center justify-center hidden w-10 h-10 shadow-md bg-gradient-to-br from-green-600 to-green-700 rounded-xl md:flex">
                <Globe className="w-6 h-6 text-white" />
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
            <div className="hidden mr-2 text-right lg:block">
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
                className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadNotifications > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
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
                  <div className="absolute right-0 z-20 mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg w-80 rounded-xl">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-full">
                          {unreadNotifications} new
                        </span>
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-96">
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
                              <p className="text-sm font-medium text-gray-900">
                                {notif.text}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                      <button className="w-full text-sm font-medium text-center text-green-600 hover:text-green-700">
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
                className="flex items-center gap-2 px-2 py-2 transition-all border border-gray-200 shadow-sm sm:gap-3 bg-gradient-to-r from-gray-50 to-gray-100 sm:px-3 rounded-xl hover:from-gray-100 hover:to-gray-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-md bg-gradient-to-br from-green-600 to-green-700">
                  <span className="text-sm font-semibold text-white">
                    {adminName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="hidden text-left sm:block">
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
                  <div className="absolute right-0 z-20 w-64 mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 shadow-md bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
                          <span className="text-lg font-bold text-white">
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
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">My Profile</p>
                          <p className="text-xs text-gray-500">
                            View and edit profile
                          </p>
                        </div>
                      </button>

                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
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

                    {/* Logout */}
                    <div className="py-2 border-t border-gray-200">
                      <button className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600">
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
