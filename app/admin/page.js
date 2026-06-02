import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminWhitelist, isAdminUser } from "@/src/lib/admin";
import { prisma } from "@/src/lib/prisma";
import { buildDriveMediaQuery, formatDriveItemTitle } from "@/src/utils/driveMedia";
import { env } from "@/src/utils/env";
import {
  PERSON_TYPE_OPTIONS,
  getOptionLabel,
  getProfileFromMetadata,
  getUserDisplayName,
  getUserInitials,
} from "@/src/lib/profile";
import {
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_OPTIONS,
  formatSubmissionDate,
  getKnowledgeAreaLabel,
  getSubmissionStatusLabel,
  getSubmissionTypeLabel,
} from "@/src/lib/submissions";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";
import { logout } from "../login/actions";
import { reviewSubmission } from "./actions";

export const metadata = {
  title: "Admin | Raizes Negras",
};

function getAdminMessage(error) {
  if (error === "submission") {
    return "Submissao nao encontrada.";
  }

  if (error === "status") {
    return "Status de revisao invalido.";
  }

  return error || "";
}

const driveFolders = [
  env.googleDriveFolderGeneral,
  env.googleDriveSubfolderId,
  env.googleDriveFolderCentro,
  env.googleDriveFolderLeste,
  env.googleDriveFolderNorte,
  env.googleDriveFolderOeste,
  env.googleDriveFolderSul,
].filter(Boolean);

function getDriveSearchTerm(title = "") {
  return title
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 5)
    .join(" ");
}

async function findDriveSuggestion(submission) {
  if (!env.googleApiKey || driveFolders.length === 0 || submission.status === SUBMISSION_STATUS.APPROVED) {
    return null;
  }

  const searchTerm = getDriveSearchTerm(submission.title);

  if (!searchTerm) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: buildDriveMediaQuery({ folderIds: driveFolders, searchTerm }),
      key: env.googleApiKey,
      fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
      orderBy: "modifiedTime desc",
      pageSize: "1",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.files?.[0] || null;
  } catch {
    return null;
  }
}

