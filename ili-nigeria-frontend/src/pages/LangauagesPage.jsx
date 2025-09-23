import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Globe,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
} from "lucide-react";

export default function LanguagesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(0);

  const regions = [
    "All",
    "African",
    "European",
    "Asian",
    "Middle Eastern",
    "Americas",
  ];
  const categories = ["All", "Popular", "Certified", "Specialized"];

  const languages = [
    // African Languages (Nigerian focus)
    {
      name: "Yoruba",
      region: "African",
      speakers: "50M+",
      flag: "🇳🇬",
      popular: true,
      certified: true,
      specialized: true,
      country: "Nigeria",
      difficulty: "Medium",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Igbo",
      region: "African",
      speakers: "30M+",
      flag: "🇳🇬",
      popular: true,
      certified: true,
      specialized: true,
      country: "Nigeria",
      difficulty: "Medium",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Hausa",
      region: "African",
      speakers: "70M+",
      flag: "🇳🇬",
      popular: true,
      certified: true,
      specialized: true,
      country: "Nigeria",
      difficulty: "Medium",
      script: "Latin/Arabic",
      family: "Afro-Asiatic",
    },
    {
      name: "Swahili",
      region: "African",
      speakers: "100M+",
      flag: "🇰🇪",
      popular: true,
      certified: true,
      specialized: false,
      country: "Kenya/Tanzania",
      difficulty: "Easy",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Amharic",
      region: "African",
      speakers: "25M+",
      flag: "🇪🇹",
      popular: false,
      certified: true,
      specialized: true,
      country: "Ethiopia",
      difficulty: "Hard",
      script: "Ge'ez",
      family: "Afro-Asiatic",
    },
    {
      name: "Akan (Twi)",
      region: "African",
      speakers: "11M+",
      flag: "🇬🇭",
      popular: false,
      certified: true,
      specialized: false,
      country: "Ghana",
      difficulty: "Medium",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Zulu",
      region: "African",
      speakers: "12M+",
      flag: "🇿🇦",
      popular: false,
      certified: true,
      specialized: false,
      country: "South Africa",
      difficulty: "Medium",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Xhosa",
      region: "African",
      speakers: "8M+",
      flag: "🇿🇦",
      popular: false,
      certified: true,
      specialized: false,
      country: "South Africa",
      difficulty: "Hard",
      script: "Latin",
      family: "Niger-Congo",
    },
    {
      name: "Wolof",
      region: "African",
      speakers: "5M+",
      flag: "🇸🇳",
      popular: false,
      certified: true,
      specialized: false,
      country: "Senegal",
      difficulty: "Medium",
      script: "Latin",
      family: "Niger-Congo",
    },

    // European Languages
    {
      name: "English",
      region: "European",
      speakers: "1.5B+",
      flag: "🇬🇧",
      popular: true,
      certified: true,
      specialized: false,
      country: "United Kingdom",
      difficulty: "Medium",
      script: "Latin",
      family: "Germanic",
    },
    {
      name: "Spanish",
      region: "European",
      speakers: "500M+",
      flag: "🇪🇸",
      popular: true,
      certified: true,
      specialized: false,
      country: "Spain",
      difficulty: "Easy",
      script: "Latin",
      family: "Romance",
    },
    {
      name: "French",
      region: "European",
      speakers: "280M+",
      flag: "🇫🇷",
      popular: true,
      certified: true,
      specialized: false,
      country: "France",
      difficulty: "Medium",
      script: "Latin",
      family: "Romance",
    },
    {
      name: "German",
      region: "European",
      speakers: "100M+",
      flag: "🇩🇪",
      popular: true,
      certified: true,
      specialized: true,
      country: "Germany",
      difficulty: "Hard",
      script: "Latin",
      family: "Germanic",
    },
    {
      name: "Italian",
      region: "European",
      speakers: "65M+",
      flag: "🇮🇹",
      popular: true,
      certified: true,
      specialized: false,
      country: "Italy",
      difficulty: "Medium",
      script: "Latin",
      family: "Romance",
    },
    {
      name: "Portuguese",
      region: "European",
      speakers: "260M+",
      flag: "🇵🇹",
      popular: true,
      certified: true,
      specialized: false,
      country: "Portugal",
      difficulty: "Medium",
      script: "Latin",
      family: "Romance",
    },
    {
      name: "Russian",
      region: "European",
      speakers: "258M+",
      flag: "🇷🇺",
      popular: true,
      certified: true,
      specialized: true,
      country: "Russia",
      difficulty: "Hard",
      script: "Cyrillic",
      family: "Slavic",
    },
    {
      name: "Dutch",
      region: "European",
      speakers: "24M+",
      flag: "🇳🇱",
      popular: false,
      certified: true,
      specialized: false,
      country: "Netherlands",
      difficulty: "Medium",
      script: "Latin",
      family: "Germanic",
    },
    {
      name: "Polish",
      region: "European",
      speakers: "45M+",
      flag: "🇵🇱",
      popular: false,
      certified: true,
      specialized: false,
      country: "Poland",
      difficulty: "Hard",
      script: "Latin",
      family: "Slavic",
    },
    {
      name: "Swedish",
      region: "European",
      speakers: "10M+",
      flag: "🇸🇪",
      popular: false,
      certified: true,
      specialized: false,
      country: "Sweden",
      difficulty: "Medium",
      script: "Latin",
      family: "Germanic",
    },
    {
      name: "Norwegian",
      region: "European",
      speakers: "5M+",
      flag: "🇳🇴",
      popular: false,
      certified: true,
      specialized: false,
      country: "Norway",
      difficulty: "Medium",
      script: "Latin",
      family: "Germanic",
    },
    {
      name: "Danish",
      region: "European",
      speakers: "6M+",
      flag: "🇩🇰",
      popular: false,
      certified: true,
      specialized: false,
      country: "Denmark",
      difficulty: "Medium",
      script: "Latin",
      family: "Germanic",
    },

    // Asian Languages
    {
      name: "Mandarin Chinese",
      region: "Asian",
      speakers: "918M+",
      flag: "🇨🇳",
      popular: true,
      certified: true,
      specialized: true,
      country: "China",
      difficulty: "Very Hard",
      script: "Chinese",
      family: "Sino-Tibetan",
    },
    {
      name: "Hindi",
      region: "Asian",
      speakers: "600M+",
      flag: "🇮🇳",
      popular: true,
      certified: true,
      specialized: false,
      country: "India",
      difficulty: "Medium",
      script: "Devanagari",
      family: "Indo-European",
    },
    {
      name: "Japanese",
      region: "Asian",
      speakers: "125M+",
      flag: "🇯🇵",
      popular: true,
      certified: true,
      specialized: true,
      country: "Japan",
      difficulty: "Very Hard",
      script: "Hiragana/Katakana/Kanji",
      family: "Japonic",
    },
    {
      name: "Korean",
      region: "Asian",
      speakers: "77M+",
      flag: "🇰🇷",
      popular: true,
      certified: true,
      specialized: true,
      country: "South Korea",
      difficulty: "Hard",
      script: "Hangul",
      family: "Koreanic",
    },
    {
      name: "Thai",
      region: "Asian",
      speakers: "60M+",
      flag: "🇹🇭",
      popular: false,
      certified: true,
      specialized: false,
      country: "Thailand",
      difficulty: "Hard",
      script: "Thai",
      family: "Tai-Kadai",
    },
    {
      name: "Vietnamese",
      region: "Asian",
      speakers: "95M+",
      flag: "🇻🇳",
      popular: false,
      certified: true,
      specialized: false,
      country: "Vietnam",
      difficulty: "Hard",
      script: "Latin",
      family: "Austroasiatic",
    },
    {
      name: "Tagalog",
      region: "Asian",
      speakers: "45M+",
      flag: "🇵🇭",
      popular: false,
      certified: true,
      specialized: false,
      country: "Philippines",
      difficulty: "Medium",
      script: "Latin",
      family: "Austronesian",
    },
    {
      name: "Indonesian",
      region: "Asian",
      speakers: "43M+",
      flag: "🇮🇩",
      popular: false,
      certified: true,
      specialized: false,
      country: "Indonesia",
      difficulty: "Easy",
      script: "Latin",
      family: "Austronesian",
    },
    {
      name: "Malay",
      region: "Asian",
      speakers: "33M+",
      flag: "🇲🇾",
      popular: false,
      certified: true,
      specialized: false,
      country: "Malaysia",
      difficulty: "Easy",
      script: "Latin",
      family: "Austronesian",
    },
    {
      name: "Bengali",
      region: "Asian",
      speakers: "230M+",
      flag: "🇧🇩",
      popular: false,
      certified: true,
      specialized: false,
      country: "Bangladesh",
      difficulty: "Medium",
      script: "Bengali",
      family: "Indo-European",
    },

    // Middle Eastern Languages
    {
      name: "Arabic",
      region: "Middle Eastern",
      speakers: "420M+",
      flag: "🇸🇦",
      popular: true,
      certified: true,
      specialized: true,
      country: "Saudi Arabia",
      difficulty: "Hard",
      script: "Arabic",
      family: "Afro-Asiatic",
    },
    {
      name: "Persian (Farsi)",
      region: "Middle Eastern",
      speakers: "70M+",
      flag: "🇮🇷",
      popular: false,
      certified: true,
      specialized: true,
      country: "Iran",
      difficulty: "Hard",
      script: "Arabic",
      family: "Indo-European",
    },
    {
      name: "Turkish",
      region: "Middle Eastern",
      speakers: "80M+",
      flag: "🇹🇷",
      popular: true,
      certified: true,
      specialized: false,
      country: "Turkey",
      difficulty: "Hard",
      script: "Latin",
      family: "Turkic",
    },
    {
      name: "Hebrew",
      region: "Middle Eastern",
      speakers: "9M+",
      flag: "🇮🇱",
      popular: false,
      certified: true,
      specialized: true,
      country: "Israel",
      difficulty: "Hard",
      script: "Hebrew",
      family: "Afro-Asiatic",
    },
    {
      name: "Kurdish",
      region: "Middle Eastern",
      speakers: "30M+",
      flag: "🏴",
      popular: false,
      certified: true,
      specialized: true,
      country: "Kurdistan Region",
      difficulty: "Hard",
      script: "Latin/Arabic",
      family: "Indo-European",
    },

    // Americas Languages
    {
      name: "Portuguese (Brazilian)",
      region: "Americas",
      speakers: "215M+",
      flag: "🇧🇷",
      popular: true,
      certified: true,
      specialized: false,
      country: "Brazil",
      difficulty: "Medium",
      script: "Latin",
      family: "Romance",
    },
    {
      name: "Quechua",
      region: "Americas",
      speakers: "8M+",
      flag: "🇵🇪",
      popular: false,
      certified: true,
      specialized: true,
      country: "Peru",
      difficulty: "Hard",
      script: "Latin",
      family: "Quechuan",
    },
    {
      name: "Guaraní",
      region: "Americas",
      speakers: "5M+",
      flag: "🇵🇾",
      popular: false,
      certified: true,
      specialized: true,
      country: "Paraguay",
      difficulty: "Hard",
      script: "Latin",
      family: "Tupian",
    },
  ];

  // Filter languages
  const filteredLanguages = languages.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === "All" || lang.region === selectedRegion;
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Popular" && lang.popular) ||
      (selectedCategory === "Certified" && lang.certified) ||
      (selectedCategory === "Specialized" && lang.specialized);
    return matchesSearch && matchesRegion && matchesCategory;
  });

  // Animated counter for total languages
  useEffect(() => {
    let start = 0;
    const end = languages.length + 161; //I added 161 to make it 200
    const duration = 1500;
    const increment = Math.ceil(end / (duration / 50));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const popularLanguages = languages.filter((lang) => lang.popular);
  const africanLanguages = languages.filter(
    (lang) => lang.region === "African"
  );

  const handleGetQuote = () => {
    navigate("/quote");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 pt-32 bg-gradient-to-br from-green-50 to-emerald-50 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
              Languages We Support
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              <span className="text-green-600">{displayCount}+</span> Languages
              <span className="block">Connecting Global Communities</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              From major international languages to local Nigerian dialects, our
              certified translators provide expert linguistic services with deep
              cultural understanding.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="p-6 bg-white shadow-md rounded-2xl">
                <Globe className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="mb-1 text-2xl font-bold text-gray-900">50+</h3>
                <p className="text-gray-600">Languages Supported</p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-2xl">
                <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="mb-1 text-2xl font-bold text-gray-900">3B+</h3>
                <p className="text-gray-600">Native Speakers Covered</p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-2xl">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="mb-1 text-2xl font-bold text-gray-900">195</h3>
                <p className="text-gray-600">Countries Reached</p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-2xl">
                <Award className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="mb-1 text-2xl font-bold text-gray-900">15+</h3>
                <p className="text-gray-600">Specialized Fields</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nigerian Languages Spotlight */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Nigerian Languages - Our Specialty
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              As a Nigerian company, we have deep expertise in local languages,
              understanding cultural nuances that make communication truly
              effective.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3">
            {africanLanguages.slice(0, 3).map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 text-center transition-shadow border-2 border-green-200 bg-green-50 rounded-2xl hover:shadow-lg"
              >
                <div className="mb-4 text-6xl">{lang.flag}</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {lang.name}
                </h3>
                <p className="mb-4 font-semibold text-green-600">
                  {lang.speakers} speakers
                </p>
                <p className="mb-6 text-gray-600">
                  Native {lang.country} language with rich cultural heritage
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  {lang.certified && (
                    <div className="flex items-center text-green-600">
                      <Award className="w-4 h-4 mr-1" />
                      Certified
                    </div>
                  )}
                  {lang.specialized && (
                    <div className="flex items-center text-blue-600">
                      <Star className="w-4 h-4 mr-1" />
                      Specialized
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="mb-6 text-gray-600">
              We also support other major African languages including Swahili,
              Amharic, Akan, Zulu, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Languages */}
      <section className="px-6 py-20 bg-gray-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Most Requested Languages
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              The languages most frequently requested by our clients across
              various industries and sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {popularLanguages.slice(0, 12).map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 text-center transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg hover:scale-105"
              >
                <div className="mb-3 text-4xl">{lang.flag}</div>
                <h4 className="mb-1 font-semibold text-gray-900">
                  {lang.name}
                </h4>
                <p className="mb-2 text-sm text-gray-600">{lang.speakers}</p>
                <Star className="w-4 h-4 mx-auto text-yellow-500 fill-current" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Language Browser */}
      <section className="px-6 py-20 bg-white md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Complete Language Directory
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore our complete language offerings with detailed information
              about each language we support.
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-6 mb-12 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search languages or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <Filter className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="pl-12 pr-8 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region} Languages
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredLanguages.length}
              </span>{" "}
              languages
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {selectedRegion !== "All" && <span> in {selectedRegion}</span>}
              {selectedCategory !== "All" && <span> ({selectedCategory})</span>}
            </p>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLanguages.map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${
                  lang.region === "African"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="mr-4 text-3xl">{lang.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {lang.name}
                      </h3>
                      <p className="text-sm text-gray-600">{lang.country}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {lang.popular && (
                      <Star className="w-4 h-4 mb-1 text-yellow-500 fill-current" />
                    )}
                    {lang.certified && (
                      <Award className="w-4 h-4 mb-1 text-green-600" />
                    )}
                    {lang.specialized && (
                      <Target className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speakers:</span>
                    <span className="font-semibold text-gray-900">
                      {lang.speakers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span
                      className={`font-semibold ${
                        lang.difficulty === "Easy"
                          ? "text-green-600"
                          : lang.difficulty === "Medium"
                          ? "text-yellow-600"
                          : lang.difficulty === "Hard"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {lang.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Script:</span>
                    <span className="font-semibold text-gray-900">
                      {lang.script}
                    </span>
                  </div>
                </div>

                {lang.region === "African" && (
                  <div className="flex items-center px-3 py-1 mt-4 text-xs text-green-600 bg-green-100 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Local Expertise Available
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-16 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-600">
                No languages found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Service Features */}
      <section className="px-6 py-20 bg-gray-50 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              What Makes Our Language Services Special
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Beyond just translation, we provide comprehensive language
              solutions with cultural expertise and industry specialization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 text-center bg-white shadow-md rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Native Speakers
              </h3>
              <p className="text-gray-600">
                All translations done by certified native speakers with cultural
                expertise
              </p>
            </div>

            <div className="p-6 text-center bg-white shadow-md rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Certified Quality
              </h3>
              <p className="text-gray-600">
                ISO 17100 certified processes ensuring accuracy and reliability
              </p>
            </div>

            <div className="p-6 text-center bg-white shadow-md rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Industry Specialization
              </h3>
              <p className="text-gray-600">
                Specialized translators for legal, medical, technical, and
                business content
              </p>
            </div>

            <div className="p-6 text-center bg-white shadow-md rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Fast Turnaround
              </h3>
              <p className="text-gray-600">
                Quick delivery without compromising quality - most projects
                completed within 48 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 bg-green-600 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white">
              Don't See Your Language Listed?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-green-100">
              We're constantly expanding our language capabilities. If you need
              a language not shown here, contact us - we likely have qualified
              translators available or can source them quickly for your project.
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetQuote}
                className="inline-flex items-center px-8 py-4 font-semibold text-green-600 transition-colors bg-white shadow-lg rounded-xl hover:bg-gray-100"
              >
                Request Your Language
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className="inline-flex items-center px-8 py-4 font-semibold text-white transition-colors bg-transparent border-2 border-orange-500 rounded-xl hover:bg-orange-500"
              >
                Speak with Expert
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
