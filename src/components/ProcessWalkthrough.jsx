import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Search,
  FileText,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Award,
} from "lucide-react";

export default function ProcessWalkthrough() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: "Upload & Quote",
      description: "Send your document and get instant quote",
      details: "Free quote in 30 minutes",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      number: "01",
    },
    {
      icon: <Search className="w-8 h-8 text-purple-600" />,
      title: "Expert Assignment",
      description: "Certified translator matched to your project",
      details: "Industry specialist selected",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      number: "02",
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Translation & Review",
      description: "Professional translation with quality checks",
      details: "3-step review process",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      number: "03",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Delivery & Support",
      description: "Final document with ongoing support",
      details: "24/7 customer service",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      number: "04",
    },
  ];

  const features = [
    {
      icon: <Clock className="w-5 h-5 text-green-600" />,
      text: "24-48 hour delivery",
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      text: "100% confidential",
    },
    {
      icon: <Award className="w-5 h-5 text-green-600" />,
      text: "Certified quality",
    },
  ];

  const handleGetStarted = () => {
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
          How It Works
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Simple 4-Step Process
        </h2>
        <p className="text-gray-600">
          From upload to delivery - professional translation made easy
        </p>
      </motion.div>

      {/* Process Steps - Streamlined */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
            >
              {/* Step Number */}
              <div className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full -top-3 -right-3">
                {step.number}
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 mb-4 rounded-xl ${step.iconBg} flex items-center justify-center`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mb-2 text-sm text-gray-600">{step.description}</p>
              <p className="text-xs font-medium text-green-600">
                {step.details}
              </p>

              {/* Connector Arrow (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="absolute hidden transform -translate-y-1/2 lg:block -right-3 top-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Bar - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white shadow-md rounded-xl md:flex-row">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              {feature.icon}
              <span className="ml-2 font-medium text-gray-700">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA - Simple */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="p-8 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
          <h3 className="mb-4 text-2xl font-bold text-white">
            Ready to Get Started?
          </h3>
          <p className="mb-6 text-green-100">
            Upload your document now and get a free quote in minutes
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
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
