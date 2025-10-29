import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ← ADD
import heroImg1 from "../assets/hero1.png";
import heroImg2 from "../assets/hero2.png";
import heroImg3 from "../assets/hero3.png";
import LanguageMarquee from "./LanguageMarquee";

export default function Hero() {
  const { t } = useTranslation(); // ← ADD
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

  const handleGetQuote = () => navigate("/quote");
  const handleLearnMore = () => navigate("/about");

  return (
    <section className="flex flex-col justify-between px-6 pt-24 pb-2 md:px-20 md:pt-28 md:pb">
      {/* Content row */}
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
        {/* Text side */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 max-w-lg text-center md:text-start" // ← RTL: text-start
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            {t("hero.title1")}{" "}
            <span className="text-green-600">{t("hero.title2")}</span>,{" "}
            {t("hero.title3")}{" "}
            <span className="text-green-600">{t("hero.title4")}</span>
          </h1>

          <p className="mb-8 leading-relaxed text-gray-600 text-md">
            {t("hero.description1")}{" "}
            <span className="font-bold text-green-600">
              {t("hero.languages")}
            </span>
            .{t("hero.description2")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 sm:justify-center md:justify-start">
            <motion.button
              whileTap={{ scale: 0.95, opacity: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleGetQuote}
              className="px-8 py-3 font-medium text-white transition-colors duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t("hero.getQuote")}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95, opacity: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleLearnMore}
              className="px-8 py-3 font-medium text-gray-900 transition-colors duration-300 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {t("hero.learnMore")}
            </motion.button>
          </div>
        </motion.div>

        {/* Image slider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex-1 relative w-full h-[300px] md:w-[450px] md:h-[450px] overflow-hidden rounded-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={t(`hero.imageAlt${currentIndex + 1}`)} // ← Translated alt
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 object-contain w-full h-full"
              loading="eager" // ← Force load all images
            />
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 start-1/2">
            {" "}
            {/* start-1/2 = logical center */}
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
                aria-label={t("hero.goToSlide", { number: index + 1 })}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="hidden md:block w-screen relative start-1/2 end-1/2 -ms-[50vw] -me-[50vw] mt-6">
        <LanguageMarquee />
      </div>
    </section>
  );
}
