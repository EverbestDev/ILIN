import { motion } from "framer-motion";
import { Globe, MessageSquare, BookOpen, Phone } from "lucide-react";
import aboutImg from "../assets/about.png";

export default function About() {
  const highlights = [
    {
      icon: <Globe className='w-10 h-10 text-blue-600' />,
      title: "Global Reach",
      desc: "We support over 50+ world languages with precise, human-level translation.",
      cta: "Explore",
    },
    {
      icon: <MessageSquare className='w-10 h-10 text-green-600' />,
      title: "Live Interpreting",
      desc: "Real-time interpretation for events, meetings, and international conferences.",
      cta: "Discover",
    },
    {
      icon: <BookOpen className='w-10 h-10 text-purple-600' />,
      title: "Faith-Based Translation",
      desc: "Specialized expertise in religious and cultural translation with respect and accuracy.",
      cta: "View Details",
    },
    {
      icon: <Phone className='w-10 h-10 text-red-600' />,
      title: "Support & Consultation",
      desc: "Guidance and support for businesses entering global markets.",
      cta: "Check It Out",
    },
  ];

  return (
    <section className='px-8 py-16 bg-white md:px-20' id='about'>
      {/* Top section */}
      <div className='flex flex-col items-center gap-12 md:flex-row'>
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='w-full md:w-1/2'>
          <img
            src={aboutImg}
            alt='About our translation company'
            className='object-cover w-full shadow-lg rounded-2xl'
          />
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='w-full md:w-1/2'>
          <h2 className='mb-6 text-3xl font-bold text-gray-800 md:text-4xl'>
            About Us
          </h2>
          <p className='mb-6 text-lg leading-relaxed text-gray-600'>
            We are a professional translation and interpretation company helping
            businesses, organizations, and individuals communicate seamlessly
            across cultures. With certified translators and cultural experts, we
            ensure your message is delivered with clarity and precision.
          </p>

          {/* Highlights */}
          <ul className='grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2'>
            <li className='flex items-center space-x-2'>
              <span className='text-green-500'>✔</span>
              <span>50+ Languages</span>
            </li>
            <li className='flex items-center space-x-2'>
              <span className='text-green-500'>✔</span>
              <span>Certified Experts</span>
            </li>
            <li className='flex items-center space-x-2'>
              <span className='text-green-500'>✔</span>
              <span>Fast & Reliable Delivery</span>
            </li>
            <li className='flex items-center space-x-2'>
              <span className='text-green-500'>✔</span>
              <span>Cultural Accuracy</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Options as cards */}
      <div className='mt-20 text-center'>
        <h3 className='text-2xl font-bold text-gray-800 md:text-3xl'>
          What We Offer
        </h3>
        <p className='max-w-2xl mx-auto mt-4 text-gray-600'>
          Our services are designed to help you break barriers and communicate
          confidently, no matter where you are in the world.
        </p>

        <div className='grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4'>
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className='bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition'>
              {item.icon}
              <h4 className='mt-4 text-xl font-semibold'>{item.title}</h4>
              <p className='mt-2 text-gray-600'>{item.desc}</p>
              <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                {item.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
