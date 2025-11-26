import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(true); // Start as true to prevent flash
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ilin_cookie_accepted");
    
    if (stored !== "true") {
      // Show the banner after a delay
      const timer = setTimeout(() => {
        setAccepted(false);
        setShouldRender(true);
        // Trigger animation slightly after render
        requestAnimationFrame(() => {
          setTimeout(() => setIsVisible(true), 50);
        });
      }, 1500); // 1.5 second delay before showing

      return () => clearTimeout(timer);
    }
  }, []);

  const onAccept = () => {
    localStorage.setItem("ilin_cookie_accepted", "true");
    setIsVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setAccepted(true);
      setShouldRender(false);
    }, 300);
  };

  if (accepted || !shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
      {/* Backdrop with fade animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onAccept}
      />
      
      {/* Cookie banner with slide and fade animation */}
      <div 
        className={`relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden pointer-events-auto transition-all duration-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0 sm:scale-100' 
            : 'opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95'
        }`}
      >
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
        
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            {/* Cookie icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 text-xl font-bold text-gray-900 tracking-tight">
                {t("cookie.title")}
              </h3>
              <p className="mb-5 text-sm text-gray-600 leading-relaxed">
                {t("cookie.message")}
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2 decoration-green-600/30 hover:decoration-green-600 transition-colors"
                >
                  {t("footer.legal.privacy")}
                </Link>
                <span className="text-gray-300">•</span>
                <Link 
                  to="/terms" 
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2 decoration-green-600/30 hover:decoration-green-600 transition-colors"
                >
                  {t("footer.legal.terms")}
                </Link>
              </div>
            </div>
            
            {/* Accept button */}
            <button
              onClick={onAccept}
              className="flex-shrink-0 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all duration-200 hover:scale-105 active:scale-100 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t("cookie.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}