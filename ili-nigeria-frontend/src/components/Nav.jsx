import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/ILIN.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsOpen(false); // close menu when clicking a link
  };

  const handleQuoteClick = () => {
    navigate("/quote");
    setIsOpen(false);
  };
  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };
  const logoPics = logo;

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Left - Logo */}
        <div className="flex items-center gap-2 align-middle">
          <img src={logoPics} alt="logo" className="h-8 cursor-pointer" />
          <div className="hidden text-2xl font-bold text-green-600 md:block">
            ILI-Nigeria
          </div>
        </div>

        {/* Center - Nav Links (desktop) */}
        <div className="hidden space-x-8 font-medium text-gray-700 md:flex">
          <Link
            to="/"
            className="transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
          >
            About
          </Link>
          <Link
            to="/services"
            className="transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
          >
            Services
          </Link>
          <Link
            to="/languages"
            className="transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
          >
            Languages
          </Link>
          <Link
            to="/contact"
            className="transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
          >
            Contact
          </Link>
        </div>

        {/* Right - Buttons (desktop) */}
        <div className="hidden space-x-4 md:flex">
          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleLogin}
            className="px-4 py-2 text-gray-900 transition-colors duration-200 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleQuoteClick}
            className="px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Get Quote
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-gray-700 rounded md:hidden focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            // Close (X)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger (☰)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-4 space-y-4 bg-white shadow-inner md:hidden"
          >
            <Link
              to="/"
              className="block py-2 transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block py-2 transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
              onClick={handleLinkClick}
            >
              Services
            </Link>
            <Link
              to="/languages"
              className="block py-2 transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
              onClick={handleLinkClick}
            >
              Languages
            </Link>
            <Link
              to="/contact"
              className="block py-2 transition-colors duration-200 hover:text-green-600 focus:text-green-600 focus:outline-none"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-3 pt-3">
              <motion.button
                whileTap={{ scale: 0.95, opacity: 0.8 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleLogin}
                className="w-full px-4 py-2 text-gray-700 transition-colors duration-200 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Login
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95, opacity: 0.8 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleQuoteClick}
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Get Quote
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
