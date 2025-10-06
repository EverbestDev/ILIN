import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Settings,
  ChevronDown,
  LogOut,
  Bell,
  Check,
} from "lucide-react";

// =========================================================================
// FIX: Mocked Components (Defined locally to resolve compilation errors)
// In a real project, these would be in their own files in '../components/Dashboard/'
// =========================================================================

// Mocked DashboardNavbar
const DashboardNavbar = ({
  brandName,
  portalTitle,
  userName,
  userRole,
  unreadNotificationCount,
  notificationsList,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-100 shadow-md lg:left-64">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {portalTitle || "Dashboard"}
        </h1>
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown (Mocked) */}
            {isNotificationsOpen && (
              <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white border border-gray-200 shadow-lg rounded-xl ring-1 ring-black ring-opacity-5">
                <div className="p-4 border-b">
                  <h6 className="font-semibold">Notifications</h6>
                </div>
                <div className="overflow-y-auto max-h-60">
                  {notificationsList && notificationsList.length > 0 ? (
                    notificationsList.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-sm transition-colors cursor-pointer ${
                          n.unread
                            ? "bg-green-50 hover:bg-green-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <p
                          className={`font-medium ${
                            n.unread ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {n.text}
                        </p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-center text-gray-500">
                      No new notifications.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <div className="flex items-center justify-center font-semibold text-white bg-green-600 rounded-full shadow-md w-9 h-9">
                {userName ? userName.charAt(0) : "U"}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 lg:inline">
                {userName || "User"}
              </span>
              <ChevronDown className="hidden w-4 h-4 text-gray-500 lg:inline" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white border border-gray-200 shadow-lg rounded-xl ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
                <div className="py-1">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Mocked DashboardSidebar
const DashboardSidebar = ({ isOpen, menuItems, secondaryItems }) => {
  const activePath = window.location.pathname; // Mock active path

  const SidebarLink = ({ to, icon: Icon, label }) => (
    <a
      href={to}
      className={`flex items-center p-3 text-sm font-medium transition-colors rounded-xl ${
        activePath === to
          ? "bg-green-600 text-white shadow-md"
          : "text-gray-600 hover:bg-green-50 hover:text-green-700"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </a>
  );

  return (
    <aside
      className={`flex flex-col h-full w-64 bg-white border-r border-gray-100 shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } p-4`}
    >
      <div className="flex items-center justify-between p-2 mb-6">
        <h2 className="text-xl font-bold text-green-700">ILIN Admin</h2>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="pt-4 mt-auto space-y-2 border-t border-gray-100">
        {secondaryItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </div>
    </aside>
  );
};

// Mocked DashboardFooter
const DashboardFooter = ({ copyrightName, portalVersion }) => {
  return (
    <footer className="p-4 mt-auto text-sm text-center text-gray-500 border-t border-gray-100 bg-gray-50">
      &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved. |{" "}
      <span className="font-medium text-green-600">v{portalVersion}</span>
    </footer>
  );
};

// =========================================================================
// FIX: Mocked Auth0 Hook (Defined locally to resolve compilation errors)
// =========================================================================
const useAuth0 = () => {
  console.warn(
    "Using mocked useAuth0 hook. Full Auth0 functionality is not available."
  );
  return {
    logout: (options) => {
      // Mock logout function
      console.log(
        "Mocked Auth0 logout called. Redirecting to:",
        options.logoutParams.returnTo
      );
      // Simulate redirection by reloading the page to clear state
      window.location.href = options.logoutParams.returnTo || "/";
    },
    // Add other necessary mocks if needed, e.g., isAuthenticated: true
    isAuthenticated: true,
  };
};

// =========================================================================
// END MOCKING
// =========================================================================

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // NEW: Get the Auth0 logout function (now mocked)
  const { logout } = useAuth0();

  // NEW: Auth0 Logout Handler
  const handleAdminLogout = () => {
    // Call Auth0's logout function
    logout({
      logoutParams: {
        returnTo: window.location.origin + "/login", // Redirect back to the login page
      },
    });
  };

  const adminData = {
    brandName: "ILIN",
    portalTitle: "Admin Portal",
    userName: "John Doe",
    userEmail: "admin@ilin.com",
    userRole: "Super Admin",
    unreadNotificationCount: 3,
    notificationsList: [
      {
        id: 1,
        text: "New quote request from Sarah Chen",
        time: "5 min ago",
        unread: true,
      },
      {
        id: 2,
        text: "System maintenance scheduled for tonight.",
        time: "1 hr ago",
        unread: true,
      },
      {
        id: 3,
        text: "Jane has updated the Contact list.",
        time: "4 hrs ago",
        unread: true,
      },
      {
        id: 4,
        text: "Quote #2024-001 approved.",
        time: "1 day ago",
        unread: false,
      },
    ],
    menuItems: [
      {
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        to: "/admin/quotes",
        icon: FileText,
        label: "Quotes",
      },
      {
        to: "/admin/subscribers",
        icon: Mail,
        label: "Subscribers",
      },
      {
        to: "/admin/contacts",
        icon: Users,
        label: "Contacts",
      },
    ],
    secondaryItems: [
      {
        to: "/admin/settings",
        icon: Settings,
        label: "Settings",
      },
    ],
    copyrightName: "ILIN Language Services",
    portalVersion: "1.0.0",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 z-40 w-full lg:w-auto">
        <DashboardNavbar
          brandName={adminData.brandName}
          portalTitle={adminData.portalTitle}
          userName={adminData.userName}
          userRole={adminData.userRole}
          unreadNotificationCount={adminData.unreadNotificationCount}
          notificationsList={adminData.notificationsList}
          onLogout={handleAdminLogout}
        />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 z-30 top-16 ${
          !sidebarOpen
            ? "pointer-events-none lg:pointer-events-auto"
            : "pointer-events-auto"
        }`}
      >
        <DashboardSidebar
          isOpen={sidebarOpen}
          menuItems={adminData.menuItems}
          secondaryItems={adminData.secondaryItems}
        />
      </div>

      <main className="flex flex-col min-h-[calc(100vh-4rem)] pt-16 lg:ml-64">
        <div className="flex-grow p-4 sm:p-6 lg:p-8">{children}</div>

        <DashboardFooter
          copyrightName={adminData.copyrightName}
          portalVersion={adminData.portalVersion}
        />
      </main>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed z-50 flex items-center justify-center w-10 h-10 text-white transition-transform duration-300 ease-in-out bg-green-600 rounded-full shadow-lg top-20 left-4 lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
