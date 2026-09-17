import { siteContactLinks } from "@/src/data/site";

export default function Privacidade() {
  return (
    <main className="legal-shell">
      <section className="legal-page__hero">
        <span className="legal-page__eyebrow">Informações legais</span>
        <h1>Política de Privacidade</h1>
        <p>Como o portal trata métricas e dados pessoais para manter a navegação transparente e segura.</p>
      </section>

      <div className="legal-grid">
        <article className="legal-page legal-page--article">
          <p>
            O portal Raízes Negras utiliza dados de autenticação e perfil quando uma pessoa cria uma conta, envia materiais ou acessa áreas restritas. Esses dados são usados para identificar o autor, administrar submissões e proteger o painel administrativo.
          </p>
          <h2>Métricas de navegação</h2>
          <p>
            Com sua autorização, utilizamos o Vercel Analytics para compreender de forma agregada como o portal é acessado. A coleta só é ativada quando a opção “Aceitar métricas” é escolhida no banner.
          </p>
          <p>Você também pode continuar usando o portal sem ativar essas métricas.</p>
          <h2>Google Drive e Supabase</h2>
          <p>
            O acervo público consulta arquivos armazenados no Google Drive. Autenticação, perfis e registros de submissão são processados por meio do Supabase e do banco de dados associado ao projeto.
          </p>
          <h2>Erros e notificações</h2>
          <p>
            O portal utiliza o Sentry para registrar falhas técnicas sem envio intencional de informações pessoais por padrão. Quando o status de uma submissão muda, o endereço informado pelo autor pode ser processado pela Resend exclusivamente para entregar a notificação transacional.
          </p>
          <h2>Seus direitos</h2>
          <p>
            Conforme a LGPD, você pode solicitar acesso, correção ou exclusão dos seus dados pessoais. Para exercer esses direitos, entre em contato com a equipe do projeto.
          </p>
        </article>

        <aside className="legal-aside">
          <strong>Resumo</strong>
          <div className="legal-aside__stack">
            <div className="legal-aside__card">
              <span>Métricas opcionais</span>
              <p>A medição de navegação depende da escolha feita no banner de privacidade.</p>
            </div>
            <div className="legal-aside__card">
              <span>Dados de conta</span>
              <p>São utilizados para autenticação, perfil, submissões e administração do acervo.</p>
            </div>
            <div className="legal-aside__card">
              <span>Operação do portal</span>
              <p>Falhas técnicas são monitoradas e e-mails transacionais informam mudanças nas submissões.</p>
            </div>
          </div>
          <a className="legal-aside__link" href={siteContactLinks.email}>Solicitar informações</a>
        </aside>
      </div>
    </main>
  );
}
