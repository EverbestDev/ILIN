import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Globe2,
  Mic,
  Video,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Zap,
  Star,
  Calculator,
  Download,
  Upload,
  Phone,
  Mail,
  BookOpen,
  Building,
  Heart,
  Scale,
} from "lucide-react";

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState("document");
  const isArabic = i18n.language === "ar";
  const isRTL = isArabic;

  const mainServices = [
    {
      id: "document",
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      titleKey: "servicespage.main.document.title",
      subtitleKey: "servicespage.main.document.subtitle",
      shortDescKey: "servicespage.main.document.shortDesc",
      descKey: "servicespage.main.document.description",
      featuresKey: "servicespage.main.document.features",
      processKey: "servicespage.main.document.process",
      pricingKey: "servicespage.main.document.pricing",
      turnaroundKey: "servicespage.main.document.turnaround",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "localization",
      icon: <Globe2 className="w-12 h-12 text-green-600" />,
      titleKey: "servicespage.main.localization.title",
      subtitleKey: "servicespage.main.localization.subtitle",
      shortDescKey: "servicespage.main.localization.shortDesc",
      descKey: "servicespage.main.localization.description",
      featuresKey: "servicespage.main.localization.features",
      processKey: "servicespage.main.localization.process",
      pricingKey: "servicespage.main.localization.pricing",
      turnaroundKey: "servicespage.main.localization.turnaround",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "interpretation",
      icon: <Mic className="w-12 h-12 text-purple-600" />,
      titleKey: "servicespage.main.interpretation.title",
      subtitleKey: "servicespage.main.interpretation.subtitle",
      shortDescKey: "servicespage.main.interpretation.shortDesc",
      descKey: "servicespage.main.interpretation.description",
      featuresKey: "servicespage.main.interpretation.features",
      processKey: "servicespage.main.interpretation.process",
      pricingKey: "servicespage.main.interpretation.pricing",
      turnaroundKey: "servicespage.main.interpretation.turnaround",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "multimedia",
      icon: <Video className="w-12 h-12 text-orange-600" />,
      titleKey: "servicespage.main.multimedia.title",
      subtitleKey: "servicespage.main.multimedia.subtitle",
      shortDescKey: "servicespage.main.multimedia.shortDesc",
      descKey: "servicespage.main.multimedia.description",
      featuresKey: "servicespage.main.multimedia.features",
      processKey: "servicespage.main.multimedia.process",
      pricingKey: "servicespage.main.multimedia.pricing",
      turnaroundKey: "servicespage.main.multimedia.turnaround",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "certified",
      icon: <Award className="w-12 h-12 text-red-600" />,
      titleKey: "servicespage.main.certified.title",
      subtitleKey: "servicespage.main.certified.subtitle",
      shortDescKey: "servicespage.main.certified.shortDesc",
      descKey: "servicespage.main.certified.description",
      featuresKey: "servicespage.main.certified.features",
      processKey: "servicespage.main.certified.process",
      pricingKey: "servicespage.main.certified.pricing",
      turnaroundKey: "servicespage.main.certified.turnaround",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "enterprise",
      icon: <Building className="w-12 h-12 text-indigo-600" />,
      titleKey: "servicespage.main.enterprise.title",
      subtitleKey: "servicespage.main.enterprise.subtitle",
      shortDescKey: "servicespage.main.enterprise.shortDesc",
      descKey: "servicespage.main.enterprise.description",
      featuresKey: "servicespage.main.enterprise.features",
      processKey: "servicespage.main.enterprise.process",
      pricingKey: "servicespage.main.enterprise.pricing",
      turnaroundKey: "servicespage.main.enterprise.turnaround",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  const industries = [
    {
      icon: <Scale className="w-8 h-8 text-blue-600" />,
      titleKey: "servicespage.industries.legal.title",
      descKey: "servicespage.industries.legal.desc",
      projectsKey: "servicespage.industries.legal.projects",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      titleKey: "servicespage.industries.medical.title",
      descKey: "servicespage.industries.medical.desc",
      projectsKey: "servicespage.industries.medical.projects",
    },
    {
      icon: <Building className="w-8 h-8 text-green-600" />,
      titleKey: "servicespage.industries.business.title",
      descKey: "servicespage.industries.business.desc",
      projectsKey: "servicespage.industries.business.projects",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      titleKey: "servicespage.industries.education.title",
      descKey: "servicespage.industries.education.desc",
      projectsKey: "servicespage.industries.education.projects",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      titleKey: "servicespage.why.speed.title",
      descKey: "servicespage.why.speed.desc",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      titleKey: "servicespage.why.quality.title",
      descKey: "servicespage.why.quality.desc",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      titleKey: "servicespage.why.experts.title",
      descKey: "servicespage.why.experts.desc",
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      titleKey: "servicespage.why.cultural.title",
      descKey: "servicespage.why.cultural.desc",
    },
  ];

  const currentService = mainServices.find(
    (service) => service.id === activeService
  );

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  const convertToArabicNumerals = (num) => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num)
      .split("")
      .map((digit) => arabicNumerals[parseInt(digit)])
      .join("");
  };

  const formatNumber = (num) => {
    return isArabic ? convertToArabicNumerals(num) : num;
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="px-6 py-20 pt-32 bg-gradient-to-br from-green-50 to-emerald-50 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
              {t("servicespage.hero.badge")}
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t("servicespage.hero.title")}
              <span className="block text-green-600">
                {t("servicespage.hero.subtitle")}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              {t("servicespage.hero.description")}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-green-600">
                  {formatNumber(6)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("servicespage.stats.categories")}
                </p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-blue-600">
                  {formatNumber(200)}+
                </h3>
                <p className="text-sm text-gray-600">
                  {t("servicespage.stats.languages")}
                </p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-purple-600">
                  {formatNumber(25)}K+
                </h3>
                <p className="text-sm text-gray-600">
                  {t("servicespage.stats.projects")}
                </p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-orange-600">
                  {formatNumber(24)}hrs
                </h3>
                <p className="text-sm text-gray-600">
                  {t("servicespage.stats.delivery")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* servicespage Navigation */}
      <section className="px-6 py-4 pt-8 bg-white md:py-12 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {mainServices.map((service, index) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveService(service.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeService === service.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(service.titleKey)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Service Details */}
      <section className="px-6 py-16 bg-gray-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${currentService.bgColor} ${currentService.borderColor} border-2 rounded-3xl p-8 md:p-12 shadow-xl`}
          >
            {/* Service Header */}
            <div
              className={`flex flex-col items-start gap-8 mb-12 lg:flex-row ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div
                  className={`flex items-center mb-6 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-20 h-20 bg-white shadow-lg rounded-2xl ${
                      isRTL ? "ml-6" : "mr-6"
                    }`}
                  >
                    {currentService.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {t(currentService.titleKey)}
                    </h2>
                    <p className="text-lg font-semibold text-green-600">
                      {t(currentService.subtitleKey)}
                    </p>
                  </div>
                </div>
                <p className="mb-8 text-lg leading-relaxed text-gray-700">
                  {t(currentService.descKey)}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.isArray(
                    t(currentService.featuresKey, { returnObjects: true })
                  ) &&
                    t(currentService.featuresKey, { returnObjects: true }).map(
                      (feature, index) => (
                        <div
                          key={index}
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <CheckCircle
                            className={`w-5 h-5 text-green-600 flex-shrink-0 ${
                              isRTL ? "ml-3" : "mr-3"
                            }`}
                          />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      )
                    )}
                </div>
              </div>

              {/* Pricing Card */}
              <div
                className={`w-full p-6 bg-white shadow-xl lg:w-80 rounded-2xl ${
                  isRTL ? "flex-col flex-start" : ""
                }`}
              >
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {t("servicespage.pricing.title")}
                </h3>
                <div className="mb-6 space-y-4">
                  {Object.entries(
                    t(currentService.pricingKey, { returnObjects: true })
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-gray-600 capitalize">
                        {t(`servicespage.pricing.${key}`)}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className={`flex items-center p-3 mb-6 rounded-lg bg-green-50 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Clock
                    className={`w-5 h-5 text-green-600 flex-shrink-0 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                  <span className="font-medium text-green-700">
                    {t("servicespage.pricing.turnaround")}:{" "}
                    {t(currentService.turnaroundKey)}
                  </span>
                </div>
                <button
                  onClick={handleGetQuote}
                  className="w-full py-3 font-semibold text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
                >
                  {t("servicespage.cta.quote")}
                </button>
              </div>
            </div>

            {/* Process Steps */}
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
                {t("servicespage.process.title")}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(
                  t(currentService.processKey, { returnObjects: true })
                ) &&
                  t(currentService.processKey, { returnObjects: true }).map(
                    (step, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-lg font-bold text-white bg-green-600 rounded-full">
                          {formatNumber(index + 1)}
                        </div>
                        <p className="font-medium text-gray-700">{step}</p>
                      </div>
                    )
                  )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {t("servicespage.industries.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              {t("servicespage.industries.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 text-center transition-shadow bg-gray-50 rounded-2xl hover:shadow-lg ${
                  isRTL ? "flex flex-col items-center" : ""
                }`}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white shadow-md rounded-2xl">
                  {industry.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {t(industry.titleKey)}
                </h3>
                <p className="mb-4 text-gray-600">{t(industry.descKey)}</p>
                <div
                  className={`flex items-center justify-center font-semibold text-green-600 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isRTL ? "ml-1" : "mr-1"
                    } flex-shrink-0`}
                  />
                  {t(industry.projectsKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-20 bg-gray-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {t("servicespage.why.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              {t("servicespage.why.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 text-center transition-shadow bg-white shadow-md rounded-2xl hover:shadow-lg ${
                  isRTL ? "flex flex-col items-center" : ""
                }`}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl">
                  {item.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {t(item.titleKey)}
                </h3>
                <p className="text-gray-600">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 bg-green-600 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white">
              {t("servicespage.cta.title")}
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              {t("servicespage.cta.description")}
            </p>
            <div
              className={`flex flex-col justify-center gap-6 sm:flex-row ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className={`inline-flex items-center px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Calculator className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("servicespage.cta.quote")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className={`inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("servicespage.cta.contact")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
