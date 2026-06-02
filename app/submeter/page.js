import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/top-section/Navbar/Navbar";
import Footer from "@/src/components/footer/footer";
import { prisma } from "@/src/lib/prisma";
import {
  KNOWLEDGE_AREA_OPTIONS,
  SUBMISSION_TYPE_OPTIONS,
  formatSubmissionDate,
  getKnowledgeAreaLabel,
  getSubmissionStatusLabel,
  getSubmissionTypeLabel,
} from "@/src/lib/submissions";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";
import { createSubmission } from "./actions";
import SubmissionSubmitButton from "./submit-button";

export const metadata = {
  title: "Submeter Publicacao | Raizes Negras",
};

function getSubmissionMessage(error) {
  if (error === "config") {
    return "Configure as variaveis do Supabase antes de usar as submissoes.";
  }

  if (error === "session") {
    return "Faca login para enviar uma submissao.";
  }

  return error || "";
}

export default async function SubmitPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const error = getSubmissionMessage(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : "",
  );
  const success = resolvedSearchParams.success === "1";

  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?mode=login&error=session");
  }

  const submissions = await prisma.publicationSubmission.findMany({
    where: {
      OR: [{ submitterId: user.id }, { submitterEmail: user.email || "" }],
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <Navbar />
      <main className="submission-page">
        <section className="submission-hero">
          <div>
            <span className="submission-eyebrow">Submissao ao acervo</span>
            <h1>Enviar publicacao</h1>
            <p>
              Cadastre os dados da publicacao e informe um link publico do Google Drive. A equipe revisa, solicita
              ajustes quando necessario e associa o material final ao acervo apos aprovacao.
            </p>
          </div>
          <Link className="submission-hero__link" href="/perfil">
            Meu perfil
          </Link>
        </section>

        <section className="submission-layout">
          <form className="submission-form" action={createSubmission}>
            {error && (
              <div className="submission-alert submission-alert--error">
                <strong>Falha na submissao.</strong>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="submission-alert submission-alert--success">
                <strong>Submissao enviada.</strong>
                <p>O material entrou na fila de revisao administrativa.</p>
              </div>
            )}

            <div className="submission-form__section">
              <h2>Dados principais</h2>
              <div className="submission-form__grid">
                <label className="submission-field submission-field--wide" htmlFor="submission-title">
                  <span>Titulo</span>
                  <input id="submission-title" name="title" type="text" minLength="6" required />
                </label>

                <label className="submission-field submission-field--wide" htmlFor="submission-authors">
                  <span>Autores</span>
                  <input
                    id="submission-authors"
                    name="authors"
                    type="text"
                    placeholder="Separe os nomes por ponto e virgula"
                    required
                  />
                </label>

                <label className="submission-field" htmlFor="submission-institution">
                  <span>Instituicao</span>
                  <input id="submission-institution" name="institution" type="text" placeholder="Opcional" />
                </label>

                <label className="submission-field" htmlFor="submission-type">
                  <span>Tipo de material</span>
                  <select id="submission-type" name="submissionType" required>
                    <option value="">Selecione</option>
                    {SUBMISSION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="submission-field" htmlFor="submission-area">
                  <span>Area de conhecimento</span>
                  <select id="submission-area" name="knowledgeArea" required>
                    <option value="">Selecione</option>
                    {KNOWLEDGE_AREA_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="submission-field" htmlFor="submission-research-area">
                  <span>Linha / tema</span>
                  <input id="submission-research-area" name="researchArea" type="text" placeholder="Opcional" />
                </label>
              </div>
            </div>

            <div className="submission-form__section">
              <h2>Resumo e arquivo</h2>
              <label className="submission-field" htmlFor="submission-abstract">
                <span>Resumo</span>
                <textarea
                  id="submission-abstract"
                  name="abstract"
                  rows="7"
                  minLength="80"
                  placeholder="Contexto, objetivo, metodologia ou descricao do material."
                  required
                />
              </label>

              <div className="submission-form__grid">
                <label className="submission-field" htmlFor="submission-keywords">
                  <span>Palavras-chave</span>
                  <input id="submission-keywords" name="keywords" type="text" placeholder="Ex.: memoria; territorio" />
                </label>

                <label className="submission-field" htmlFor="submission-drive">
                  <span>Link publico do Drive</span>
                  <input id="submission-drive" name="driveLink" type="url" placeholder="https://drive.google.com/..." required />
                </label>
              </div>
            </div>

            <div className="submission-form__section">
              <h2>Contato</h2>
              <div className="submission-form__grid">
                <label className="submission-field" htmlFor="submission-email">
                  <span>Email</span>
                  <input
                    id="submission-email"
                    name="contactEmail"
                    type="email"
                    defaultValue={user.email || ""}
                    required
                  />
                </label>

                <label className="submission-field" htmlFor="submission-phone">
                  <span>Telefone</span>
                  <input id="submission-phone" name="contactPhone" type="tel" placeholder="Opcional" />
                </label>
              </div>
            </div>

            <SubmissionSubmitButton />
          </form>

          <aside className="submission-aside">
            <h2>Minhas submissoes</h2>
            {submissions.length === 0 && <p>Nenhuma submissao enviada ainda.</p>}
            <div className="submission-history">
              {submissions.map((submission) => (
                <article className="submission-history__item" key={submission.id}>
                  <span className={`submission-status submission-status--${submission.status.toLowerCase()}`}>
                    {getSubmissionStatusLabel(submission.status)}
                  </span>
                  <h3>{submission.title}</h3>
                  <p>{getSubmissionTypeLabel(submission.submissionType)} / {getKnowledgeAreaLabel(submission.knowledgeArea)}</p>
                  <small>Enviado em {formatSubmissionDate(submission.createdAt)}</small>
                  {submission.adminNote && <div className="submission-note">{submission.adminNote}</div>}
                  {submission.approvedDriveFileId && (
                    <Link href={`/artigo/${submission.approvedDriveFileId}`} className="submission-history__link">
                      Abrir no acervo
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
