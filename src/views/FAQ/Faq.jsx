import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";

export default function Faq() {
  return (
    <>
      <Navbar />
      <main className="faq__main">
        <section className="faq__hero">
          <span className="faq__eyebrow">Contato e suporte</span>
          <h1 className="faq__title">FAQ</h1>
          <p className="faq__text">Aqui estão as formas oficiais de contato e quando usar cada uma.</p>
        </section>

        <section className="faq__section faq__section--email">
          <h2 className="faq__subtitle">E-mail do projeto</h2>
          <p className="faq__text">
            Para dúvidas gerais, envio de sugestões ou relato de problemas, você pode escrever para
            <a className="faq__link" href="mailto:acervo.raizesnegras@gmail.com"> acervo.raizesnegras@gmail.com</a>.
          </p>
        </section>

        <section className="faq__section">
          <h2 className="faq__subtitle">Canais diretos</h2>
          <div className="faq__contacts">
            <article className="faq__card">
              <div className="faq__card-header">
                <h3 className="faq__name">Jorge Miguel Viana Torres</h3>
                <span className="faq__role">Dúvidas gerais • Problemas técnicos</span>
              </div>
              <div className="faq__card-actions">
                <a className="faq__btn" href="https://wa.me/5598986249925" target="_blank" rel="noreferrer">Enviar mensagem</a>
              </div>
            </article>

            <article className="faq__card">
              <div className="faq__card-header">
                <h3 className="faq__name">Murilo Gabriel Mourão</h3>
                <span className="faq__role">Artigos e mídias do site</span>
              </div>
              <div className="faq__card-actions">
                <a className="faq__btn" href="mailto:acervo.raizesnegras@gmail.com" target="_blank" rel="noreferrer">Enviar mensagem</a>
              </div>
            </article>

            <article className="faq__card">
              <div className="faq__card-header">
                <h3 className="faq__name">Erick MacGregor</h3>
                <span className="faq__role">Contato institucional e orientação</span>
              </div>
              <div className="faq__card-actions">
                <a className="faq__btn" href="mailto:acervo.raizesnegras@gmail.com" target="_blank" rel="noreferrer">Enviar mensagem</a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
