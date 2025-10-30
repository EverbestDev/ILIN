import { useRTL } from "../hooks/useRTL";
import { useTranslation } from "react-i18next";
import React from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const dir = useRTL();
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  // RTL check: if language is "ar", use ArrowRight; otherwise use ArrowLeft
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div
      dir={dir}
      style={{ direction: dir === "rtl" ? "rtl" : "ltr" }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      {/* HEADER (NAV) - Contains the "Go Back" button */}
      <header className="bg-white shadow-sm">
        <nav className=" mx-auto px-6 py-4 flex items-center">
          {/* Go Back Link (Placed in the navigation area) */}
          <Link
            to="/"
            className={`flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowIcon className="w-5 h-5" />
            <span className="font-medium">{t("auth.goBack")}</span>
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT AREA - Children (Login.jsx) fill the remaining height */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>©</span>
          <span>{currentYear}</span>
          <span>ILIN.</span>
          <span>{t("auth.translationServices")}</span>
          
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
