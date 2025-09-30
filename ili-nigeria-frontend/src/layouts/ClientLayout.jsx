import React, { useState } from "react";
import { X } from "lucide-react";

// CORRECTED IMPORTS based on your structure: "../components/Dashboard/"
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";

// Destructure required icons from the sidebar for use in menu data.
// NOTE: We assume DashboardSidebar.jsx has been updated to export MessageSquare in requiredIcons.
const { LayoutDashboard, FileText, Settings, MessageSquare } =
  DashboardSidebar.requiredIcons; // <-- UPDATED: Added MessageSquare

const ClientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // *** CLIENT-SPECIFIC DATA CONSOLIDATED HERE ***
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
    ],

    // Footer Props
    copyrightName: "Client Portal",
    portalVersion: "Client v1.0",

    // Sidebar Props - Client Menu (Now comprehensive)
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/client/dashboard",
        badge: null,
      },
      {
        id: "orders",
        label: "My Orders",
        icon: FileText,
        path: "/client/orders",
        // The badge shows how many orders need action (e.g., Awaiting Payment)
        badge: "1",
      },
      {
        id: "messages",
        label: "Support Inbox", // <-- ADDED: Client Messages
        icon: MessageSquare, // Icon from DashboardSidebar.requiredIcons
        path: "/client/messages",
        badge: "New", // Badge for unread messages
      },
    ],

    // Secondary Items for Settings
    secondaryItems: [
      {
        id: "settings",
        label: "Account Settings", // <-- UPDATED Label
        icon: Settings,
        path: "/client/settings",
      },
    ],
  };

  const handleClientLogout = () => {
    // Implement client-side logout logic here (e.g., clear token, redirect to /login)
    console.log("Client logging out...");
    // navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100">
      {/* Fixed Navbar - Always at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar
          brandName={clientData.brandName}
          portalTitle={clientData.portalTitle}
          userName={clientData.userName}
          userRole={clientData.userRole}
          unreadNotificationCount={clientData.unreadNotificationCount}
          notificationsList={clientData.notificationsList}
          onLogout={handleClientLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Container - Pass Client Menu Props */}
      <div className="fixed bottom-0 left-0 z-40 top-16">
        <DashboardSidebar
          isOpen={sidebarOpen}
          // *** UPDATED: Pass the comprehensive menu data ***
          menuItems={clientData.menuItems}
          secondaryItems={clientData.secondaryItems}
        />
      </div>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-64">
        {children}
        {/* Footer - Pass Client Props */}
        <DashboardFooter
          copyrightName={clientData.copyrightName}
          portalVersion={clientData.portalVersion}
        />
      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          // Note: Changed color of the close button for visual distinction
          className="fixed z-50 flex items-center justify-center text-white transition-transform rounded-full shadow-lg lg:hidden bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 hover:scale-105"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ClientLayout;
