import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- ADDED
import {
  Scale,
  Heart,
  TrendingUp,
  GraduationCap,
  Church,
  Building,
  Plane,
  ShoppingCart,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Clock,
  Shield,
} from "lucide-react";

export default function IndustryExpertise() {
  const { t } = useTranslation(); // <-- ADDED
  const navigate = useNavigate();
  const [activeIndustry, setActiveIndustry] = useState(0);

  // NOTE: The data structure is now TRANSLATED/MAPPED from the i18n JSON
  // We use a mapping function to build the final industries array from the translation file.
  const industryKeys = [
    "legal",
    "medical",
    "business",
    "educational",
    "religious",
    "government",
    "tourism",
    "ecommerce",
  ];

  const iconMap = {
    legal: <Scale className="w-8 h-8 text-blue-600" />,
    medical: <Heart className="w-8 h-8 text-red-600" />,
    business: <TrendingUp className="w-8 h-8 text-green-600" />,
    educational: <GraduationCap className="w-8 h-8 text-purple-600" />,
    religious: <Church className="w-8 h-8 text-amber-600" />,
    government: <Building className="w-8 h-8 text-indigo-600" />,
    tourism: <Plane className="w-8 h-8 text-sky-600" />,
    ecommerce: <ShoppingCart className="w-8 h-8 text-emerald-600" />,
  };

  const colorMap = {
    legal: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    medical: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      color: "text-red-600",
    },
    business: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      color: "text-green-600",
    },
    educational: {
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      color: "text-purple-600",
    },
    religious: {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      color: "text-amber-600",
    },
    government: {
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconBg: "bg-indigo-100",
      color: "text-indigo-600",
    },
    tourism: {
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconBg: "bg-sky-100",
      color: "text-sky-600",
    },
    ecommerce: {
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      color: "text-emerald-600",
    },
  };

  const industries = industryKeys.map((key) => ({
    key: key,
    icon: iconMap[key],
    title: t(`industries.${key}.title`),
    subtitle: t(`industries.${key}.subtitle`),
    description: t(`industries.${key}.description`),
    services: t(`industries.${key}.services`, { returnObjects: true }),
    stats: {
      projects: t(`industries.${key}.stats.projects`),
      accuracy: t(`industries.${key}.stats.accuracy`),
      certified: t(`industries.${key}.stats.certified`) === "true", // Convert string to boolean
    },
    ...colorMap[key],
    popular: t(`industries.${key}.popular`) === "true", // Convert string to boolean
  }));

  const popularIndustries = industries.filter((industry) => industry.popular);

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const activeIndustryData = industries[activeIndustry];

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
          {t("industries.header.badge")} {/* <-- TRANSLATE */}
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          {t("industries.header.title.part1")}
          <span className="block text-green-600">
            {t("industries.header.title.part2")}
          </span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          {t("industries.header.description")}
        </p>
      </motion.div>

      {/* Popular Industries Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          {t("industries.popular.title")} {/* <-- TRANSLATE */}
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {popularIndustries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-6 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${industry.borderColor} hover:shadow-xl hover:scale-105 group cursor-pointer`}
              onClick={() => setActiveIndustry(industries.indexOf(industry))}
            >
              {/* Popular Badge */}
              <div className="absolute top-4 end-4">
                {" "}
                {/* <-- RTL: right-4 -> end-4 */}
                <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  {t("industries.popular.badge")} {/* <-- TRANSLATE */}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 mb-4 rounded-2xl ${industry.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
              >
                {industry.icon}
              </div>

              {/* Content */}
              <h4 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-green-600">
                {industry.title}
              </h4>
              <p className="mb-4 text-sm font-medium text-green-600">
                {industry.subtitle}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">
                    {industry.stats.projects}
                  </p>
                  <p>{t("industries.stats.projectsLabel")}</p>{" "}
                  {/* <-- TRANSLATE */}
                </div>
                <div className="text-end">
                  {" "}
                  {/* <-- RTL: text-right -> text-end */}
                  <p className="font-semibold text-gray-900">
                    {industry.stats.accuracy}
                  </p>
                  <p>{t("industries.stats.accuracyLabel")}</p>{" "}
                  {/* <-- TRANSLATE */}
                </div>
              </div>

              {/* Certified Badge */}
              {industry.stats.certified && (
                <div className="flex items-center mt-3 text-xs text-green-600">
                  <Award className="w-3 h-3 me-1" />{" "}
                  {/* <-- RTL: mr-1 -> me-1 */}
                  {t("industries.stats.certifiedAvailable")}{" "}
                  {/* <-- TRANSLATE */}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Industry Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          {t("industries.details.title")} {/* <-- TRANSLATE */}
        </h3>

        {/* Industry Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => setActiveIndustry(index)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeIndustry === index
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200"
              }`}
            >
              {industry.title}
            </button>
          ))}
        </div>

        {/* Active Industry Details */}
        <motion.div
          key={activeIndustry}
          initial={{ opacity: 0, x: t("direction") === "rtl" ? -20 : 20 }} // RTL adjustment for animation
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className={`p-8 bg-white border-2 rounded-2xl shadow-lg ${activeIndustryData.borderColor} md:p-12`}
          >
            <div className="flex flex-col items-start gap-8 md:flex-row">
              {/* Left Side - Icon and Title */}
              <div className="flex-shrink-0">
                <div
                  className={`w-20 h-20 mb-4 rounded-2xl ${activeIndustryData.iconBg} flex items-center justify-center`}
                >
                  {activeIndustryData.icon}
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {activeIndustryData.title}
                    </h4>
                    <p className="font-medium text-green-600">
                      {activeIndustryData.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex-1">
                <p className="mb-6 leading-relaxed text-gray-600">
                  {activeIndustryData.description}
                </p>

                {/* Services Grid */}
                <h5 className="mb-3 text-lg font-semibold text-gray-800">
                  {t("industries.details.servicesHeader")} {/* <-- TRANSLATE */}
                </h5>
                <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2">
                  {activeIndustryData.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle className="flex-shrink-0 w-4 h-4 me-2 text-green-500" />{" "}
                      {/* <-- RTL: mr-2 -> me-2 */}
                      {service}
                    </div>
                  ))}
                </div>

                {/* Stats and Features */}
                <div className="flex flex-wrap gap-6 p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 me-2 text-green-600" />{" "}
                    {/* <-- RTL: mr-2 -> me-2 */}
                    <span className="text-sm">
                      <strong>{activeIndustryData.stats.projects}</strong>{" "}
                      {t("industries.details.projectsStat")}{" "}
                      {/* <-- TRANSLATE */}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 me-2 text-green-600" />{" "}
                    {/* <-- RTL: mr-2 -> me-2 */}
                    <span className="text-sm">
                      <strong>{activeIndustryData.stats.accuracy}</strong>{" "}
                      {t("industries.details.accuracyStat")}{" "}
                      {/* <-- TRANSLATE */}
                    </span>
                  </div>
                  {activeIndustryData.stats.certified && (
                    <div className="flex items-center">
                      <Award className="w-5 h-5 me-2 text-green-600" />{" "}
                      {/* <-- RTL: mr-2 -> me-2 */}
                      <span className="text-sm">
                        {t("industries.details.certifiedStat")}{" "}
                        {/* <-- TRANSLATE */}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 me-2 text-green-600" />{" "}
                    {/* <-- RTL: mr-2 -> me-2 */}
                    <span className="text-sm">
                      {t("industries.details.turnaroundStat")}{" "}
                      {/* <-- TRANSLATE */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="p-8 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl md:p-12">
          <Building className="w-16 h-16 mx-auto mb-6 text-white" />
          <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("industries.cta.title")} {/* <-- TRANSLATE */}
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-green-100">
            {t("industries.cta.description")} {/* <-- TRANSLATE */}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetQuote}
              className="inline-flex items-center px-8 py-4 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {t("industries.cta.quoteButton")} {/* <-- TRANSLATE */}
              <ArrowRight className="w-5 h-5 ms-2" />{" "}
              {/* <-- RTL: ml-2 -> ms-2 */}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/services")}
              className="inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {t("industries.cta.servicesButton")} {/* <-- TRANSLATE */}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
