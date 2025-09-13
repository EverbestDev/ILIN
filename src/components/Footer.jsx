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
  ArrowRight,
  Award,
  Shield,
  CheckCircle,
  ExternalLink,
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
    { name: "Business Solutions", path: "/services" },
  ];

  const industries = [
    { name: "Legal & Immigration", path: "/services" },
    { name: "Medical & Healthcare", path: "/services" },
    { name: "Business & Finance", path: "/services" },
    { name: "Education", path: "/services" },
    { name: "Government", path: "/services" },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      name: "Facebook",
      url: "https://www.facebook.com/share/1FDihmFcBU/",
    },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "#" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "#" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", url: "#" },
  ];

  const certifications = [
    { name: "ISO 17100 Certified", icon: <Award className="w-4 h-4" /> },
    { name: "GDPR Compliant", icon: <Shield className="w-4 h-4" /> },
    { name: "ISO 27001 Security", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="text-white bg-gradient-to-b from-green-900 to-green-950">
      {/* Main Footer Content */}
      <div className="px-6 py-16 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="mb-6">
                <h2 className="mb-4 text-2xl font-bold text-green-400">
                  ILI-Nigeria
                </h2>
                <p className="mb-6 leading-relaxed text-gray-300">
                  Nigeria's premier translation and interpretation service.
                  Breaking language barriers and building global connections
                  since 2010.
                </p>
              </div>

              {/* Contact Info */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-green-400" />
                  <span>+234 1 234 5678</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-green-400" />
                  <span>hello@ili-nigeria.com</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <MapPin className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-green-400" />
                  <span>Victoria Island, Lagos State, Nigeria</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-green-400" />
                  <span>Mon-Fri 8AM-6PM WAT</span>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="mb-3 text-sm text-gray-400">Follow Us</p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 transition-colors bg-gray-800 rounded-lg hover:text-green-400 hover:bg-gray-700"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className="flex items-center text-gray-300 transition-colors hover:text-green-400 group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 transition-all transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.name}
                    </button>
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
              <h3 className="mb-6 text-lg font-semibold text-white">
                Our Services
              </h3>
              <ul className="mb-8 space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(service.path)}
                      className="flex items-center text-gray-300 transition-colors hover:text-green-400 group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 transition-all transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-400">
                  Industries We Serve
                </h4>
                <ul className="space-y-2">
                  {industries.slice(0, 3).map((industry, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      {industry.name}
                    </li>
                  ))}
                  <li className="text-sm text-gray-500">+ 5 more industries</li>
                </ul>
              </div>
            </motion.div>

            {/* Newsletter & Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">
                Stay Updated
              </h3>
              <p className="mb-4 text-sm text-gray-300">
                Get translation tips and industry updates delivered to your
                inbox.
              </p>

              <div className="mb-8">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 transition-colors bg-green-600 rounded-r-lg hover:bg-green-700"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-400">
                  Certifications
                </h4>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <div className="flex items-center justify-center w-6 h-6 mr-3 bg-green-600 rounded bg-opacity-20">
                        {cert.icon}
                      </div>
                      {cert.name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="px-6 py-6 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between md:flex-row">
              {/* Copyright */}
              <div className="flex items-center mb-4 md:mb-0">
                <Globe className="w-5 h-5 mr-2 text-green-400" />
                <p className="text-sm text-gray-400">
                  © 2024 ILI-Nigeria. All rights reserved.
                </p>
              </div>

              {/* Legal Links */}
              <div className="flex items-center mb-4 space-x-6 md:mb-0">
                <button className="text-sm text-gray-400 transition-colors hover:text-green-400">
                  Privacy Policy
                </button>
                <button className="text-sm text-gray-400 transition-colors hover:text-green-400">
                  Terms of Service
                </button>
                <button className="text-sm text-gray-400 transition-colors hover:text-green-400">
                  Cookie Policy
                </button>
              </div>

              {/* Language/Region */}
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Nigeria</span>
                <span className="mx-2">•</span>
                <span>English</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-6 mt-6 border-t border-gray-800">
              <div className="text-center">
                <p className="max-w-4xl mx-auto text-xs leading-relaxed text-gray-500">
                  ILI-Nigeria is a registered translation and interpretation
                  company in Nigeria. We provide professional language services
                  across Africa and internationally. All translations are
                  performed by certified linguists and subject matter experts.
                  <span className="block mt-2">
                    RC Number: 123456789 • Licensed by the Corporate Affairs
                    Commission, Nigeria
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
