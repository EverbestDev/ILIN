import { useRTL } from "../hooks/useRTL";
import React, { useEffect, useState } from "react";
import {
  X,
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
} from "lucide-react";
import Spinner from "../components/UI/Spinner";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardFooter from "../components/Dashboard/DashboardFooter";
import { useAuth } from "../context/AuthContext";

const ClientLayout = ({ children }) => {
  const dir = useRTL();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, profile, isLoading, handleLogout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || profile.role !== "client") {
        navigate("/login");
      }
    }
  }, [isLoading, isLoggedIn, profile, navigate]);

  const clientData = {
    brandName: "ILIN",
    portalTitle: "Client Dashboard",
    userName: profile.name || "Sarah Chen",
    userEmail: profile.email || "sarah@client.com",
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
    copyrightName: "Client Portal",
    portalVersion: "Client v1.0",
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/client/dashboard",
        badge: null,
      },
      {
        id: "quotes",
        label: "My Quotes",
        icon: FileText,
        path: "/client/orders",
        badge: null,
      },
      {
        id: "messages",
        label: "Messages",
        icon: MessageSquare,
        path: "/client/messages",
        badge: 3,
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

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      <div className="fixed top-0 z-40 w-full">
        <DashboardNavbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          brandName={clientData.brandName}
          portalTitle={clientData.portalTitle}
          userName={clientData.userName}
          userEmail={clientData.userEmail}
          userRole={clientData.userRole}
          unreadNotificationCount={clientData.unreadNotificationCount}
          notificationsList={clientData.notificationsList}
          showNotifications={clientData.showNotifications}
          onLogout={handleLogout}
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
          menuItems={clientData.menuItems}
          secondaryItems={clientData.secondaryItems}
        />
      </div>

      <main className="lg:ml-64 pt-16 flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex-grow p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <Spinner size="md" />
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
        <DashboardFooter
          copyrightName={clientData.copyrightName}
          portalVersion={clientData.portalVersion}
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

export default ClientLayout;
