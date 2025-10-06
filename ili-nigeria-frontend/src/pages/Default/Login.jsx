import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { Globe, Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  auth,
} from "../../utility/firebase";
//carousel
const carouselSlides = [
  {
    title: "Our Mission",
    text: "Breaking language barriers and building bridges of understanding to enable seamless communication across all cultures and industries.",
  },
  {
    title: "Our Vision",
    text: "A connected, multilingual world. To be Africa's leading language services provider, empowering global commerce and understanding.",
  },
  {
    title: "Client Commitment",
    text: "We provide professional translation and interpretation services tailored for success, ensuring accuracy and cultural sensitivity in every project.",
  },
];

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
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === index ? "bg-white w-6" : "bg-white/50"
              }`}
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "https://ilin-backend.onrender.com" || import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = async (provider) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = provider
        ? await signInWithPopup(auth, provider)
        : await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const profileResponse = await fetch(
        `${BASE_URL}/api/auth/set-claims-and-get-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: name || user.displayName || email.split("@")[0],
            role: "client",
          }),
          credentials: "include",
        }
      );

      if (!profileResponse.ok) {
        const data = await profileResponse.json();
        throw new Error(
          data.message || `HTTP error! Status: ${profileResponse.status}`
        );
      }

      const profileData = await profileResponse.json();
      const { role, email: userEmail } = profileData.user;
      await user.getIdToken(true); // Force refresh token to get new claims
      setLoading(false);
      navigate(
        role === "admin" ? "/admin/dashboard" : `/client/dashboard/${userEmail}`
      );
    } catch (error) {
      setLoading(false);
      let errorMessage = "Failed to sign in. Please try again.";

      if (error.code && error.code.startsWith("auth/")) {
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts. Try again later.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/popup-closed-by-user":
            errorMessage = "Sign-in cancelled.";
            break;
          case "auth/popup-blocked":
            errorMessage = "Popup blocked. Please allow popups.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage = "Account exists with a different sign-in method.";
            break;
          default:
            errorMessage = error.message || "Sign-in failed.";
            break;
        }
      } else {
        errorMessage = error.message || "Network error. Check backend connection.";
      }

      console.error("Sign-In Error:", error);
      setError(errorMessage);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const profileResponse = await fetch(
        `${BASE_URL}/api/auth/set-claims-and-get-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ name, role: "client" }),
          credentials: "include",
        }
      );

      if (!profileResponse.ok) {
        const data = await profileResponse.json();
        throw new Error(data.message || `HTTP error! Status: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      const { role, email: userEmail } = profileData.user;

      setLoading(false);
      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("Account created. Please sign in.");
      navigate(role === "admin" ? "/admin/dashboard" : `/client/dashboard/${userEmail}`);
    } catch (error) {
      setLoading(false);
      let errorMessage = "Failed to register. Please try again.";

      if (error.code && error.code.startsWith("auth/")) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak. Use at least 6 characters.";
            break;
          default:
            errorMessage = error.message || "Registration failed.";
            break;
        }
      } else {
        errorMessage = error.message || "Network error. Check backend connection.";
      }

      console.error("Registration Error:", error);
      setError(errorMessage);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess("Password reset email sent. Check your inbox.");
      setResetEmail("");
      setShowResetPassword(false);
    } catch (error) {
      let errorMessage = "Failed to send password reset email.";
      if (error.code && error.code.startsWith("auth/")) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
          default:
            errorMessage = error.message || "Password reset failed.";
            break;
        }
      }
      console.error("Password Reset Error:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      await handleSignUp();
    } else {
      await handleSignIn(null);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await handleSignIn(provider);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50">
      <AuthSidebar activeSlide={activeSlide} />
      <div className="flex flex-col items-center justify-center w-full p-6 sm:p-12 lg:w-2/3 xl:w-3/5 bg-gray-50">
        <motion.div
          key={isSignup ? "signup" : "login"}
          className="w-full max-w-sm p-8 bg-white border border-gray-100 shadow-2xl sm:max-w-md sm:p-10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center mb-8">
            <button
              type="button"
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
              type="button"
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
          {error && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 text-sm text-green-600" role="alert">
              {success}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Your Name"
                  required
                  disabled={loading}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 mt-6" />
                ) : (
                  <Eye className="w-5 h-5 mt-6" />
                )}
              </button>
            </div>
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 mt-6" />
                  ) : (
                    <Eye className="w-5 h-5 mt-6" />
                  )}
                </button>
              </div>
            )}
            {!isSignup && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="block ml-2 text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </button>
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
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <FcGoogle size={20} />
            </button>
            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <FaFacebookF size={20} className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <FaTwitter size={20} className="text-blue-400" />
            </button>
          </div>
          {showComingSoon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  Coming Soon
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  This authentication method is not yet available. Please use
                  Google or email/password to sign in.
                </p>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showResetPassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reset Password
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email to receive a password reset link.
                </p>
                <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="resetEmail"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 mx-auto border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Terms of Service
            </a>
            {" and "}
            <a
              href="#"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}