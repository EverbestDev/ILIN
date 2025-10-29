import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- ADDED
import {
  TrendingUp,
  Globe,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Target,
  Clock,
  Award,
  ArrowLeft, // Added for RTL consistency
} from "lucide-react";

export default function SuccessStories() {
  const { t, i18n } = useTranslation(); // <-- ADDED
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(0);
  const isRtl = i18n.language === "ar";

  // Data structure mapped from JSON keys
  const storyKeys = ["technova", "lagosMedical", "federalMinistry"];

  // Note: Icons and bgGradient are non-translatable styling props, only the content is translated
  const iconMap = {
    trendingUp: <TrendingUp className="w-5 h-5 text-green-600" />,
    globeBlue: <Globe className="w-5 h-5 text-blue-600" />,
    usersPurple: <Users className="w-5 h-5 text-purple-600" />,
    usersRed: <Users className="w-5 h-5 text-red-600" />,
    awardAmber: <Award className="w-5 h-5 text-amber-600" />,
    awardBlue: <Award className="w-5 h-5 text-blue-600" />,
    globeGreen: <Globe className="w-5 h-5 text-green-600" />,
    clockOrange: <Clock className="w-5 h-5 text-orange-600" />,
  };

  const gradientMap = {
    technova: "from-green-500 to-emerald-600",
    lagosMedical: "from-red-500 to-rose-600",
    federalMinistry: "from-blue-500 to-indigo-600",
  };

  // Custom structure to hold translated stories and map the fixed styling
  const stories = storyKeys.map((key) => {
    const translatedStory = t(`stories.${key}`, { returnObjects: true });
    return {
      ...translatedStory,
      bgGradient: gradientMap[key],
      // Map icons based on the structure defined in the JSON
      stats: translatedStory.stats.map((stat) => ({
        ...stat,
        icon: iconMap[stat.iconKey], // iconKey is a new field in JSON
      })),
    };
  });

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

  // Helper functions for RTL styling
  const CTAArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft; // Prev story uses right arrow in RTL
  const NextIcon = isRtl ? ChevronLeft : ChevronRight; // Next story uses left arrow in RTL
  const marginStart = isRtl ? "ms-2" : "ml-2";
  const marginEnd = isRtl ? "me-2" : "mr-2";

  // Reverse the grid order for RTL: Results (Right Side) goes to the left (order-1)
  const gridOrderClass = isRtl
    ? "lg:grid-cols-2 lg:grid-flow-col-dense"
    : "lg:grid-cols-2";
  const storyContentOrder = isRtl ? "lg:order-2" : "lg:order-1";
  const resultsContentOrder = isRtl ? "lg:order-1" : "lg:order-2";

  // Text alignment for story content
  const storyTextAlignment = isRtl ? "text-right" : "text-left";
  const resultsTextAlignment = isRtl ? "lg:text-left" : "lg:text-right";

  // Quote border for RTL
  const quoteBorder = isRtl ? "pr-4 border-r-4" : "pl-4 border-l-4";

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
          {t("stories.header.badge")}
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {t("stories.header.title")}
        </h2>
        <p className="text-gray-600">{t("stories.header.description")}</p>
      </motion.div>

      {/* Main Story Showcase */}
      <div className="max-w-5xl mx-auto mb-8">
        <motion.div
          key={activeStory}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }} // Animation flip
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r ${stories[activeStory].bgGradient}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="relative p-8 md:p-12">
            <div
              className={`grid items-center grid-cols-1 gap-8 ${gridOrderClass}`}
            >
              {/* Story Content (Left Side in LTR, Right Side in RTL) */}
              <div
                className={`text-white ${storyContentOrder} ${storyTextAlignment}`}
              >
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">
                    {stories[activeStory].company}
                  </h3>
                  <p className="font-medium text-green-100">
                    {stories[activeStory].industry}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-semibold">
                    {t("stories.labels.challenge")}:
                  </h4>
                  <p className="text-green-50">
                    {stories[activeStory].challenge}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="mb-2 font-semibold">
                    {t("stories.labels.solution")}:
                  </h4>
                  <p className="text-green-50">
                    {stories[activeStory].solution}
                  </p>
                </div>

                {/* Quote */}
                <blockquote className={`${quoteBorder} border-white mb-4`}>
                  <p className="italic text-green-50">
                    "{stories[activeStory].quote}"
                  </p>
                  <cite className="text-sm font-medium text-white">
                    - {stories[activeStory].client}
                  </cite>
                </blockquote>
              </div>

              {/* Results (Right Side in LTR, Left Side in RTL) */}
              <div
                className={`text-center ${resultsContentOrder} ${resultsTextAlignment}`}
              >
                <div className="mb-8">
                  <div className="mb-2 text-6xl font-bold text-white">
                    {stories[activeStory].results.metric}
                  </div>
                  <div className="text-xl font-medium text-green-100">
                    {stories[activeStory].results.description}
                  </div>
                  <div className="text-sm text-green-200">
                    {t("stories.labels.in")}{" "}
                    {stories[activeStory].results.timeline}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {stories[activeStory].stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`text-center ${resultsTextAlignment}`}
                    >
                      <div
                        className={`flex items-center justify-center mb-2 ${
                          isRtl ? "lg:justify-start" : "lg:justify-end"
                        }`}
                      >
                        <span
                          className={`${
                            isRtl ? marginEnd : marginStart
                          } font-medium text-white`}
                        >
                          {stat.label}
                        </span>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements (keep mirrored) */}
            <div
              className={`absolute top-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full opacity-10 ${
                isRtl ? "left-0 right-auto -ml-16" : "right-0"
              }`}
            ></div>
            <div
              className={`absolute bottom-0 w-24 h-24 -mb-12 -ml-12 bg-white rounded-full opacity-10 ${
                isRtl ? "right-0 left-auto -mr-12" : "left-0"
              }`}
            ></div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={prevStory}
            className="p-3 mr-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <PrevIcon className="w-6 h-6 text-gray-600" /> {/* Flipped icon */}
          </button>

          {/* Story Indicators */}
          <div className="flex space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStory(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeStory ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStory}
            className="p-3 ml-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <NextIcon className="w-6 h-6 text-gray-600" /> {/* Flipped icon */}
          </button>
        </div>
      </div>

      {/* CTA - Simple */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="p-8 bg-white shadow-lg py-14 rounded-xl">
          <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            {t("stories.cta.title")}
          </h3>
          <p className="mb-6 text-gray-600">{t("stories.cta.description")}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetQuote}
            className="inline-flex items-center px-8 py-3 font-medium text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("stories.cta.button")}
            <CTAArrowIcon className={`w-5 h-5 ${marginStart}`} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
