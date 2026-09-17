"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="error-fallback">
      <section>
        <span>Erro inesperado</span>
        <h1>Não foi possível carregar esta página</h1>
        <p>A ocorrência foi registrada. Você pode tentar novamente agora.</p>
        <button type="button" onClick={reset}>Tentar novamente</button>
      </section>
    </main>
  );
}
