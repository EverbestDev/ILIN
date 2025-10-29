import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Globe,
  Star,
  ArrowLeft,
} from "lucide-react";

export default function ContactGetStarted() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar"; // Helper functions for RTL styling
  const CTAArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const marginStart = isRtl ? "ms-2" : "ml-2";
  const marginEnd = isRtl ? "me-3" : "mr-3";
  const listDirection = isRtl ? "flex-row-reverse" : "flex-row";
  const contentAlignment = isRtl ? "text-right" : "text-left"; // NEW: Text alignment helper // ---------------------------------------------------------------- // VITAL, NON-TRANSLATABLE DATA (Kept in JS for HREFs) // ----------------------------------------------------------------

  const contactMethodsSource = [
    {
      key: "whatsapp", // Key for JSON lookup
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      detail: "+234 810 906 7382", // Raw number for Href
      detailDisplay: "+234 810 906 7382", // Default display (Overwritten by JSON detailDisplay)
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
      link: "https://wa.me/message/ERTDGUAJTMNUA1",
    },
    {
      key: "phone",
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      detail: "+234 810 906 7382", // Raw number for Href
      detailDisplay: "+234 810 906 7382", // Default display
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
      link: "tel:+2348109067382",
    },
    {
      key: "email",
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      detail: "official.intlng@gmail.com", // Raw email for Href
      detailDisplay: "official.intlng@gmail.com", // Default display
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
      link: "mailto:official.intlng@gmail.com",
    },
  ];

  const officesSource = [
    {
      key: "ogun",
      isMain: true,
      hoursKey: "officeOgunHours",
    },
    {
      key: "abuja",
      isMain: false,
      hoursKey: "officeAbujaHours",
    },
    {
      key: "niamey",
      isMain: false,
      hoursKey: "officeNiameyHours",
    },
  ]; // ---------------------------------------------------------------- // MAPPING TRANSLATED DATA // ----------------------------------------------------------------

  const contactMethods = contactMethodsSource.map((method) => {
    const translated = t(`contact.methods.${method.key}`, {
      returnObjects: true,
    });
    return { ...method, ...translated };
  });

  const quickStats = t("contact.stats", { returnObjects: true }).map(
    (stat) => ({
      ...stat,
      icon:
        stat.iconKey === "users" ? (
          <Users className="w-8 h-8 text-green-600" />
        ) : stat.iconKey === "zap" ? (
          <Zap className="w-8 h-8 text-amber-600" />
        ) : stat.iconKey === "shield" ? (
          <Shield className="w-8 h-8 text-blue-600" />
        ) : (
          <Globe className="w-8 h-8 text-emerald-600" />
        ),
    })
  );

  const offices = officesSource.map((office) => {
    const translated = t(`contact.offices.${office.key}`, {
      returnObjects: true,
    });
    const hours = t(`contact.offices.${office.hoursKey}`);
    return {
      ...office,
      city: translated.city, // Use translated city name
      address: translated.fullAddress, // Use translated full address string
      hours: hours, // Use translated hours
    };
  });

  const whyChooseUs = t("contact.whyChooseUs.features", {
    returnObjects: true,
  });

  const businessHours = t("contact.businessHours.periods", {
    returnObjects: true,
  }); // ---------------------------------------------------------------- // EVENT HANDLERS // ----------------------------------------------------------------

  const handleQuickQuote = () => {
    navigate("/quote");
  };

  const handleContactPage = () => {
    navigate("/contact");
  }; // ---------------------------------------------------------------- // RENDER // ----------------------------------------------------------------

  return (
    <section
      className="px-6 py-20 bg-gray-50 md:px-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
            {/* Section Header (Kept text-center) */}     
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
               
        <span className="inline-block px-6 py-2 mb-4 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                    {t("contact.header.badge")}       
        </span>
               
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                    {t("contact.header.title")}       
        </h2>
               
        <p className="text-lg leading-relaxed text-gray-600">
                    {t("contact.header.description")}       
        </p>
             
      </motion.div>
            {/* Contact Methods */}     
      <div className="max-w-6xl mx-auto mb-16">
               
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
                   
          <h3 className="mb-12 text-2xl font-bold text-center text-gray-900">
                        {t("contact.methods.title")}         
          </h3>
                   
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                       
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 bg-white border-2 rounded-2xl shadow-md transition-all duration-300 ${method.borderColor} hover:shadow-xl hover:scale-105 group cursor-pointer ${contentAlignment}`}
              >
                                {/* Icon */}               
                <div
                  className={`w-20 h-20 mb-6 rounded-2xl ${
                    method.iconBg
                  } flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    isRtl ? "mx-auto" : "mx-0"
                  }`}
                >
                                    {method.icon}               
                </div>
                                {/* Content */}               
                <h4 className="mb-3 text-xl font-bold text-gray-900">
                                    {method.title}               
                </h4>
                               
                <p className="mb-4 text-gray-600">{method.description}</p>     
                         
                <a
                  className="mb-4 text-lg font-semibold text-green-600"
                  href={method.link}
                >
                                    {method.detailDisplay || method.detail}     
                           
                </a>
                               
                <div
                  className={`flex items-center justify-between ${
                    isRtl ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                                   
                  <span className="text-sm text-gray-500">
                                        {method.available}                 
                  </span>
                                   
                  <a href={method.link}>
                                       
                    <div
                      className={`flex items-center font-medium text-green-600 transition-transform ${
                        isRtl
                          ? "group-hover:-translate-x-2 flex-row-reverse"
                          : "group-hover:translate-x-2"
                      }`}
                    >
                                            {method.action}
                                           
                      <CTAArrowIcon className={`w-5 h-5 ${marginStart}`} />     
                                   
                    </div>
                                     
                  </a>
                                 
                </div>
                             
              </motion.div>
            ))}
                     
          </div>
                 
        </motion.div>
                {/* Stats Grid (Kept text-center) */}       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4"
        >
                   
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 ${stat.bgColor} rounded-2xl text-center shadow-md hover:shadow-lg transition-shadow`}
            >
                           
              <div className="flex justify-center mb-4">{stat.icon}</div>       
                   
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                {stat.value}             
              </h3>
                           
              <p className="text-sm text-gray-600">{stat.label}</p>           
            </div>
          ))}
                 
        </motion.div>
             
      </div>
            {/* Two-Column Layout */}     
      <div className="max-w-6xl mx-auto">
               
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left - Office Locations Card */}         
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 bg-white border border-gray-200 shadow-lg rounded-2xl ${contentAlignment}`}
          >
                       
            <div className={`flex items-center mb-8 ${listDirection}`}>
                           
              <div
                className={`flex items-center justify-center w-16 h-16 ${marginEnd} bg-green-100 rounded-2xl`}
              >
                                <MapPin className="w-8 h-8 text-green-600" />   
                         
              </div>
                           
              <div>
                               
                <h3 className="text-2xl font-bold text-gray-900">
                                    {t("contact.offices.title")}               
                </h3>
                               
                <p className="text-gray-600">
                                    {t("contact.offices.description")}         
                       
                </p>
                             
              </div>
                         
            </div>
                       
            <div className="space-y-6">
                           
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gray-50 rounded-xl"
                >
                                   
                  <div className="flex-1">
                                       
                    <div className={`flex items-center mb-2 ${listDirection}`}>
                                           
                      <h4 className="text-lg font-semibold text-gray-900">
                                                {office.city}                   
                         
                      </h4>
                                           
                      {office.isMain && (
                        <span
                          className={`${
                            isRtl ? "me-3" : "ml-3"
                          } px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full`}
                        >
                                                   
                          {t("contact.offices.mainOfficeBadge")}               
                                 
                        </span>
                      )}
                                         
                    </div>
                                       
                    <p className="mb-2 text-gray-600">{office.address}</p>     
                                 
                    <div
                      className={`flex items-center text-sm text-gray-500 ${listDirection}`}
                    >
                                           
                      <Clock className={`w-4 h-4 ${marginEnd}`} />             
                              {office.hours}                   
                    </div>
                                     
                  </div>
                                 
                </div>
              ))}
                         
            </div>
                       
            <div className="p-4 mt-8 bg-green-50 rounded-xl">
                           
              <div
                className={`flex items-center text-green-600 ${listDirection}`}
              >
                               
                <CheckCircle className={`w-5 h-5 ${marginEnd}`} />             
                 
                <span className="text-sm font-medium">
                                    {t("contact.offices.emergencyNote")}       
                         
                </span>
                             
              </div>
                         
            </div>
                     
          </motion.div>
                    {/* Right - Quick Actions */}         
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
                        {/* Quick Quote Card */}           
            <div
              className={`p-8 text-white shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl ${contentAlignment}`}
            >
                           
              <div className={`flex items-center mb-6 ${listDirection}`}>
                               
                <div
                  className={`flex items-center justify-center w-16 h-16 ${marginEnd} bg-white bg-opacity-20 rounded-2xl`}
                >
                                    <Star className="w-8 h-8 text-green-600" /> 
                               
                </div>
                               
                <div className="flex-1">
                                   
                  <h3 className="text-2xl font-bold">
                                        {t("contact.quoteCard.title")}         
                           
                  </h3>
                                   
                  <p className="text-green-100">
                                        {t("contact.quoteCard.description")}   
                                 
                  </p>
                                 
                </div>
                             
              </div>
                           
              <div
                className={`flex flex-col gap-4 sm:flex-row ${
                  isRtl ? "sm:flex-row-reverse" : ""
                }`}
              >
                               
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickQuote}
                  className={`inline-flex items-center justify-center flex-1 px-6 py-4 font-semibold text-green-600 transition-colors bg-white rounded-xl hover:bg-gray-100 ${listDirection}`}
                >
                                    {t("contact.quoteCard.buttonQuote")}
                                   
                  <CTAArrowIcon className={`w-5 h-5 ${marginStart}`} />         
                       
                </motion.button>
                               
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactPage}
                  className="inline-flex items-center justify-center flex-1 px-6 py-4 font-semibold text-orange-600 transition-all duration-300 bg-white border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
                >
                                    {t("contact.quoteCard.buttonContact")}     
                           
                </motion.button>
                             
              </div>
                         
            </div>
                        {/* Why Choose Us Card */}           
            <div
              className={`p-8 bg-white border border-gray-200 shadow-lg rounded-2xl ${contentAlignment}`}
            >
                           
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                                {t("contact.whyChooseUs.title")}             
              </h3>
                           
              <div className="space-y-4">
                               
                {whyChooseUs.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${listDirection}`}
                  >
                                       
                    <CheckCircle
                      className={`w-6 h-6 ${marginEnd} text-green-600`}
                    />
                                       
                    <span className="text-gray-700">
                                            {feature}                   
                    </span>
                                     
                  </div>
                ))}
                             
              </div>
                         
            </div>
                        {/* Business Hours Card */}           
            <div
              className={`p-8 border-2 border-blue-200 bg-blue-50 rounded-2xl ${contentAlignment}`}
            >
                           
              <div className={`flex items-center mb-6 ${listDirection}`}>
                               
                <Clock className={`w-8 h-8 ${marginEnd} text-blue-600`} />     
                         
                <h3 className="text-xl font-bold text-gray-900">
                                    {t("contact.businessHours.title")}         
                       
                </h3>
                             
              </div>
                           
              <div className="space-y-3">
                               
                {businessHours.map((period, index) => (
                  <div key={index} className="flex justify-between">
                                       
                    <span className="text-gray-600">{period.day}</span>         
                             
                    <span
                      className={`font-medium ${
                        period.hours === "Closed"
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                                            {period.hours}                   
                    </span>
                                     
                  </div>
                ))}
                             
              </div>
                         
            </div>
                     
          </motion.div>
                 
        </div>
             
      </div>
            {/* Bottom CTA (Kept text-center) */}     
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
               
        <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-2xl md:p-12">
                   
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
                        {t("contact.bottomCta.title")}         
          </h3>
                   
          <p className="max-w-2xl mx-auto mb-8 text-gray-600">
                        {t("contact.bottomCta.description")}         
          </p>
                   
          <div
            className={`flex flex-col justify-center gap-6 sm:flex-row ${
              isRtl ? "sm:flex-row-reverse" : ""
            }`}
          >
                       
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickQuote}
              className={`inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-green-600 shadow-lg rounded-xl hover:bg-green-700 ${listDirection}`}
            >
                            {t("contact.bottomCta.buttonQuote")}
                           
              <CTAArrowIcon className={`w-5 h-5 ${marginStart}`} />           
            </motion.button>
                       
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContactPage}
              className="inline-flex items-center px-8 py-4 font-semibold text-orange-600 transition-all duration-300 bg-white border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white"
            >
                            {t("contact.bottomCta.buttonConsultation")}         
               
            </motion.button>
                     
          </div>
                 
        </div>
             
      </motion.div>
       
    </section>
  );
}
