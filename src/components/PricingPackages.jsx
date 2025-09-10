import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Zap,
  Crown,
  CheckCircle,
  ArrowRight,
  Calculator,
  Clock,
  Award,
  Shield,
} from "lucide-react";

export default function PricingPackages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("per-word");

  const packages = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      name: "Standard",
      subtitle: "For everyday translation needs",
      pricePerWord: "₦25",
      pricePerPage: "₦8,500",
      turnaround: "48-72 hours",
      features: [
        "Professional translation",
        "Basic quality check",
        "Email support",
        "Standard delivery",
      ],
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      popular: false,
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      name: "Professional",
      subtitle: "Most popular choice",
      pricePerWord: "₦35",
      pricePerPage: "₦12,000",
      turnaround: "24-48 hours",
      features: [
        "Certified translator",
        "2-step quality review",
        "Priority support",
        "Rush delivery available",
        "Revision included",
      ],
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      popular: true,
    },
    {
      icon: <Crown className="w-8 h-8 text-purple-600" />,
      name: "Premium",
      subtitle: "For critical documents",
      pricePerWord: "₦50",
      pricePerPage: "₦18,000",
      turnaround: "12-24 hours",
      features: [
        "Expert specialist",
        "3-step quality review",
        "Dedicated manager",
        "Same-day delivery",
        "Unlimited revisions",
        "Certification included",
      ],
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      popular: false,
    },
  ];

  const calculatorInputs = [
    { label: "Word Count", placeholder: "e.g., 1000", key: "words" },
    { label: "Pages", placeholder: "e.g., 5", key: "pages" },
  ];

  const handleGetQuote = (packageName) => {
    navigate("/quote", { state: { selectedPackage: packageName } });
  };

  return (
    <section className="px-6 py-16 bg-white md:px-20">
      {/* Section Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
        <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          Transparent Pricing
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Simple, Fair Pricing
        </h2>
        <p className="text-gray-600">
          Choose the package that fits your needs. All prices in Nigerian Naira.
        </p>
      </motion.div>

      {/* Pricing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center mb-8"
      >
        <div className="p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab("per-word")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "per-word"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Per Word
          </button>
          <button
            onClick={() => setActiveTab("per-page")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "per-page"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Per Page
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto mb-12 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative p-6 border-2 rounded-xl shadow-md transition-all duration-300 ${pkg.borderColor} ${pkg.bgColor} hover:shadow-lg hover:scale-105`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute transform -translate-x-1/2 -top-3 left-1/2">
                <span className="px-4 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md">
                {pkg.icon}
              </div>
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="mb-1 text-xl font-bold text-gray-900">
                {pkg.name}
              </h3>
              <p className="mb-4 text-sm text-gray-600">{pkg.subtitle}</p>

              {/* Price */}
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {activeTab === "per-word"
                    ? pkg.pricePerWord
                    : pkg.pricePerPage}
                </span>
                <span className="ml-1 text-gray-600">
                  /{activeTab === "per-word" ? "word" : "page"}
                </span>
              </div>

              {/* Turnaround */}
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1 text-green-600" />
                {pkg.turnaround}
              </div>
            </div>

            {/* Features */}
            <ul className="mb-6 space-y-2">
              {pkg.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-sm text-gray-700"
                >
                  <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleGetQuote(pkg.name)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                pkg.popular
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              Choose {pkg.name}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6 mr-2 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Quick Price Estimate
            </h3>
          </div>
          <p className="mb-4 text-sm text-center text-gray-600">
            Get an instant estimate for your project
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/quote")}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              Calculate Price
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center justify-center p-4 rounded-lg bg-blue-50">
            <Shield className="w-6 h-6 mr-3 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Money-back Guarantee
            </span>
          </div>
          <div className="flex items-center justify-center p-4 rounded-lg bg-green-50">
            <Award className="w-6 h-6 mr-3 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Certified Quality
            </span>
          </div>
          <div className="flex items-center justify-center p-4 rounded-lg bg-purple-50">
            <Clock className="w-6 h-6 mr-3 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              On-time Delivery
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
