"use client";

import { useEffect, useState } from "react";

const ADSENSE_SCRIPT = {
  src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
  async: true,
  "data-ad-client": "ca-pub-9866884710668386",
};

function injectAdSenseScript() {
  if (document.getElementById("adsense-script")) return;

  const script = document.createElement("script");
  script.id = "adsense-script";

  Object.entries(ADSENSE_SCRIPT).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });

  document.body.appendChild(script);
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (consent === "true") {
      setAccepted(true);
      injectAdSenseScript();
      return;
    }

    setShowBanner(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setAccepted(true);
    setShowBanner(false);
    injectAdSenseScript();
  };

  if (!showBanner || accepted) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Consentimento de cookies">
      <div className="cookie-consent__body">
        <span className="cookie-consent__eyebrow">Privacidade</span>
        <h2>Consentimento de Cookies</h2>
        <p>
          Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e exibir anúncios do Google AdSense. Ao aceitar, você concorda com nossa{" "}
          <a href="/privacidade">Política de Privacidade</a> e com o uso de cookies conforme a LGPD.
        </p>
      </div>
      <button className="cookie-consent__button" onClick={handleAccept} type="button">
        Aceitar e continuar
      </button>
    </div>
  );
}
