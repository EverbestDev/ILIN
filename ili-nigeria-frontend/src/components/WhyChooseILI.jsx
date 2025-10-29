import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- ADDED
import {
  Award,
  Clock,
  Shield,
  Users,
  Star,
  Globe,
  CheckCircle,
  Heart,
  Target,
  Zap,
  ArrowRight,
  Quote,
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default function WhyChooseILI() {
  const { t, i18n } = useTranslation(); // <-- ADDED
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Stats are initialized to 0, and the logic below handles the counting animation.
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    satisfaction: 0,
    languages: 0,
  });

  const isRtl = i18n.language === "ar";

  // Data structure mapped from JSON keys
  const advantagesKeys = [
    "certified",
    "delivery",
    "quality",
    "cultural",
    "industry",
    "support",
  ];

  const iconMap = {
    certified: <Award className="w-8 h-8 text-amber-600" />,
    delivery: <Clock className="w-8 h-8 text-green-600" />,
    quality: <Shield className="w-8 h-8 text-blue-600" />,
    cultural: <Heart className="w-8 h-8 text-red-600" />,
    industry: <Target className="w-8 h-8 text-purple-600" />,
    support: <Zap className="w-8 h-8 text-orange-600" />,
  };

  const colorMap = {
    certified: {
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
    },
    delivery: {
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
    },
    quality: {
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    cultural: {
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      borderColor: "border-red-200",
    },
    industry: {
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    support: {
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      borderColor: "border-orange-200",
    },
  };

  const advantages = advantagesKeys.map((key) => ({
    key: key,
    icon: iconMap[key],
    title: t(`advantages.${key}.title`),
    description: t(`advantages.${key}.description`),
    features: t(`advantages.${key}.features`, { returnObjects: true }),
    ...colorMap[key],
  }));

  // Testimonials mapped from JSON
  const testimonials = t("testimonials", { returnObjects: true });

  // Animated counters - Logic remains the same, but toLocaleString will handle display formatting
  useEffect(() => {
    const targets = {
      clients: 5000,
      projects: 25000,
      satisfaction: 98,
      languages: 50,
    };
    const duration = 2500;
    const steps = 50;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setStats((prev) => ({
        clients: Math.min(
          prev.clients + Math.ceil(targets.clients / steps),
          targets.clients
        ),
        projects: Math.min(
          prev.projects + Math.ceil(targets.projects / steps),
          targets.projects
        ),
        satisfaction: Math.min(
          prev.satisfaction + Math.ceil(targets.satisfaction / steps),
          targets.satisfaction
        ),
        languages: Math.min(
          prev.languages + Math.ceil(targets.languages / steps),
          targets.languages
        ),
      }));
    }, increment);

    setTimeout(() => clearInterval(timer), duration);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]); // Added dependency

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const currentTestimonialData = testimonials[currentTestimonial];

  // Helper function for Arabic numeral formatting
  const formatArabicNumber = (number) => {
    if (!isRtl) return number.toLocaleString();

    // Replace standard digits with Hindu-Arabic digits
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number
      .toLocaleString()
      .replace(/\d/g, (d) => arabicDigits[d])
      .replace(/,/g, "،");
  };

  return (
    <section className="px-6 py-20 bg-white md:px-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          {t("whyChooseUs.header.badge")}
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          {t("whyChooseUs.header.title.part1")}
          <span className="block text-green-600">
            {t("whyChooseUs.header.title.part2")}
          </span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          {t("whyChooseUs.header.description")}
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-6 mb-20 md:grid-cols-4"
      >
        <div className="p-6 text-center bg-green-50 rounded-2xl">
          <Users className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {formatArabicNumber(stats.clients)}+
          </h3>{" "}
          {/* <-- Arabic Numeral Formatting Applied */}
          <p className="text-gray-600">{t("whyChooseUs.stats.clients")}</p>
        </div>
        <div className="p-6 text-center bg-blue-50 rounded-2xl">
          <Globe className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {formatArabicNumber(stats.projects)}+
          </h3>{" "}
          {/* <-- Arabic Numeral Formatting Applied */}
          <p className="text-gray-600">{t("whyChooseUs.stats.projects")}</p>
        </div>
        <div className="p-6 text-center bg-amber-50 rounded-2xl">
          <Star className="w-12 h-12 mx-auto mb-3 fill-current text-amber-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {formatArabicNumber(stats.satisfaction)}%
          </h3>{" "}
          {/* <-- Arabic Numeral Formatting Applied */}
          <p className="text-gray-600">{t("whyChooseUs.stats.satisfaction")}</p>
        </div>
        <div className="p-6 text-center bg-purple-50 rounded-2xl">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {formatArabicNumber(stats.languages)}+
          </h3>{" "}
          {/* <-- Arabic Numeral Formatting Applied */}
          <p className="text-gray-600">{t("whyChooseUs.stats.languages")}</p>
        </div>
      </motion.div>

      {/* Advantages Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          {t("advantages.title")}
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${advantage.borderColor} hover:shadow-xl hover:scale-105 group`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mb-4 rounded-2xl ${advantage.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
              >
                {advantage.icon}
              </div>

              {/* Content */}
              <h4 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-green-600">
                {advantage.title}
              </h4>
              <p className="mb-4 leading-relaxed text-gray-600">
                {advantage.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {advantage.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <CheckCircle className="flex-shrink-0 w-4 h-4 me-2 text-green-500" />{" "}
                    {/* <-- RTL: mr-2 -> me-2 */}
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          {t("testimonialsHeader")}
        </h3>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }} // RTL: swap X-axis direction
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 50 : -50 }} // RTL: swap X-axis direction
            transition={{ duration: 0.5 }}
            className="p-8 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl md:p-12"
          >
            <div className="flex flex-col items-center text-center md:flex-row md:text-start md:items-start">
              {" "}
              {/* <-- RTL: md:text-left -> md:text-start */}
              {/* Client Avatar */}
              <div className="flex-shrink-0 mb-6 md:mb-0 md:me-8">
                {" "}
                {/* <-- RTL: md:mr-8 -> md:me-8 */}
                <div
                  className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl bg-gray-600`} // Removed dynamic bgColor as it wasn't defined
                >
                  {currentTestimonialData.image}
                </div>
              </div>
              {/* Content */}
              <div className="flex-1">
                {/* Quote */}
                <Quote className="w-8 h-8 mx-auto mb-4 text-green-600 md:mx-0" />
                <p className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  "{currentTestimonialData.text}"
                </p>

                {/* Client Info */}
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-bold text-gray-900">
                      {currentTestimonialData.name}
                    </h4>
                    <p className="font-medium text-green-600">
                      {currentTestimonialData.role}
                    </p>
                    <p className="text-gray-600">
                      {currentTestimonialData.company}
                    </p>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 me-1 text-gray-500" />{" "}
                      {/* <-- RTL: mr-1 -> me-1 */}
                      <span className="text-sm text-gray-500">
                        {currentTestimonialData.location}
                      </span>
                    </div>
                  </div>

                  {/* Rating and Project */}
                  <div className="text-center md:text-end">
                    {" "}
                    {/* <-- RTL: md:text-right -> md:text-end */}
                    <div className="flex justify-center mb-2 md:justify-end">
                      {[...Array(currentTestimonialData.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {t("testimonialProjectLabel")}:{" "}
                      {currentTestimonialData.project}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 me-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50" // <-- RTL: mr-4 -> me-4
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 ms-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50" // <-- RTL: ml-4 -> ms-4
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
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
          <Star className="w-16 h-16 mx-auto mb-6 text-white fill-current" />
          <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {t("whyChooseUs.cta.title")}
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-green-100">
            {t("whyChooseUs.cta.description")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetQuote}
              className="inline-flex items-center px-8 py-4 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {t("whyChooseUs.cta.quoteButton")}
              <ArrowRight className="w-5 h-5 ms-2" />{" "}
              {/* <-- RTL: ml-2 -> ms-2 */}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {t("whyChooseUs.cta.contactButton")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
