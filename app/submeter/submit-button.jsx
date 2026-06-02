"use client";

import { useFormStatus } from "react-dom";

export default function SubmissionSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="submission-submit" type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar submissao"}
    </button>
  );
}
