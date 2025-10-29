import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Globe,
  Users,
  Star,
  ArrowRight,
  Filter,
  CheckCircle,
  MapPin,
  ChevronDown,
} from "lucide-react";

export default function LanguagesSupport() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [languageCount, setLanguageCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const isArabic = i18n.language === "ar";
  const isRTL = isArabic;

  const regions = [
    "All",
    "African",
    "European",
    "Asian",
    "Middle Eastern",
    "Americas",
  ];

  const languages = [
    // African Languages (Nigerian focus)
    {
      name: "Yoruba",
      region: "African",
      speakers: "50M+",
      popular: true,
      flag: "🇳🇬",
    },
    {
      name: "Igbo",
      region: "African",
      speakers: "30M+",
      popular: true,
      flag: "🇳🇬",
    },
    {
      name: "Hausa",
      region: "African",
      speakers: "70M+",
      popular: true,
      flag: "🇳🇬",
    },
    {
      name: "Swahili",
      region: "African",
      speakers: "100M+",
      popular: true,
      flag: "🇰🇪",
    },
    {
      name: "Amharic",
      region: "African",
      speakers: "25M+",
      popular: false,
      flag: "🇪🇹",
    },
    {
      name: "Akan",
      region: "African",
      speakers: "11M+",
      popular: false,
      flag: "🇬🇭",
    },
    {
      name: "Zulu",
      region: "African",
      speakers: "12M+",
      popular: false,
      flag: "🇿🇦",
    },
    {
      name: "Xhosa",
      region: "African",
      speakers: "8M+",
      popular: false,
      flag: "🇿🇦",
    },

    // European Languages
    {
      name: "English",
      region: "European",
      speakers: "1.5B+",
      popular: true,
      flag: "🇬🇧",
    },
    {
      name: "Spanish",
      region: "European",
      speakers: "500M+",
      popular: true,
      flag: "🇪🇸",
    },
    {
      name: "French",
      region: "European",
      speakers: "280M+",
      popular: true,
      flag: "🇫🇷",
    },
    {
      name: "German",
      region: "European",
      speakers: "100M+",
      popular: true,
      flag: "🇩🇪",
    },
    {
      name: "Italian",
      region: "European",
      speakers: "65M+",
      popular: true,
      flag: "🇮🇹",
    },
    {
      name: "Portuguese",
      region: "European",
      speakers: "260M+",
      popular: true,
      flag: "🇵🇹",
    },
    {
      name: "Russian",
      region: "European",
      speakers: "258M+",
      popular: true,
      flag: "🇷🇺",
    },
    {
      name: "Dutch",
      region: "European",
      speakers: "24M+",
      popular: false,
      flag: "🇳🇱",
    },
    {
      name: "Polish",
      region: "European",
      speakers: "45M+",
      popular: false,
      flag: "🇵🇱",
    },
    {
      name: "Swedish",
      region: "European",
      speakers: "10M+",
      popular: false,
      flag: "🇸🇪",
    },

    // Asian Languages
    {
      name: "Mandarin",
      region: "Asian",
      speakers: "918M+",
      popular: true,
      flag: "🇨🇳",
    },
    {
      name: "Hindi",
      region: "Asian",
      speakers: "600M+",
      popular: true,
      flag: "🇮🇳",
    },
    {
      name: "Japanese",
      region: "Asian",
      speakers: "125M+",
      popular: true,
      flag: "🇯🇵",
    },
    {
      name: "Korean",
      region: "Asian",
      speakers: "77M+",
      popular: true,
      flag: "🇰🇷",
    },
    {
      name: "Thai",
      region: "Asian",
      speakers: "60M+",
      popular: false,
      flag: "🇹🇭",
    },
    {
      name: "Vietnamese",
      region: "Asian",
      speakers: "95M+",
      popular: false,
      flag: "🇻🇳",
    },
    {
      name: "Tagalog",
      region: "Asian",
      speakers: "45M+",
      popular: false,
      flag: "🇵🇭",
    },
    {
      name: "Indonesian",
      region: "Asian",
      speakers: "43M+",
      popular: false,
      flag: "🇮🇩",
    },

    // Middle Eastern Languages
    {
      name: "Arabic",
      region: "Middle Eastern",
      speakers: "420M+",
      popular: true,
      flag: "🇸🇦",
    },
    {
      name: "Persian",
      region: "Middle Eastern",
      speakers: "70M+",
      popular: false,
      flag: "🇮🇷",
    },
    {
      name: "Turkish",
      region: "Middle Eastern",
      speakers: "80M+",
      popular: true,
      flag: "🇹🇷",
    },
    {
      name: "Hebrew",
      region: "Middle Eastern",
      speakers: "9M+",
      popular: false,
      flag: "🇮🇱",
    },

    // Americas
    {
      name: "Portuguese (Brazil)",
      region: "Americas",
      speakers: "215M+",
      popular: true,
      flag: "🇧🇷",
    },
    {
      name: "Quechua",
      region: "Americas",
      speakers: "8M+",
      popular: false,
      flag: "🇵🇪",
    },
  ];

  // Filter languages based on search and region
  const filteredLanguages = languages.filter((lang) => {
    const matchesSearch = lang.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === "All" || lang.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Show limited languages initially (first 12), expand with showAll
  const displayLanguages = showAll
    ? filteredLanguages
    : filteredLanguages.slice(0, 12);

  const popularLanguages = languages.filter((lang) => lang.popular);

  // Animated counter effect
  useEffect(() => {
    let start = 0;
    const end = 32;
    const duration = 2000;
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setLanguageCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Format numbers based on language
  const formatNumber = (num, suffix = "+") => {
    if (isArabic) {
      return convertToArabicNumerals(num) + suffix;
    }
    return num + suffix;
  };

  const convertToArabicNumerals = (num) => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num)
      .split("")
      .map((digit) => arabicNumerals[parseInt(digit)])
      .join("");
  };

  return (
    <section
      className="px-6 py-20 bg-white md:px-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          {t("languages.globalReach")}
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          <span className="text-green-600">
            {formatNumber(languageCount)} {t("languages.header")}
          </span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          {t("languages.description")}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-6 text-center bg-green-50 rounded-2xl"
        >
          <Globe className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            {formatNumber(50)}
          </h3>
          <p className="text-gray-600">{t("languages.stats.languages")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="p-6 text-center bg-blue-50 rounded-2xl"
        >
          <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            {isArabic ? "٣" : "3"}B{formatNumber("+", "")}
          </h3>
          <p className="text-gray-600">{t("languages.stats.speakers")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="p-6 text-center bg-orange-50 rounded-2xl"
        >
          <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-600" />
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            {isArabic ? "١٩٥" : "195"}
            {formatNumber("+", "")}
          </h3>
          <p className="text-gray-600">{t("languages.stats.countries")}</p>
        </motion.div>
      </div>

      {/* Popular Languages Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
          {t("languages.popular.title")}
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 overflow-x-auto pb-2 -mx-6 md:-mx-0 md:overflow-visible">
          {popularLanguages.slice(0, 12).map((lang, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 text-center transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:scale-105 group min-w-[140px] md:min-w-0"
            >
              <div className="mb-3 text-3xl">{lang.flag}</div>
              <h4 className="mb-1 font-semibold text-gray-900 group-hover:text-green-600">
                {lang.name}
              </h4>
              <p className="text-sm text-gray-500">{lang.speakers}</p>
              <Star className="w-4 h-4 mx-auto mt-2 text-yellow-500 fill-current" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
          {t("languages.explore.title")}
        </h3>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-center md:items-center">
          {/* Search Input */}
          <div className="relative">
            <Search
              className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                isRTL ? "end-3" : "start-3"
              }`}
            />
            <input
              type="text"
              placeholder={t("languages.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-3 px-4 border border-gray-300 rounded-lg md:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isRTL ? "pe-10 ps-4" : "ps-10 pe-4"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Region Filter */}
          <div className="relative">
            <Filter
              className={`absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 ${
                isRTL ? "end-3" : "start-3"
              }`}
            />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={`py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isRTL ? "pe-10 ps-4 text-right" : "ps-10 pe-8"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {t(
                    `languages.regions.${region
                      .toLowerCase()
                      .replace(" ", "_")}`
                  )}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
          {displayLanguages.map((lang, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-4 bg-white border rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden ${
                lang.region === "African"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div
                className={`flex items-center justify-between mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-2xl ${isRTL ? "ms-3" : "me-3"}`}>
                    {lang.flag}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600">
                      {lang.name}
                    </h4>
                    <p className="text-sm text-gray-500">{lang.speakers}</p>
                  </div>
                </div>
                {lang.popular && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              {lang.region === "African" && (
                <div
                  className={`flex items-center text-xs text-green-600 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <CheckCircle
                    className={`w-3 h-3 ${isRTL ? "ms-1" : "me-1"}`}
                  />
                  {t("languages.localExpertise")}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        {filteredLanguages.length > 12 && !showAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={toggleShowAll}
              className={`inline-flex items-center px-6 py-3 font-medium text-green-600 transition-all duration-300 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t("languages.seeAll")}
              <ChevronDown
                className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                  isRTL ? "ms-2" : "ml-2"
                }`}
              />
            </button>
          </motion.div>
        )}

        {filteredLanguages.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">{t("languages.noResults")}</p>
          </div>
        )}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="p-8 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl md:p-12 overflow-hidden">
          <Globe className="w-16 h-16 mx-auto mb-6 text-white" />
          <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("languages.cta.title")}
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-green-100">
            {t("languages.cta.description")}
          </p>
          <div
            className={`flex flex-col gap-4 sm:flex-row sm:justify-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetQuote}
              className={`inline-flex items-center px-8 py-4 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t("languages.cta.request")}
              <ArrowRight className={`w-5 h-5 ${isRTL ? "ms-2" : "ml-2"}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/languages")}
              className={`inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t("languages.cta.viewAll")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
