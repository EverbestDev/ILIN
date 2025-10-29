// LanguageMarquee.jsx
import { useTranslation } from "react-i18next";

export default function LanguageMarquee() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const languages = [
    { code: "en", text: "Welcome - English" },
    { code: "es", text: "Bienvenido - Español" },
    { code: "fr", text: "Bienvenue - Français" },
    { code: "de", text: "Willkommen - Deutsch" },
    { code: "it", text: "Benvenuto - Italiano" },
    { code: "ar", text: "أهلا بك - العربية" },
    { code: "zh", text: "欢迎 - 中文" },
    { code: "hi", text: "स्वागत है - हिन्दी" },
    { code: "ru", text: "Добро пожаловать - Русский" },
    { code: "sw", text: "Karibu - Kiswahili" },
    { code: "ig", text: "Nnọọ - Igbo" },
    { code: "yo", text: "Ẹ ku abọ - Yoruba" },
  ];

  return (
    <div className="w-screen py-3 overflow-hidden bg-green-600">
      <div
        className={`relative flex whitespace-nowrap ${
          isRTL ? "direction-rtl" : ""
        }`}
      >
        {/* First set of texts */}
        <div
          className={`flex ${
            isRTL ? "animate-marquee-rtl" : "animate-marquee"
          }`}
        >
          {languages.map((lang) => (
            <span
              key={lang.code}
              className="mx-6 text-lg font-medium text-white"
            >
              {lang.text}
            </span>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div
          className={`flex ${
            isRTL ? "animate-marquee-rtl" : "animate-marquee"
          }`}
          aria-hidden="true"
        >
          {languages.map((lang) => (
            <span
              key={lang.code}
              className="mx-6 text-lg font-medium text-white"
            >
              {lang.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
