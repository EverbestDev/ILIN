import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function SuccessStories() {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      company: "TechNova Solutions",
      industry: "E-commerce",
      challenge: "Expanding into African markets",
      solution: "Website & marketing localization",
      results: {
        metric: "340%",
        description: "Sales increase",
        timeline: "6 months",
      },
      stats: [
        {
          icon: <TrendingUp className="w-5 h-5 text-green-600" />,
          label: "Revenue Growth",
          value: "340%",
        },
        {
          icon: <Globe className="w-5 h-5 text-blue-600" />,
          label: "Markets Entered",
          value: "12",
        },
        {
          icon: <Users className="w-5 h-5 text-purple-600" />,
          label: "New Customers",
          value: "15K+",
        },
      ],
      bgGradient: "from-green-500 to-emerald-600",
      quote:
        "ILI-Nigeria didn't just translate our content - they helped us understand the market.",
      client: "James Chen, Business Director",
    },
    {
      company: "Lagos Medical Center",
      industry: "Healthcare",
      challenge: "Serving international patients",
      solution: "Medical document translation",
      results: {
        metric: "95%",
        description: "Patient satisfaction",
        timeline: "1 year",
      },
      stats: [
        {
          icon: <Users className="w-5 h-5 text-red-600" />,
          label: "Patients Served",
          value: "2,500+",
        },
        {
          icon: <Globe className="w-5 h-5 text-blue-600" />,
          label: "Languages",
          value: "15",
        },
        {
          icon: <Award className="w-5 h-5 text-amber-600" />,
          label: "Accuracy Rate",
          value: "99.9%",
        },
      ],
      bgGradient: "from-red-500 to-rose-600",
      quote:
        "Accurate medical translation is literally life-saving. ILI-Nigeria delivers perfection.",
      client: "Dr. Sarah Adebayo, Chief Medical Officer",
    },
    {
      company: "Federal Ministry",
      industry: "Government",
      challenge: "International agreements",
      solution: "Official document translation",
      results: {
        metric: "100%",
        description: "Embassy acceptance",
        timeline: "2 years",
      },
      stats: [
        {
          icon: <Award className="w-5 h-5 text-blue-600" />,
          label: "Documents",
          value: "1,200+",
        },
        {
          icon: <Globe className="w-5 h-5 text-green-600" />,
          label: "Countries",
          value: "25",
        },
        {
          icon: <Clock className="w-5 h-5 text-orange-600" />,
          label: "Avg. Delivery",
          value: "24hrs",
        },
      ],
      bgGradient: "from-blue-500 to-indigo-600",
      quote:
        "Official translations require absolute precision. ILI-Nigeria has never failed us.",
      client: "Hon. Minister's Office",
    },
  ];

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

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
          Success Stories
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Real Results, Real Impact
        </h2>
        <p className="text-gray-600">
          See how we've helped clients achieve their global ambitions
        </p>
      </motion.div>

      {/* Main Story Showcase */}
      <div className="max-w-5xl mx-auto mb-8">
        <motion.div
          key={activeStory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r ${stories[activeStory].bgGradient}`}
        >
          <div className="relative p-8 md:p-12">
            <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Side - Story Content */}
              <div className="text-white">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">
                    {stories[activeStory].company}
                  </h3>
                  <p className="font-medium text-green-100">
                    {stories[activeStory].industry}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-semibold">Challenge:</h4>
                  <p className="text-green-50">
                    {stories[activeStory].challenge}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="mb-2 font-semibold">Solution:</h4>
                  <p className="text-green-50">
                    {stories[activeStory].solution}
                  </p>
                </div>

                {/* Quote */}
                <blockquote className="pl-4 mb-4 border-l-4 border-white">
                  <p className="italic text-green-50">
                    "{stories[activeStory].quote}"
                  </p>
                  <cite className="text-sm font-medium text-white">
                    - {stories[activeStory].client}
                  </cite>
                </blockquote>
              </div>

              {/* Right Side - Results */}
              <div className="text-center lg:text-right">
                <div className="mb-8">
                  <div className="mb-2 text-6xl font-bold text-white">
                    {stories[activeStory].results.metric}
                  </div>
                  <div className="text-xl font-medium text-green-100">
                    {stories[activeStory].results.description}
                  </div>
                  <div className="text-sm text-green-200">
                    in {stories[activeStory].results.timeline}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {stories[activeStory].stats.map((stat, idx) => (
                    <div key={idx} className="text-center lg:text-right">
                      <div className="flex items-center justify-center mb-2 lg:justify-end">
                        {stat.icon}
                        <span className="ml-2 font-medium text-white">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 bg-white rounded-full opacity-10"></div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={prevStory}
            className="p-3 mr-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
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
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* CTA - Simple */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Ready to Create Your Success Story?
          </h3>
          <p className="mb-6 text-gray-600">
            Join these successful companies and achieve your global goals
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetQuote}
            className="inline-flex items-center px-8 py-3 font-medium text-white transition-all duration-300 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
