import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

export default function ContactPage() {
  const navigate = useNavigate();
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

  const contactMethods = [
    {
      id: "whatsapp",
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: "WhatsApp Chat",
      description: "Get instant responses for quick questions and updates",
      contact: "+234 810 906 7382",
      availability: "24/7 Available",
      response: "Instant response",
      bgGradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100",
    },
    {
      id: "phone",
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Phone Support",
      description: "Speak directly with our translation experts",
      contact: "+234 810 906 7382",
      availability: "Mon-Fri 8AM-6PM",
      response: "Immediate assistance",
      bgGradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "email",
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: "Email Support",
      description: "Detailed discussions about your translation project",
      contact: "official.intlng@gmail.com",
      availability: "24/7 Monitored",
      response: "Within 2 hours",
      bgGradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100",
    },
  ];

  const offices = [
    {
      city: "Lagos",
      address: "Victoria Island Business District",
      fullAddress: "Plot 1234, Ahmadu Bello Way, Victoria Island, Lagos State",
      isMain: true,
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
      phone: "+234 810 906 7382",
      email: "official.intlng@gmail.com",
    },
    {
      city: "Abuja",
      address: "Central Business District",
      fullAddress: "Suite 456, Central Business District, Abuja FCT",
      isMain: false,
      hours: "Mon-Fri: 9AM-5PM",
      phone: "+234 810 906 7382",
      email: "official.intlng@gmail.com",
    },
    {
      city: "Port Harcourt",
      address: "GRA Phase 2",
      fullAddress: "No. 78 Aba Road, GRA Phase 2, Port Harcourt, Rivers State",
      isMain: false,
      hours: "Mon-Fri: 9AM-5PM",
      phone: "+234 810 906 7382",
      email: "official.intlng@gmail.com",
    },
  ];

  const services = [
    "Document Translation",
    "Website Localization",
    "Live Interpretation",
    "Certified Translation",
    "Voiceover & Subtitling",
    "Enterprise Solutions",
    "Other - Please specify",
  ];

  const supportFeatures = [
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: "Quick Response",
      description: "Average 2-hour response time",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Secure Communication",
      description: "End-to-end encrypted conversations",
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      title: "Expert Consultation",
      description: "Direct access to senior linguists",
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      title: "Flexible Scheduling",
      description: "Book calls at your convenience",
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
      
      // FIXED: Check data.success instead of response.ok
      if (data.success) {
        setSuccess(
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {data.message || "Inquiry submitted successfully"}
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
            {data.message || "Failed to submit inquiry"}
          </span>
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        <span className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          {"Something went wrong. Try again later."}
        </span>
      );
    }
    setLoading(false);
  };
  const handleGetQuote = () => {
    navigate("/quote");
  };

  function validateForm(formData) {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      return "Enter a valid email.";
    if (!formData.message.trim()) return "Message is required.";
    if (!formData.service.trim()) return "Please select a service.";
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
      }, 4000); // 4 seconds
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Glassmorphism */}
      <section className="relative px-6 py-20 pt-32 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 md:px-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute bg-green-200 rounded-full top-20 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute delay-1000 bg-blue-200 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute bg-purple-200 rounded-full -bottom-8 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 border border-green-200 rounded-full bg-white/80 backdrop-blur-sm">
              Get In Touch
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Let's Start Your
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                Translation Journey
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              Ready to break language barriers? Our expert team is here to help
              you communicate effectively across cultures. Get in touch and
              let's discuss your project.
            </p>

            {/* Contact Method Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveContact("form")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "form"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveContact("direct")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "direct"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                Direct Contact
              </button>
              <button
                onClick={() => setActiveContact("offices")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  activeContact === "offices"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white/90"
                }`}
              >
                Our Offices
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
                >
                  <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 md:text-3xl ">
                    Send Us a Message
                  </h2>

                  {/* Feedback messages (place above <form> */}
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
                        <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full Name *"
                          required
                          className="w-full py-4 pl-12 pr-4 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address *"
                          required
                          className="w-full py-4 pl-12 pr-4 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="relative">
                        <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                          className="w-full py-4 pl-12 pr-4 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <Building className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Company Name"
                          className="w-full py-4 pl-12 pr-4 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Globe className="absolute w-5 h-5 text-gray-400 left-4 top-6" />
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full py-4 pl-12 pr-4 transition-all bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select a Service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Clock className="absolute w-5 h-5 text-gray-400 left-4 top-6" />
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full py-4 pl-12 pr-4 transition-all bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="standard">Standard (48-72 hours)</option>
                        <option value="rush">Rush (24-48 hours)</option>
                        <option value="urgent">Urgent (Same day)</option>
                      </select>
                    </div>

                    <div className="relative">
                      <FileText className="absolute w-5 h-5 text-gray-400 left-4 top-4" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project..."
                        rows="5"
                        className="w-full py-4 pl-12 pr-4 transition-all border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {loading ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              {/* Support Features */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="sticky top-8"
                >
                  <div className="p-8 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                      What to Expect
                    </h3>

                    <div className="space-y-6">
                      {supportFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white shadow-sm rounded-xl">
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
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Free Consultation
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Get expert advice on your translation needs at no cost.
                        We'll help you choose the right service for your
                        project.
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
                Choose Your Preferred Contact Method
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Get in touch through your preferred channel. Our team is ready
                to assist you with expert translation services.
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
                  {/* Consistent card dimensions */}
                  <div className="flex flex-col p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl h-90 rounded-3xl hover:shadow-2xl group-hover:scale-105">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 ${method.iconBg} py-2 md:py-6 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {method.icon}
                    </div>

                    {/* Content - Flex grow to fill space evenly */}
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
                          <span className="text-gray-500">Available:</span>
                          <span className="font-medium text-gray-900">
                            {method.availability}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Response:</span>
                          <span className="font-medium text-green-600">
                            {method.response}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background gradient effect */}
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
                Visit Our Offices
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Meet our team in person at any of our conveniently located
                offices across Nigeria. We're always happy to discuss your
                translation needs face-to-face.
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
                  {/* Consistent card dimensions */}
                  <div
                    className={`h-96 p-8 bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 flex flex-col ${
                      office.isMain
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Header with badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                            office.isMain ? "bg-green-600" : "bg-gray-600"
                          }`}
                        >
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {office.city}
                          </h3>
                          {office.isMain && (
                            <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full">
                              Main Office
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content - Flex grow to fill space evenly */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            Address
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {office.fullAddress}
                          </p>
                        </div>

                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            Business Hours
                          </h4>
                          <p className="text-sm text-gray-600">
                            {office.hours}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3 border-t border-gray-200">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-green-600" />
                          <span className="font-medium text-gray-900">
                            {office.phone}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-green-600" />
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
              <div className="inline-flex items-center px-6 py-3 border border-blue-200 bg-blue-50 rounded-xl">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Schedule a meeting in advance for personalized consultation
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
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              Don't wait - get your free quote today and join thousands of
              satisfied clients who trust ILI-Nigeria for their translation
              needs.
            </p>
            {/* Consistent CTA button width */}
            <div className="flex flex-col justify-center max-w-2xl gap-6 mx-auto sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className="inline-flex items-center justify-center flex-1 px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveContact("form")}
                className="inline-flex items-center justify-center flex-1 px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500"
              >
                Send Message
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
