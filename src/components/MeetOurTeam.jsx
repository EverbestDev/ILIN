import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Globe,
  BookOpen,
  Users,
  ArrowRight,
  MapPin,
  Star,
  Languages,
} from "lucide-react";

export default function MeetOurTeam() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Dr. Amina Bello",
      role: "Chief Translation Officer",
      specialization: "Medical & Legal Translation",
      languages: ["English", "French", "Arabic", "Hausa"],
      experience: "12+ years",
      certifications: ["ISO 17100", "Medical Certified", "Court Certified"],
      location: "Lagos, Nigeria",
      initials: "AB",
      bgColor: "bg-blue-600",
      expertise: "Led 5,000+ medical translations with 99.9% accuracy",
    },
    {
      name: "Emmanuel Okafor",
      role: "Senior Business Translator",
      specialization: "Finance & Technology",
      languages: ["English", "Igbo", "German", "Mandarin"],
      experience: "8+ years",
      certifications: [
        "Business Certified",
        "Tech Specialist",
        "Financial Expert",
      ],
      location: "Abuja, Nigeria",
      initials: "EO",
      bgColor: "bg-green-600",
      expertise: "Helped 200+ companies expand internationally",
    },
    {
      name: "Fatima Al-Rashid",
      role: "Cultural Adaptation Specialist",
      specialization: "Religious & Educational Content",
      languages: ["Arabic", "English", "French", "Yoruba"],
      experience: "10+ years",
      certifications: [
        "Cultural Expert",
        "Educational Certified",
        "Religious Scholar",
      ],
      location: "Kano, Nigeria",
      initials: "FR",
      bgColor: "bg-purple-600",
      expertise: "Cultural adaptation for 1,500+ educational projects",
    },
    {
      name: "Sarah Adeyemi",
      role: "Quality Assurance Director",
      specialization: "Multi-language Quality Control",
      languages: ["English", "Spanish", "Portuguese", "Yoruba"],
      experience: "9+ years",
      certifications: ["QA Certified", "ISO Auditor", "Linguistics PhD"],
      location: "Lagos, Nigeria",
      initials: "SA",
      bgColor: "bg-red-600",
      expertise: "Reviewed 15,000+ translations with zero errors",
    },
  ];

  const teamStats = [
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      label: "Expert Translators",
      value: "50+",
    },
    {
      icon: <Languages className="w-8 h-8 text-blue-600" />,
      label: "Languages Covered",
      value: "50+",
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      label: "Certifications",
      value: "200+",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      label: "Years Experience",
      value: "15+",
    },
  ];

  const handleJoinTeam = () => {
    navigate("/contact");
  };

  const handleGetQuote = () => {
    navigate("/quote");
  };

  return (
    <section className="px-6 py-16 bg-white md:px-20">
      {/* Section Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12 text-center"
      >
        <span className="inline-block px-4 py-1 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
          Our Team
        </span>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Expert Translators, Proven Results
        </h2>
        <p className="text-gray-600">
          Meet the certified professionals who make your global communication
          possible
        </p>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid max-w-4xl grid-cols-2 gap-6 mx-auto mb-16 md:grid-cols-4"
      >
        {teamStats.map((stat, index) => (
          <div key={index} className="p-6 text-center bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-3">{stat.icon}</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Team Members */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto mb-12 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 transition-shadow duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full ${member.bgColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                {member.initials}
              </div>
            </div>

            {/* Info */}
            <div className="mb-4 text-center">
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="mb-2 text-sm font-medium text-green-600">
                {member.role}
              </p>
              <p className="text-sm text-gray-600">{member.specialization}</p>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <p className="mb-2 text-xs text-gray-500">Languages:</p>
              <div className="flex flex-wrap gap-1">
                {member.languages.slice(0, 3).map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                  >
                    {lang}
                  </span>
                ))}
                {member.languages.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                    +{member.languages.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Experience & Location */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-amber-500" />
                {member.experience} experience
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-green-600" />
                {member.location}
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-4">
              <p className="text-xs italic text-gray-600">{member.expertise}</p>
            </div>

            {/* Certifications */}
            <div>
              <p className="mb-2 text-xs text-gray-500">Certifications:</p>
              <div className="flex flex-wrap gap-1">
                {member.certifications.slice(0, 2).map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded"
                  >
                    {cert}
                  </span>
                ))}
                {member.certifications.length > 2 && (
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                    +{member.certifications.length - 2}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Work With Us */}
          <div className="p-6 text-center bg-green-50 rounded-xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Work With Our Experts
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Get matched with the perfect translator for your project needs
            </p>
            <button
              onClick={handleGetQuote}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              Start Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Join Team */}
          <div className="p-6 text-center bg-orange-50 rounded-xl">
            <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Join Our Team
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Are you a certified translator? We're always looking for talent
            </p>
            <button
              onClick={handleJoinTeam}
              className="inline-flex items-center px-6 py-3 font-medium text-orange-600 transition-colors bg-white border-2 border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
