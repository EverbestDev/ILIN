import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- ADDED
import {
  Award,
  Globe,
  BookOpen,
  Users,
  ArrowRight,
  MapPin,
  Star,
  Languages,
  ArrowLeft, // Added for RTL consistency
} from "lucide-react";

export default function MeetOurTeam() {
  const { t, i18n } = useTranslation(); // <-- ADDED
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar"; // Data structure mapped from JSON keys

  const memberKeys = [
    "aminaBello",
    "emmanuelOkafor",
    "fatimaAlRashid",
    "sarahAdeyemi",
  ]; // Non-translatable styling props (used to map data dynamically)

  const memberStyleMap = {
    aminaBello: { initials: "AB", bgColor: "bg-blue-600" },
    emmanuelOkafor: { initials: "EO", bgColor: "bg-green-600" },
    fatimaAlRashid: { initials: "FR", bgColor: "bg-purple-600" },
    sarahAdeyemi: { initials: "SA", bgColor: "bg-red-600" },
  };

  const statsIconMap = {
    users: <Users className="w-8 h-8 text-green-600" />,
    languages: <Languages className="w-8 h-8 text-blue-600" />,
    award: <Award className="w-8 h-8 text-amber-600" />,
    globe: <Globe className="w-8 h-8 text-purple-600" />,
  }; // Map team data from JSON

  const teamMembers = memberKeys.map((key) => {
    const member = t(`team.members.${key}`, { returnObjects: true });
    return {
      ...member,
      ...memberStyleMap[key],
      // The languages array must remain untranslated (or only transliterated) for technical correctness
      languages: member.languages,
    };
  }); // Map stats data from JSON

  const teamStats = t("team.stats", { returnObjects: true }).map((stat) => ({
    ...stat,
    icon: statsIconMap[stat.iconKey],
  }));

  const handleJoinTeam = () => {
    navigate("/contact");
  };

  const handleGetQuote = () => {
    navigate("/quote");
  }; // Helper functions for RTL styling

  const CTAArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const marginStart = isRtl ? "ms-2" : "mr-2";
  const marginEnd = isRtl ? "me-2" : "ml-2";
  const LanguageCountClass = isRtl ? "flex-row-reverse" : "flex-row";

  return (
    <section
      className="px-6 py-16 bg-white md:px-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
        <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          {t("team.header.badge")}
        </span>

        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {t("team.header.title")}
        </h2>

        <p className="text-gray-600">{t("team.header.description")}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid max-w-4xl grid-cols-2 gap-6 mx-auto mb-16 md:grid-cols-4"
      >
        {teamStats.map((stat, index) => (
          <div key={index} className="p-6 text-center bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-3">{stat.icon}</div>

            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </motion.div>
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto mb-12 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 transition-shadow duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full ${member.bgColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                {member.initials}
              </div>
            </div>
            {/* Info */}
            <div className="mb-4 text-center">
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                {member.name}
              </h3>

              <p className="mb-2 text-sm font-medium text-green-600">
                {member.role}
              </p>
              <p className="text-sm text-gray-600">{member.specialization}</p>
            </div>
            {/* Languages */}
            <div className="mb-4">
              <p className="mb-2 text-xs text-gray-500">
                {t("team.labels.languages")}:
              </p>

              <div className="flex flex-wrap gap-1">
                {member.languages.slice(0, 3).map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                  >
                    {lang}
                  </span>
                ))}
                {member.languages.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                    {t("team.labels.plus", {
                      count: member.languages.length - 3,
                    })}
                  </span>
                )}
              </div>
            </div>
            {/* Experience & Location */}
            <div className="mb-4 space-y-2">
              <div
                className={`flex items-center text-sm text-gray-600 ${LanguageCountClass}`}
              >
                <Star className={`w-4 h-4 ${marginStart} text-amber-500`} />
                {member.experience} {t("team.labels.experience")}
              </div>

              <div
                className={`flex items-center text-sm text-gray-600 ${LanguageCountClass}`}
              >
                <MapPin className={`w-4 h-4 ${marginStart} text-green-600`} />
                {member.location}
              </div>
            </div>
            {/* Expertise */}
            <div className="mb-4">
              <p className="text-xs italic text-gray-600">{member.expertise}</p>
            </div>
            {/* Certifications */}
            <div>
              <p className="mb-2 text-xs text-gray-500">
                {t("team.labels.certifications")}:
              </p>

              <div className="flex flex-wrap gap-1">
                {member.certifications.slice(0, 2).map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded"
                  >
                    {cert}
                  </span>
                ))}
                {member.certifications.length > 2 && (
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                    {t("team.labels.plus", {
                      count: member.certifications.length - 2,
                    })}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-6 text-center bg-green-50 rounded-xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />

            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {t("team.cta.work.title")}
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {t("team.cta.work.description")}
            </p>
            <button
              onClick={handleGetQuote}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              {t("team.cta.work.button")}
              <CTAArrowIcon className={`w-5 h-5 ${marginEnd}`} />
            </button>
          </div>

          <div className="p-6 text-center bg-orange-50 rounded-xl">
            <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />

            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {t("team.cta.join.title")}
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {t("team.cta.join.description")}
            </p>
            <button
              onClick={handleJoinTeam}
              className="inline-flex items-center px-6 py-3 font-medium text-orange-600 transition-colors bg-white border-2 border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white"
            >
              {t("team.cta.join.button")}
              <CTAArrowIcon className={`w-5 h-5 ${marginEnd}`} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
