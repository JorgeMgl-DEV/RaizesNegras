import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import Footer from "../../components/footer/footer";
import "./faq.css";

function Faq() {
    return (
        <>
            <Navbar />
            <main className="faq__main">
                <h1 className="faq__title">FAQ</h1>
                <p className="faq__text">Aqui estão as formas oficiais de contato e quando usar cada uma.</p>

                <section className="faq__section">
                    <h2 className="faq__subtitle">E-mail do Projeto</h2>
                    <p className="faq__text">
                        Para dúvidas gerais, envio de sugestões ou relato de problemas, você pode escrever para
                        <a className="faq__link" href="mailto:acervo.raizesnegras@gmail.com"> acervo.raizesnegras@gmail.com</a>.
                    </p>
                </section>

                <section className="faq__section">
                    <h2 className="faq__subtitle">WhatsApp</h2>
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
                                <a className="faq__btn" href="#" target="_blank" rel="noreferrer">Enviar mensagem</a>
                            </div>
                        </article>

                        <article className="faq__card">
                            <div className="faq__card-header">
                                <h3 className="faq__name">Erick MacGregor</h3>
                                <span className="faq__role">Contato institucional/Orientação</span>
                            </div>
                            <div className="faq__card-actions">
                                <a className="faq__btn" href="#" target="_blank" rel="noreferrer">Enviar mensagem</a>
                            </div>
                        </article>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Faq;


