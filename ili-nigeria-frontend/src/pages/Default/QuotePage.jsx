import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
  Info,
  ArrowLeft,
  Check,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";

// Debounce hook for performance optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function QuotePage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced values for calculations
  const debouncedWordCount = useDebounce(formData.wordCount, 500);
  const debouncedPageCount = useDebounce(formData.pageCount, 500);

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

  // File type icons
  const getFileIcon = (type) => {
    if (type.includes("pdf")) return <File className="w-6 h-6 text-red-600" />;
    if (type.includes("word") || type.includes("document"))
      return <FileText className="w-6 h-6 text-blue-600" />;
    if (type.includes("spreadsheet") || type.includes("excel"))
      return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
    if (type.includes("image"))
      return <FileImage className="w-6 h-6 text-purple-600" />;
    return <File className="w-6 h-6 text-gray-600" />;
  };

  // Step validation functions
  const validateStep = (stepNumber) => {
    const errors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.service) errors.service = "Please select a service";
        if (!formData.sourceLanguage)
          errors.sourceLanguage = "Please select source language";
        if (formData.targetLanguages.length === 0)
          errors.targetLanguages = "Please select at least one target language";
        break;

      case 2:
        if (
          formData.documents.length === 0 &&
          !formData.wordCount &&
          !formData.pageCount
        ) {
          errors.documents = "Please upload files or provide word/page count";
        }
        break;

      case 3:
        // Optional step - no required fields
        break;

      case 4:
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Please enter a valid email";
        }
        break;
    }

    return errors;
  };

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
    const maxFiles = 10;
    const maxSizePerFile = 10 * 1024 * 1024; // 10MB
    const maxTotalSize = 50 * 1024 * 1024; // 50MB total

    const currentSize = formData.documents.reduce(
      (sum, doc) => sum + doc.size,
      0
    );
    const newFiles = Array.from(files).slice(
      0,
      maxFiles - formData.documents.length
    );

    const validFiles = [];
    let totalNewSize = 0;

    for (const file of newFiles) {
      if (file.size > maxSizePerFile) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }

      if (currentSize + totalNewSize + file.size > maxTotalSize) {
        alert("Total file size would exceed 50MB limit.");
        break;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      totalNewSize += file.size;
    }

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...validFiles],
    }));

    // Clear validation error if files are uploaded
    if (validFiles.length > 0) {
      setValidationErrors((prev) => ({ ...prev, documents: undefined }));
    }
  };

  const removeFile = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== fileId),
    }));
  };

  // FIXED: Cost calculation with proper memoization
  const estimatedCost = useMemo(() => {
    const service = services.find((s) => s.id === formData.service);
    if (!service || (!debouncedWordCount && !debouncedPageCount)) return null;

    let baseAmount = 0;
    if (debouncedWordCount) {
      baseAmount = parseInt(debouncedWordCount) * service.baseRate;
    } else if (debouncedPageCount) {
      baseAmount = parseInt(debouncedPageCount) * service.baseRate * 250;
    }

    const urgencyMultiplier =
      urgencyOptions.find((u) => u.id === formData.urgency)?.multiplier || 1;
    const certificationMultiplier = formData.certification ? 1.3 : 1;
    const languageMultiplier = Math.max(formData.targetLanguages.length, 1);

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
  }, [
    formData.service,
    debouncedWordCount,
    debouncedPageCount,
    formData.urgency,
    formData.certification,
    formData.targetLanguages.length, // FIXED: Only track length, not the array itself
    services,
    urgencyOptions,
  ]);

  // FIXED: handleInputChange function
  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear validation error for the field
      if (validationErrors[name]) {
        setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [validationErrors]
  );

  // FIXED: Input change handler for form elements
  const handleFormInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      handleInputChange(name, type === "checkbox" ? checked : value);
    },
    [handleInputChange]
  );

  // Remove target language tag
  const removeTargetLanguage = useCallback(
    (languageToRemove) => {
      const newTargetLanguages = formData.targetLanguages.filter(
        (lang) => lang !== languageToRemove
      );
      handleInputChange("targetLanguages", newTargetLanguages);
    },
    [formData.targetLanguages, handleInputChange]
  );

  // Add target language
  const addTargetLanguage = useCallback(
    (language) => {
      if (
        !formData.targetLanguages.includes(language) &&
        language !== formData.sourceLanguage
      ) {
        handleInputChange("targetLanguages", [
          ...formData.targetLanguages,
          language,
        ]);
      }
    },
    [formData.targetLanguages, formData.sourceLanguage, handleInputChange]
  );

  const nextStep = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setValidationErrors({});
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validate all steps
    let allErrors = {};
    for (let step = 1; step <= 4; step++) {
      const stepErrors = validateStep(step);
      allErrors = { ...allErrors, ...stepErrors };
    }

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      // Navigate to first step with errors
      for (let step = 1; step <= 4; step++) {
        const stepErrors = validateStep(step);
        if (Object.keys(stepErrors).length > 0) {
          setActiveStep(step);
          break;
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      //Create FormData
      const formDataToSend = new FormData();

      // Append all text fields
      for (const key in formData) {
        if (key === "documents") {
          continue; // handled below
        } else if (key === "targetLanguages" && Array.isArray(formData[key])) {
          formData[key].forEach((lang) =>
            formDataToSend.append("targetLanguages[]", lang)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Append files correctly
      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((doc) => {
          // `doc` should be the File object itself
          formDataToSend.append("documents", doc.file || doc);
        });
      }

      // POST to backend
      const res = await fetch("https://ilin-backend.onrender.com/api/quotes", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Quote submitted:", data);
        setShowSuccessModal(true);
      } else {
        console.error("Failed:", data.message);
        alert("Failed to submit quote. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const SuccessModal = () => (
    <AnimatePresence>
      s
      {showSuccessModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setShowSuccessModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 bg-white shadow-2xl pointer-events-auto rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Quote Request Sent!
                </h3>
                <p className="mb-6 text-gray-600">
                  Thank you for your request. We'll send you a detailed quote
                  within 30 minutes to {formData.email}.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleReturnHome}
                    className="w-full px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Return to Home
                  </button>
                  <button
                    onClick={handleSubmitAnother}
                    className="w-full px-6 py-3 font-semibold text-gray-600 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Submit Another Quote
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  const handleReturnHome = async () => {
    setShowSuccessModal(false);
    await new Promise((resolve) => setTimeout(resolve, 300));
    navigate("/");
  };

  const handleSubmitAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      service: "",
      sourceLanguage: "",
      targetLanguages: [],
      urgency: "standard",
      certification: false,
      documents: [],
      wordCount: "",
      pageCount: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      specialInstructions: "",
      industry: "",
      glossary: false,
    });
    setValidationErrors({});
    setActiveStep(1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "ArrowLeft" && activeStep > 1) {
          e.preventDefault();
          prevStep();
        } else if (e.key === "ArrowRight" && activeStep < 4) {
          e.preventDefault();
          nextStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <SuccessModal />

      {/* Hero Section with Glassmorphism */}
      <section className="relative px-6 py-2 pt-32 overflow-hidden md:py-20 md:px-20">
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
            <p className="max-w-3xl mx-auto mb-12 text-sm leading-relaxed text-gray-600 md:text-xl">
              Get accurate pricing for your translation project. Our intelligent
              quote system provides instant estimates with transparent pricing
              and no hidden fees.
            </p>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {quickBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex flex-col p-6 pb-10 overflow-hidden transition-all duration-300 border border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl group-hover:scale-105 h-52">
                    <div className="flex items-center justify-center w-16 h-16 py-4 mx-auto mb-4 transition-transform duration-300 bg-gray-100 rounded-2xl group-hover:scale-110 md:py">
                      {benefit.icon}
                    </div>
                    <div className="flex flex-col justify-center flex-1 mb-8">
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="mb-6 text-sm leading-relaxed text-gray-600">
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
      <section className="p-6 shadow-md md:py-12 bg-white/50 backdrop-blur-sm md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex items-center flex-1 mx-auto"
              >
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      // Allow navigation to previous steps or current step
                      if (step.number <= activeStep) {
                        setActiveStep(step.number);
                        setValidationErrors({});
                      }
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                      activeStep >= step.number
                        ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } ${
                      step.number <= activeStep
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                  >
                    {activeStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-semibold ${
                        activeStep >= step.number
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
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

                        {validationErrors.service && (
                          <div className="flex items-center p-3 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {validationErrors.service}
                          </div>
                        )}

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
                          {validationErrors.sourceLanguage && (
                            <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {validationErrors.sourceLanguage}
                              </span>
                            </div>
                          )}
                          <select
                            name="sourceLanguage"
                            value={formData.sourceLanguage}
                            onChange={handleFormInputChange}
                            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              validationErrors.sourceLanguage
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
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
                          {validationErrors.targetLanguages && (
                            <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {validationErrors.targetLanguages}
                              </span>
                            </div>
                          )}

                          {/* Selected Languages Tags */}
                          {formData.targetLanguages.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 mb-3 border border-gray-200 rounded-lg bg-gray-50">
                              {formData.targetLanguages.map((lang) => (
                                <span
                                  key={lang}
                                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full "
                                >
                                  {lang}
                                  <button
                                    type="button"
                                    onClick={() => removeTargetLanguage(lang)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addTargetLanguage(e.target.value);
                                e.target.value = "";
                              }
                            }}
                            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              validationErrors.targetLanguages
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Add target language...</option>
                            {languages
                              .filter(
                                (lang) =>
                                  lang !== formData.sourceLanguage &&
                                  !formData.targetLanguages.includes(lang)
                              )
                              .map((lang) => (
                                <option key={lang} value={lang}>
                                  {lang}
                                </option>
                              ))}
                          </select>
                          <p className="mt-2 text-xs text-gray-500">
                            Select languages one by one to build your target
                            list
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Document Upload with Enhanced UX */}
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

                        {validationErrors.documents && (
                          <div className="flex items-center p-3 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {validationErrors.documents}
                          </div>
                        )}

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
                            name="documents"
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
                          <p className="mb-4 text-sm text-gray-500">
                            Maximum {10 - formData.documents.length} more files
                            • Total size limit: 50MB
                          </p>
                          <div className="inline-flex items-center px-6 py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700">
                            <Upload className="w-5 h-5 mr-2" />
                            Choose Files
                          </div>
                        </div>

                        {/* Uploaded Files with Enhanced Display */}
                        {formData.documents.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">
                                Uploaded Files ({formData.documents.length}/10)
                              </h4>
                              <div className="text-sm text-gray-600">
                                Total:{" "}
                                {(
                                  formData.documents.reduce(
                                    (sum, doc) => sum + doc.size,
                                    0
                                  ) /
                                  1024 /
                                  1024
                                ).toFixed(1)}
                                MB / 50MB
                              </div>
                            </div>

                            {/* Progress bar for total file size */}
                            <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
                              <div
                                className="h-2 transition-all duration-300 bg-green-600 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (formData.documents.reduce(
                                      (sum, doc) => sum + doc.size,
                                      0
                                    ) /
                                      (50 * 1024 * 1024)) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>

                            <div className="space-y-3 overflow-y-auto max-h-60">
                              {formData.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-4 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
                                >
                                  <div className="flex items-center flex-1 min-w-0">
                                    {getFileIcon(doc.type)}
                                    <div className="flex-1 min-w-0 ml-3">
                                      <p className="font-medium text-gray-900 truncate">
                                        {doc.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                                        • {doc.type || "Unknown type"}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(doc.id)}
                                    className="p-2 ml-4 text-red-600 transition-colors rounded-lg hover:bg-red-50"
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
                                name="wordCount"
                                value={formData.wordCount}
                                onChange={handleFormInputChange}
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
                                name="pageCount"
                                value={formData.pageCount}
                                onChange={handleFormInputChange}
                                placeholder="e.g., 6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600">
                            We estimate 250 words per page for calculation
                            purposes
                          </p>
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
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                                    formData.urgency === option.id
                                      ? "border-green-500 bg-green-50 shadow-lg"
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
                                name="industry"
                                value={formData.industry}
                                onChange={handleFormInputChange}
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
                              <label className="flex items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                  type="checkbox"
                                  name="certification"
                                  checked={formData.certification}
                                  onChange={handleFormInputChange}
                                  className="w-5 h-5 mr-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">
                                    Certified Translation
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    +30% for official documents
                                  </p>
                                </div>
                              </label>

                              <label className="flex items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                  type="checkbox"
                                  name="glossary"
                                  checked={formData.glossary}
                                  onChange={handleFormInputChange}
                                  className="w-5 h-5 mr-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">
                                    Custom Glossary Support
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    Maintain consistent terminology
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block mb-3 text-sm font-semibold text-gray-900">
                              Special Instructions
                            </label>
                            <textarea
                              name="specialInstructions"
                              value={formData.specialInstructions}
                              onChange={handleFormInputChange}
                              placeholder="Any specific requirements, style guides, or special instructions..."
                              rows="4"
                              maxLength="500"
                              className="w-full p-4 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                              {500 -
                                (formData.specialInstructions?.length ||
                                  0)}{" "}
                              characters remaining
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Information with Enhanced Validation */}
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
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900">
                              Full Name *
                            </label>
                            {validationErrors.name && (
                              <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">
                                  {validationErrors.name}
                                </span>
                              </div>
                            )}
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormInputChange}
                              placeholder="Enter your full name"
                              required
                              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                validationErrors.name
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900">
                              Email Address *
                            </label>
                            {validationErrors.email && (
                              <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">
                                  {validationErrors.email}
                                </span>
                              </div>
                            )}
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormInputChange}
                              placeholder="your.email@example.com"
                              required
                              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                validationErrors.email
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>

                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormInputChange}
                            placeholder="Phone Number (Optional)"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleFormInputChange}
                            placeholder="Company Name (Optional)"
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

                  {/*Navigation Buttons*/}
                  <div className="flex-col items-center justify-center mt-6 space-x-4 space-y-4 md:flex md:space-y-0 md:flex-row md:justify-between ">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={activeStep === 1}
                      className={`flex  items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto text-center align-middle justify-center ${
                        activeStep === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Previous
                      {activeStep > 1 && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Ctrl+←)
                        </span>
                      )}
                    </button>

                    {activeStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center justify-center w-full px-8 py-3 font-semibold text-white transition-all duration-300 bg-green-600 rounded-xl hover:bg-green-700 hover:shadow-lg md:w-auto"
                      >
                        Next Step
                        <ArrowRight className="w-5 h-5 ml-2" />
                        <span className="ml-2 text-xs text-green-200">
                          (Ctrl+→)
                        </span>
                      </button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className={`flex items-center px-8 py-3 font-semibold text-white transition-all duration-300 shadow-lg rounded-xl hover:shadow-xl ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Get My Quote
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
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
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Price Estimate
                      </h3>
                      {estimatedCost && (
                        <button
                          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          title="Calculation: Base rate × Words/Pages × Urgency × Certification × Languages"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          How is this calculated?
                        </button>
                      )}
                    </div>
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
                          <p className="mt-1 text-xs text-green-600">
                            Final quote may vary ±10%
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
                      <p className="mt-2 text-sm text-gray-500">
                        Estimates update automatically as you type
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Enhanced Project Summary */}
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

                    {(formData.certification || formData.glossary) && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Add-ons:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.certification && (
                            <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                              Certified
                            </span>
                          )}
                          {formData.glossary && (
                            <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                              Glossary
                            </span>
                          )}
                        </div>
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
