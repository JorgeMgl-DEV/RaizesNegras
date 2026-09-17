"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <main className="error-fallback">
          <section>
            <span>Erro inesperado</span>
            <h1>O portal encontrou um problema</h1>
            <p>A ocorrência foi registrada. Você pode tentar carregar o portal novamente.</p>
            <button type="button" onClick={reset}>Tentar novamente</button>
          </section>
        </main>
      </body>
    </html>
  );
}
