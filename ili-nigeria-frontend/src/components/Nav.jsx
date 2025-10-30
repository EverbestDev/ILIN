// src/components/Nav.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import logo from "../assets/ILIN.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: "en", flag: "🇬🇧", label: t("language.en") },
    { code: "fr", flag: "🇫🇷", label: t("language.fr") },
    { code: "ar", flag: "🇸🇦", label: t("language.ar") },
    { code: "yo", flag: "🇳🇬", label: t("language.yo") },
  ];

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const handleLinkClick = () => setIsOpen(false);
  const handleQuoteClick = () => {
    navigate("/quote");
    setIsOpen(false);
  };
  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 start-0 z-50 w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3 mx-auto md:py-4 max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="ILI-Nigeria" className="h-8 cursor-pointer" />
          <div className="hidden text-2xl font-bold text-green-600 md:block">
            ILI-Nigeria
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {["home", "about", "services", "languages", "contact"].map((key) => {
            const path = key === "home" ? "/" : `/${key}`;
            const isActive = location.pathname === path;

            return (
              <Link
                key={key}
                to={path}
                className={`transition-colors duration-200 focus:outline-none ${
                  isActive
                    ? "text-green-600 font-semibold"
                    : "text-gray-700 hover:text-green-600 focus:text-green-600"
                }`}
                onClick={handleLinkClick}
              >
                {t(`nav.${key}`)}
              </Link>
            );
          })}
        </div>

        {/* Buttons + Language */}
        <div className="hidden md:flex items-center gap-4 rtl:space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleLogin}
            className="px-4 py-2 text-gray-900 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {t("nav.login")}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleQuoteClick}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("nav.getQuote")}
          </motion.button>

          {/* Language Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLang.flag}</span>
            </motion.button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute end-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-2 transition-colors rtl:text-right"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-gray-700 rounded md:hidden focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-4 space-y-4 bg-white shadow-inner md:hidden"
          >
            {["home", "about", "services", "languages", "contact"].map(
              (key) => (
                <Link
                  key={key}
                  to={key === "home" ? "/" : `/${key}`}
                  className="block py-2 transition-colors duration-200 hover:text-green-600 rtl:text-right"
                  onClick={handleLinkClick}
                >
                  {t(`nav.${key}`)}
                </Link>
              )
            )}

            <div className="pt-3 border-t border-gray-200">
              <p className="mb-2 text-xs font-medium text-gray-600 rtl:text-right">
                {t("language.title") || "Language"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all rtl:text-right ${
                      i18n.language === lang.code
                        ? "bg-green-50 border-green-300 text-green-700 font-medium"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="me-1">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleLogin}
                className="w-full px-4 py-2 text-gray-700 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white"
              >
                {t("nav.login")}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleQuoteClick}
                className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {t("nav.getQuote")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
