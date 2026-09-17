import "server-only";

import { getSubmissionStatusLabel, SUBMISSION_STATUS } from "@/src/lib/submissions";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_SITE_URL = "https://raizesnegrasma.com.br";

const statusMessages = {
  [SUBMISSION_STATUS.PENDING]: "Sua submissão voltou para a fila de análise.",
  [SUBMISSION_STATUS.APPROVED]: "Sua submissão foi aprovada e já pode ser consultada no acervo.",
  [SUBMISSION_STATUS.REJECTED]: "Sua submissão não foi aprovada nesta revisão.",
  [SUBMISSION_STATUS.CHANGES_REQUESTED]: "A equipe solicitou alterações antes de continuar a avaliação.",
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getNotificationUrl(submission) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

  if (submission.status === SUBMISSION_STATUS.APPROVED && submission.approvedDriveFileId) {
    return `${siteUrl}/artigo/${encodeURIComponent(submission.approvedDriveFileId)}`;
  }

  return `${siteUrl}/submeter`;
}

function buildEmailContent(submission) {
  const statusLabel = getSubmissionStatusLabel(submission.status);
  const statusMessage = statusMessages[submission.status] || "O status da sua submissão foi atualizado.";
  const destinationUrl = getNotificationUrl(submission);
  const safeTitle = escapeHtml(submission.title);
  const safeStatus = escapeHtml(statusLabel);
  const safeMessage = escapeHtml(statusMessage);
  const safeAdminNote = escapeHtml(submission.adminNote || "").replaceAll("\n", "<br />");

  const noteBlock = safeAdminNote
    ? `<div style="margin:20px 0;padding:16px;border-radius:12px;background:#f7efe2;color:#6a4a35"><strong>Mensagem da equipe</strong><p style="margin:8px 0 0">${safeAdminNote}</p></div>`
    : "";

  return {
    subject: `[Raízes Negras] ${statusLabel}: ${submission.title.replace(/[\r\n]+/g, " ")}`,
    text: [
      "Olá,",
      "",
      statusMessage,
      `Material: ${submission.title}`,
      `Status: ${statusLabel}`,
      submission.adminNote ? `Mensagem da equipe: ${submission.adminNote}` : "",
      "",
      `Acompanhe em: ${destinationUrl}`,
      "",
      "Equipe Raízes Negras",
    ].filter(Boolean).join("\n"),
    html: `
      <div style="margin:0 auto;max-width:620px;padding:32px;font-family:Arial,sans-serif;color:#30110b">
        <div style="margin-bottom:24px;color:#f39c13;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Raízes Negras</div>
        <h1 style="margin:0 0 16px;font-size:28px">Atualização da sua submissão</h1>
        <p style="font-size:16px;line-height:1.6">${safeMessage}</p>
        <div style="margin:20px 0;padding:16px;border:1px solid #ead9c8;border-radius:12px">
          <strong>${safeTitle}</strong>
          <p style="margin:8px 0 0">Status: ${safeStatus}</p>
        </div>
        ${noteBlock}
        <a href="${destinationUrl}" style="display:inline-block;margin-top:8px;padding:13px 20px;border-radius:999px;background:#460e06;color:#fff1dc;text-decoration:none;font-weight:700">Acompanhar submissão</a>
        <p style="margin-top:28px;color:#947562;font-size:13px">Esta é uma mensagem automática do portal Raízes Negras.</p>
      </div>
    `,
  };
}

export function hasEmailNotificationConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFICATION_FROM_EMAIL);
}

export async function sendSubmissionStatusNotification(submission) {
  if (!hasEmailNotificationConfig()) {
    return { status: "unconfigured" };
  }

  const content = buildEmailContent(submission);
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `submission-status/${submission.id}/${submission.status}/${submission.updatedAt.toISOString()}`,
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: [submission.contactEmail || submission.submitterEmail],
      subject: content.subject,
      text: content.text,
      html: content.html,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Resend recusou a notificação (${response.status}): ${responseBody.slice(0, 500)}`);
  }

  const data = await response.json();
  return { status: "sent", id: data.id };
}
