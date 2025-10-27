import React, { useState } from "react";
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
  Award,
  Shield,
  CheckCircle,
  Send,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    {
      icon: <Facebook className="w-5 h-5" />,
      name: "Facebook",
      url: "https://m.facebook.com/zoovyarnMA/",
    },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "#" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "#" },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      name: "MessageCircle",
      url: "https://www.facebook.com/share/p/1MhSGUpwDz/",
    },
  ];

  const handleLinkClick = (path) => {

    console.log(`Navigate to: ${path}`);
  };

  const handleSubscribe = async (e) => {
  e.preventDefault();
  setMessage("");
  setIsLoading(true);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") {
    setMessage(" Please enter an email address");
    setIsLoading(false);
    return;
  }
  if (!emailRegex.test(email)) {
    setMessage("Please enter a valid email address");
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch("https://ilin-backend.onrender.com/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Thanks for subscribing!");
      setEmail("");
    } else {
      setMessage(`${data.message || "Failed to subscribe"}`);
    }
  } catch (error) {
    setMessage("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <footer className="overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-t-xl md:rounded-t-none">
      {/* Newsletter Section */}
      <div className="relative px-6 py-16 bg-gradient-to-r from-green-700 to-green-600 md:px-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-white shadow-xl rounded-2xl">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="mb-4 text-3xl font-bold text-white">
              Stay Updated with Translation Insights
            </h3>
            <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-green-100">
              Get expert tips, industry news, and special offers delivered to
              your inbox. Join 5,000+ professionals who trust our insights.
            </p>
            <div className="flex flex-col max-w-lg gap-4 mx-auto sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white shadow-lg rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50"
                required
              />
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="w-5 h-5 mr-2" />
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {message && (
              <p
                className={`mt-6 text-lg font-medium ${
                  message.includes("✅") ? "text-green-200" : "text-red-300"
                }`}
              >
                {message}
              </p>
            )}
            <p className="mt-6 text-sm text-green-200">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 py-20 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Company Information */}
            <div className="lg:col-span-1">
              <div>
                {/* Logo */}
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center mr-4 bg-white shadow-lg w-14 h-14 rounded-xl">
                    <Globe className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">ILI Nigeria</h2>
                </div>

                <p className="mb-8 text-lg leading-relaxed text-green-100">
                  Nigeria's premier translation and interpretation service.
                  Breaking language barriers and building global connections
                  since 2010.
                </p>

                {/* Contact Information */}
                <div className="mb-8 space-y-6">
                  <a
                    href="tel:+23481067382"
                    className="flex items-center text-green-100 transition-all duration-300 hover:text-white group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-green-700 rounded-xl group-hover:bg-orange-500">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        +234 810 906 7382
                      </p>
                      <p className="text-sm text-green-200">
                        24/7 Support Line
                      </p>
                    </div>
                  </a>
                  <a
                    href="mailto:official.intlng@gmail.com"
                    className="flex items-center text-green-100 transition-all duration-300 hover:text-white group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-300 bg-green-700 rounded-xl group-hover:bg-orange-500">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        official.intlng@gmail.com
                      </p>
                      <p className="text-sm text-green-200">
                        Quick response guaranteed
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start text-green-100">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-700 rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Itamerin, Ago-Iwoye
                      </p>
                      <p className="text-sm text-green-200">
                        Ogun, Nigeria 100001
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="mb-6 text-xl font-semibold text-white">
                    Connect With Us
                  </h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 bg-green-700 shadow-lg rounded-xl hover:bg-orange-500 hover:shadow-xl hover:scale-110 hover:-translate-y-1"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {/* Quick Links */}
                <div>
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Quick Links
                  </h3>
                  <ul className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleLinkClick(link.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group hover:translate-x-2"
                        >
                          <ArrowRight className="hidden w-5 h-5 mr-3 text-orange-400 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:flex" />
                          <span className="font-medium">{link.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div>
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Our Services
                  </h3>
                  <ul className="space-y-4">
                    {services.map((service, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleLinkClick(service.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group hover:translate-x-2"
                        >
                          <ArrowRight className="hidden w-5 h-5 mr-3 text-orange-400 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:flex" />
                          <span className="font-medium">{service.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Industries We Serve
                  </h3>
                  <ul className="space-y-4">
                    {industries.map((industry, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleLinkClick(industry.path)}
                          className="flex items-center text-green-100 transition-all duration-300 hover:text-white group hover:translate-x-2"
                        >
                          <ArrowRight className="hidden w-5 h-5 mr-3 text-orange-400 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:flex" />
                          <span className="font-medium">{industry.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Business Hours & Certifications */}
              <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2">
                {/* Business Hours */}
                <div className="p-8 border shadow-xl bg-gradient-to-br from-green-700 to-green-800 rounded-2xl border-green-500/20">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-orange-500 rounded-xl">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Business Hours
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-100">
                        Monday - Friday
                      </span>
                      <span className="font-bold text-white">
                        8:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-100">
                        Saturday
                      </span>
                      <span className="font-bold text-white">
                        9:00 AM - 3:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-100">Sunday</span>
                      <span className="font-bold text-orange-300">Closed</span>
                    </div>
                    <div className="pt-4 mt-6 border-t border-green-500/30">
                      <div className="flex items-center text-orange-300">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span className="font-medium">
                          Emergency support available 24/7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="p-8 border shadow-xl bg-gradient-to-br from-green-700 to-green-800 rounded-2xl border-green-500/20">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-orange-500 rounded-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Our Certifications
                    </h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 shadow-lg rounded-xl bg-amber-100">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                      <span className="text-lg font-semibold text-white">
                        ISO 17100 Certified
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 shadow-lg rounded-xl">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-lg font-semibold text-white">
                        GDPR Compliant
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-100 shadow-lg rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-lg font-semibold text-white">
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
      <div className="px-6 py-8 border-t bg-gradient-to-r from-green-800 to-green-900 border-green-600/30 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Copyright */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-600 shadow-lg rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-semibold text-green-100">
                © 2025 ILI Nigeria. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-8">
              <button className="text-lg font-semibold text-green-100 transition-colors hover:text-white">
                Privacy Policy
              </button>
              <span className="text-2xl text-green-400">•</span>
              <button className="text-lg font-semibold text-green-100 transition-colors hover:text-white">
                Terms of Service
              </button>
              <span className="text-2xl text-green-400">•</span>
              <button className="text-lg font-semibold text-green-100 transition-colors hover:text-white">
                Cookie Policy
              </button>
            </div>

            {/* Language/Region */}
            <div className="flex items-center px-6 py-3 bg-green-700 shadow-lg rounded-xl">
              <MapPin className="w-5 h-5 mr-3 text-white" />
              <span className="font-semibold text-white">Nigeria</span>
              <span className="mx-4 text-xl text-green-300">•</span>
              <span className="font-semibold text-white">English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
