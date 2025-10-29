import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- ADDED
import {
  Upload,
  Search,
  FileText,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Award,
  ArrowLeft, // Added for RTL consistency
} from "lucide-react";

export default function ProcessWalkthrough() {
  const { t, i18n } = useTranslation(); // <-- ADDED
  const navigate = useNavigate();

  const isRtl = i18n.language === "ar";

  // Data structure mapped from JSON keys
  const stepKeys = ["upload", "assignment", "translation", "delivery"];

  const iconMap = {
    upload: <Upload className="w-8 h-8 text-blue-600" />,
    assignment: <Search className="w-8 h-8 text-purple-600" />,
    translation: <FileText className="w-8 h-8 text-orange-600" />,
    delivery: <CheckCircle className="w-8 h-8 text-green-600" />,
  };

  const colorMap = {
    upload: { iconBg: "bg-blue-100" },
    assignment: { iconBg: "bg-purple-100" },
    translation: { iconBg: "bg-orange-100" },
    delivery: { iconBg: "bg-green-100" },
  };

  // Steps array dynamically pulling from translation keys
  const steps = stepKeys.map((key, index) => ({
    key: key,
    icon: iconMap[key],
    title: t(`process.steps.${key}.title`),
    description: t(`process.steps.${key}.description`),
    details: t(`process.steps.${key}.details`),
    iconBg: colorMap[key].iconBg,
    number: t("process.number", { number: index + 1 }), // Use i18n for number localization
  }));

  // Features array dynamically pulling from translation keys
  const featureKeys = ["deliveryTime", "confidentiality", "quality"];

  const featureIconMap = {
    deliveryTime: <Clock className="w-5 h-5 text-green-600" />,
    confidentiality: <Shield className="w-5 h-5 text-green-600" />,
    quality: <Award className="w-5 h-5 text-green-600" />,
  };

  const features = featureKeys.map((key) => ({
    icon: featureIconMap[key],
    text: t(`process.features.${key}`),
  }));

  const handleGetStarted = () => {
    navigate("/quote");
  };

  // Helper function for positioning class
  const getNumberPositionClass = () => {
    return isRtl ? "-top-3 -left-3" : "-top-3 -right-3";
  };

  // Helper function for margin class
  const getMarginClass = () => {
    return isRtl ? "me-2" : "ml-2";
  };

  // Helper function for the Arrow icon
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
          {t("process.header.badge")}
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {t("process.header.title")}
        </h2>
        <p className="text-gray-600">{t("process.header.description")}</p>
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
              <div
                className={`absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full ${getNumberPositionClass()}`} // <-- RTL Position
              >
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
                <div
                  className={`absolute hidden transform -translate-y-1/2 lg:block ${
                    isRtl ? "-left-3" : "-right-3"
                  } top-1/2`} // <-- RTL Position
                >
                  <ArrowIcon className="w-6 h-6 text-gray-300" />{" "}
                  {/* <-- Dynamic Arrow */}
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
              <span className={`${getMarginClass()} font-medium text-gray-700`}>
                {" "}
                {/* <-- RTL Margin */}
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
            {t("process.cta.title")}
          </h3>
          <p className="mb-6 text-green-100">{t("process.cta.description")}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-3 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {t("process.cta.button")}
            <ArrowIcon className={`w-5 h-5 ${getMarginClass()}`} />{" "}
            {/* <-- RTL Margin and Dynamic Arrow */}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
