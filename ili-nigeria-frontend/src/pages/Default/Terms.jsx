import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-20 sm:mt-24 md:mt-28">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block px-4 py-2 mb-4 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              {t("legal.terms.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t("legal.terms.title")}
            </h1>
            <p className="text-lg text-gray-600">
              {t("legal.terms.lastUpdated")}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Introduction */}
            <div className="p-6 sm:p-8 lg:p-10 border-b border-gray-100">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {t("legal.terms.intro")}
              </p>
            </div>

            {/* Sections */}
            <div className="divide-y divide-gray-100">
              {/* Services */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.terms.services.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("legal.terms.services.description")}
                </p>
              </section>

              {/* User Responsibilities */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.terms.responsibilities.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("legal.terms.responsibilities.description")}
                </p>
                <ul className="space-y-3">
                  {t("legal.terms.responsibilities.items", { returnObjects: true }).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Payment & Refunds */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.terms.payment.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("legal.terms.payment.description")}
                </p>
              </section>

              {/* Cancellation */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.terms.cancellation.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("legal.terms.cancellation.description")}
                </p>
              </section>

              {/* Intellectual Property */}
              <section className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("legal.terms.intellectual.title")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("legal.terms.intellectual.description")}
                </p>
              </section>

              {/* Contact */}
              <section className="p-6 sm:p-8 lg:p-10 bg-gray-50">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t("legal.terms.contact.title")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {t("legal.terms.contact.description")}
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