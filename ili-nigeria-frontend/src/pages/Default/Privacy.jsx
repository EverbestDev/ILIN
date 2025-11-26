import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-20 sm:mt-24 md:mt-28">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block px-4 py-2 mb-4 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              {t("legal.privacy.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t("legal.privacy.title")}
            </h1>
            <p className="text-lg text-gray-600">
              {t("legal.privacy.lastUpdated")}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Introduction */}
            <div className="p-6 sm:p-8 lg:p-10 border-b border-gray-100">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {t("legal.privacy.intro")}
              </p>
            </div>

            {/* Sections */}
            <div className="divide-y divide-gray-100">
              {/* Information We Collect */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.privacy.collect.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("legal.privacy.collect.description")}
                </p>
                <ul className="space-y-3">
                  {t("legal.privacy.collect.items", { returnObjects: true }).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.privacy.usage.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("legal.privacy.usage.description")}
                </p>
                <ul className="space-y-3">
                  {t("legal.privacy.usage.items", { returnObjects: true }).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Data Sharing */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.privacy.sharing.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("legal.privacy.sharing.description")}
                </p>
              </section>

              {/* Your Rights */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.privacy.rights.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("legal.privacy.rights.description")}
                </p>
                <ul className="space-y-3">
                  {t("legal.privacy.rights.items", { returnObjects: true }).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Contact */}
              <section className="p-6 sm:p-8 lg:p-10 bg-gray-50">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t("legal.privacy.contact.title")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {t("legal.privacy.contact.description")}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}