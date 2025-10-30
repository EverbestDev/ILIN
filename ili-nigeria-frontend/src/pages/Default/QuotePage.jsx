import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
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

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced values for calculations
  const debouncedWordCount = useDebounce(formData.wordCount, 500);
  const debouncedPageCount = useDebounce(formData.pageCount, 500);

  // Get services from translation
  const services = [
    {
      id: "document",
      name: t("quotepage.services.document.name"),
      icon: <FileText className="w-6 h-6" />,
      baseRate: 25,
    },
    {
      id: "localization",
      name: t("quotepage.services.localization.name"),
      icon: <Globe className="w-6 h-6" />,
      baseRate: 50,
    },
    {
      id: "interpretation",
      name: t("quotepage.services.interpretation.name"),
      icon: <MessageCircle className="w-6 h-6" />,
      baseRate: 200,
    },
    {
      id: "multimedia",
      name: t("quotepage.services.multimedia.name"),
      icon: <Eye className="w-6 h-6" />,
      baseRate: 150,
    },
    {
      id: "certified",
      name: t("quotepage.services.certified.name"),
      icon: <Award className="w-6 h-6" />,
      baseRate: 40,
    },
    {
      id: "enterprise",
      name: t("quotepage.services.enterprise.name"),
      icon: <Users className="w-6 h-6" />,
      baseRate: 0,
    },
  ];

  // Get languages from translation
  const languages = t("quotepage.languages", { returnObjects: true });

  // Get industries from translation
  const industries = t("quotepage.industries", { returnObjects: true });

  // Get urgency options from translation
  const urgencyOptions = [
    {
      id: "standard",
      name: t("quotepage.urgency.standard.name"),
      multiplier: 1,
    },
    {
      id: "rush",
      name: t("quotepage.urgency.rush.name"),
      multiplier: 1.5,
    },
    {
      id: "urgent",
      name: t("quotepage.urgency.urgent.name"),
      multiplier: 2.5,
    },
  ];

  // Get steps from translation
  const steps = [
    {
      number: 1,
      title: t("quotepage.steps.step1.title"),
      description: t("quotepage.steps.step1.description"),
    },
    {
      number: 2,
      title: t("quotepage.steps.step2.title"),
      description: t("quotepage.steps.step2.description"),
    },
    {
      number: 3,
      title: t("quotepage.steps.step3.title"),
      description: t("quotepage.steps.step3.description"),
    },
    {
      number: 4,
      title: t("quotepage.steps.step4.title"),
      description: t("quotepage.steps.step4.description"),
    },
  ];

  // Get quick benefits from translation
  const quickBenefits = [
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: t("quotepage.benefits.estimate.title"),
      description: t("quotepage.benefits.estimate.description"),
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: t("quotepage.benefits.secure.title"),
      description: t("quotepage.benefits.secure.description"),
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      title: t("quotepage.benefits.response.title"),
      description: t("quotepage.benefits.response.description"),
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
        if (!formData.service)
          errors.service = t("quotepage.errors.serviceRequired");
        if (!formData.sourceLanguage)
          errors.sourceLanguage = t("quotepage.errors.sourceLanguageRequired");
        if (formData.targetLanguages.length === 0)
          errors.targetLanguages = t(
            "quotepage.errors.targetLanguagesRequired"
          );
        break;

      case 2:
        if (
          formData.documents.length === 0 &&
          !formData.wordCount &&
          !formData.pageCount
        ) {
          errors.documents = t("quotepage.errors.documentsRequired");
        }
        break;

      case 3:
        // Optional step - no required fields
        break;

      case 4:
        if (!formData.name.trim())
          errors.name = t("quotepage.errors.nameRequired");
        if (!formData.email.trim())
          errors.email = t("quotepage.errors.emailRequired");
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = t("quotepage.errors.emailInvalid");
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
    const maxSizePerFile = 10 * 1024 * 1024;
    const maxTotalSize = 50 * 1024 * 1024;

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
        alert(t("quotepage.upload.fileTooLarge", { name: file.name }));
        continue;
      }

      if (currentSize + totalNewSize + file.size > maxTotalSize) {
        alert(t("quotepage.upload.totalSizeExceeded"));
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
    formData.targetLanguages.length,
    services,
    urgencyOptions,
  ]);

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (validationErrors[name]) {
        setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [validationErrors]
  );

  const handleFormInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      handleInputChange(name, type === "checkbox" ? checked : value);
    },
    [handleInputChange]
  );

  const removeTargetLanguage = useCallback(
    (languageToRemove) => {
      const newTargetLanguages = formData.targetLanguages.filter(
        (lang) => lang !== languageToRemove
      );
      handleInputChange("targetLanguages", newTargetLanguages);
    },
    [formData.targetLanguages, handleInputChange]
  );

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

    let allErrors = {};
    for (let step = 1; step <= 4; step++) {
      const stepErrors = validateStep(step);
      allErrors = { ...allErrors, ...stepErrors };
    }

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
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
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === "documents") {
          continue;
        } else if (key === "targetLanguages" && Array.isArray(formData[key])) {
          formData[key].forEach((lang) =>
            formDataToSend.append("targetLanguages[]", lang)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((doc) => {
          formDataToSend.append("documents", doc.file || doc);
        });
      }

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
        alert(t("quotepage.submit.failed"));
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert(t("quotepage.submit.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const SuccessModal = () => (
    <AnimatePresence>
      {showSuccessModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setShowSuccessModal(false)}
          />

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
                  {t("quotepage.modal.success.title")}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t("quotepage.modal.success.message", {
                    email: formData.email,
                  })}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleReturnHome}
                    className="w-full px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {t("quotepage.modal.success.returnHome")}
                  </button>
                  <button
                    onClick={handleSubmitAnother}
                    className="w-full px-6 py-3 font-semibold text-gray-600 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {t("quotepage.modal.success.submitAnother")}
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
          <div className="absolute w-64 h-64 bg-green-200 rounded-full top-20 start-20 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute w-64 h-64 delay-1000 bg-blue-200 rounded-full top-40 end-20 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute w-64 h-64 bg-purple-200 rounded-full bottom-40 start-1/2 mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-green-600 border border-green-200 rounded-full shadow-sm bg-white/80 backdrop-blur-sm">
              {t("quotepage.hero.badge")}
            </span>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t("quotepage.hero.title")}
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                {t("quotepage.hero.subtitle")}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-sm leading-relaxed text-gray-600 md:text-xl">
              {t("quotepage.hero.description")}
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
                          {t("quotepage.step1.heading")}
                        </h2>
                        <p className="mb-6 text-gray-600">
                          {t("quotepage.step1.subheading")}
                        </p>

                        {validationErrors.service && (
                          <div className="flex items-center p-3 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 me-2" />
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
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center me-4 ${
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
                                {t("quotepage.step1.startingFrom")} ₦
                                {service.baseRate}
                                {service.id === "document" ||
                                service.id === "certified"
                                  ? t("quotepage.step1.perWord")
                                  : service.id === "interpretation"
                                  ? t("quotepage.step1.perHour")
                                  : t("quotepage.step1.perProject")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-3 text-sm font-semibold text-gray-900">
                            {t("quotepage.step1.sourceLanguage")}
                          </label>
                          {validationErrors.sourceLanguage && (
                            <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                              <AlertCircle className="w-4 h-4 me-1" />
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
                            <option value="">
                              {t("quotepage.step1.selectSourceLanguage")}
                            </option>
                            {languages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block mb-3 text-sm font-semibold text-gray-900">
                            {t("quotepage.step1.targetLanguages")}
                          </label>
                          {validationErrors.targetLanguages && (
                            <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                              <AlertCircle className="w-4 h-4 me-1" />
                              <span className="text-sm">
                                {validationErrors.targetLanguages}
                              </span>
                            </div>
                          )}

                          {formData.targetLanguages.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 mb-3 border border-gray-200 rounded-lg bg-gray-50">
                              {formData.targetLanguages.map((lang) => (
                                <span
                                  key={lang}
                                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full"
                                >
                                  {lang}
                                  <button
                                    type="button"
                                    onClick={() => removeTargetLanguage(lang)}
                                    className="ms-2 text-green-600 hover:text-green-800"
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
                            <option value="">
                              {t("quotepage.step1.addTargetLanguage")}
                            </option>
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
                            {t("quotepage.step1.languageNote")}
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
                          {t("quotepage.step2.heading")}
                        </h2>
                        <p className="mb-6 text-gray-600">
                          {t("quotepage.step2.subheading")}
                        </p>

                        {validationErrors.documents && (
                          <div className="flex items-center p-3 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 me-2" />
                            {validationErrors.documents}
                          </div>
                        )}

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
                            {t("quotepage.step2.dragDrop")}
                          </h3>
                          <p className="mb-4 text-gray-600">
                            {t("quotepage.step2.supportedFormats")}
                          </p>
                          <p className="mb-4 text-sm text-gray-500">
                            {t("quotepage.step2.fileLimit", {
                              remaining: 10 - formData.documents.length,
                            })}
                          </p>
                          <div className="inline-flex items-center px-6 py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700">
                            <Upload className="w-5 h-5 me-2" />
                            {t("quotepage.step2.chooseFiles")}
                          </div>
                        </div>

                        {formData.documents.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">
                                {t("quotepage.step2.uploadedFiles", {
                                  count: formData.documents.length,
                                })}
                              </h4>
                              <div className="text-sm text-gray-600">
                                {t("quotepage.step2.totalSize")}:{" "}
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
                                    <div className="flex-1 min-w-0 ms-3">
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
                                    className="p-2 ms-4 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-6 mt-8 border border-blue-200 bg-blue-50 rounded-2xl">
                          <h4 className="mb-4 font-semibold text-gray-900">
                            {t("quotepage.step2.manualCount")}
                          </h4>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                {t("quotepage.step2.wordCount")}
                              </label>
                              <input
                                type="number"
                                name="wordCount"
                                value={formData.wordCount}
                                onChange={handleFormInputChange}
                                placeholder={t(
                                  "quotepage.step2.wordCountPlaceholder"
                                )}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                {t("quotepage.step2.pageCount")}
                              </label>
                              <input
                                type="number"
                                name="pageCount"
                                value={formData.pageCount}
                                onChange={handleFormInputChange}
                                placeholder={t(
                                  "quotepage.step2.pageCountPlaceholder"
                                )}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600">
                            {t("quotepage.step2.estimateNote")}
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
                          {t("quotepage.step3.heading")}
                        </h2>
                        <p className="mb-6 text-gray-600">
                          {t("quotepage.step3.subheading")}
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block mb-3 text-sm font-semibold text-gray-900">
                              {t("quotepage.step3.urgency")}
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
                                      ? t("quotepage.step3.feePercentage", {
                                          percentage: Math.round(
                                            (option.multiplier - 1) * 100
                                          ),
                                        })
                                      : t("quotepage.step3.standardPricing")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label className="block mb-3 text-sm font-semibold text-gray-900">
                                {t("quotepage.step3.industry")}
                              </label>
                              <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleFormInputChange}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                <option value="">
                                  {t("quotepage.step3.selectIndustry")}
                                </option>
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
                                  className="w-5 h-5 me-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {t("quotepage.step3.certification")}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    {t("quotepage.sidebar.fees.certification")}
                                  </p>
                                </div>
                              </label>

                              <label className="flex items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                  type="checkbox"
                                  name="glossary"
                                  checked={formData.glossary}
                                  onChange={handleFormInputChange}
                                  className="w-5 h-5 me-3 text-green-600 rounded focus:ring-green-500"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {t("quotepage.step3.glossary")}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    {t("quotepage.step3.glossaryNote")}
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block mb-3 text-sm font-semibold text-gray-900">
                              {t("quotepage.step3.specialInstructions")}
                            </label>
                            <textarea
                              name="specialInstructions"
                              value={formData.specialInstructions}
                              onChange={handleFormInputChange}
                              placeholder={t(
                                "quotepage.step3.specialInstructionsPlaceholder"
                              )}
                              rows="4"
                              maxLength="500"
                              className="w-full p-4 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                              {t("quotepage.step3.charactersRemaining", {
                                remaining:
                                  500 -
                                  (formData.specialInstructions?.length || 0),
                              })}
                            </p>
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
                          {t("quotepage.step4.heading")}
                        </h2>
                        <p className="mb-6 text-gray-600">
                          {t("quotepage.step4.subheading")}
                        </p>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900">
                              {t("quotepage.step4.fullName")} *
                            </label>
                            {validationErrors.name && (
                              <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                                <AlertCircle className="w-4 h-4 me-1" />
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
                              placeholder={t(
                                "quotepage.step4.fullNamePlaceholder"
                              )}
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
                              {t("quotepage.step4.email")} *
                            </label>
                            {validationErrors.email && (
                              <div className="flex items-center p-2 mb-2 text-red-800 bg-red-100 border border-red-200 rounded">
                                <AlertCircle className="w-4 h-4 me-1" />
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
                              placeholder={t(
                                "quotepage.step4.emailPlaceholder"
                              )}
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
                            placeholder={t("quotepage.step4.phonePlaceholder")}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleFormInputChange}
                            placeholder={t(
                              "quotepage.step4.companyPlaceholder"
                            )}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div className="p-6 mt-8 border border-green-200 bg-green-50 rounded-2xl">
                          <h4 className="mb-2 font-semibold text-green-800">
                            {t("quotepage.step4.whatNext")}
                          </h4>
                          <ul className="space-y-2 text-sm text-green-700">
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 me-2" />
                              {t("quotepage.step4.nextStep1")}
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 me-2" />
                              {t("quotepage.step4.nextStep2")}
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="w-4 h-4 me-2" />
                              {t("quotepage.step4.nextStep3")}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex-col items-center justify-center mt-6 space-x-4 space-y-4 md:flex md:space-y-0 md:flex-row md:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={activeStep === 1}
                      className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto text-center align-middle justify-center ${
                        activeStep === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5 me-2" />
                      {t("quotepage.navigation.previous")}
                      {activeStep > 1 && (
                        <span className="ms-2 text-xs text-gray-500">
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
                        {t("quotepage.navigation.next")}
                        <ArrowRight className="w-5 h-5 ms-2" />
                        <span className="ms-2 text-xs text-green-200">
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
                            <div className="w-5 h-5 me-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            {t("quotepage.navigation.processing")}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 me-2" />
                            {t("quotepage.navigation.getQuote")}
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
                {/* Price Estimate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 me-4 bg-green-100 rounded-2xl">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t("quotepage.sidebar.priceEstimate")}
                      </h3>
                      {estimatedCost && (
                        <button
                          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          title={t("quotepage.sidebar.calculationNote")}
                        >
                          <Info className="w-4 h-4 me-1" />
                          {t("quotepage.sidebar.howCalculated")}
                        </button>
                      )}
                    </div>
                  </div>

                  {estimatedCost ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                        <div className="text-center">
                          <p className="mb-1 text-sm font-medium text-green-600">
                            {t("quotepage.sidebar.estimatedTotal")}
                          </p>
                          <p className="text-3xl font-bold text-green-800">
                            ₦{estimatedCost.totalAmount.toLocaleString()}
                          </p>
                          <p className="mt-1 text-xs text-green-600">
                            {t("quotepage.sidebar.varianceNote")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {t("quotepage.sidebar.basePrice")}:
                          </span>
                          <span className="font-semibold">
                            ₦{estimatedCost.baseAmount.toLocaleString()}
                          </span>
                        </div>
                        {estimatedCost.urgencyMultiplier > 1 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {t("quotepage.sidebar.urgency", {
                                percentage: Math.round(
                                  (estimatedCost.urgencyMultiplier - 1) * 100
                                ),
                              })}
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
                              {t("quotepage.sidebar.fees.certification")}:
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
                              {t("quotepage.sidebar.additionalLanguages")}:
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
                        {t("quotepage.sidebar.completeForm")}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {t("quotepage.sidebar.updateAutomatically")}
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
                    {t("quotepage.sidebar.projectSummary")}
                  </h3>

                  <div className="space-y-4">
                    {formData.service && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.service")}:
                        </span>
                        <span className="font-semibold text-end">
                          {services.find((s) => s.id === formData.service)
                            ?.name || t("quotepage.sidebar.notSelected")}
                        </span>
                      </div>
                    )}

                    {formData.sourceLanguage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.from")}:
                        </span>
                        <span className="font-semibold">
                          {formData.sourceLanguage}
                        </span>
                      </div>
                    )}

                    {formData.targetLanguages.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.to")}:
                        </span>
                        <span className="font-semibold text-end">
                          {formData.targetLanguages.slice(0, 2).join(", ")}
                          {formData.targetLanguages.length > 2 &&
                            ` +${formData.targetLanguages.length - 2} ${t(
                              "quotepage.sidebar.more"
                            )}`}
                        </span>
                      </div>
                    )}

                    {(formData.wordCount || formData.pageCount) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.volume")}:
                        </span>
                        <span className="font-semibold">
                          {formData.wordCount
                            ? t("quotepage.sidebar.words", {
                                count: formData.wordCount,
                              })
                            : t("quotepage.sidebar.pages", {
                                count: formData.pageCount,
                              })}
                        </span>
                      </div>
                    )}

                    {formData.documents.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.files")}:
                        </span>
                        <span className="font-semibold">
                          {t("quotepage.sidebar.filesUploaded", {
                            count: formData.documents.length,
                          })}
                        </span>
                      </div>
                    )}

                    {formData.urgency && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("quotepage.sidebar.timeline")}:
                        </span>
                        <span className="font-semibold text-end">
                          {urgencyOptions
                            .find((u) => u.id === formData.urgency)
                            ?.name.split(" ")[0] ||
                            t("quotepage.sidebar.standard")}
                        </span>
                      </div>
                    )}

                    {(formData.certification || formData.glossary) && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                          {t("quotepage.sidebar.addOns")}:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.certification && (
                            <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                              {t("quotepage.sidebar.certified")}
                            </span>
                          )}
                          {formData.glossary && (
                            <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                              {t("quotepage.sidebar.glossary")}
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
                        {t("quotepage.sidebar.projectDetailsAppear")}
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
                      {t("quotepage.sidebar.qualityGuaranteed")}
                    </h4>
                    <p className="mb-4 text-sm text-gray-600">
                      {t("quotepage.sidebar.qualityDescription")}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          99.8%
                        </p>
                        <p className="text-xs text-gray-600">
                          {t("quotepage.sidebar.accuracyRate")}
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          5,000+
                        </p>
                        <p className="text-xs text-gray-600">
                          {t("quotepage.sidebar.happyClients")}
                        </p>
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
