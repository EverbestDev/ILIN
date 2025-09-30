import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Calendar,
  ChevronRight,
  Globe,
  BarChart3,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      badge: null,
    },
    {
      id: "quotes",
      label: "Quote Requests",
      icon: FileText,
      path: "/admin/quotes",
      badge: "12",
    },
    {
      id: "subscribers",
      label: "Subscribers",
      icon: Users,
      path: "/admin/subscribers",
      badge: null,
    },
    {
      id: "contacts",
      label: "Contact Messages",
      icon: Mail,
      path: "/admin/contacts",
      badge: "5",
    },
    {
      id: "schedules",
      label: "Schedules",
      icon: Calendar,
      path: "/admin/schedules",
      badge: null,
    },
  ];

  const secondaryItems = [
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`
        h-full w-64
        bg-white border-r border-gray-200 shadow-sm
        transition-transform duration-300 ease-in-out
        overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Main Menu */}
        <nav className="flex-1 px-3 py-6">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />

                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-white text-green-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && <ChevronRight className="h-4 w-4 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Secondary Menu */}
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />

                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Mission Statement */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Breaking Barriers
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Connecting cultures through language
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
