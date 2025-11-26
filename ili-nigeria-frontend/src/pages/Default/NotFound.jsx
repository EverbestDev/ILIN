import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const popularPages = [
    { name: t("errors.notFound.links.home"), path: "/" },
    { name: t("errors.notFound.links.services"), path: "/services" },
    { name: t("errors.notFound.links.contact"), path: "/contact" },
    { name: t("errors.notFound.links.quote"), path: "/quote" },
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8 relative">
            <div className="text-9xl sm:text-[12rem] font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center animate-pulse">
                <svg 
                  className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("errors.notFound.title")}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {t("errors.notFound.message")}
            </p>
            <p className="text-sm text-gray-500">
              {t("errors.notFound.suggestion")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all duration-200 hover:scale-105 active:scale-100"
            >
              {t("errors.notFound.buttons.goBack")}
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-100"
            >
              {t("errors.notFound.buttons.goHome")}
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("errors.notFound.popularPages")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularPages.map((page, idx) => (
                <Link
                  key={idx}
                  to={page.path}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-green-200 transition-all group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg 
                      className="w-5 h-5 text-green-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors">
                    {page.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            {t("errors.notFound.helpText")}{" "}
            <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium underline">
              {t("errors.notFound.contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
