import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Globe,
  Star,
} from "lucide-react";

export default function ContactGetStarted() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: "WhatsApp Chat",
      description: "Instant response via WhatsApp",
      detail: "+234 803 123 4567",
      action: "Chat Now",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
      available: "24/7 Available",
    },
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      detail: "+234 1 234 5678",
      action: "Call Now",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
      available: "Mon-Fri 8AM-6PM",
    },
    {
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: "Email Support",
      description: "Detailed project discussions",
      detail: "hello@ili-nigeria.com",
      action: "Send Email",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
      available: "24hr Response",
    },
  ];

  const quickStats = [
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      label: "Expert Team",
      value: "50+",
      bgColor: "bg-green-50",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      label: "Fast Delivery",
      value: "24hrs",
      bgColor: "bg-amber-50",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      label: "Accuracy Rate",
      value: "99.8%",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-600" />,
      label: "Languages",
      value: "50+",
      bgColor: "bg-emerald-50",
    },
  ];

  const offices = [
    {
      city: "Lagos",
      address: "Victoria Island, Lagos State",
      isMain: true,
      hours: "Mon-Fri 8AM-6PM",
    },
    {
      city: "Abuja",
      address: "Central Business District, FCT",
      isMain: false,
      hours: "Mon-Fri 9AM-5PM",
    },
    {
      city: "Port Harcourt",
      address: "GRA Phase 2, Rivers State",
      isMain: false,
      hours: "Mon-Fri 9AM-5PM",
    },
  ];

  const handleQuickQuote = () => {
    navigate("/quote");
  };

  const handleContactPage = () => {
    navigate("/contact");
  };

  return (
    <section className="px-6 py-20 bg-gray-50 md:px-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          Get Started Today
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Ready to Break Language Barriers?
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          Join thousands of satisfied clients who trust ILI-Nigeria for their
          global communication needs
        </p>
      </motion.div>

      {/* Contact Methods */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
            Choose Your Preferred Contact Method
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${method.borderColor} hover:shadow-xl hover:scale-105 group cursor-pointer`}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 mb-6 rounded-2xl ${method.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {method.icon}
                </div>

                {/* Content */}
                <h4 className="mb-3 text-xl font-bold text-gray-900">
                  {method.title}
                </h4>
                <p className="mb-4 text-gray-600">{method.description}</p>
                <p className="mb-4 text-lg font-semibold text-green-600">
                  {method.detail}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {method.available}
                  </span>
                  <div className="flex items-center font-medium text-green-600 transition-transform group-hover:translate-x-2">
                    {method.action}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4"
        >
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 ${stat.bgColor} rounded-2xl text-center shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left - Office Locations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl"
          >
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 mr-4 bg-green-100 rounded-2xl">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Our Locations
                </h3>
                <p className="text-gray-600">Visit us at any of our offices</p>
              </div>
            </div>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {office.city}
                      </h4>
                      {office.isMain && (
                        <span className="px-3 py-1 ml-3 text-xs font-medium text-white bg-green-600 rounded-full">
                          Main Office
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-gray-600">{office.address}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {office.hours}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 mt-8 bg-green-50 rounded-xl">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  Emergency support available 24/7
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Quick Quote Card */}
            <div className="p-8 text-white shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 mr-4 bg-white bg-opacity-20 rounded-2xl">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Need a Quick Quote?</h3>
                  <p className="text-green-100">
                    Upload your document and get pricing in minutes
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickQuote}
                  className="inline-flex items-center justify-center flex-1 px-6 py-4 font-semibold text-green-600 transition-colors bg-white rounded-xl hover:bg-gray-100"
                >
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactPage}
                  className="inline-flex items-center justify-center flex-1 px-6 py-4 font-semibold text-orange-600 transition-all duration-300 bg-white border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
                >
                  Full Contact Form
                </motion.button>
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Why Choose ILI-Nigeria
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  <span className="text-gray-700">
                    Certified translators and linguists
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  <span className="text-gray-700">
                    24-48 hour turnaround time
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  <span className="text-gray-700">
                    99.8% accuracy guarantee
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  <span className="text-gray-700">
                    Competitive Nigerian pricing
                  </span>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="p-8 border-2 border-blue-200 bg-blue-50 rounded-2xl">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 mr-3 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">
                    8:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">
                    9:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
        <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-2xl md:p-12">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Start Your Translation Project Today
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-gray-600">
            Join over 5,000+ satisfied clients who trust ILI-Nigeria for
            accurate, fast, and culturally-sensitive translation services.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickQuote}
              className="inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-green-600 shadow-lg rounded-xl hover:bg-green-700"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContactPage}
              className="inline-flex items-center px-8 py-4 font-semibold text-orange-600 transition-all duration-300 bg-white border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
