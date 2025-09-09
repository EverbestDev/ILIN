import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Clock,
  Shield,
  Users,
  Star,
  Globe,
  CheckCircle,
  Heart,
  Target,
  Zap,
  ArrowRight,
  Quote,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function WhyChooseILI() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    satisfaction: 0,
    languages: 0,
  });

  const advantages = [
    {
      icon: <Award className="w-8 h-8 text-gold-600" />,
      title: "Certified Translators",
      description:
        "All our translators are certified professionals with industry-specific expertise and proven track records.",
      features: [
        "ISO 17100 Certified",
        "University Qualified",
        "Industry Specialists",
        "Continuous Training",
      ],
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Lightning-Fast Delivery",
      description:
        "We understand deadlines matter. Our streamlined process ensures rapid turnaround without compromising quality.",
      features: [
        "24-hour Rush Service",
        "Real-time Updates",
        "Weekend Availability",
        "Express Processing",
      ],
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Quality Guaranteed",
      description:
        "Every translation undergoes rigorous quality checks with our multi-step review process and accuracy guarantee.",
      features: [
        "3-Step Review Process",
        "99.8% Accuracy Rate",
        "Money-back Guarantee",
        "Quality Certificates",
      ],
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Cultural Sensitivity",
      description:
        "We don't just translate words - we bridge cultures with deep understanding of local customs and nuances.",
      features: [
        "Local Cultural Experts",
        "Nigerian Market Focus",
        "Regional Variations",
        "Cultural Adaptation",
      ],
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      borderColor: "border-red-200",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Industry Expertise",
      description:
        "Specialized knowledge across 8+ industries ensures your content is translated with the right terminology.",
      features: [
        "8+ Industries Covered",
        "Technical Specialists",
        "Legal Certified",
        "Medical Expertise",
      ],
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support ensures you always have assistance when you need it most.",
      features: [
        "24/7 Live Chat",
        "Dedicated Managers",
        "Phone Support",
        "WhatsApp Available",
      ],
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  const testimonials = [
    {
      name: "Adebayo Okonkwo",
      role: "Immigration Lawyer",
      company: "Lagos Legal Associates",
      location: "Lagos, Nigeria",
      rating: 5,
      text: "ILI-Nigeria transformed my practice. Their certified translations are accepted by embassies worldwide, and the turnaround time is incredible. I've processed over 200 immigration cases with their help.",
      project: "Legal Document Translation",
      image: "👨🏿‍💼",
    },
    {
      name: "Dr. Fatima Al-Hassan",
      role: "Medical Director",
      company: "Abuja Medical Center",
      location: "Abuja, Nigeria",
      rating: 5,
      text: "When dealing with international patients, accuracy is literally life or death. ILI-Nigeria's medical translations are flawless, and their cultural sensitivity makes our patients feel understood.",
      project: "Medical Records Translation",
      image: "👩🏿‍⚕️",
    },
    {
      name: "James Chen",
      role: "Business Development",
      company: "TechNova Solutions",
      location: "Singapore",
      rating: 5,
      text: "Expanding into the African market seemed daunting until we found ILI-Nigeria. They didn't just translate our website - they localized it perfectly for Nigerian customers. Sales increased 340%!",
      project: "Website Localization",
      image: "👨‍💻",
    },
    {
      name: "Sarah Muhammad",
      role: "PhD Student",
      company: "University of Cambridge",
      location: "Cambridge, UK",
      rating: 5,
      text: "My academic transcripts needed perfect translation for my Cambridge application. ILI-Nigeria delivered certified translations that were accepted immediately. They made my dream possible!",
      project: "Academic Transcript Translation",
      image: "👩🏿‍🎓",
    },
    {
      name: "Pastor David Okafor",
      role: "Senior Pastor",
      company: "Grace Baptist Church",
      location: "Enugu, Nigeria",
      rating: 5,
      text: "Translating religious materials requires deep cultural understanding. ILI-Nigeria's team respected our faith while delivering translations that truly connected with our multilingual congregation.",
      project: "Religious Content Translation",
      image: "👨🏿‍🏫",
    },
  ];

  // Animated counters
  useEffect(() => {
    const targets = {
      clients: 5000,
      projects: 25000,
      satisfaction: 98,
      languages: 50,
    };
    const duration = 2500;
    const steps = 50;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setStats((prev) => ({
        clients: Math.min(
          prev.clients + Math.ceil(targets.clients / steps),
          targets.clients
        ),
        projects: Math.min(
          prev.projects + Math.ceil(targets.projects / steps),
          targets.projects
        ),
        satisfaction: Math.min(
          prev.satisfaction + Math.ceil(targets.satisfaction / steps),
          targets.satisfaction
        ),
        languages: Math.min(
          prev.languages + Math.ceil(targets.languages / steps),
          targets.languages
        ),
      }));
    }, increment);

    setTimeout(() => clearInterval(timer), duration);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

  return (
    <section className="px-6 py-20 bg-white md:px-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          Why Choose Us
        </span>
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Nigeria's Most Trusted
          <span className="block text-green-600">Translation Partner</span>
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          Join thousands of satisfied clients who trust ILI-Nigeria for their
          most important translation needs. Here's why we're the preferred
          choice across Nigeria and beyond.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-6 mb-20 md:grid-cols-4"
      >
        <div className="p-6 text-center bg-green-50 rounded-2xl">
          <Users className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {stats.clients.toLocaleString()}+
          </h3>
          <p className="text-gray-600">Happy Clients</p>
        </div>
        <div className="p-6 text-center bg-blue-50 rounded-2xl">
          <Globe className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {stats.projects.toLocaleString()}+
          </h3>
          <p className="text-gray-600">Projects Completed</p>
        </div>
        <div className="p-6 text-center bg-amber-50 rounded-2xl">
          <Star className="w-12 h-12 mx-auto mb-3 fill-current text-amber-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {stats.satisfaction}%
          </h3>
          <p className="text-gray-600">Satisfaction Rate</p>
        </div>
        <div className="p-6 text-center bg-purple-50 rounded-2xl">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            {stats.languages}+
          </h3>
          <p className="text-gray-600">Languages Supported</p>
        </div>
      </motion.div>

      {/* Advantages Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          What Sets Us Apart
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${advantage.borderColor} hover:shadow-xl hover:scale-105 group`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mb-4 rounded-2xl ${advantage.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
              >
                {advantage.icon}
              </div>

              {/* Content */}
              <h4 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-green-600">
                {advantage.title}
              </h4>
              <p className="mb-4 leading-relaxed text-gray-600">
                {advantage.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {advantage.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
          What Our Clients Say
        </h3>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="p-8 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl md:p-12"
          >
            <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start">
              {/* Client Avatar */}
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div
                  className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl ${testimonials[currentTestimonial].bgColor}`}
                >
                  {testimonials[currentTestimonial].initials}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Quote */}
                <Quote className="w-8 h-8 mx-auto mb-4 text-green-600 md:mx-0" />
                <p className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  "{testimonials[currentTestimonial].text}"
                </p>

                {/* Client Info */}
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="font-medium text-green-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].company}
                    </p>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {testimonials[currentTestimonial].location}
                      </span>
                    </div>
                  </div>

                  {/* Rating and Project */}
                  <div className="text-center md:text-right">
                    <div className="flex justify-center mb-2 md:justify-end">
                      {[...Array(testimonials[currentTestimonial].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-500 fill-current"
                          />
                        )
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Project: {testimonials[currentTestimonial].project}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 mr-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 ml-4 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
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
          <Star className="w-16 h-16 mx-auto mb-6 text-white fill-current" />
          <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            Ready to Experience the Difference?
          </h3>
          <p className="mb-8 text-lg leading-relaxed text-green-100">
            Join over 5,000+ satisfied clients who trust ILI-Nigeria for their
            translation needs. Get your free quote today and see why we're
            Nigeria's #1 translation service.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetQuote}
              className="inline-flex items-center px-8 py-4 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center px-8 py-4 font-medium text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Contact Us Today
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
