// src/hooks/useRTL.js
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function useRTL() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return i18n.language === "ar" ? "rtl" : "ltr";
}
