"use client";

import { useFormStatus } from "react-dom";

export default function LoginSubmitButton({ label, pendingLabel, formAction, className = "login-form__submit" }) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending} formAction={formAction}>
      {pending ? pendingLabel : label}
    </button>
  );
}
