import React from "react";
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
  MessageSquare, // <--- ADDED: MessageSquare icon for Client messages
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Note: Ensure you import all necessary icons (like the ones above)
// or move the icon definitions (like LayoutDashboard) to be passed in the menuItems array.
// For simplicity, we'll keep the required icons imported here for now.

const DashboardSidebar = ({
  isOpen = true,
  menuItems = [], // Primary menu items from props
  secondaryItems = [], // Secondary menu items from props
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // NOTE: The original menu items array is REMOVED from here.
  // The AdminLayout will now pass the Admin-specific menu.

  const handleItemClick = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon; // Icon is now expected to be an imported Lucide component
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

        <span className="flex-1 text-sm font-medium text-left truncate">
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

        {isActive && <ChevronRight className="w-4 h-4 text-white" />}
      </button>
    );
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
          <div className="space-y-1">{menuItems.map(renderMenuItem)}</div>

          {menuItems.length > 0 && secondaryItems.length > 0 && (
            <div className="my-6 border-t border-gray-200" />
          )}

          {/* Secondary Menu */}
          <div className="space-y-1">{secondaryItems.map(renderMenuItem)}</div>
        </nav>

        {/* Footer - Mission Statement (kept generic for reusability) */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg shadow-md bg-gradient-to-br from-green-600 to-green-700">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-900">
                  Breaking Barriers
                </p>
                <p className="text-xs leading-relaxed text-gray-600">
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

// Exporting required icons so that the AdminLayout/ClientLayout can pass them in the props
DashboardSidebar.requiredIcons = {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Calendar,
  BarChart3,
  Settings,
  MessageSquare, // <--- ADDED: Export the new icon
};

export default DashboardSidebar;
