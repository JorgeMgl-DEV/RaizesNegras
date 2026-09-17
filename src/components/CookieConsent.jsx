"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

const CONSENT_KEY = "analyticsConsent";

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
    setReady(true);
  }, []);

  const saveConsent = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && <Analytics />}
      {ready && consent === null && (
        <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Consentimento de métricas">
          <div className="cookie-consent__body">
            <span className="cookie-consent__eyebrow">Privacidade</span>
            <h2>Métricas de navegação</h2>
            <p>
              Podemos coletar métricas anônimas para entender o uso do portal. Você pode aceitar ou continuar sem a coleta. Consulte nossa{" "}
              <a href="/privacidade">Política de Privacidade</a>.
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button className="cookie-consent__button cookie-consent__button--secondary" onClick={() => saveConsent("rejected")} type="button">
              Continuar sem métricas
            </button>
            <button className="cookie-consent__button" onClick={() => saveConsent("accepted")} type="button">
              Aceitar métricas
            </button>
          </div>
        </div>
      )}
    </>
  );
}
