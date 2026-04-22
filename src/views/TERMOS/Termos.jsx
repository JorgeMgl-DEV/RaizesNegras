import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";

export default function Termos() {
  return (
    <>
      <Navbar />
      <main className="legal-shell">
        <section className="legal-page__hero">
          <span className="legal-page__eyebrow">Informações legais</span>
          <h1>Termos de Uso</h1>
          <p>Diretrizes para acesso, uso do acervo e circulação responsável dos materiais disponibilizados pelo portal.</p>
        </section>

        <div className="legal-grid">
          <article className="legal-page legal-page--article">
            <p>
              Ao acessar o portal Raízes Negras, você concorda com estes termos. O conteúdo do site é destinado à promoção da cultura afro-brasileira, educação e projetos sociais.
            </p>
            <p>
              É proibida a reprodução não autorizada de textos, imagens ou mapas. O usuário compromete-se a utilizar o site de forma ética, respeitando direitos autorais e a legislação vigente.
            </p>
            <h2>Responsabilidades</h2>
            <p>
              O portal não se responsabiliza por opiniões de colaboradores ou conteúdos de terceiros. Links externos são fornecidos apenas para referência.
            </p>
            <h2>Contato</h2>
            <p>
              Para dúvidas sobre os termos de uso, entre em contato pelo e-mail institucional.
            </p>
          </article>

          <aside className="legal-aside">
            <strong>Em resumo</strong>
            <div className="legal-aside__stack">
              <div className="legal-aside__card">
                <span>Uso permitido</span>
                <p>Consulta, estudo e circulação educativa dentro dos limites autorais e legais.</p>
              </div>
              <div className="legal-aside__card">
                <span>Conduta esperada</span>
                <p>Uso ético, respeito à autoria e preservação do contexto dos materiais do acervo.</p>
              </div>
            </div>
            <a className="legal-aside__link" href="mailto:acervo.raizesnegras@gmail.com">
              Falar com a equipe
            </a>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
