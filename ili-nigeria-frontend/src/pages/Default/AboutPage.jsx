import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Users,
  Award,
  Target,
  Heart,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const isRTL = isArabic;

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      labelKey: "aboutpage.stats.clients.label",
      valueKey: "aboutpage.stats.clients.value",
      descKey: "aboutpage.stats.clients.desc",
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      labelKey: "aboutpage.stats.languages.label",
      valueKey: "aboutpage.stats.languages.value",
      descKey: "aboutpage.stats.languages.desc",
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      labelKey: "aboutpage.stats.projects.label",
      valueKey: "aboutpage.stats.projects.value",
      descKey: "aboutpage.stats.projects.desc",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      labelKey: "aboutpage.stats.experience.label",
      valueKey: "aboutpage.stats.experience.value",
      descKey: "aboutpage.stats.experience.desc",
    },
  ];

  const values = [
    {
      icon: <Target className="w-12 h-12 text-green-600" />,
      titleKey: "aboutpage.values.precision.title",
      descKey: "aboutpage.values.precision.desc",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      icon: <Heart className="w-12 h-12 text-red-600" />,
      titleKey: "aboutpage.values.cultural.title",
      descKey: "aboutpage.values.cultural.desc",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      icon: <Zap className="w-12 h-12 text-amber-600" />,
      titleKey: "aboutpage.values.speed.title",
      descKey: "aboutpage.values.speed.desc",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      titleKey: "aboutpage.values.trust.title",
      descKey: "aboutpage.values.trust.desc",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
  ];

  const timeline = [
    {
      year: "2010",
      titleKey: "aboutpage.timeline.0.title",
      descKey: "aboutpage.timeline.0.desc",
      highlight: true,
    },
    {
      year: "2013",
      titleKey: "aboutpage.timeline.1.title",
      descKey: "aboutpage.timeline.1.desc",
      highlight: false,
    },
    {
      year: "2016",
      titleKey: "aboutpage.timeline.2.title",
      descKey: "aboutpage.timeline.2.desc",
      highlight: false,
    },
    {
      year: "2019",
      titleKey: "aboutpage.timeline.3.title",
      descKey: "aboutpage.timeline.3.desc",
      highlight: true,
    },
    {
      year: "2022",
      titleKey: "aboutpage.timeline.4.title",
      descKey: "aboutpage.timeline.4.desc",
      highlight: false,
    },
    {
      year: "2024",
      titleKey: "aboutpage.timeline.5.title",
      descKey: "aboutpage.timeline.5.desc",
      highlight: true,
    },
  ];

  const team = [
    {
      name: "Dr. Sufyan Ayemu",
      roleKey: "aboutpage.team.0.role",
      descKey: "aboutpage.team.0.desc",
      initials: "SA",
      bgColor: "bg-green-600",
      specKey: "aboutpage.team.0.spec",
    },
    {
      name: "Sarah Muhammad",
      roleKey: "aboutpage.team.1.role",
      descKey: "aboutpage.team.1.desc",
      initials: "SM",
      bgColor: "bg-blue-600",
      specKey: "aboutpage.team.1.spec",
    },
    {
      name: "Usamah Abidemi",
      roleKey: "aboutpage.team.2.role",
      descKey: "aboutpage.team.2.desc",
      initials: "UA",
      bgColor: "bg-purple-600",
      specKey: "aboutpage.team.2.spec",
    },
    {
      name: "Dr. Fatima Al-Hassan",
      roleKey: "aboutpage.team.3.role",
      descKey: "aboutpage.team.3.desc",
      initials: "FA",
      bgColor: "bg-amber-600",
      specKey: "aboutpage.team.3.spec",
    },
  ];

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="px-6 py-2 pt-32 md:py-28 bg-gradient-to-br from-green-50 to-emerald-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
              {t("aboutpage.hero.badge")}
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t("aboutpage.hero.title")}
              <span className="block text-green-600">
                {t("aboutpage.hero.subtitle")}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              {t("aboutpage.hero.description")}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 text-center transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="mb-2 text-3xl font-bold text-gray-900">
                  {t(stat.valueKey)}
                </h3>
                <h4 className="mb-1 font-semibold text-gray-800">
                  {t(stat.labelKey)}
                </h4>
                <p className="text-sm text-gray-600">{t(stat.descKey)}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid items-center grid-cols-1 gap-12 lg:grid-cols-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t("aboutpage.story.title")}
              </h2>
              <div className="space-y-6 leading-relaxed text-gray-600">
                <p>{t("aboutpage.story.para1")}</p>
                <p>{t("aboutpage.story.para2")}</p>
                <p>{t("aboutpage.story.para3")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-green-50 rounded-2xl"
            >
              <div className="space-y-6">
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl ${
                      isRTL ? "ms-4" : "mr-4"
                    }`}
                  >
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t("aboutpage.mission.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("aboutpage.mission.subtitle")}
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">
                  {t("aboutpage.mission.description")}
                </p>

                <div
                  className={`flex items-center mt-8 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl ${
                      isRTL ? "ms-4" : "mr-4"
                    }`}
                  >
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t("aboutpage.vision.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("aboutpage.vision.subtitle")}
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">
                  {t("aboutpage.vision.description")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              {t("aboutpage.values.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              {t("aboutpage.values.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 ${value.bgColor} rounded-2xl shadow-md hover:shadow-lg transition-shadow`}
              >
                <div
                  className={`w-20 h-20 ${value.iconBg} rounded-2xl flex items-center justify-center mb-6`}
                >
                  {value.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t(value.titleKey)}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {t(value.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {t("aboutpage.timeline.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("aboutpage.timeline.subtitle")}
            </p>
          </motion.div>

          {/* Mobile-first Timeline */}
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div
                    className={`flex items-start ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Timeline Line and Dot */}
                    <div
                      className={`flex flex-col items-center flex-shrink-0 ${
                        isRTL ? "ml-6" : "mr-6"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                          item.highlight ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-green-200 mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 p-6 rounded-2xl shadow-lg ${
                        item.highlight
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div
                        className={`flex items-center mb-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-12 h-12 ${
                            item.highlight ? "bg-green-600" : "bg-gray-600"
                          } rounded-full flex items-center justify-center ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                        >
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-2xl font-bold ${
                            item.highlight ? "text-green-600" : "text-gray-900"
                          }`}
                        >
                          {item.year}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900">
                        {t(item.titleKey)}
                      </h3>
                      <p className="leading-relaxed text-gray-600">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                  <div
                    className={`flex items-center ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`w-5/12 ${
                        index % 2 === 0
                          ? `text-right ${isRTL ? "pl-8" : "pr-8"}`
                          : `text-left ${isRTL ? "pr-8" : "pl-8"}`
                      }`}
                    >
                      <div
                        className={`p-6 rounded-2xl shadow-lg ${
                          item.highlight
                            ? "bg-green-50 border-2 border-green-200"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            index % 2 === 0 ? "justify-end" : "justify-start"
                          } ${isRTL ? "flex-row-reverse" : ""} mb-4`}
                        >
                          <div
                            className={`w-12 h-12 ${
                              item.highlight ? "bg-green-600" : "bg-gray-600"
                            } rounded-full flex items-center justify-center ${
                              isRTL ? "ml-3" : "mr-3"
                            }`}
                          >
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <span
                            className={`text-2xl font-bold ${
                              item.highlight
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {item.year}
                          </span>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900">
                          {t(item.titleKey)}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {t(item.descKey)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Dot for Desktop */}
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 ${
                        item.highlight ? "bg-green-600" : "bg-gray-400"
                      } rounded-full border-4 border-white shadow-lg`}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Timeline Line */}
          <div
            className="absolute hidden w-1 transform -translate-x-1/2 bg-green-200 md:block left-1/2"
            style={{ height: "calc(100% - 200px)", top: "200px" }}
          ></div>
        </div>
      </section>

      {/* Leadership Team */}
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
              {t("aboutpage.team.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              {t("aboutpage.team.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 text-center transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl"
              >
                <div
                  className={`w-20 h-20 ${member.bgColor} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg`}
                >
                  {member.initials}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="mb-3 font-semibold text-green-600">
                  {t(member.roleKey)}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {t(member.descKey)}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500">
                    {t(member.specKey)}
                  </p>
                </div>
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
              {t("aboutpage.cta.title")}
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              {t("aboutpage.cta.description")}
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
                {t("aboutpage.cta.getQuote")}
                <ArrowRight className={`w-5 h-5 ${isRTL ? "ms-2" : "ml-2"}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className={`inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {t("aboutpage.cta.contact")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