export default async function AdminPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const error = getAdminMessage(typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : "");
  const reviewed = resolvedSearchParams.reviewed === "1";

  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=session");
  }

  if (!isAdminUser(user)) {
    redirect("/perfil?error=admin");
  }

  const profile = getProfileFromMetadata(user.user_metadata);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const personTypeLabel = getOptionLabel(PERSON_TYPE_OPTIONS, profile.personType, "Perfil em configuracao");
  const whitelistMode = hasAdminWhitelist();
  const [submissions, pendingCount, approvedCount, changesCount, rejectedCount] = await Promise.all([
    prisma.publicationSubmission.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 30,
    }),
    prisma.publicationSubmission.count({ where: { status: SUBMISSION_STATUS.PENDING } }),
    prisma.publicationSubmission.count({ where: { status: SUBMISSION_STATUS.APPROVED } }),
    prisma.publicationSubmission.count({ where: { status: SUBMISSION_STATUS.CHANGES_REQUESTED } }),
    prisma.publicationSubmission.count({ where: { status: SUBMISSION_STATUS.REJECTED } }),
  ]);
  const driveSuggestions = await Promise.all(
    submissions.map(async (submission) => [submission.id, await findDriveSuggestion(submission)]),
  );
  const driveSuggestionBySubmissionId = Object.fromEntries(driveSuggestions);

  return (
    <main className="login-page profile-page admin-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-panel__intro profile-sidebar">
            <span className="login-panel__eyebrow">Admin</span>
            <h1>Painel administrativo</h1>
            <p>
              Esta area inicial serve como ponto de entrada para administracao restrita, validada no servidor antes
              de renderizar a pagina.
            </p>

            <div className="profile-summary">
              <div className="profile-summary__avatar" aria-hidden="true">
                {profile.avatarUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatarUrl} alt={displayName} />
                  </>
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="profile-summary__meta">
                <strong>{displayName}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="login-panel__notes">
              <p>Tipo de perfil: {personTypeLabel}.</p>
              <p>Modo de acesso atual: whitelist fixa por email em `ADMIN_EMAILS`.</p>
              {!whitelistMode && <p>Sem `ADMIN_EMAILS` definido, ninguem deve ser tratado como admin.</p>}
            </div>

            <div className="profile-admin-badge">Administrador autorizado</div>

            <div className="profile-sidebar__actions">
              <Link href="/perfil" className="login-panel__back">
                Voltar ao perfil
              </Link>
              <Link href="/" className="login-form__submit login-form__submit--secondary profile-link-button">
                Ir para o site
              </Link>
            </div>
          </div>

          <div className="login-card admin-card">
            <div className="profile-header">
              <div>
                <span className="login-session__label">Area restrita</span>
                <h2>Visao geral</h2>
                <p>Somente usuarios reconhecidos como admin conseguem abrir esta rota.</p>
              </div>

              <form action={logout}>
                <button className="login-session__logout" type="submit">
                  Sair
                </button>
              </form>
            </div>

            <div className="admin-grid">
              <article className="admin-panel">
                <span className="admin-panel__label">Pendentes</span>
                <strong>{pendingCount}</strong>
                <p>Materiais aguardando primeira decisao administrativa.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Aprovadas</span>
                <strong>{approvedCount}</strong>
                <p>Publicacoes associadas a um arquivo final no Drive.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Alteracoes</span>
                <strong>{changesCount}</strong>
                <p>Submissoes devolvidas para ajustes pelos autores.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Recusadas</span>
                <strong>{rejectedCount}</strong>
                <p>Materiais recusados na revisao administrativa.</p>
              </article>
            </div>

            {error && (
              <div className="login-alert login-alert--error">
                <strong>Falha na revisao.</strong>
                <p>{error}</p>
              </div>
            )}

            {reviewed && (
              <div className="login-alert login-alert--success">
                <strong>Revisao salva.</strong>
                <p>A decisao administrativa foi registrada.</p>
              </div>
            )}

            <div className="admin-submissions">
              <div className="admin-submissions__header">
                <div>
                  <span className="login-session__label">Fila editorial</span>
                  <h3>Submissoes recentes</h3>
                </div>
                <Link href="/submeter" className="login-form__submit login-form__submit--secondary profile-link-button">
                  Abrir submissao
                </Link>
              </div>

              {submissions.length === 0 && <div className="admin-empty">Nenhuma submissao recebida ainda.</div>}

              {submissions.map((submission) => {
                const driveSuggestion = driveSuggestionBySubmissionId[submission.id];

                return (
                    <article className="admin-submission" key={submission.id}>
                      <div className="admin-submission__main">
                        <span className={`submission-status submission-status--${submission.status.toLowerCase()}`}>
                          {getSubmissionStatusLabel(submission.status)}
                        </span>
                        <h4>{submission.title}</h4>
                        <p>{submission.abstract}</p>
                        <div className="admin-submission__meta">
                          <span>{submission.authors}</span>
                          <span>{submission.institution || "Sem instituicao"}</span>
                          <span>{getSubmissionTypeLabel(submission.submissionType)}</span>
                          <span>{getKnowledgeAreaLabel(submission.knowledgeArea)}</span>
                          <span>Enviado em {formatSubmissionDate(submission.createdAt)}</span>
                        </div>
                        <div className="admin-submission__links">
                          <a href={submission.driveLink} target="_blank" rel="noreferrer">
                            Link submetido
                          </a>
                          {submission.approvedDriveFileId && (
                            <Link href={`/artigo/${submission.approvedDriveFileId}`}>Abrir no acervo</Link>
                          )}
                        </div>
                        {driveSuggestion && (
                          <div className="admin-drive-suggestion">
                            <span>Sugestao mais recente no Drive</span>
                            <strong>{formatDriveItemTitle(driveSuggestion.name)}</strong>
                            <small>ID: {driveSuggestion.id}</small>
                            {driveSuggestion.webViewLink && (
                              <a href={driveSuggestion.webViewLink} target="_blank" rel="noreferrer">
                                Conferir arquivo
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <form className="admin-review-form" action={reviewSubmission}>
                        <input type="hidden" name="submissionId" value={submission.id} />
                        <label>
                          <span>Status</span>
                          <select name="status" defaultValue={submission.status}>
                            {SUBMISSION_STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Arquivo final no Drive</span>
                          <input
                            name="approvedDriveValue"
                            type="text"
                            defaultValue={submission.approvedDriveFileId || submission.approvedDriveLink || driveSuggestion?.id || ""}
                            placeholder="ID ou link do arquivo final"
                          />
                        </label>
                        <label>
                          <span>Nome confirmado do arquivo</span>
                          <input
                            name="approvedDriveFileName"
                            type="text"
                            defaultValue={submission.approvedDriveFileName || driveSuggestion?.name || ""}
                            placeholder="Opcional"
                          />
                        </label>
                        <label>
                          <span>Mensagem ao autor</span>
                          <textarea
                            name="adminNote"
                            rows="4"
                            defaultValue={submission.adminNote || ""}
                            placeholder="Motivo da recusa, ajustes solicitados ou observacoes de aprovacao."
                          />
                        </label>
                        <button className="login-form__submit" type="submit">
                          Salvar revisao
                        </button>
                      </form>
                    </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
