import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg1 from "../assets/hero1.png";
import heroImg2 from "../assets/hero2.png";
import heroImg3 from "../assets/hero3.png";
import LanguageMarquee from "./LanguageMarquee";

export default function Hero() {
  const images = [heroImg1, heroImg2, heroImg3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Cycle images every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <section
      className="flex flex-col justify-between px-6 pt-24 pb-2 md:px-20 bg-gray-50 md:pt-28 md:pb-10"
      style={{ minHeight: "calc(100vh - 64px)" }} // subtract navbar height
    >
      {/* Content row (text + image) */}
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
        {/* Text side */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-lg text-center md:text-left"
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Breaking <span className="text-green-600">Language Barriers</span>,{" "}
            Building <span className="text-green-600">Global Connections</span>
          </h1>

          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            We provide professional translation and interpretation services in
            over{" "}
            <span className="font-semibold text-green-600">50+ languages</span>.
            From documents, websites, and apps to voiceovers and real-time
            interpretation, our certified experts ensure your message reaches
            the world with clarity and cultural accuracy.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 sm:justify-center md:justify-start">
            <motion.button
              whileTap={{ scale: 0.95, opacity: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleGetQuote}
              className="px-8 py-3 font-medium text-white transition-colors duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Get a Quote
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95, opacity: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleLearnMore}
              className="px-8 py-3 font-medium text-gray-900 transition-colors duration-300 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Image slider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-[400px] h-[300px] md:w-[450px] md:h-[450px] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Translation Illustration ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 object-contain w-full h-full"
            />
          </AnimatePresence>

          {/* Image indicators */}
          <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marquee (hidden on mobile, visible on md+) */}
      <div className="hidden md:block w-screen relative left-1/2 right-1/2 -mx-[50vw] mt-8">
        <LanguageMarquee />
      </div>
    </section>
  );
}
