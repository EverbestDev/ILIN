import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Globe, Eye, EyeOff } from "lucide-react"; // <-- ADDED: Eye and EyeOff icons

// Carousel Data
const carouselSlides = [
  {
    title: "Our Mission",
    text: "Breaking language barriers and building bridges of understanding to enable seamless communication across all cultures and industries.",
  },
  {
    title: "Our Vision",
    text: "A connected, multilingual world. To be Africa’s leading language services provider, empowering global commerce and understanding.",
  },
  {
    title: "Client Commitment",
    text: "We provide professional translation and interpretation services tailored for success, ensuring accuracy and cultural sensitivity in every project.",
  },
];

// Auth Sidebar Component (Full Height of the main area)
const AuthSidebar = ({ activeSlide }) => {
  const slide = carouselSlides[activeSlide];
  return (
    <div className="relative flex flex-col justify-between hidden min-h-full p-8 overflow-hidden text-white lg:flex lg:w-1/3 xl:w-2/5 bg-gradient-to-br from-green-700 to-green-900">
      {/* 1. Logo at the top of the side-Modal Bar (Sidebar) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-xl bg-white/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold">ILIN Portal</h1>
      </div>

      {/* 2. Carousel Content */}
      <div className="max-w-md my-auto text-left">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
          <p className="text-xl font-light text-green-100">{slide.text}</p>
        </motion.div>

        {/* Carousel Indicators */}
        <div className="flex justify-start gap-2 mt-8">
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Optional: Mission Statement at the bottom */}
      <p className="text-xs text-white/70">
        Connecting cultures through language excellence.
      </p>
    </div>
  );
};

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  // 👇 New state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleAuth(e) {
    e.preventDefault();
    setLoading(true);

    if (isSignup && password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (email.includes("admin")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    }, 1500);
  }

  // Form content based on toggle state
  const FormContent = () => (
    <>
      {isSignup && (
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="Your Name"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          placeholder="you@example.com"
        />
      </div>

      {/* Password Field with Eye Toggle */}
      <div className="relative">
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          // 👇 Dynamically set type based on state
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          placeholder="••••••••"
        />
        {/* Eye Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Confirm Password Field with Eye Toggle (only for Signup) */}
      {isSignup && (
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            // 👇 Dynamically set type based on state
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="••••••••"
          />
          {/* Eye Button */}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {!isSignup && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label
              htmlFor="remember-me"
              className="block ml-2 text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Forgot password?
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition duration-150 border border-transparent rounded-lg shadow-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
        ) : isSignup ? (
          "Create Account"
        ) : (
          "Sign In"
        )}
      </button>
    </>
  );

  return (
    // min-h-full ensures the dual panel fills the remaining space between header and footer
    <div className="flex min-h-full">
      {/* Full-Height Side Panel */}
      <AuthSidebar activeSlide={activeSlide} />

      {/* Right Side - Login Form (2/3 on desktop) */}
      <div className="flex flex-col items-center justify-center w-full p-6 sm:p-12 lg:w-2/3 xl:w-3/5 bg-gray-50">
        {/* Form Container */}
        <motion.div
          key={isSignup ? "signup" : "login"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm p-8 bg-white border border-gray-100 shadow-2xl sm:max-w-md sm:p-10 rounded-xl"
        >
          {/* Title and Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsSignup(false)}
              className={`px-6 py-2 text-xl font-bold border-b-2 transition-colors ${
                !isSignup
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`px-6 py-2 text-xl font-bold border-b-2 transition-colors ${
                isSignup
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <FormContent />
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                Or connect with
              </span>
            </div>
          </div>

          {/* Social Login Buttons (Google, Facebook, LinkedIn) */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              onClick={() => console.log("Google Auth")}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FcGoogle size={20} />
            </button>
            <button
              onClick={() => console.log("Facebook Auth")}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFacebookF size={20} className="text-blue-600" />
            </button>
            <button
              onClick={() => console.log("LinkedIn Auth")}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaLinkedinIn size={20} className="text-blue-700" />
            </button>
          </div>

          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Terms of Service
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
