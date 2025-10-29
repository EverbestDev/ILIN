import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ArrowLeft,
} from "lucide-react";

export default function PricingPackages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("per-word");
  const isRtl = i18n.language === "ar";

  // Data structure mapped from JSON keys
  const packageKeys = ["standard", "professional", "premium"];
  const iconMap = {
    standard: <FileText className="w-8 h-8 text-blue-600" />,
    professional: <Zap className="w-8 h-8 text-green-600" />,
    premium: <Crown className="w-8 h-8 text-purple-600" />,
  };

  // Mapping package data
  const packages = packageKeys.map((key) => {
    const pkg = {
      key: key,
      icon: iconMap[key],
      // Name is now purely translated
      name: t(`pricing.packages.${key}.name`),
      subtitle: t(`pricing.packages.${key}.subtitle`),
      pricePerWord: t(`pricing.packages.${key}.pricePerWord`),
      pricePerPage: t(`pricing.packages.${key}.pricePerPage`),
      turnaround: t(`pricing.packages.${key}.turnaround`),
      features: t(`pricing.packages.${key}.features`, { returnObjects: true }),
      popular: key === "professional",
    };

    // Set colors based on the key (recreating the original logic)
    if (key === "standard") {
      pkg.bgColor = "bg-white";
      pkg.borderColor = "border-gray-200";
    } else if (key === "professional") {
      pkg.bgColor = "bg-green-50";
      pkg.borderColor = "border-green-200";
    } else {
      // premium
      pkg.bgColor = "bg-purple-50";
      pkg.borderColor = "border-purple-200";
    }
    return pkg;
  });

  // Features Bar data structure mapped from JSON keys
  const trustKeys = ["guarantee", "quality", "delivery"];
  const trustIconMap = {
    guarantee: <Shield className="w-6 h-6 text-blue-600" />,
    quality: <Award className="w-6 h-6 text-green-600" />,
    delivery: <Clock className="w-6 h-6 text-purple-600" />,
  };
  const trustBgMap = {
    guarantee: "bg-blue-50",
    quality: "bg-green-50",
    delivery: "bg-purple-50",
  };
  const trustIndicators = trustKeys.map((key) => ({
    icon: trustIconMap[key],
    text: t(`pricing.trustIndicators.${key}`),
    bgColor: trustBgMap[key],
  }));

  const handleGetQuote = (packageName) => {
    navigate("/quote", { state: { selectedPackage: packageName } });
  };

  // Helper functions for RTL styling
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const marginStart = isRtl ? "ms-2" : "mr-2";
  const marginEnd = isRtl ? "me-2" : "ml-2";

  // Helper function for the Price Tag's "per word/page"
  const getPriceUnit = () => {
    // Use the unit key to pull the fully translated unit from JSON
    return t(`pricing.units.${activeTab === "per-word" ? "word" : "page"}`);
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
          {t("pricing.header.badge")}
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {t("pricing.header.title")}
        </h2>
        <p className="text-gray-600">{t("pricing.header.description")}</p>
      </motion.div>

      {/* Pricing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center mb-8"
        dir={isRtl ? "rtl" : "ltr"}
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
            {t("pricing.toggle.perWord")}
          </button>
          <button
            onClick={() => setActiveTab("per-page")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "per-page"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("pricing.toggle.perPage")}
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
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute transform -translate-x-1/2 -top-3 left-1/2">
                <span className="px-4 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  {t("pricing.popularBadge")}
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
                <span className={`${marginStart} text-gray-600`}>
                  / {getPriceUnit()} {/* Unit is now fully translated */}
                </span>
              </div>

              {/* Turnaround */}
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className={`w-4 h-4 ${marginStart} text-green-600`} />
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
                  <CheckCircle
                    className={`flex-shrink-0 w-4 h-4 ${marginStart} text-green-500`}
                  />
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
              {t("pricing.chooseButton", { packageName: pkg.name })}
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
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <Calculator className={`w-6 h-6 ${marginStart} text-green-600`} />
            <h3 className="text-lg font-bold text-gray-900">
              {t("pricing.calculator.title")}
            </h3>
          </div>
          <p className="mb-4 text-sm text-center text-gray-600">
            {t("pricing.calculator.description")}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/quote")}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              {t("pricing.calculator.button")}
              <ArrowIcon className={`w-5 h-5 ${marginEnd}`} />
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
          {trustIndicators.map((trust, index) => (
            <div
              key={index}
              className={`flex items-center justify-center p-4 rounded-lg ${trust.bgColor}`}
            >
              <div
                className={`flex items-center ${
                  isRtl ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span
                  className={`${marginStart} text-sm font-medium text-gray-700`}
                >
                  {trust.text}
                </span>
                {trust.icon}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
