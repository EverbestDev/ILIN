// Updated AdminLayout.jsx
// Changes:
// - Removed localStorage checks.
// - Use useAuth from context to check isLoggedIn, isLoading, and profile.role.
// - If not admin or not logged in, redirect to /login after loading.
// - Use handleLogout from context for logout.
// - Import useAuth from the correct path (adjust if AuthContext is moved).
import React, { useEffect, useState } from "react";
import {
  X,
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";
import { useAuth } from "../context/AuthContext"; // Adjust path based on structure

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, profile, isLoading, handleLogout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || profile.role !== "admin") {
        navigate("/login");
      }
    }
  }, [isLoading, isLoggedIn, profile, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    ); // Optional loading state
  }

  const adminData = {
    brandName: "ILIN",
    portalTitle: "Admin Portal",
    userName: profile.name || "John Doe", // Use from context
    userEmail: profile.email || "admin@ilin.com",
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
    copyrightName: "ILIN",
    portalVersion: "Admin v1.0",
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      {
        id: "quotes",
        label: "Quote Requests",
        icon: FileText,
        path: "/admin/quotes",
        badge: 12,
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
        badge: 5,
      },
    ],
    secondaryItems: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100">
      <div className="fixed top-0 z-40 w-full">
        <DashboardNavbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          brandName={adminData.brandName}
          portalTitle={adminData.portalTitle}
          userName={adminData.userName}
          userEmail={adminData.userEmail}
          userRole={adminData.userRole}
          unreadNotificationCount={adminData.unreadNotificationCount}
          notificationsList={adminData.notificationsList}
          onLogout={handleLogout} // Use context logout
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

      <main className="lg:ml-64 pt-16 flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex-grow p-4 sm:p-6 lg:p-8">{children}</div>

        <DashboardFooter
          copyrightName={adminData.copyrightName}
          portalVersion={adminData.portalVersion}
        />
      </main>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed z-50 flex items-center justify-center text-white transition-transform rounded-full shadow-lg lg:hidden bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 hover:scale-105"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
