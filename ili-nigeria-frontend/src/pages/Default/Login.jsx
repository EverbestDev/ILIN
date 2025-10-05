import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Globe, Eye, EyeOff } from "lucide-react";

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

// Auth Sidebar Component
const AuthSidebar = ({ activeSlide }) => {
  const slide = carouselSlides[activeSlide];
  return (
    <div className="relative flex-col justify-between hidden min-h-full p-8 overflow-hidden text-white md:flex lg:flex lg:w-1/3 xl:w-2/5 bg-gradient-to-br from-green-700 to-green-900">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-xl bg-white/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold">ILIN Portal</h1>
      </div>

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

        <div className="flex justify-start gap-2 mt-8">
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let endpoint = "/api/auth/login";
      let body = { email, password };

      if (isSignup) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        endpoint = "/api/auth/register";
        body = { name, email, password, role: "client" }; // Default to client for signup
      }

      const res = await fetch("https://ilin-backend.onrender.com" + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isSignup) {
          setError("Account created. Please log in.");
          setIsSignup(false);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          console.log("JWT Token:", data.token); // Log token for debugging
          navigate(data.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to " + (isSignup ? "register" : "login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <AuthSidebar activeSlide={activeSlide} />

      {/* Form Section */}
      <div className="relative flex items-center justify-center w-full p-8 lg:w-2/3 xl:w-3/5">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          {error && <p className="mb-4 text-red-600">{error}</p>}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-4"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {isSignup && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-4"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
            {!isSignup && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <label className="block ml-2 text-sm text-gray-900">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">Forgot password?</a>
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
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or connect with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <button type="button" onClick={() => console.log("Google Auth")} className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FcGoogle size={20} />
            </button>
            <button type="button" onClick={() => console.log("Facebook Auth")} className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FaFacebookF size={20} className="text-blue-600" />
            </button>
            <button type="button" onClick={() => console.log("LinkedIn Auth")} className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FaLinkedinIn size={20} className="text-blue-700" />
            </button>
          </div>

          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to our <a href="#" className="font-medium text-green-600 hover:text-green-500">Terms of Service</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}