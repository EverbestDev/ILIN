import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Heart,
  TrendingUp,
  GraduationCap,
  Church,
  Building,
  Plane,
  ShoppingCart,
  Factory,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Clock,
  Shield,
} from "lucide-react";

export default function IndustryExpertise() {
  const navigate = useNavigate();
  const [activeIndustry, setActiveIndustry] = useState(0);

  const industries = [
    {
      icon: <Scale className="w-8 h-8 text-blue-600" />,
      title: "Legal & Immigration",
      subtitle: "Certified • Accurate • Court-Accepted",
      description:
        "Specialized legal translation services for immigration, litigation, contracts, and official documentation with certified accuracy.",
      services: [
        "Immigration documents",
        "Court proceedings",
        "Legal contracts",
        "Affidavits & certificates",
        "Patent applications",
        "Compliance documents",
      ],
      stats: { projects: "2,500+", accuracy: "99.8%", certified: true },
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      popular: true,
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Medical & Healthcare",
      subtitle: "Precise • Confidential • Life-Critical",
      description:
        "Medical translation services ensuring patient safety through accurate translation of medical records, pharmaceutical documents, and clinical trials.",
      services: [
        "Medical records",
        "Pharmaceutical documents",
        "Clinical trial materials",
        "Patient consent forms",
        "Medical device manuals",
        "Research publications",
      ],
      stats: { projects: "1,800+", accuracy: "99.9%", certified: true },
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      popular: true,
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Business & Finance",
      subtitle: "Strategic • Compliant • Growth-Focused",
      description:
        "Financial and business translation services supporting international expansion, investment, and cross-border commerce.",
      services: [
        "Financial reports",
        "Business plans",
        "Investment documents",
        "Banking materials",
        "Insurance policies",
        "Audit reports",
      ],
      stats: { projects: "3,200+", accuracy: "99.7%", certified: true },
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      popular: true,
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      title: "Educational Institutions",
      subtitle: "Academic • Recognized • Student-Focused",
      description:
        "Educational translation services supporting international students, academic research, and institutional partnerships.",
      services: [
        "Academic transcripts",
        "Diploma certificates",
        "Research papers",
        "Course materials",
        "Student applications",
        "Institutional agreements",
      ],
      stats: { projects: "4,100+", accuracy: "99.6%", certified: true },
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      popular: false,
    },
    {
      icon: <Church className="w-8 h-8 text-amber-600" />,
      title: "Religious Organizations",
      subtitle: "Respectful • Cultural • Faithful",
      description:
        "Faith-based translation services with deep cultural understanding and respect for religious texts and materials.",
      services: [
        "Religious texts",
        "Sermon materials",
        "Faith-based content",
        "Community outreach",
        "Missionary documents",
        "Spiritual guidance",
      ],
      stats: { projects: "850+", accuracy: "99.5%", certified: false },
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      popular: false,
    },
    {
      icon: <Building className="w-8 h-8 text-indigo-600" />,
      title: "Government Agencies",
      subtitle: "Official • Secure • Compliant",
      description:
        "Government translation services ensuring compliance with official standards and security requirements for public sector communications.",
      services: [
        "Official documents",
        "Policy materials",
        "Public communications",
        "Regulatory documents",
        "International agreements",
        "Diplomatic correspondence",
      ],
      stats: { projects: "1,200+", accuracy: "99.9%", certified: true },
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconBg: "bg-indigo-100",
      popular: false,
    },
    {
      icon: <Plane className="w-8 h-8 text-sky-600" />,
      title: "Tourism & Hospitality",
      subtitle: "Welcoming • Cultural • Experience-Driven",
      description:
        "Tourism and hospitality translations that capture cultural nuances and create welcoming experiences for international visitors.",
      services: [
        "Marketing materials",
        "Website content",
        "Menu translations",
        "Tour guides",
        "Hotel communications",
        "Travel documentation",
      ],
      stats: { projects: "950+", accuracy: "99.4%", certified: false },
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconBg: "bg-sky-100",
      popular: false,
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-emerald-600" />,
      title: "E-commerce & Retail",
      subtitle: "Converting • Localized • Sales-Driven",
      description:
        "E-commerce translation services that drive sales through culturally-adapted product descriptions and marketing content.",
      services: [
        "Product descriptions",
        "Marketing campaigns",
        "Customer support",
        "Payment systems",
        "User interfaces",
        "Brand messaging",
      ],
      stats: { projects: "2,800+", accuracy: "99.3%", certified: false },
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      popular: true,
    },
  ];

  const popularIndustries = industries.filter((industry) => industry.popular);

  const handleGetQuote = () => {
    navigate("/quote");
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
          Industry Expertise
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Specialized Knowledge Across
          <span className="block text-green-600">Every Industry</span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          Our certified translators don't just speak languages - they understand
          industries. From technical jargon to cultural nuances, we deliver
          translations that work in your specific field.
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
          Most Requested Industries
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
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  Popular
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
                  <p>Projects</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {industry.stats.accuracy}
                  </p>
                  <p>Accuracy</p>
                </div>
              </div>

              {/* Certified Badge */}
              {industry.stats.certified && (
                <div className="flex items-center mt-3 text-xs text-green-600">
                  <Award className="w-3 h-3 mr-1" />
                  Certified Available
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
          Complete Industry Coverage
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className={`p-8 bg-white border-2 rounded-2xl shadow-lg ${industries[activeIndustry].borderColor} md:p-12`}
          >
            <div className="flex flex-col items-start gap-8 md:flex-row">
              {/* Left Side - Icon and Title */}
              <div className="flex-shrink-0">
                <div
                  className={`w-20 h-20 mb-4 rounded-2xl ${industries[activeIndustry].iconBg} flex items-center justify-center`}
                >
                  {industries[activeIndustry].icon}
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {industries[activeIndustry].title}
                    </h4>
                    <p className="font-medium text-green-600">
                      {industries[activeIndustry].subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex-1">
                <p className="mb-6 leading-relaxed text-gray-600">
                  {industries[activeIndustry].description}
                </p>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2">
                  {industries[activeIndustry].services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                      {service}
                    </div>
                  ))}
                </div>

                {/* Stats and Features */}
                <div className="flex flex-wrap gap-6 p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-sm">
                      <strong>
                        {industries[activeIndustry].stats.projects}
                      </strong>{" "}
                      projects completed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-sm">
                      <strong>
                        {industries[activeIndustry].stats.accuracy}
                      </strong>{" "}
                      accuracy rate
                    </span>
                  </div>
                  {industries[activeIndustry].stats.certified && (
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-green-600" />
                      <span className="text-sm">
                        Certified translations available
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-sm">24-72 hour turnaround</span>
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
            Need Industry-Specific Expertise?
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-green-100">
            Our specialized translators understand your industry's unique
            requirements, terminology, and regulatory standards. Get expert
            translation that speaks your business language.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetQuote}
              className="inline-flex items-center px-8 py-4 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Get Industry Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/services")}
              className="inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              View All Services
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
