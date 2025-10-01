import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Update these paths if your components are organized differently
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";

// We import all icons directly here for simplicity, as requested.
// NOTE: Assuming DashboardFooter is also imported/available.

const ClientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // --- CLIENT-SPECIFIC MOCK DATA ---
  const clientData = {
    // Navbar Props
    brandName: "ILIN",
    portalTitle: "Client Dashboard",
    userName: "Sarah Chen",
    userEmail: "sarah@client.com",
    userRole: "Customer",
    showNotifications: true,
    unreadNotificationCount: 1,
    notificationsList: [
      {
        id: 101,
        text: "Your translation for Project X is complete.",
        time: "30 min ago",
        unread: true,
      },
      {
        id: 102,
        text: "Invoice #2024-05 is due next week.",
        time: "1 day ago",
        unread: false,
      },
    ],

    // Footer Props (Assuming DashboardFooter uses these)
    copyrightName: "Client Portal",
    portalVersion: "Client v1.0",

    // Sidebar Menu Items - Passing the imported icons directly
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/client/dashboard",
        badge: null,
      },
      {
        id: "projects",
        label: "My Projects",
        icon: FileText,
        path: "/client/orders",
        badge: "3",
      },
      {
        id: "support",
        label: "Support Center",
        icon: MessageSquare,
        path: "/client/messages",
        badge: null,
      },
    ],
    secondaryItems: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/client/settings",
      },
    ],
  };

  const handleClientLogout = () => {
    // Perform actual logout logic (clear tokens, etc.)
    console.log("Client logged out.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100">
      {/* Fixed Navbar - Always at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar
          // The crucial toggle function passed to the navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          brandName={clientData.brandName}
          portalTitle={clientData.portalTitle}
          userName={clientData.userName}
          userEmail={clientData.userEmail}
          userRole={clientData.userRole}
          unreadNotificationCount={clientData.unreadNotificationCount}
          notificationsList={clientData.notificationsList}
          showNotifications={clientData.showNotifications}
          onLogout={handleClientLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay (FIX: This part handles the click outside on mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Container - Pass Client Menu Props */}
      {/* We set top-16 to clear the fixed navbar height */}
      <div className="fixed bottom-0 left-0 z-40 top-16">
        <DashboardSidebar
          isOpen={sidebarOpen} // Controls the mobile visibility/transition
          menuItems={clientData.menuItems}
          secondaryItems={clientData.secondaryItems}
        />
      </div>

      {/* Main Content */}
      {/* lg:ml-64 creates space for the desktop sidebar */}
      <main className="min-h-screen pt-16 lg:ml-64">
        {children}
        <DashboardFooter
          copyrightName={clientData.copyrightName}
          portalVersion={clientData.portalVersion}
        />
      </main>

      {/* Mobile Close Button (Good for UX) */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed z-50 flex items-center justify-center text-white transition-transform rounded-full shadow-lg lg:hidden bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 hover:scale-105"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ClientLayout;
