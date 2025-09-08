import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Globe2,
  Mic,
  Video,
  Award,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function ServicesOverview() {
  const navigate = useNavigate();

  const services = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Document Translation",
      subtitle: "Accurate • Certified • Fast",
      description:
        "Professional translation of legal, medical, business, and academic documents with certified accuracy.",
      features: [
        "Legal documents",
        "Medical reports",
        "Academic transcripts",
        "Business contracts",
      ],
      priceFrom: "₦15,000",
      turnaround: "24-48 hours",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      borderColor: "border-blue-200",
      popular: false,
    },
    {
      icon: <Globe2 className="w-8 h-8 text-emerald-600" />,
      title: "Website & App Localization",
      subtitle: "Global Reach • Cultural Adaptation",
      description:
        "Transform your digital presence for international markets with culturally-adapted content.",
      features: [
        "Website translation",
        "Mobile app localization",
        "SEO optimization",
        "Cultural consulting",
      ],
      priceFrom: "₦50,000",
      turnaround: "3-7 days",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
      borderColor: "border-emerald-200",
      popular: true,
    },
    {
      icon: <Mic className="w-8 h-8 text-purple-600" />,
      title: "Live Interpretation",
      subtitle: "Real-time • Professional • Seamless",
      description:
        "On-site and remote interpretation services for meetings, conferences, and events.",
      features: [
        "Conference interpretation",
        "Business meetings",
        "Court proceedings",
        "Medical consultations",
      ],
      priceFrom: "₦25,000",
      turnaround: "Same day",
      bgColor: "bg-purple-50",
      hoverBg: "hover:bg-purple-100",
      borderColor: "border-purple-200",
      popular: false,
    },
    {
      icon: <Video className="w-8 h-8 text-orange-600" />,
      title: "Voiceover & Subtitling",
      subtitle: "Audio • Video • Multimedia",
      description:
        "Professional voiceover and subtitle services for videos, documentaries, and multimedia content.",
      features: [
        "Professional voiceover",
        "Video subtitles",
        "Audio dubbing",
        "Multimedia content",
      ],
      priceFrom: "₦20,000",
      turnaround: "2-5 days",
      bgColor: "bg-orange-50",
      hoverBg: "hover:bg-orange-100",
      borderColor: "border-orange-200",
      popular: false,
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: "Certified Translations",
      subtitle: "Official • Notarized • Accepted",
      description:
        "Officially certified translations accepted by embassies, universities, and government agencies.",
      features: [
        "Embassy-accepted",
        "University applications",
        "Immigration documents",
        "Official certification",
      ],
      priceFrom: "₦30,000",
      turnaround: "48-72 hours",
      bgColor: "bg-red-50",
      hoverBg: "hover:bg-red-100",
      borderColor: "border-red-200",
      popular: false,
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Corporate Solutions",
      subtitle: "Enterprise • Scalable • Dedicated",
      description:
        "Comprehensive translation solutions for businesses expanding into global markets.",
      features: [
        "Dedicated account manager",
        "Volume discounts",
        "API integration",
        "24/7 support",
      ],
      priceFrom: "Custom",
      turnaround: "Flexible",
      bgColor: "bg-indigo-50",
      hoverBg: "hover:bg-indigo-100",
      borderColor: "border-indigo-200",
      popular: false,
    },
  ];

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleViewServices = () => {
    navigate("/services");
  };

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
          Our Services
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Professional Translation Services
          <span className="block text-green-600">Tailored for Your Needs</span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          From documents to websites, live events to multimedia content - we
          provide comprehensive language solutions that help you communicate
          effectively across cultures.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative p-8 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${service.borderColor} ${service.hoverBg} hover:shadow-xl hover:scale-105 group`}
          >
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  Popular
                </span>
              </div>
            )}

            {/* Icon Background */}
            <div
              className={`w-16 h-16 mb-6 rounded-2xl ${service.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
            >
              {service.icon}
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {service.title}
            </h3>
            <p className="mb-4 text-sm font-medium text-green-600">
              {service.subtitle}
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              {service.description}
            </p>

            {/* Features List */}
            <ul className="mb-6 space-y-2">
              {service.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-sm text-gray-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Pricing & Timeline */}
            <div className="flex items-center justify-between p-4 mb-6 rounded-lg bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">Starting from</p>
                <p className="text-lg font-bold text-gray-900">
                  {service.priceFrom}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Turnaround</p>
                <p className="flex items-center text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 mr-1 text-green-500" />
                  {service.turnaround}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGetQuote}
              className="w-full px-6 py-3 font-medium text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 group-hover:bg-green-700"
            >
              Get Quote
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-12">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            Need Something Custom?
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            Every project is unique. If you don't see exactly what you need,
            let's discuss your specific requirements and create a tailored
            solution.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewServices}
              className="inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center px-8 py-4 font-medium text-gray-900 transition-all duration-300 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Contact Us
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
