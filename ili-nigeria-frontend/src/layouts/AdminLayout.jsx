import React, { useState } from "react";
import { X } from "lucide-react";
import AdminNavbar from "../components/Admin/AdminNavbar";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminFooter from "../components/Admin/AdminFooter";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100">
      {/* Fixed Navbar - Always at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar Container */}
      <div className="fixed top-16 bottom-0 left-0 z-40">
        <AdminSidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content - No extra padding wrapper */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        {children}
        <AdminFooter />
      </main>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
