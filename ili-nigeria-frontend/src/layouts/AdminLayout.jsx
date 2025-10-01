import React, { useState } from "react";
import { X } from "lucide-react";
// UPDATED IMPORTS
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";

// Destructure required icons from the sidebar for use in menu data
const {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Calendar,
  BarChart3,
  Settings,
} = DashboardSidebar.requiredIcons;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // *** ADMIN-SPECIFIC DATA CONSOLIDATED HERE ***
  const adminData = {
    // Navbar Props
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
    ],
    // Footer Props
    copyrightName: "ILIN",
    portalVersion: "v1.0",

    // Sidebar Props - NOTE: We are using the imported Lucide icons as values
    menuItems: [
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
    ],
    secondaryItems: [
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
    ],
  };

  const handleAdminLogout = () => {
    Navigate("/login");
    console.log("Admin Logged out successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100">
      {/* Fixed Navbar - Pass Props */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          brandName={adminData.brandName}
          portalTitle={adminData.portalTitle}
          userName={adminData.userName}
          userEmail={adminData.userEmail}
          userRole={adminData.userRole}
          unreadNotificationCount={adminData.unreadNotificationCount}
          notificationsList={adminData.notificationsList}
          onLogout={handleAdminLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Container - Pass Props */}
      <div className="fixed bottom-0 left-0 z-40 top-16">
        <DashboardSidebar
          isOpen={sidebarOpen}
          menuItems={adminData.menuItems}
          secondaryItems={adminData.secondaryItems}
        />
      </div>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-64">
        {children}
        {/* Footer - Pass Props */}
        <DashboardFooter
          copyrightName={adminData.copyrightName}
          portalVersion={adminData.portalVersion}
        />
      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed z-50 flex items-center justify-center text-white transition-transform rounded-full shadow-lg lg:hidden bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 hover:scale-110"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
