import React, { useState, useEffect } from "react";
import "../../pages/PRIVACIDADE/legal.css";

const ADSENSE_SCRIPT = {
  src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
  async: true,
  "data-ad-client": "ca-pub-9866884710668386"
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

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "true") {
      setAccepted(true);
      injectAdSenseScript();
    } else {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setAccepted(true);
    setShowBanner(false);
    injectAdSenseScript();
  };

  if (!showBanner || accepted) return null;

  return (
    <div className="legal-page" style={{position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#fff", boxShadow: "0 -2px 8px rgba(0,0,0,0.07)", borderRadius: "8px 8px 0 0", maxWidth: "700px", margin: "0 auto", padding: "1.2rem"}}>
      <h2>Consentimento de Cookies</h2>
      <p>
        Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e exibir anúncios do Google AdSense. Ao aceitar, você concorda com nossa <a href="/privacidade">Política de Privacidade</a> e com o uso de cookies conforme a LGPD.
      </p>
      <button style={{marginTop: "1rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", padding: "0.7rem 1.5rem", cursor: "pointer"}} onClick={handleAccept}>
        Aceitar e continuar
      </button>
    </div>
  );
};

export default CookieConsent;
