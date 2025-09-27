import { motion } from "framer-motion";
import { Globe, BookOpen, Zap, Flag, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aboutImg from "../assets/about.png";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Globe className="w-10 h-10 mx-auto text-green-600" />,
      title: "50+ Languages",
      desc: "Communicate seamlessly in more than 50 languages worldwide.",
    },
    {
      icon: <BookOpen className="w-10 h-10 mx-auto text-green-600" />,
      title: "Certified Experts",
      desc: "Work with accredited translators and interpreters for guaranteed quality.",
    },
    {
      icon: <Zap className="w-10 h-10 mx-auto text-yellow-500" />,
      title: "Fast & Reliable Delivery",
      desc: "Timely translations without compromising on accuracy.",
    },
    {
      icon: <Flag className="w-10 h-10 mx-auto text-red-500" />,
      title: "Cultural Accuracy",
      desc: "Preserving cultural meaning and nuance in every translation.",
    },
  ];

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  const highlights = [
    {
      icon: <Globe className="w-10 h-10 text-green-600" />,
      title: "Global Translation Services",
      desc: "We support over 50+ world languages with precise, human-level translation. Our certified translators ensure your message maintains its meaning and cultural nuance across all languages.",
      cta: "Get a Quote",
      featured: true,
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-green-600" />,
      title: "Live Interpreting",
      desc: "Real-time interpretation for events, meetings, and international conferences.",
      cta: "View Details",
      onClick: handleLearnMore,
    },
    {
      icon: <BookOpen className="w-10 h-10 text-purple-600" />,
      title: "Faith-Based Translation",
      desc: "Specialized expertise in religious and cultural translation with respect and accuracy.",
      cta: "View Details",
      onClick: handleLearnMore,
    },
    {
      icon: <Phone className="w-10 h-10 text-red-600" />,
      title: "Support & Consultation",
      desc: "Guidance and support for businesses entering global markets.",
      cta: "View Details",
      onClick: handleLearnMore,
    },
  ];

  // Separate featured service from others
  const featuredService = highlights.find((item) => item.featured);
  const otherServices = highlights.filter((item) => !item.featured);

  return (
    <section className="px-8 py-16 bg-white md:px-20" id="about">
      {/* About Heading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          About Us
        </span>
        <p className="mt-2 text-lg leading-relaxed text-gray-600">
          We are a professional translation and interpretation company helping
          businesses, organizations, and individuals communicate seamlessly
          across cultures. With certified translators and cultural experts, we
          ensure your message is delivered with clarity and precision.
        </p>
      </motion.div>

      {/* Image + Features grid */}
      <div className="flex flex-col items-center gap-12 md:flex-row">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <img
            src={aboutImg}
            alt="About our translation company"
            className="object-cover w-full shadow-lg rounded-2xl"
          />
        </motion.div>

        {/* Features side */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid w-full grid-cols-1 gap-6 md:w-1/2 sm:grid-cols-2"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative p-6 overflow-hidden text-center transition bg-white shadow-md group rounded-xl hover:shadow-lg"
            >
              {/* Animated green line (inside card) */}
              <span className="absolute top-0 w-0 h-1 transition-all duration-500 bg-green-600 left-1/2 group-hover:w-full group-hover:left-0"></span>

              {item.icon}
              <h4 className="mt-4 text-lg font-semibold text-gray-800">
                {item.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              <button
                onClick={handleLearnMore}
                className="px-4 py-2 mt-4 text-white transition bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Learn More
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* What We Offer - Updated Layout */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">
          What We Offer
        </h3>
        <p className="max-w-2xl mx-auto mt-4 text-gray-600">
          Our services are designed to help you break barriers and communicate
          confidently, no matter where you are in the world.
        </p>

        {/* Featured Service - Full Width Card */}
        {featuredService && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 mb-16"
          >
            <div className="relative overflow-hidden shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative px-8 py-12 md:px-16 md:py-16">
                <div className="flex flex-col items-center text-center text-white">
                  <div className="mb-6 transform scale-150">
                    {featuredService.icon}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                    {featuredService.title}
                  </h2>
                  <p className="max-w-4xl mb-8 text-lg leading-relaxed md:text-xl opacity-90">
                    {featuredService.desc}
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetQuote}
                      className="px-8 py-4 font-semibold text-green-600 transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      {featuredService.cta}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLearnMore}
                      className="px-8 py-4 font-semibold text-white transition-all duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full opacity-5"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 bg-white rounded-full opacity-5"></div>
            </div>
          </motion.div>
        )}

        {/* Other Services - Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 text-center transition duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl hover:transform hover:scale-105"
            >
              {/* Animated icon background */}
              <div
                className={`w-16 h-16 mb-4 rounded-2xl ${item.bgColor} ${item.hoverBg} transition-all duration-300 flex items-center justify-center hover:scale-110 hover:rotate-3`}
              >
                {item.icon}
              </div>

              <h4 className="mb-2 text-xl font-semibold">{item.title}</h4>
              <p className="flex-grow mb-4 text-gray-600">{item.desc}</p>
              <button
                onClick={item.onClick}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {item.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
