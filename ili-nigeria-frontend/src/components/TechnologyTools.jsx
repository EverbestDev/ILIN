import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Cpu,
  Shield,
  Zap,
  Eye,
  Cloud,
  Lock,
  ArrowRight,
  CheckCircle,
  Monitor,
  Database,
  Globe,
  Award,
  ArrowLeft,
} from "lucide-react";

export default function TechnologyTools() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar"; // Helper functions for RTL styling
  const CTAArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const marginStart = isRtl ? "ms-2" : "mr-2";
  const marginEnd = isRtl ? "me-2" : "ml-2";
  const listDirection = isRtl ? "flex-row-reverse" : "flex-row"; // Icon map for main technology blocks

  const techIconMap = {
    cpu: <Cpu className="w-8 h-8 text-blue-600" />,
    shield: <Shield className="w-8 h-8 text-green-600" />,
    eye: <Eye className="w-8 h-8 text-purple-600" />,
    monitor: <Monitor className="w-8 h-8 text-orange-600" />,
  }; // Map main technologies data from JSON

  const technologies = t("technology.main", { returnObjects: true }).map(
    (tech) => ({
      ...tech,
      icon: techIconMap[tech.iconKey],
      features: tech.features, // languages array is handled in JSON
    })
  ); // Icon map for security features

  const securityIconMap = {
    lock: <Lock className="w-5 h-5 text-green-600" />,
    database: <Database className="w-5 h-5 text-green-600" />,
    award: <Award className="w-5 h-5 text-green-600" />,
    shield: <Shield className="w-5 h-5 text-green-600" />,
  }; // Map security features data from JSON
  const securityFeatures = t("technology.security.features", {
    returnObjects: true,
  }).map((feature) => ({
    ...feature,
    icon: securityIconMap[feature.iconKey],
  })); // Map performance stats data from JSON

  const performanceStats = t("technology.stats", { returnObjects: true });
  const statIconMap = {
    zap: <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-600" />,
    eye: <Eye className="w-12 h-12 mx-auto mb-3 text-purple-600" />,
    cloud: <Cloud className="w-12 h-12 mx-auto mb-3 text-blue-600" />,
  }; // Map performance stats with icons
  const statsWithIcons = performanceStats.map((stat) => ({
    ...stat,
    icon: statIconMap[stat.iconKey],
  }));

  const handleGetQuote = () => {
    navigate("/quote");
  };

  return (
    <section
      className="px-6 py-16 bg-gray-50 md:px-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
            {/* Section Header - Compact */}     
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
               
        <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                    {t("technology.header.badge")}       
        </span>
               
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                    {t("technology.header.title")}       
        </h2>
               
        <p className="text-gray-600">
                    {t("technology.header.description")}       
        </p>
             
      </motion.div>
            {/* Main Technologies */}     
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto mb-16 md:grid-cols-2 lg:grid-cols-4">
               
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-6 bg-white border-2 rounded-xl shadow-md transition-all duration-300 ${tech.borderColor} hover:shadow-lg hover:scale-105`}
          >
                        {/* Icon */}           
            <div
              className={`w-16 h-16 mb-4 rounded-xl ${tech.iconBg} flex items-center justify-center`}
            >
                            {tech.icon}           
            </div>
                        {/* Content */}           
            <h3 className="mb-3 text-lg font-bold text-gray-900">
                            {tech.title}           
            </h3>
                       
            <p className="mb-4 text-sm text-gray-600">{tech.description}</p>   
                    {/* Features */}           
            <ul className="space-y-2">
                           
              {tech.features.map((feature, idx) => (
                <li
                  key={idx}
                  className={`flex items-center text-xs text-gray-700 ${listDirection}`}
                >
                                   
                  <CheckCircle
                    className={`flex-shrink-0 w-3 h-3 ${marginStart} text-green-500`}
                  />
                                    {feature}               
                </li>
              ))}
                         
            </ul>
                     
          </motion.div>
        ))}
             
      </div>
            {/* Security Features */}     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
               
        <div className="p-8 bg-white shadow-lg rounded-xl">
                   
          <div className="mb-8 text-center">
                       
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />       
               
            <h3 className="mb-2 text-xl font-bold text-gray-900">
                            {t("technology.security.title")}           
            </h3>
                       
            <p className="text-gray-600">
                            {t("technology.security.description")}           
            </p>
                     
          </div>
                   
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                       
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center justify-center p-3 rounded-lg bg-green-50 ${listDirection}`}
              >
                                {feature.icon}               
                <span
                  className={`${marginEnd} text-sm font-medium text-gray-700`}
                >
                                    {feature.text}               
                </span>
                             
              </div>
            ))}
                     
          </div>
                 
        </div>
             
      </motion.div>
            {/* Performance Stats */}     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
               
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                   
          {statsWithIcons.map((stat, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white shadow-md rounded-xl"
            >
                            {stat.icon}             
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
                            <p className="text-gray-600">{stat.description}</p> 
                       
            </div>
          ))}
                 
        </div>
             
      </motion.div>
            {/* CTA */}     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
               
        <div className="p-8 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-white" />     
             
          <h3 className="mb-4 text-xl font-bold text-white">
                        {t("technology.cta.title")}         
          </h3>
                   
          <p className="mb-6 text-green-100">
                        {t("technology.cta.description")}         
          </p>
                   
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetQuote}
            className="inline-flex items-center px-8 py-3 font-medium text-green-600 transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
                        {t("technology.cta.button")}
                        <CTAArrowIcon className={`w-5 h-5 ${marginEnd}`} />     
               
          </motion.button>
                 
        </div>
             
      </motion.div>
         
    </section>
  );
}
