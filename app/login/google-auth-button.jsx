"use client";

import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function GoogleAuthButton({ disabled = false }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError("");

      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/login?success=1`;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (authError) {
        setError("Nao foi possivel iniciar o login com Google.");
        setLoading(false);
      }
    } catch {
      setError("Nao foi possivel iniciar o login com Google.");
      setLoading(false);
    }
  }

  return (
    <div className="login-social">
      <button
        className="login-social__button"
        type="button"
        disabled={disabled || loading}
        onClick={handleGoogleLogin}
      >
        <span className="login-social__icon" aria-hidden="true">
          G
        </span>
        <span>{loading ? "Redirecionando..." : "Continuar com Google"}</span>
      </button>
      {error && <p className="login-social__error">{error}</p>}
    </div>
  );
}
