import React from "react";
import { Globe, Heart } from "lucide-react";

const DashboardFooter = ({
  brandName = "ILIN Translation Services",
  tagline = "Breaking language barriers worldwide",
  copyrightName = "ILIN",
  portalVersion = "v1.0",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200"> 
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Left Section - Brand (Using Props) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-md bg-gradient-to-br from-green-600 to-green-700">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{brandName}</p>
              <p className="text-xs text-gray-500">{tagline}</p>
            </div>
          </div>

          {/* Right Section - Copyright (Using Props) */}
          <div className="text-center sm:text-right">
            <p className="flex items-center justify-center gap-1 text-xs text-gray-600 sm:justify-end">
              © {currentYear} {copyrightName}
            </p>
            <p className="mt-1 text-xs text-gray-500">Portal {portalVersion}</p>
          </div>
        </div>

        {/* Optional: Additional Links Row */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
            <a href="#" className="transition-colors hover:text-green-600">
              Privacy Policy
            </a>
            <span className="text-gray-300"> • </span>
            <a href="#" className="transition-colors hover:text-green-600">
              Terms of Service
            </a>
            <span className="text-gray-300"> • </span>
            <a href="#" className="transition-colors hover:text-green-600">
              Documentation
            </a>
            <span className="text-gray-300"> • </span>
            <a href="#" className="transition-colors hover:text-green-600">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;