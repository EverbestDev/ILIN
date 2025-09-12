import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Shield,
  Zap,
  Eye,
  Cloud,
  Lock,
  ArrowRight,
  CheckCircle,
  Monitor,
  Database,
  Globe,
  Award,
} from "lucide-react";

export default function TechnologyTools() {
  const navigate = useNavigate();

  const technologies = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered CAT Tools",
      description:
        "Advanced Computer-Assisted Translation tools for consistency and speed",
      features: [
        "Translation Memory",
        "Terminology Database",
        "Quality Assurance",
        "Real-time Collaboration",
      ],
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Security & Encryption",
      description: "Bank-level security protecting your confidential documents",
      features: [
        "256-bit SSL Encryption",
        "Secure File Transfer",
        "NDA Compliance",
        "GDPR Compliant",
      ],
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Quality Assurance",
      description: "Multi-layered quality checks ensuring perfect translations",
      features: [
        "Automated QA Checks",
        "Human Review",
        "Consistency Verification",
        "Final Proofreading",
      ],
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      icon: <Monitor className="w-8 h-8 text-orange-600" />,
      title: "Project Management",
      description:
        "Real-time tracking and communication throughout your project",
      features: [
        "Live Progress Updates",
        "Client Portal Access",
        "24/7 Support Chat",
        "Delivery Notifications",
      ],
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  const tools = [
    { name: "SDL Trados Studio", type: "CAT Tool", icon: "🔧" },
    { name: "MemoQ", type: "Translation Memory", icon: "💾" },
    { name: "Wordfast", type: "Productivity Suite", icon: "⚡" },
    { name: "Phrase", type: "Localization Platform", icon: "🌐" },
    { name: "XTM Cloud", type: "Project Management", icon: "☁️" },
    { name: "Verifika", type: "Quality Assurance", icon: "✅" },
  ];

  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5 text-green-600" />,
      text: "End-to-end encryption",
    },
    {
      icon: <Database className="w-5 h-5 text-green-600" />,
      text: "Secure cloud storage",
    },
    {
      icon: <Award className="w-5 h-5 text-green-600" />,
      text: "ISO 27001 certified",
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      text: "GDPR compliant",
    },
  ];

  const handleGetQuote = () => {
    navigate("/quote");
  };

  return (
    <section className="px-6 py-16 bg-gray-50 md:px-20">
      {/* Section Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
        <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          Technology & Tools
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Cutting-Edge Translation Technology
        </h2>
        <p className="text-gray-600">
          Advanced tools and AI-powered systems ensuring faster delivery and
          higher quality
        </p>
      </motion.div>

      {/* Main Technologies */}
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto mb-16 md:grid-cols-2 lg:grid-cols-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-6 bg-white border-2 rounded-xl shadow-md transition-all duration-300 ${tech.borderColor} hover:shadow-lg hover:scale-105`}
          >
            {/* Icon */}
            <div
              className={`w-16 h-16 mb-4 rounded-xl ${tech.iconBg} flex items-center justify-center`}
            >
              {tech.icon}
            </div>

            {/* Content */}
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              {tech.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600">{tech.description}</p>

            {/* Features */}
            <ul className="space-y-2">
              {tech.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-xs text-gray-700"
                >
                  <CheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Tools We Use */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
        <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
          Professional Tools We Use
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 text-center transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="mb-2 text-2xl">{tool.icon}</div>
              <h4 className="mb-1 text-sm font-semibold text-gray-900">
                {tool.name}
              </h4>
              <p className="text-xs text-gray-600">{tool.type}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <div className="mb-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Security & Confidentiality
            </h3>
            <p className="text-gray-600">
              Your documents are protected with enterprise-grade security
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-3 rounded-lg bg-green-50"
              >
                {feature.icon}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">50%</h3>
            <p className="text-gray-600">Faster delivery with CAT tools</p>
          </div>
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <Eye className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">99.8%</h3>
            <p className="text-gray-600">Quality accuracy rate</p>
          </div>
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <Cloud className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900">100%</h3>
            <p className="text-gray-600">Secure file handling</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="p-8 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
          <Globe className="w-12 h-12 mx-auto mb-4 text-white" />
          <h3 className="mb-4 text-xl font-bold text-white">
            Experience the Technology Advantage
          </h3>
          <p className="mb-6 text-green-100">
            Let our advanced tools and expert team deliver superior translations
            for your project
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetQuote}
            className="inline-flex items-center px-8 py-3 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
