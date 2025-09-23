import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Award,
  Shield,
  CheckCircle,
  Send,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Our Services", path: "/services" },
    { name: "Languages", path: "/languages" },
    { name: "Get Quote", path: "/quote" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Document Translation", path: "/services" },
    { name: "Website Localization", path: "/services" },
    { name: "Live Interpretation", path: "/services" },
    { name: "Certified Translation", path: "/services" },
  ];

  const industries = [
    { name: "Legal & Immigration", path: "/services" },
    { name: "Medical & Healthcare", path: "/services" },
    { name: "Business & Finance", path: "/services" },
    { name: "Educational Institutions", path: "/services" },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "#" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "#" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "#" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", url: "#" },
  ];

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="overflow-hidden bg-green-600 rounded-t-xl md:rounded-t-none">
      {/* Newsletter Section */}
      <div className="px-6 py-12 bg-green-700 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="mb-4 text-2xl font-bold text-white">
              Stay Updated with Translation Insights
            </h3>
            <p className="max-w-2xl mx-auto mb-8 text-green-100">
              Get expert tips, industry news, and special offers delivered to
              your inbox. Join 5,000+ professionals who trust our insights.
            </p>
            <div className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-8 py-4 font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                <Send className="w-5 h-5 mr-2" />
                Subscribe
              </motion.button>
            </div>
            <p className="mt-4 text-sm text-green-200">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 py-16 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Company Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg">
                    <Globe className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">ILI-Nigeria</h2>
                </div>

                <p className="mb-8 leading-relaxed text-green-100">
                  Nigeria's premier translation and interpretation service.
                  Breaking language barriers and building global connections
                  since 2010.
                </p>

                {/* Contact Information */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center text-green-100">
                    <Phone className="w-5 h-5 mr-3 text-white" />
                    <div>
                      <p className="font-semibold">+234 1 234 5678</p>
                      <p className="text-sm text-green-200">Main Office Line</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-100">
                    <Mail className="w-5 h-5 mr-3 text-white" />
                    <div>
                      <p className="font-semibold">hello@ili-nigeria.com</p>
                      <p className="text-sm text-green-200">24-hour response</p>
                    </div>
                  </div>
                  <div className="flex items-start text-green-100">
                    <MapPin className="w-5 h-5 mt-1 mr-3 text-white" />
                    <div>
                      <p className="font-semibold">Victoria Island, Lagos</p>
                      <p className="text-sm text-green-200">
                        Lagos State, Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="mb-4 font-semibold text-white">
                    Connect With Us
                  </h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-12 h-12 text-white transition-colors bg-green-700 rounded-lg shadow-lg hover:bg-orange-500"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => handleLinkClick(link.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group"
                        >
                          <ArrowRight className="w-4 h-4 mr-2 transition-opacity opacity-0 group-hover:opacity-100" />
                          {link.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Our Services
                  </h3>
                  <ul className="space-y-3">
                    {services.map((service, index) => (
                      <li key={index}>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => handleLinkClick(service.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group"
                        >
                          <ArrowRight className="w-4 h-4 mr-2 transition-opacity opacity-0 group-hover:opacity-100" />
                          {service.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Industries */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="mb-6 text-xl font-bold text-white">
                    Industries
                  </h3>
                  <ul className="space-y-3">
                    {industries.map((industry, index) => (
                      <li key={index}>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => handleLinkClick(industry.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group"
                        >
                          <ArrowRight className="w-4 h-4 mr-2 transition-opacity opacity-0 group-hover:opacity-100" />
                          {industry.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Business Hours & Certifications */}
              <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2">
                {/* Business Hours */}
                <div className="p-6 bg-green-700 bg-opacity-50 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 mr-3 text-orange-400" />
                    <h4 className="text-lg font-bold text-white">
                      Business Hours
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Monday - Friday</span>
                      <span className="font-semibold text-white">
                        8:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Saturday</span>
                      <span className="font-semibold text-white">
                        9:00 AM - 2:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Sunday</span>
                      <span className="text-green-300">Closed</span>
                    </div>
                    <div className="pt-3 mt-4 border-t border-green-500">
                      <div className="flex items-center text-orange-300">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Emergency support available 24/7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="p-6 bg-green-700 bg-opacity-50 rounded-2xl">
                  <h4 className="flex items-center mb-4 text-lg font-bold text-white">
                    <Award className="w-6 h-6 mr-3 text-orange-400" />
                    Our Certifications
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-amber-100">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium text-white">
                        ISO 17100 Certified
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-white">
                        GDPR Compliant
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-white">
                        ISO 27001 Security
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 py-6 bg-green-800 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Copyright */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-green-600 rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-green-100">
                © 2025 ILI-Nigeria. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6">
              <button className="font-medium text-green-100 transition-colors hover:text-white">
                Privacy Policy
              </button>
              <span className="text-green-400">•</span>
              <button className="font-medium text-green-100 transition-colors hover:text-white">
                Terms of Service
              </button>
              <span className="text-green-400">•</span>
              <button className="font-medium text-green-100 transition-colors hover:text-white">
                Cookie Policy
              </button>
            </div>

            {/* Language/Region */}
            <div className="flex items-center px-4 py-2 bg-green-700 rounded-lg">
              <MapPin className="w-4 h-4 mr-2 text-white" />
              <span className="font-medium text-white">Nigeria</span>
              <span className="mx-3 text-green-300">•</span>
              <span className="font-medium text-white">English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
