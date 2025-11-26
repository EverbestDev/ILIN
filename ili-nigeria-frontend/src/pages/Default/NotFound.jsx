
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-6xl font-bold text-green-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">{t("notFound.title")}</h2>
        <p className="mt-2 text-gray-600">{t("notFound.description")}</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-white bg-green-600 rounded-lg"
          >
            {t("notFound.goHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
