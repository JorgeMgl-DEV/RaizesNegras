"use client";

import { useFormStatus } from "react-dom";

export default function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="login-form__submit" type="submit" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}
