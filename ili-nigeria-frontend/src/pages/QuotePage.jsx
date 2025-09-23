import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Calculator,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Download,
  Globe,
  Users,
  Zap,
  Award,
  Send,
  X,
  File,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  MessageCircle,
} from "lucide-react";

export default function QuotePage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Project Details
    service: "",
    sourceLanguage: "",
    targetLanguages: [],
    urgency: "standard",
    certification: false,

    // Document Details
    documents: [],
    wordCount: "",
    pageCount: "",

    // Client Details
    name: "",
    email: "",
    phone: "",
    company: "",

    // Additional Requirements
    specialInstructions: "",
    industry: "",
    glossary: false,
  });

  const [dragActive, setDragActive] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(null);

  const services = [
    {
      id: "document",
      name: "Document Translation",
      icon: <FileText className="w-6 h-6" />,
      baseRate: 25,
    },
    {
      id: "localization",
      name: "Website Localization",
      icon: <Globe className="w-6 h-6" />,
      baseRate: 50,
    },
    {
      id: "interpretation",
      name: "Live Interpretation",
      icon: <MessageCircle className="w-6 h-6" />,
      baseRate: 200,
    },
    {
      id: "multimedia",
      name: "Voiceover & Subtitling",
      icon: <Eye className="w-6 h-6" />,
      baseRate: 150,
    },
    {
      id: "certified",
      name: "Certified Translation",
      icon: <Award className="w-6 h-6" />,
      baseRate: 40,
    },
    {
      id: "enterprise",
      name: "Enterprise Solutions",
      icon: <Users className="w-6 h-6" />,
      baseRate: 0,
    },
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Swahili",
    "Dutch",
    "Polish",
    "Turkish",
    "Persian",
  ];

  const industries = [
    "Legal & Immigration",
    "Medical & Healthcare",
    "Business & Finance",
    "Education",
    "Technology",
    "Government",
    "Tourism",
    "Religious",
    "Marketing",
    "Other",
  ];

  const urgencyOptions = [
    { id: "standard", name: "Standard (48-72 hours)", multiplier: 1 },
    { id: "rush", name: "Rush (24-48 hours)", multiplier: 1.5 },
    { id: "urgent", name: "Urgent (Same day)", multiplier: 2.5 },
  ];

  const steps = [
    {
      number: 1,
      title: "Service & Languages",
      description: "Choose your service and language pair",
    },
    {
      number: 2,
      title: "Upload Documents",
      description: "Upload files or provide word count",
    },
    {
      number: 3,
      title: "Project Details",
      description: "Specify requirements and timeline",
    },
    {
      number: 4,
      title: "Contact Information",
      description: "Your details for quote delivery",
    },
  ];

  const quickBenefits = [
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Instant Estimate",
      description: "Get pricing in real-time as you complete the form",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure Upload",
      description:
        "Your documents are encrypted and handled with complete confidentiality",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      title: "Fast Response",
      description: "Detailed quote delivered to your inbox within 30 minutes",
    },
  ];

  // File upload handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
    }));
  };

  const removeFile = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== fileId),
    }));
  };

  // Cost calculation
  const calculateEstimate = () => {
    const service = services.find((s) => s.id === formData.service);
    if (!service || (!formData.wordCount && !formData.pageCount)) return null;

    let baseAmount = 0;
    if (formData.wordCount) {
      baseAmount = parseInt(formData.wordCount) * service.baseRate;
    } else if (formData.pageCount) {
      baseAmount = parseInt(formData.pageCount) * service.baseRate * 250; // 250 words per page
    }

    const urgencyMultiplier =
      urgencyOptions.find((u) => u.id === formData.urgency)?.multiplier || 1;
    const certificationMultiplier = formData.certification ? 1.3 : 1;
    const languageMultiplier = formData.targetLanguages.length || 1;

    const totalAmount =
      baseAmount *
      urgencyMultiplier *
      certificationMultiplier *
      languageMultiplier;

    return {
      baseAmount,
      urgencyMultiplier,
      certificationMultiplier,
      languageMultiplier,
      totalAmount: Math.round(totalAmount),
    };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Recalculate estimate when relevant fields change
    if (
      [
        "service",
        "wordCount",
        "pageCount",
        "urgency",
        "certification",
        "targetLanguages",
      ].includes(field)
    ) {
      const estimate = calculateEstimate();
      setEstimatedCost(estimate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle quote submission
    console.log("Quote request:", formData);
    // Navigate to success page or show confirmation
  };

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section with Glassmorphism */}
      <section className="relative px-6 py-20 pt-32 overflow-hidden md:px-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 bg-green-200 rounded-full top-20 left-20 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute w-64 h-64 delay-1000 bg-blue-200 rounded-full top-40 right-20 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute w-64 h-64 bg-purple-200 rounded-full bottom-40 left-1/2 mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 border border-green-200 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
              Get Your Quote
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Professional Translation
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                Quote in Minutes
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-600">
              Get accurate pricing for your translation project. Our intelligent
              quote system provides instant estimates with transparent pricing
              and no hidden fees.
            </p>

            {/* Quick Benefits - Consistent card sizing */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {quickBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  {/* Fixed height for consistency */}
                  <div className="flex flex-col h-48 p-6 transition-all duration-300 border border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl group-hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-gray-100 rounded-2xl group-hover:scale-110">
                      {benefit.icon}
                    </div>
                    {/* Flex grow content for even distribution */}
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="px-6 py-12 bg-white/50 backdrop-blur-sm md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      activeStep >= step.number
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {activeStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </p>
                    <p className="hidden text-xs text-gray-600 md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      activeStep > step.number ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Quote Form */}
      <section className="px-6 py-16 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
              >
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Service & Languages */}
                  {activeStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                          Choose Your Service
                        </h2>
                        <p className="mb-6 text-gray-600">
                          Select the type of translation service you need
                        </p>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              onClick={() =>
                                handleInputChange("service", service.id)
                              }
                              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.service === service.id
                                  ? "border-green-500 bg-green-50 shadow-lg"
                                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center mb-3">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                    formData.service === service.id
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {service.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900">
                                  {service.name}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                Starting from ₦{service.baseRate}
                                {service.id === "document" ||
                                service.id === "certified"
                                  ? "/word"
                                  : service.id === "interpretation"
                                  ? "/hour"
                                  : "/project"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-3 text-sm font-semibold text-gray-900">
                            Source Language
                          </label>
                          <select
                            value={formData.sourceLanguage}
                            onChange={(e) =>
                              handleInputChange(
                                "sourceLanguage",
                                e.target.value
                              )
                            }
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Select source language</option>
                            {languages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block mb-3 text-sm font-semibold text-gray-900">
                            Target Languages
                          </label>
                          <select
                            multiple
                            value={formData.targetLanguages}
                            onChange={(e) =>
                              handleInputChange(
                                "targetLanguages",
                                Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value
                                )
                              )
                            }
                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            {languages
                              .filter(
                                (lang) => lang !== formData.sourceLanguage
                              )
                              .map((lang) => (
                                <option key={lang} value={lang}>
                                  {lang}
                                </option>
                              ))}
                          </select>
                          <p className="mt-2 text-xs text-gray-500">
                            Hold Ctrl/Cmd to select multiple languages
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Document Upload */}
                  {activeStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                          Upload Documents
                        </h2>
                        <p className="mb-6 text-gray-600">
                          Upload your files or provide word/page count for
                          accurate pricing
                        </p>

                        {/* File Upload Area */}
                        <div
                          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                            dragActive
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
                          />

                          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            Drop files here or click to browse
                          </h3>
                          <p className="mb-4 text-gray-600">
                            Supported formats: PDF, DOC, DOCX, TXT, RTF, ODT
                            (Max 10MB each)
                          </p>
                          <div className="inline-flex items-center px-6 py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700">
                            <Upload className="w-5 h-5 mr-2" />
                            Choose Files
                          </div>
                        </div>

                        {/* Uploaded Files */}
                        {formData.documents.length > 0 && (
                          <div className="mt-6">
                            <h4 className="mb-3 font-semibold text-gray-900">
                              Uploaded Files ({formData.documents.length})
                            </h4>
                            <div className="space-y-3">
                              {formData.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                >
                                  <div className="flex items-center">
                                    <File className="w-6 h-6 mr-3 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {doc.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(doc.id)}
                                    className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Manual Count Input */}
                        <div className="p-6 mt-8 border border-blue-200 bg-blue-50 rounded-2xl">
                          <h4 className="mb-4 font-semibold text-gray-900">
                            Or provide word/page count manually
                          </h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Word Count
                              </label>
                              <input
                                type="number"
                                value={formData.wordCount}
                                onChange={(e) =>
                                  handleInputChange("wordCount", e.target.value)
                                }
                                placeholder="e.g., 1500"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Page Count
                              </label>
                              <input
                                type="number"
                                value={formData.pageCount}
                                onChange={(e) =>
                                  handleInputChange("pageCount", e.target.value)
                                }
                                placeholder="e.g., 6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Project Details */}
                  {activeStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                          Project Requirements
                        </h2>
                        <p className="mb-6 text-gray-600">
                          Specify your timeline and special requirements
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block mb-3 text-sm font-semibold text-gray-900">
                              Urgency Level
                            </label>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              {urgencyOptions.map((option) => (
                                <div
                                  key={option.id}
                                  onClick={() =>
                                    handleInputChange("urgency", option.id)
                                  }
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                    formData.urgency === option.id
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <h4 className="mb-1 font-semibold text-gray-900">
                                    {option.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {option.multiplier > 1
                                      ? `+${Math.round(
                                          (option.multiplier - 1) * 100
                                        )}% fee`
                                      : "Standard pricing"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label className="block mb-3 text-sm font-semibold text-gray-900">
                                Industry
                              </label>
                              <select
                                value={formData.industry}
                                onChange={(e) =>
                                  handleInputChange("industry", e.target.value)
                                }
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                <option value="">Select your industry</option>
                                {industries.map((industry) => (
                                  <option key={industry} value={industry}>
                                    {industry}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.certification}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "certification",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 mr-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-900">
                                  Certified Translation (+30%)
                                </span>
                              </label>

                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.glossary}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "glossary",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 mr-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-900">
                                  Custom Glossary Support
                                </span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block mb-3 text-sm font-semibold text-gray-900">
                              Special Instructions
                            </label>
                            <textarea
                              value={formData.specialInstructions}
                              onChange={(e) =>
                                handleInputChange(
                                  "specialInstructions",
                                  e.target.value
                                )
                              }
                              placeholder="Any specific requirements, style guides, or special instructions..."
                              rows="4"
                              className="w-full p-4 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Information */}
                  {activeStep === 4 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                          Contact Information
                        </h2>
                        <p className="mb-6 text-gray-600">
                          Where should we send your detailed quote?
                        </p>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Full Name *"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="Email Address *"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="Phone Number"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            placeholder="Company Name"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div className="p-6 mt-8 border border-green-200 bg-green-50 rounded-2xl">
                          <h4 className="mb-2 font-semibold text-green-800">
                            What happens next?
                          </h4>
                          <ul className="space-y-2 text-sm text-green-700">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Detailed quote emailed within 30 minutes
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Personal consultation call if needed
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Project kickoff once approved
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-12">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={activeStep === 1}
                      className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
                        activeStep === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {activeStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center px-8 py-3 font-semibold text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
                      >
                        Next Step
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    ) : (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-8 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Get My Quote
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Sidebar - Price Estimate & Summary */}
            <div className="lg:col-span-1">
              <div className="sticky space-y-6 top-8">
                {/* Real-time Price Estimate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-100 rounded-2xl">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Price Estimate
                    </h3>
                  </div>

                  {estimatedCost ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                        <div className="text-center">
                          <p className="mb-1 text-sm font-medium text-green-600">
                            Estimated Total
                          </p>
                          <p className="text-3xl font-bold text-green-800">
                            ₦{estimatedCost.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-semibold">
                            ₦{estimatedCost.baseAmount.toLocaleString()}
                          </span>
                        </div>
                        {estimatedCost.urgencyMultiplier > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Urgency (
                              {Math.round(
                                (estimatedCost.urgencyMultiplier - 1) * 100
                              )}
                              %):
                            </span>
                            <span className="font-semibold">
                              +₦
                              {Math.round(
                                estimatedCost.baseAmount *
                                  (estimatedCost.urgencyMultiplier - 1)
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {estimatedCost.certificationMultiplier > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Certification (30%):
                            </span>
                            <span className="font-semibold">
                              +₦
                              {Math.round(
                                estimatedCost.baseAmount *
                                  (estimatedCost.certificationMultiplier - 1)
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {estimatedCost.languageMultiplier > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Additional Languages:
                            </span>
                            <span className="font-semibold">
                              ×{estimatedCost.languageMultiplier}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">
                        Complete the form to see your estimate
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Project Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
                >
                  <h3 className="mb-6 text-xl font-bold text-gray-900">
                    Project Summary
                  </h3>

                  <div className="space-y-4">
                    {formData.service && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold text-right">
                          {services.find((s) => s.id === formData.service)
                            ?.name || "Not selected"}
                        </span>
                      </div>
                    )}

                    {formData.sourceLanguage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="font-semibold">
                          {formData.sourceLanguage}
                        </span>
                      </div>
                    )}

                    {formData.targetLanguages.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-semibold text-right">
                          {formData.targetLanguages.slice(0, 2).join(", ")}
                          {formData.targetLanguages.length > 2 &&
                            ` +${formData.targetLanguages.length - 2} more`}
                        </span>
                      </div>
                    )}

                    {(formData.wordCount || formData.pageCount) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume:</span>
                        <span className="font-semibold">
                          {formData.wordCount
                            ? `${formData.wordCount} words`
                            : `${formData.pageCount} pages`}
                        </span>
                      </div>
                    )}

                    {formData.documents.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Files:</span>
                        <span className="font-semibold">
                          {formData.documents.length} uploaded
                        </span>
                      </div>
                    )}

                    {formData.urgency && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-semibold text-right">
                          {urgencyOptions
                            .find((u) => u.id === formData.urgency)
                            ?.name.split(" ")[0] || "Standard"}
                        </span>
                      </div>
                    )}
                  </div>

                  {Object.values(formData).filter(Boolean).length === 0 && (
                    <div className="py-8 text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">
                        Project details will appear here as you complete the
                        form
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl"
                >
                  <div className="text-center">
                    <Award className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h4 className="mb-2 font-bold text-gray-900">
                      Quality Guaranteed
                    </h4>
                    <p className="mb-4 text-sm text-gray-600">
                      All quotes include our accuracy guarantee and free
                      revisions
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          99.8%
                        </p>
                        <p className="text-xs text-gray-600">Accuracy Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          5,000+
                        </p>
                        <p className="text-xs text-gray-600">Happy Clients</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
