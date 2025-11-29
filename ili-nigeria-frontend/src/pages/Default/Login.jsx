import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { Globe, Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  auth,
} from "../../utility/firebase";
import Spinner from "../../components/UI/Spinner";
import { linkWithPopup } from "firebase/auth";

// Helper: Check if RTL
const isRTL = (lang) => lang === "ar";

const carouselSlides = [
  {
    titleKey: "login.carousel.slide1.title",
    textKey: "login.carousel.slide1.text",
  },
  {
    titleKey: "login.carousel.slide2.title",
    textKey: "login.carousel.slide2.text",
  },
  {
    titleKey: "login.carousel.slide3.title",
    textKey: "login.carousel.slide3.text",
  },
];

const AuthSidebar = ({ activeSlide, t }) => {
  const slide = carouselSlides[activeSlide];
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <div className="relative flex flex-col justify-between hidden min-h-full p-8 overflow-hidden text-white md:flex lg:flex lg:w-1/3 xl:w-2/5 bg-gradient-to-br from-green-700 to-green-900">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-xl bg-white/20">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold">ILIN Portal</h1>
      </div>
      <div className={`max-w-md my-auto ${rtl ? "text-right" : "text-left"}`}>
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold">{t(slide.titleKey)}</h2>
          <p className="text-xl font-light text-green-100">
            {t(slide.textKey)}
          </p>
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
      <p className="text-xs text-white/70">{t("login.sidebar.footer")}</p>
    </div>
  );
};

