import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
      {/* Fixed Navbar */}
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
          onLogout={handleAdminLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Container */}
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

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex-grow p-4 sm:p-6 lg:p-8">{children}</div>

        <DashboardFooter
          copyrightName={adminData.copyrightName}
          portalVersion={adminData.portalVersion}
        />
      </main>

      {/* Mobile Close Button */}
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
