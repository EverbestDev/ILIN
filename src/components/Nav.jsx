import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // close menu when clicking a link
  };

  return (
    <nav className='fixed top-0 left-0 z-50 w-full bg-white shadow-md'>
      <div className='flex items-center justify-between px-6 py-4 mx-auto max-w-7xl'>
        {/* Left - Logo */}
        <div className='text-2xl font-bold text-blue-600'>ILI-Nigeria</div>

        {/* Center - Nav Links (desktop) */}
        <div className='hidden space-x-8 font-medium text-gray-700 md:flex'>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/services'>Services</Link>
          <Link to='/languages'>Languages</Link>
          <Link to='/contact'>Contact</Link>
        </div>

        {/* Right - Buttons (desktop) */}
        <div className='hidden space-x-4 md:flex'>
          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className='px-4 py-2 text-gray-900 transition border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white'>
            Login
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className='px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700'>
            Get Quote
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='text-gray-700 md:hidden'
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            // Close (X)
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-7 w-7'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : (
            // Hamburger (☰)
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-7 w-7'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 6h16M4 12h16M4 18h16'
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
            className='px-6 py-4 space-y-4 bg-white shadow-inner md:hidden'>
            <Link to='/' className='block' onClick={handleLinkClick}>
              Home
            </Link>
            <Link to='/about' className='block' onClick={handleLinkClick}>
              About
            </Link>
            <Link to='/services' className='block' onClick={handleLinkClick}>
              Services
            </Link>
            <Link to='/languages' className='block' onClick={handleLinkClick}>
              Languages
            </Link>
            <Link to='/contact' className='block' onClick={handleLinkClick}>
              Contact
            </Link>
            <div className='flex flex-col gap-3 pt-3'>
              <button className='w-full px-4 py-2 text-gray-700 border border-orange-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500'>
                Login
              </button>
              <button className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
                Get Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