export default function Login() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const rtl = isRTL(currentLang);

  const [isSignup, setIsSignup] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingCredential, setPendingCredential] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [pendingMethods, setPendingMethods] = useState([]);
  const [resolvePassword, setResolvePassword] = useState("");
  const [resolvingPassword, setResolvingPassword] = useState(false);
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
  const BASE_URL =
    "https://ilin-backend.onrender.com" ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

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
      // If there is a pending OAuth credential from a previous failed
      // sign-in attempt (account-exists-with-different-credential), try
      // to link it to the now-signed-in user.
      if (pendingCredential && auth.currentUser) {
        try {
          await linkWithCredential(auth.currentUser, pendingCredential);
          setPendingCredential(null);
          setPendingEmail(null);
          setPendingMethods([]);
        } catch (linkError) {
          console.error("Error linking pending credential:", linkError);
        }
      }
      await user.getIdToken(true);
      setLoading(false);
      navigate(role === "admin" ? "/admin/dashboard" : `/client/dashboard`);
    } catch (error) {
      setLoading(false);
      let errorMessage = t("login.errors.signInFailed");

      if (error.code && error.code.startsWith("auth/")) {
        // Special handling for account-exists-with-different-credential
        if (error.code === "auth/account-exists-with-different-credential") {
          const emailFromError = error.customData?.email || error.email || null;
          let pendingCred = null;
          try {
            pendingCred =
              FacebookAuthProvider?.credentialFromError?.(error) || null;
          } catch (e) {
            pendingCred = null;
          }

          try {
            const methods = emailFromError
              ? await fetchSignInMethodsForEmail(auth, emailFromError)
              : [];
            setPendingCredential(pendingCred);
            setPendingEmail(emailFromError);
            setPendingMethods(methods || []);

            const providerNames = (methods || []).map((m) => {
              switch (m) {
                case "password":
                  return t("login.methods.password");
                case "google.com":
                  return "Google";
                case "facebook.com":
                  return "Facebook";
                default:
                  return m;
              }
            });

            errorMessage =
              t("login.errors.accountExists") +
              ` ${emailFromError} (${providerNames.join(", ")})`;
          } catch (fetchErr) {
            console.error("Error fetching sign-in methods:", fetchErr);
            errorMessage = t("login.errors.accountExists");
          }
        } else {
          switch (error.code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
              errorMessage = t("login.errors.invalidCredentials");
              break;
            case "auth/too-many-requests":
              errorMessage = t("login.errors.tooManyAttempts");
              break;
            case "auth/invalid-email":
              errorMessage = t("login.errors.invalidEmail");
              break;
            case "auth/popup-closed-by-user":
              errorMessage = t("login.errors.popupClosed");
              break;
            case "auth/popup-blocked":
              errorMessage = t("login.errors.popupBlocked");
              break;
            default:
              errorMessage = error.message || t("login.errors.signInFailed");
              break;
          }
        }
      } else {
        errorMessage = error.message || t("login.errors.networkError");
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
      setError(t("login.errors.passwordMismatch"));
      setLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
        throw new Error(
          data.message || `HTTP error! Status: ${profileResponse.status}`
        );
      }

      const profileData = await profileResponse.json();
      const { role, email: userEmail } = profileData.user;

      setLoading(false);
      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(t("login.messages.accountCreated"));
      navigate(
        role === "admin" ? "/admin/dashboard" : `/client/dashboard/${userEmail}`
      );
    } catch (error) {
      setLoading(false);
      let errorMessage = t("login.errors.registrationFailed");

      if (error.code && error.code.startsWith("auth/")) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = t("login.errors.emailInUse");
            break;
          case "auth/invalid-email":
            errorMessage = t("login.errors.invalidEmail");
            break;
          case "auth/weak-password":
            errorMessage = t("login.errors.weakPassword");
            break;
          default:
            errorMessage =
              error.message || t("login.errors.registrationFailed");
            break;
        }
      } else {
        errorMessage = error.message || t("login.errors.networkError");
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
      setSuccess(t("login.messages.resetEmailSent"));
      setResetEmail("");
      setShowResetPassword(false);
    } catch (error) {
      let errorMessage = t("login.errors.resetFailed");
      if (error.code && error.code.startsWith("auth/")) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = t("login.errors.invalidEmail");
            break;
          case "auth/user-not-found":
            errorMessage = t("login.errors.userNotFound");
            break;
          default:
            errorMessage = error.message || t("login.errors.resetFailed");
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

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    await handleSignIn(provider);
  };

  const handleResolveWithPassword = async () => {
    if (!pendingEmail || !pendingCredential) return;
    setResolvingPassword(true);
    setError("");
    try {
      // Sign in with email/password to obtain the existing user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        pendingEmail,
        resolvePassword
      );

      // Link pending credential
      await linkWithCredential(userCredential.user, pendingCredential);

      // Clear pending state and navigate after refreshing token/profile
      setPendingCredential(null);
      setPendingEmail(null);
      setPendingMethods([]);

      const idToken = await auth.currentUser.getIdToken();
      const profileResponse = await fetch(
        `${BASE_URL}/api/auth/set-claims-and-get-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: auth.currentUser.displayName || pendingEmail.split("@")[0],
            role: "client",
          }),
          credentials: "include",
        }
      );
      if (!profileResponse.ok) throw new Error("Failed to set profile");

      // success — navigate based on role
      const profileData = await profileResponse.json();
      const { role } = profileData.user;
      await auth.currentUser.getIdToken(true);
      setResolvingPassword(false);
      navigate(role === "admin" ? "/admin/dashboard" : "/client/dashboard");
    } catch (err) {
      console.error("Resolve with password error:", err);
      setError(
        err.code === "auth/wrong-password"
          ? t("login.errors.invalidCredentials")
          : err.message || t("login.errors.signInFailed")
      );
      setResolvingPassword(false);
    }
  };

  return (
    <div
      className="flex min-h-screen overflow-hidden bg-gray-50"
      dir={rtl ? "rtl" : "ltr"}
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <AuthSidebar activeSlide={activeSlide} t={t} />
      <div className="flex flex-col items-center justify-center w-full p-6 sm:p-12 lg:w-2/3 xl:w-3/5 bg-gray-50">
        <motion.div
          key={isSignup ? "signup" : "login"}
          className="w-full max-w-sm p-8 bg-white border border-gray-100 shadow-2xl sm:max-w-md sm:p-10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className={`flex justify-center mb-8 ${
              rtl ? "flex-row-reverse" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`px-6 py-2 text-xl font-bold border-b-2 transition-colors ${
                !isSignup
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("login.tabs.signIn")}
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
              {t("login.tabs.signUp")}
            </button>
          </div>
          {error && (
            <p
              className={`mb-4 text-sm text-red-600 ${rtl ? "text-right" : ""}`}
              role="alert"
            >
              {error}
            </p>
          )}
          {pendingMethods && pendingMethods.length > 0 && (
            <div className="mb-4 p-3 text-sm bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                {t("login.errors.accountExists")} {pendingEmail} — {pendingMethods.join(", ")}. {t("login.messages.linkInstructions")}
              </p>
              {pendingMethods.includes("google.com") && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {t("login.buttons.signInWithGoogle") || "Sign in with Google to link"}
                  </button>
                </div>
              )}
            </div>
          )}
          {success && (
            <p
              className={`mb-4 text-sm text-green-600 ${
                rtl ? "text-right" : ""
              }`}
              role="alert"
            >
              {success}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label
                  htmlFor="name"
                  className={`block mb-1 text-sm font-medium text-gray-700 ${
                    rtl ? "text-right" : ""
                  }`}
                >
                  {t("login.form.fullName")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    rtl ? "text-right" : ""
                  }`}
                  placeholder={t("login.form.yourName")}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className={`block mb-1 text-sm font-medium text-gray-700 ${
                  rtl ? "text-right" : ""
                }`}
              >
                {t("login.form.emailAddress")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  rtl ? "text-right" : ""
                }`}
                placeholder={t("login.form.emailPlaceholder")}
                required
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className={`block mb-1 text-sm font-medium text-gray-700 ${
                  rtl ? "text-right" : ""
                }`}
              >
                {t("login.form.password")}
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  rtl ? "pr-10 text-right" : "pr-10"
                }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none ${
                  rtl ? "left-3" : "right-3"
                }`}
                aria-label={
                  showPassword
                    ? t("login.a11y.hidePassword")
                    : t("login.a11y.showPassword")
                }
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
                  className={`block mb-1 text-sm font-medium text-gray-700 ${
                    rtl ? "text-right" : ""
                  }`}
                >
                  {t("login.form.confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    rtl ? "pr-10 text-right" : "pr-10"
                  }`}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none ${
                    rtl ? "left-3" : "right-3"
                  }`}
                  aria-label={
                    showConfirmPassword
                      ? t("login.a11y.hideConfirmPassword")
                      : t("login.a11y.showConfirmPassword")
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
              <div
                className={`flex items-center justify-between pt-2 ${
                  rtl ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center ${
                    rtl ? "flex-row-reverse" : ""
                  }`}
                >
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
                    className={`block text-sm text-gray-900 ${
                      rtl ? "mr-2" : "ml-2"
                    }`}
                  >
                    {t("login.form.rememberMe")}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  {t("login.form.forgotPassword")}
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition duration-150 border border-transparent rounded-lg shadow-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              {isSignup ? t("login.buttons.createAccount") : t("login.buttons.signIn")}
            </button>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                {t("login.form.orContinueWith")}
              </span>
            </div>
          </div>
          <div
            className={`grid grid-cols-3 gap-3 mt-6 ${
              rtl ? "flex-row-reverse" : ""
            }`}
          >
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              <FcGoogle size={20} />
            </button>
            <button
              type="button"
              onClick={handleFacebookSignIn}
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              <FaFacebookF size={20} className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              <FaTwitter size={20} className="text-blue-400" />
            </button>
          </div>
          {showComingSoon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div
                className={`w-full max-w-sm p-6 bg-white rounded-lg shadow-xl ${
                  rtl ? "text-right" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("login.modals.comingSoon")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t("login.modals.comingSoonDesc")}
                </p>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {t("login.buttons.close")}
                </button>
              </div>
            </div>
          )}
          {showResetPassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div
                className={`w-full max-w-sm p-6 bg-white rounded-lg shadow-xl ${
                  rtl ? "text-right" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("login.modals.resetPassword")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t("login.modals.resetPasswordDesc")}
                </p>
                <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="resetEmail"
                      className={`block mb-1 text-sm font-medium text-gray-700 ${
                        rtl ? "text-right" : ""
                      }`}
                    >
                      {t("login.form.emailAddress")}
                    </label>
                    <input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`w-full px-4 py-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        rtl ? "text-right" : ""
                      }`}
                      placeholder={t("login.form.emailPlaceholder")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div
                    className={`flex gap-2 ${rtl ? "flex-row-reverse" : ""}`}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <Spinner size="sm" className="mx-auto" color="#ffffff" />
                      ) : (
                        t("login.buttons.sendResetLink")
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      {t("login.buttons.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Loading modal */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-xs">
                <Spinner size="lg" />
                <p className="text-sm font-medium text-gray-800">{t("login.modals.loggingIn") || "Logging you in..."}</p>
              </div>
            </div>
          )}

          {/* Pending password resolution modal */}
          {pendingMethods && pendingMethods.includes("password") && pendingEmail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h3 className="mb-2 text-lg font-semibold">{t("login.modals.resolveAccountTitle") || "Account exists"}</h3>
                <p className="mb-4 text-sm text-gray-600">{t("login.messages.providePassword") || `Enter the password for ${pendingEmail} to link your account.`}</p>
                <input
                  type="password"
                  value={resolvePassword}
                  onChange={(e) => setResolvePassword(e.target.value)}
                  placeholder={t("login.form.password")}
                  className="w-full px-4 py-2 mb-3 border rounded-lg"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingCredential(null);
                      setPendingEmail(null);
                      setPendingMethods([]);
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
                    disabled={resolvingPassword}
                  >
                    {t("login.buttons.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleResolveWithPassword}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg"
                    disabled={resolvingPassword}
                  >
                    {resolvingPassword ? (
                      <Spinner size="xs" color="#ffffff" />
                    ) : (
                      t("login.buttons.signIn")
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          <p
            className={`mt-8 text-xs text-center text-gray-500 ${
              rtl ? "text-right" : ""
            }`}
          >
            {t("login.footer.agreement")}
              <Link
                to="/terms"
                className="font-medium text-green-600 hover:text-green-500"
              >
                {t("login.footer.terms")}
              </Link>
            {" " + t("login.footer.and") + " "}
              <Link
                to="/privacy"
                className="font-medium text-green-600 hover:text-green-500"
              >
                {t("login.footer.privacy")}
              </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
