import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ilin_cookie_accepted");
    if (stored === "true") setAccepted(true);
  }, []);

  const onAccept = () => {
    localStorage.setItem("ilin_cookie_accepted", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl p-4 bg-white border rounded-xl shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          {t("cookie.message")} <Link to="/privacy" className="text-green-600 underline">{t("cookie.learnMore")}</Link>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onAccept} className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg">{t("cookie.accept")}</button>
        </div>
      </div>
    </div>
  );
}
