import { siteContact, siteContactLinks, siteTeam } from "@/src/data/site";

export default function Contato() {
  return (
    <main className="legal-shell">
      <section className="legal-page__hero">
        <span className="legal-page__eyebrow">Contato institucional</span>
        <h1>Fale com o projeto</h1>
        <p>Envie dúvidas, sugestões ou solicitações sobre o portal, o acervo e os materiais organizados por região.</p>
      </section>

      <div className="legal-grid legal-grid--contact">
        <section className="legal-page legal-page--article">
          <h2>Como podemos ajudar?</h2>
          <p>
            Para dúvidas gerais, problemas técnicos ou solicitações institucionais, fale diretamente com a equipe por e-mail ou WhatsApp.
          </p>
          <div className="contact-actions">
            <a className="legal-aside__link" href={siteContactLinks.email}>Enviar e-mail</a>
            <a
              className="legal-aside__link legal-aside__link--secondary"
              href={siteContactLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Falar pelo WhatsApp
            </a>
          </div>

          <h2>Perguntas frequentes</h2>
          <h3>Como envio um material para o acervo?</h3>
          <p>Acesse a página Submeter, entre com sua conta e informe os dados e o link público do material no Google Drive.</p>
          <h3>O envio publica o material imediatamente?</h3>
          <p>Não. Toda submissão entra em uma fila de revisão e só aparece no acervo após aprovação da equipe.</p>
          <h3>Quais formatos podem aparecer no acervo?</h3>
          <p>O portal apresenta documentos PDF, imagens e vídeos armazenados nas pastas configuradas do Google Drive.</p>
          <h3>Como acompanho minha submissão?</h3>
          <p>Entre novamente em Submeter com a mesma conta para consultar o histórico e o status dos materiais enviados.</p>
        </section>

        <aside className="legal-aside legal-aside--contact">
          <strong>Contato direto</strong>
          <div className="legal-aside__stack">
            <div className="legal-aside__card">
              <span>E-mail</span>
              <a href={siteContactLinks.email}>{siteContact.email}</a>
            </div>
            <div className="legal-aside__card">
              <span>WhatsApp</span>
              <a href={siteContactLinks.whatsapp} target="_blank" rel="noreferrer">
                {siteContact.whatsappLabel}
              </a>
            </div>
            <div className="legal-aside__card">
              <span>Equipe</span>
              {siteTeam.map((member) => (
                <p key={member.name}>{member.name} — {member.role}.</p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
