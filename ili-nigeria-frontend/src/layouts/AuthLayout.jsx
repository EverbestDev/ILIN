import { useRTL } from "../hooks/useRTL";
import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const dir = useRTL();
  const currentYear = new Date().getFullYear();

  return (
    // Set min-h-screen to ensure layout covers full viewport height
    <div dir={dir} className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER (NAV) - Contains the "Go Back" button */}
      <header className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Go Back Link (Placed in the navigation area) */}
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-green-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back to Home
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA - Children (Login.jsx) fill the remaining height */}
      <main className="flex flex-col flex-grow">{children}</main>

      {/* FOOTER */}
      <footer className="py-4 text-center border-t border-gray-100 bg-white/50">
        <p className="text-xs text-gray-600">
          © {currentYear} ILIN. Translation Services.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
