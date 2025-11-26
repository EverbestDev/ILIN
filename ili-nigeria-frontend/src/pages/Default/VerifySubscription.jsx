import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VerifySubscription() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending"); // pending, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage(t("footer.newsletter.verifiedError"));
        return;
      }
      try {
        const res = await fetch(`https://ilin-backend.onrender.com/api/subscribe/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(t("footer.newsletter.verifiedSuccess"));
        } else {
          setStatus("error");
          setMessage(data.message || t("footer.newsletter.verifiedError"));
        }
      } catch (err) {
        setStatus("error");
        setMessage(t("footer.newsletter.verifiedError"));
      }
    };
    verifyToken();
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-white">
      <div className="max-w-md w-full p-6 rounded-xl bg-white shadow-lg">
        <h2 className="text-xl font-bold mb-4">{t("footer.newsletter.title")}</h2>
        {status === "pending" && <p className="text-gray-600">{t("footer.newsletter.verifySent")}</p>}
        {status === "success" && <p className="text-green-600">{message}</p>}
        {status === "error" && <p className="text-red-600">{message}</p>}
      </div>
    </div>
  );
}
