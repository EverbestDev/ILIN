import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  Building,
  FileText,
  Globe,
  ArrowRight,
  CheckCircle,
  Calendar,
  Headphones,
  Shield,
  Zap,
  XCircle,
  Loader2,
} from "lucide-react";

// Helper: Convert English numerals to Arabic
const toArabicNumerals = (num) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[digit]);
};

// Helper: Check if RTL
const isRTL = (lang) => lang === "ar";

export default function ContactPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const rtl = isRTL(currentLang);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    urgency: "standard",
  });
  const [activeContact, setActiveContact] = useState("form");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Build contact methods with translations
  const contactMethods = [
    {
      id: "whatsapp",
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: t("contactpage.methods.whatsapp.title"),
      description: t("contactpage.methods.whatsapp.desc"),
      contact: t("contactpage.methods.whatsapp.contact"),
      availability: t("contactpage.methods.whatsapp.availability"),
      response: t("contactpage.methods.whatsapp.response"),
      bgGradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100",
    },
    {
      id: "phone",
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: t("contactpage.methods.phone.title"),
      description: t("contactpage.methods.phone.desc"),
      contact: t("contactpage.methods.phone.contact"),
      availability: t("contactpage.methods.phone.availability"),
      response: t("contactpage.methods.phone.response"),
      bgGradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "email",
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: t("contactpage.methods.email.title"),
      description: t("contactpage.methods.email.desc"),
      contact: t("contactpage.methods.email.contact"),
      availability: t("contactpage.methods.email.availability"),
      response: t("contactpage.methods.email.response"),
      bgGradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100",
    },
  ];

  // Build offices with translations
  const offices = [
    {
      city: t("contactpage.offices.lagos.city"),
      address: t("contactpage.offices.lagos.address"),
      fullAddress: t("contactpage.offices.lagos.fullAddress"),
      isMain: true,
      hours: t("contactpage.offices.lagos.hours"),
      phone: t("contactpage.offices.lagos.phone"),
      email: t("contactpage.offices.lagos.email"),
    },
    {
      city: t("contactpage.offices.abuja.city"),
      address: t("contactpage.offices.abuja.address"),
      fullAddress: t("contactpage.offices.abuja.fullAddress"),
      isMain: false,
      hours: t("contactpage.offices.abuja.hours"),
      phone: t("contactpage.offices.abuja.phone"),
      email: t("contactpage.offices.abuja.email"),
    },
    {
      city: t("contactpage.offices.portharcourt.city"),
      address: t("contactpage.offices.portharcourt.address"),
      fullAddress: t("contactpage.offices.portharcourt.fullAddress"),
      isMain: false,
      hours: t("contactpage.offices.portharcourt.hours"),
      phone: t("contactpage.offices.portharcourt.phone"),
      email: t("contactpage.offices.portharcourt.email"),
    },
  ];

  // Services from translation
  const services = [
    t("contactpage.services.option1"),
    t("contactpage.services.option2"),
    t("contactpage.services.option3"),
    t("contactpage.services.option4"),
    t("contactpage.services.option5"),
    t("contactpage.services.option6"),
    t("contactpage.services.option7"),
  ];

  // Support features
  const supportFeatures = [
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: t("contactpage.support.quickResponse.title"),
      description: t("contactpage.support.quickResponse.desc"),
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: t("contactpage.support.secure.title"),
      description: t("contactpage.support.secure.desc"),
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      title: t("contactpage.support.expert.title"),
      description: t("contactpage.support.expert.desc"),
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      title: t("contactpage.support.flexible.title"),
      description: t("contactpage.support.flexible.desc"),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const validationMsg = validateForm(formData);
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://ilin-backend.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {data.message || t("contactpage.form.successMessage")}
          </span>
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
          urgency: "standard",
        });
      } else {
        setError(
          <span className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            {data.message || t("contactpage.form.errorMessage")}
          </span>
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        <span className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          {t("contactpage.form.catchError")}
        </span>
      );
    }
    setLoading(false);
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

  function validateForm(formData) {
    if (!formData.name.trim()) return t("contactpage.validation.nameRequired");
    if (!formData.email.trim()) return t("contactpage.validation.emailRequired");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      return t("contactpage.validation.emailInvalid");
    if (!formData.message.trim())
      return t("contactpage.validation.messageRequired");
    if (!formData.service.trim())
      return t("contactpage.validation.serviceRequired");
    return "";
  }

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.message.trim() &&
    formData.service.trim();

  // Auto-hide success and error messages after 4 seconds
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div
      className="min-h-screen bg-white"
      dir={rtl ? "rtl" : "ltr"}
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      {/* Hero Section with Glassmorphism */}
      <section className="relative px-6 py-20 pt-32 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 md:px-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div
            className={`absolute bg-green-200 rounded-full top-20 ${
              rtl ? "right-10" : "left-10"
            } w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse`}
          ></div>
          <div
            className={`absolute delay-1000 bg-blue-200 rounded-full top-40 ${
              rtl ? "left-10" : "right-10"
            } w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse`}
          ></div>
          <div className="absolute bg-purple-200 rounded-full -bottom-8 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 border border-green-200 rounded-full bg-white/80 backdrop-blur-sm">
              {t("contactpage.hero.badge")}
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t("contactpage.hero.heading1")}
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                {t("contactpage.hero.heading2")}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              {t("contactpage.hero.description")}
            </p>

            {/* contactpage Method Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveContact("form")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "form"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                {t("contactpage.hero.tabs.form")}
              </button>
              <button
                onClick={() => setActiveContact("direct")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "direct"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                {t("contactpage.hero.tabs.direct")}
              </button>
              <button
                onClick={() => setActiveContact("offices")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "offices"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                {t("contactpage.hero.tabs.offices")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      {activeContact === "form" && (
        <section className="px-6 py-20 bg-white md:px-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: rtl ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
                >
                  <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 md:text-3xl">
                    {t("contactpage.form.heading")}
                  </h2>

                  {/* Feedback messages */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 mb-4 font-semibold text-center text-green-800 border border-green-200 shadow-sm rounded-xl bg-green-50"
                    >
                      {success}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 mb-4 font-semibold text-center text-red-800 border border-red-200 shadow-sm rounded-xl bg-red-50"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="relative">
                        <User
                          className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                            rtl ? "right-4" : "left-4"
                          }`}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t("contactpage.form.namePlaceholder")}
                          required
                          className={`w-full py-4 ${
                            rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                          } transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                      <div className="relative">
                        <Mail
                          className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                            rtl ? "right-4" : "left-4"
                          }`}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t("contactpage.form.emailPlaceholder")}
                          required
                          className={`w-full py-4 ${
                            rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                          } transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="relative">
                        <Phone
                          className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                            rtl ? "right-4" : "left-4"
                          }`}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t("contactpage.form.phonePlaceholder")}
                          className={`w-full py-4 ${
                            rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                          } transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                      <div className="relative">
                        <Building
                          className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                            rtl ? "right-4" : "left-4"
                          }`}
                        />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder={t("contactpage.form.companyPlaceholder")}
                          className={`w-full py-4 ${
                            rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                          } transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Globe
                        className={`absolute w-5 h-5 text-gray-400 top-6 ${
                          rtl ? "right-4" : "left-4"
                        }`}
                      />
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={`w-full py-4 ${
                          rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                        } transition-all bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      >
                        <option value="">
                          {t("contactpage.form.serviceSelect")}
                        </option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Clock
                        className={`absolute w-5 h-5 text-gray-400 top-6 ${
                          rtl ? "right-4" : "left-4"
                        }`}
                      />
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className={`w-full py-4 ${
                          rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                        } transition-all bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      >
                        <option value="standard">
                          {t("contactpage.form.urgencyStandard")}
                        </option>
                        <option value="rush">
                          {t("contactpage.form.urgencyRush")}
                        </option>
                        <option value="urgent">
                          {t("contactpage.form.urgencyUrgent")}
                        </option>
                      </select>
                    </div>

                    <div className="relative">
                      <FileText
                        className={`absolute w-5 h-5 text-gray-400 top-4 ${
                          rtl ? "right-4" : "left-4"
                        }`}
                      />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={t("contactpage.form.messagePlaceholder")}
                        rows="5"
                        className={`w-full py-4 ${
                          rtl ? "pr-12 pl-4" : "pl-12 pr-4"
                        } transition-all border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: !loading ? 1.02 : 1 }}
                      whileTap={{ scale: !loading ? 0.98 : 1 }}
                      disabled={loading || !isFormValid}
                      className={`flex items-center justify-center w-full px-8 py-4 font-semibold transition-all duration-300 shadow-lg rounded-xl
    ${
      loading
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
    }
    `}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className={`w-5 h-5 ${rtl ? "ml-2" : "mr-2"}`} />
                      )}
                      <span className={rtl ? "mr-2" : "ml-2"}>
                        {loading
                          ? t("contactpage.form.sending")
                          : t("contactpage.form.sendButton")}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              {/* Support Features */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: rtl ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="sticky top-8"
                >
                  <div className="p-8 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                      {t("contactpage.form.whatToExpect")}
                    </h3>

                    <div className="space-y-6">
                      {supportFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-white shadow-sm rounded-xl flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="mb-1 font-semibold text-gray-900">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 mt-8 border border-green-200 bg-green-50 rounded-2xl">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span
                          className={`font-semibold text-green-800 ${
                            rtl ? "mr-2" : "ml-2"
                          }`}
                        >
                          {t("contactpage.form.freeConsultation")}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        {t("contactpage.form.consultationDesc")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Direct Contact Methods */}
      {activeContact === "direct" && (
        <section className="px-6 py-20 bg-white md:px-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t("contactpage.direct.heading")}
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                {t("contactpage.direct.description")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative overflow-hidden group"
                >
                  <div className="flex flex-col p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl h-90 rounded-3xl hover:shadow-2xl group-hover:scale-105">
                    <div
                      className={`w-14 h-14 ${method.iconBg} py-2 md:py-6 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {method.icon}
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900">
                          {method.title}
                        </h3>
                        <p className="mb-4 leading-relaxed text-gray-600">
                          {method.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-gray-50">
                          <p className="font-semibold text-gray-900">
                            {method.contact}
                          </p>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {t("contactpage.direct.available")}
                          </span>
                          <span className="font-medium text-gray-900">
                            {method.availability}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {t("contactpage.direct.response")}
                          </span>
                          <span className="font-medium text-green-600">
                            {method.response}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}
                  ></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Office Locations */}
      {activeContact === "offices" && (
        <section className="px-6 py-20 bg-white md:px-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t("contactpage.offices.heading")}
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                {t("contactpage.offices.description")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {offices.map((office, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className={`h-96 p-8 bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 flex flex-col ${
                      office.isMain
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Header with badge */}
                    <div
                      className={`flex items-center ${
                        rtl ? "flex-row-reverse" : ""
                      } justify-between mb-6`}
                    >
                      <div
                        className={`flex items-center ${
                          rtl ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            office.isMain ? "bg-green-600" : "bg-gray-600"
                          } ${rtl ? "ml-4" : "mr-4"}`}
                        >
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div className={rtl ? "text-right" : ""}>
                          <h3 className="text-xl font-bold text-gray-900">
                            {office.city}
                          </h3>
                          {office.isMain && (
                            <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full mt-1">
                              {t("contactpage.offices.mainOffice")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content - Flex grow to fill space evenly */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="space-y-4">
                        <div className={rtl ? "text-right" : ""}>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            {t("contactpage.offices.addressLabel")}
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {office.fullAddress}
                          </p>
                        </div>

                        <div className={rtl ? "text-right" : ""}>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            {t("contactpage.offices.hoursLabel")}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {office.hours}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`pt-4 space-y-3 border-t border-gray-200 ${
                          rtl ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center text-sm ${
                            rtl ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Phone
                            className={`w-4 h-4 text-green-600 flex-shrink-0 ${
                              rtl ? "ml-2" : "mr-2"
                            }`}
                          />
                          <span className="font-medium text-gray-900">
                            {office.phone}
                          </span>
                        </div>
                        <div
                          className={`flex items-center text-sm ${
                            rtl ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Mail
                            className={`w-4 h-4 text-green-600 flex-shrink-0 ${
                              rtl ? "ml-2" : "mr-2"
                            }`}
                          />
                          <span className="font-medium text-gray-900">
                            {office.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div
                className={`inline-flex items-center px-6 py-3 border border-blue-200 bg-blue-50 rounded-xl ${
                  rtl ? "flex-row-reverse" : ""
                }`}
              >
                <Calendar
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 ${
                    rtl ? "ml-2" : "mr-2"
                  }`}
                />
                <span className="font-medium text-blue-800">
                  {t("contactpage.offices.scheduleNote")}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Call to Action - Consistent width */}
      <section className="px-6 py-20 bg-green-600 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white">
              {t("contactpage.cta.heading")}
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              {t("contactpage.cta.description")}
            </p>
            {/* Consistent CTA button width */}
            <div
              className={`flex flex-col justify-center max-w-2xl gap-6 mx-auto sm:flex-row ${
                rtl ? "flex-row-reverse" : ""
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className={`inline-flex items-center justify-center flex-1 px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100 ${
                  rtl ? "flex-row-reverse" : ""
                }`}
              >
                {t("contactpage.cta.quoteButton")}
                <ArrowRight
                  className={`w-5 h-5 ${rtl ? "mr-2" : "ml-2"}`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveContact("form")}
                className={`inline-flex items-center justify-center flex-1 px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500 ${
                  rtl ? "flex-row-reverse" : ""
                }`}
              >
                {t("contactpage.cta.messageButton")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}