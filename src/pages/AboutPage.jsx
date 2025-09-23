import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      label: "Happy Clients",
      value: "5,000+",
      description: "Satisfied customers worldwide",
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      label: "Languages",
      value: "50+",
      description: "Supported language pairs",
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      label: "Projects",
      value: "25,000+",
      description: "Successfully completed",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      label: "Years Experience",
      value: "15+",
      description: "In translation industry",
    },
  ];

  const values = [
    {
      icon: <Target className="w-12 h-12 text-green-600" />,
      title: "Precision & Accuracy",
      description:
        "We maintain the highest standards of accuracy in every translation project, ensuring your message is conveyed exactly as intended.",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      icon: <Heart className="w-12 h-12 text-red-600" />,
      title: "Cultural Sensitivity",
      description:
        "Understanding cultural nuances is at the heart of effective translation. We respect and preserve cultural context in every project.",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      icon: <Zap className="w-12 h-12 text-amber-600" />,
      title: "Speed & Efficiency",
      description:
        "We understand deadlines matter. Our streamlined processes ensure rapid delivery without compromising quality.",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Trust & Confidentiality",
      description:
        "Your documents are secure with us. We maintain strict confidentiality protocols and secure handling procedures.",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
  ];

  const timeline = [
    {
      year: "2010",
      title: "Foundation",
      description:
        "ILI-Nigeria was founded with a vision to bridge communication gaps across Nigerian businesses and international partners.",
      highlight: true,
    },
    {
      year: "2013",
      title: "ISO Certification",
      description:
        "Achieved ISO 17100 certification, establishing our commitment to international quality standards.",
      highlight: false,
    },
    {
      year: "2016",
      title: "Digital Expansion",
      description:
        "Launched our digital platform, enabling seamless online translation services across Africa.",
      highlight: false,
    },
    {
      year: "2019",
      title: "Regional Leader",
      description:
        "Became West Africa's leading translation service provider, serving clients across 15+ countries.",
      highlight: true,
    },
    {
      year: "2022",
      title: "AI Integration",
      description:
        "Integrated advanced CAT tools and AI-assisted quality assurance while maintaining human expertise.",
      highlight: false,
    },
    {
      year: "2024",
      title: "Global Recognition",
      description:
        "Recognized as Nigeria's premier translation service with international partnerships and certifications.",
      highlight: true,
    },
  ];

  const team = [
    {
      name: "Dr. Adebayo Oladimeji",
      role: "Founder & CEO",
      description:
        "15+ years in linguistics and international business. PhD in Applied Linguistics from University of Lagos.",
      initials: "AO",
      bgColor: "bg-green-600",
      specialization: "Strategic Leadership & Linguistics",
    },
    {
      name: "Sarah Muhammad",
      role: "Chief Operations Officer",
      description:
        "Expert in translation project management with extensive experience in quality assurance systems.",
      initials: "SM",
      bgColor: "bg-blue-600",
      specialization: "Operations & Quality Management",
    },
    {
      name: "Emmanuel Chen",
      role: "Technology Director",
      description:
        "Leading our digital transformation with cutting-edge translation technology and AI integration.",
      initials: "EC",
      bgColor: "bg-purple-600",
      specialization: "Technology & Innovation",
    },
    {
      name: "Dr. Fatima Al-Hassan",
      role: "Head of Linguistics",
      description:
        "Oversees linguistic quality and cultural adaptation across all African and Middle Eastern languages.",
      initials: "FA",
      bgColor: "bg-amber-600",
      specialization: "Linguistics & Cultural Adaptation",
    },
  ];

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 pt-32 bg-gradient-to-br from-green-50 to-emerald-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
              About ILI-Nigeria
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Bridging Cultures Through
              <span className="block text-green-600">Expert Translation</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              For over a decade, we've been Nigeria's trusted translation
              partner, helping businesses, organizations, and individuals
              communicate effectively across languages and cultures.
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
                  {stat.value}
                </h3>
                <h4 className="mb-1 font-semibold text-gray-800">
                  {stat.label}
                </h4>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Our Story: From Local Vision to Global Impact
              </h2>
              <div className="space-y-6 leading-relaxed text-gray-600">
                <p>
                  Founded in 2010 in the heart of Lagos, ILI-Nigeria began with
                  a simple yet powerful vision: to break down language barriers
                  that prevent Nigerian businesses from accessing global
                  opportunities.
                </p>
                <p>
                  What started as a small team of passionate linguists has grown
                  into Nigeria's premier translation and interpretation service,
                  trusted by government agencies, multinational corporations,
                  and individual professionals across Africa and beyond.
                </p>
                <p>
                  Today, we're proud to serve clients in over 50 languages, with
                  a team of certified translators who understand not just words,
                  but the cultural nuances that make communication truly
                  effective.
                </p>
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
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-16 h-16 mr-4 bg-green-600 rounded-2xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Our Mission
                    </h3>
                    <p className="text-gray-600">
                      Breaking barriers, building bridges
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">
                  To provide world-class translation and interpretation services
                  that enable seamless communication across cultures, empowering
                  Nigerian businesses and individuals to thrive in the global
                  marketplace.
                </p>

                <div className="flex items-center mt-8">
                  <div className="flex items-center justify-center w-16 h-16 mr-4 bg-blue-600 rounded-2xl">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Our Vision
                    </h3>
                    <p className="text-gray-600">
                      A connected, multilingual world
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">
                  To be Africa's leading language services provider, recognized
                  globally for our expertise, cultural sensitivity, and
                  commitment to excellence in translation and interpretation.
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
              Values That Guide Everything We Do
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our core values are the foundation of our service excellence and
              the reason thousands of clients trust us with their most important
              communications.
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
                  {value.title}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {value.description}
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
              Our Journey Through the Years
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones that shaped ILI-Nigeria into the trusted
              translation partner we are today
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
                  <div className="flex items-start">
                    {/* Timeline Line and Dot */}
                    <div className="flex flex-col items-center flex-shrink-0 mr-6">
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
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 ${
                            item.highlight ? "bg-green-600" : "bg-gray-600"
                          } rounded-full flex items-center justify-center mr-3`}
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
                        {item.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600">
                        {item.description}
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
                        index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
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
                          } mb-4`}
                        >
                          <div
                            className={`w-12 h-12 ${
                              item.highlight ? "bg-green-600" : "bg-gray-600"
                            } rounded-full flex items-center justify-center mr-3`}
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
                          {item.title}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {item.description}
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
              Meet Our Leadership Team
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              The experienced professionals who guide our vision and ensure the
              highest standards of service delivery across all our operations.
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
                  {member.role}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {member.description}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500">
                    {member.specialization}
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
              Ready to Work with Nigeria's Translation Experts?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              Join thousands of satisfied clients who trust ILI-Nigeria for
              accurate, culturally-sensitive translation services. Let's help
              you communicate effectively across languages and cultures.
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className="inline-flex items-center px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className="inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500"
              >
                Contact Our Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
