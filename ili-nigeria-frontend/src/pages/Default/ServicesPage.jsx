import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState("document");

  const mainServices = [
    {
      id: "document",
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      title: "Document Translation",
      subtitle: "Professional • Certified • Accurate",
      shortDesc:
        "Professional translation of legal, medical, business, and academic documents",
      description:
        "Our document translation service covers everything from simple letters to complex technical manuals. Every document is handled by certified translators with expertise in your specific field, ensuring accuracy and cultural appropriateness.",
      features: [
        "Legal documents & contracts",
        "Medical records & reports",
        "Academic transcripts & certificates",
        "Business correspondence",
        "Technical manuals & guides",
        "Immigration paperwork",
      ],
      process: [
        "Document upload and analysis",
        "Expert translator assignment",
        "Professional translation",
        "Quality assurance review",
        "Client review and feedback",
        "Final delivery with certification",
      ],
      pricing: {
        starting: "₦25/word",
        rush: "₦35/word",
        certified: "₦40/word",
      },
      turnaround: "24-72 hours",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "localization",
      icon: <Globe2 className="w-12 h-12 text-green-600" />,
      title: "Website & App Localization",
      subtitle: "Global Reach • Cultural Adaptation • SEO Ready",
      shortDesc: "Transform your digital presence for international markets",
      description:
        "Go beyond simple translation with our comprehensive localization service. We adapt your website, mobile app, or software for specific markets, considering cultural nuances, local preferences, and technical requirements.",
      features: [
        "Website content localization",
        "Mobile app internationalization",
        "E-commerce platform adaptation",
        "Software interface translation",
        "SEO optimization for local markets",
        "Cultural consulting & adaptation",
      ],
      process: [
        "Platform analysis & strategy",
        "Content extraction & preparation",
        "Cultural adaptation planning",
        "Translation & localization",
        "Technical integration",
        "Testing & quality assurance",
      ],
      pricing: {
        starting: "₦50,000/project",
        enterprise: "Custom pricing",
        maintenance: "₦15,000/month",
      },
      turnaround: "1-4 weeks",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "interpretation",
      icon: <Mic className="w-12 h-12 text-purple-600" />,
      title: "Live Interpretation",
      subtitle: "Real-time • Professional • Seamless",
      shortDesc: "On-site and remote interpretation for meetings and events",
      description:
        "Break language barriers in real-time with our professional interpretation services. Whether it's a business meeting, conference, or legal proceeding, our certified interpreters ensure smooth communication.",
      features: [
        "Simultaneous interpretation",
        "Consecutive interpretation",
        "Business meeting support",
        "Conference interpretation",
        "Legal proceeding assistance",
        "Remote video interpretation",
      ],
      process: [
        "Event briefing & preparation",
        "Interpreter assignment",
        "Pre-event consultation",
        "Live interpretation service",
        "Real-time quality monitoring",
        "Post-event follow-up",
      ],
      pricing: {
        starting: "₦25,000/hour",
        halfday: "₦120,000",
        fullday: "₦200,000",
      },
      turnaround: "Same day booking",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "multimedia",
      icon: <Video className="w-12 h-12 text-orange-600" />,
      title: "Voiceover & Subtitling",
      subtitle: "Audio • Video • Multimedia Content",
      shortDesc: "Professional voiceover and subtitle services for multimedia",
      description:
        "Bring your videos, documentaries, and multimedia content to life in multiple languages. Our native speakers provide professional voiceovers while our subtitle services ensure accessibility.",
      features: [
        "Professional voiceover recording",
        "Video subtitle creation",
        "Audio dubbing services",
        "Documentary translation",
        "Training video localization",
        "Podcast transcription & translation",
      ],
      process: [
        "Content review & analysis",
        "Script translation",
        "Voice talent selection",
        "Recording & production",
        "Synchronization & timing",
        "Final delivery & formats",
      ],
      pricing: {
        starting: "₦5,000/minute",
        subtitles: "₦3,000/minute",
        dubbing: "₦8,000/minute",
      },
      turnaround: "3-7 days",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "certified",
      icon: <Award className="w-12 h-12 text-red-600" />,
      title: "Certified Translation",
      subtitle: "Official • Notarized • Embassy Accepted",
      shortDesc: "Official translations accepted by embassies and institutions",
      description:
        "For legal, academic, or official purposes, our certified translations are accepted by embassies, universities, and government agencies worldwide. Every certified translation comes with official seals and signatures.",
      features: [
        "Embassy-accepted certifications",
        "University application documents",
        "Immigration paperwork",
        "Official government documents",
        "Notarized translations",
        "Apostille services",
      ],
      process: [
        "Document verification",
        "Certified translator assignment",
        "Professional translation",
        "Official certification process",
        "Notarization (if required)",
        "Sealed delivery",
      ],
      pricing: {
        starting: "₦30,000/document",
        rush: "₦45,000/document",
        notarized: "₦50,000/document",
      },
      turnaround: "48-72 hours",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "enterprise",
      icon: <Building className="w-12 h-12 text-indigo-600" />,
      title: "Enterprise Solutions",
      subtitle: "Scalable • Dedicated • 24/7 Support",
      shortDesc: "Comprehensive language solutions for large organizations",
      description:
        "Custom translation solutions for enterprises with ongoing language needs. Includes dedicated account management, volume discounts, API integration, and priority support.",
      features: [
        "Dedicated account manager",
        "Volume pricing discounts",
        "API integration support",
        "Priority processing",
        "24/7 customer support",
        "Custom workflow solutions",
      ],
      process: [
        "Needs assessment consultation",
        "Custom solution design",
        "Team assignment & training",
        "Integration & setup",
        "Ongoing project management",
        "Performance monitoring",
      ],
      pricing: {
        starting: "Custom quotes",
        volume: "Up to 40% discount",
        monthly: "From ₦500,000",
      },
      turnaround: "Flexible SLAs",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  const industries = [
    {
      icon: <Scale className="w-8 h-8 text-blue-600" />,
      title: "Legal & Immigration",
      description: "Court documents, contracts, immigration papers",
      projects: "2,500+",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Medical & Healthcare",
      description: "Medical records, pharmaceutical documents",
      projects: "1,800+",
    },
    {
      icon: <Building className="w-8 h-8 text-green-600" />,
      title: "Business & Finance",
      description: "Financial reports, business plans, contracts",
      projects: "3,200+",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      title: "Education & Academia",
      description: "Academic papers, transcripts, research",
      projects: "4,100+",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Fast Turnaround",
      description: "24-48 hour delivery on most projects",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Quality Guarantee",
      description: "99.8% accuracy rate with money-back guarantee",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Expert Translators",
      description: "Certified professionals with industry expertise",
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Cultural Accuracy",
      description: "Native speakers who understand local nuances",
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 pt-32 bg-gradient-to-br from-green-50 to-emerald-50 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
              Our Services
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Professional Translation Services
              <span className="block text-green-600">For Every Need</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              From simple documents to complex enterprise solutions, we provide
              comprehensive language services that help you communicate
              effectively across cultures and borders.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-green-600">6</h3>
                <p className="text-sm text-gray-600">Service Categories</p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-blue-600">200+</h3>
                <p className="text-sm text-gray-600">Languages Supported</p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-purple-600">25K+</h3>
                <p className="text-sm text-gray-600">Projects Completed</p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-xl">
                <h3 className="text-2xl font-bold text-orange-600">24hrs</h3>
                <p className="text-sm text-gray-600">Average Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Navigation */}
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
                {service.title}
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
            <div className="flex flex-col items-start gap-8 mb-12 lg:flex-row">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-20 h-20 mr-6 bg-white shadow-lg rounded-2xl">
                    {currentService.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentService.title}
                    </h2>
                    <p className="text-lg font-semibold text-green-600">
                      {currentService.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mb-8 text-lg leading-relaxed text-gray-700">
                  {currentService.description}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {currentService.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Card */}
              <div className="w-full p-6 bg-white shadow-xl lg:w-80 rounded-2xl">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Pricing & Timeline
                </h3>
                <div className="mb-6 space-y-4">
                  {Object.entries(currentService.pricing).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <div className="flex items-center p-3 mb-6 rounded-lg bg-green-50">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium text-green-700">
                    Turnaround: {currentService.turnaround}
                  </span>
                </div>
                <button
                  onClick={handleGetQuote}
                  className="w-full py-3 font-semibold text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
                >
                  Get Custom Quote
                </button>
              </div>
            </div>

            {/* Process Steps */}
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
                Our Process
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentService.process.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-lg font-bold text-white bg-green-600 rounded-full">
                      {index + 1}
                    </div>
                    <p className="font-medium text-gray-700">{step}</p>
                  </div>
                ))}
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
              Industries We Serve
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Specialized expertise across key sectors with deep understanding
              of industry terminology and requirements.
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
                className="p-6 text-center transition-shadow bg-gray-50 rounded-2xl hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white shadow-md rounded-2xl">
                  {industry.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {industry.title}
                </h3>
                <p className="mb-4 text-gray-600">{industry.description}</p>
                <div className="flex items-center justify-center font-semibold text-green-600">
                  <Star className="w-4 h-4 mr-1" />
                  {industry.projects} projects
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
              Why Choose ILI-Nigeria?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              We combine cutting-edge technology with human expertise to deliver
              translations that exceed expectations every time.
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
                className="p-6 text-center transition-shadow bg-white shadow-md rounded-2xl hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl">
                  {item.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
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
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              Get a free quote for your translation project today. Our team is
              ready to help you communicate effectively across languages and
              cultures.
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className="inline-flex items-center px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Free Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className="inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500"
              >
                <Phone className="w-5 h-5 mr-2" />
                Talk to Expert
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
