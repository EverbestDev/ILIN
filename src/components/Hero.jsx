import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroImg1 from "../assets/hero1.png";
import heroImg2 from "../assets/hero2.png"; // add more images in assets
import heroImg3 from "../assets/hero3.png";
import LanguageMarquee from "./LanguageMarquee";

export default function Hero() {
  const images = [heroImg1, heroImg2, heroImg3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle images every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      className='flex flex-col justify-between px-6 pt-20 pb-6 md:px-20 bg-gray-50 md:pt-28 md:pb-10'
      style={{ minHeight: "calc(100vh - 64px)" }} // subtract ONLY navbar
    >
      {/* Content row (text + image) */}
      <div className='flex flex-col items-center justify-between md:flex-row'>
        {/* Text side */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='max-w-lg text-center md:text-left'>
          <h1 className='mb-6 text-4xl font-bold leading-tight md:text-5xl'>
            Breaking <span className='text-blue-600'>Language Barriers</span>,{" "}
            Building <span className='text-blue-600'>Global Connections</span>
          </h1>

          <p className='mb-6 text-lg text-gray-600'>
            We provide professional translation and interpretation services in
            over <span className='font-semibold'>50+ languages</span>. From
            documents, websites, and apps to voiceovers and real-time
            interpretation, our certified experts ensure your message reaches
            the world with clarity and cultural accuracy.
          </p>

          <div className='space-x-4'>
            <button className='px-6 py-3 text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700'>
              Get a Quote
            </button>
            <button className='px-6 py-3 text-gray-900 transition-colors duration-300 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white'>
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Image slider (hidden on small, visible on md+) */}
        <div className='hidden md:block relative w-[350px] md:w-[450px] h-[350px] md:h-[450px] overflow-hidden'>
          <AnimatePresence mode='wait'>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt='Translation Illustration'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className='absolute inset-0 object-contain w-full h-full'
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Marquee (hidden on small, visible on md+) */}
      <div className='hidden md:block w-screen relative left-1/2 right-1/2 -mx-[50vw] mt-2'>
        <LanguageMarquee />
      </div>
    </section>
  );
}
