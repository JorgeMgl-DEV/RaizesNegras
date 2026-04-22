import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";

export default function Privacidade() {
  return (
    <>
      <Navbar />
      <main className="legal-shell">
        <section className="legal-page__hero">
          <span className="legal-page__eyebrow">Informações legais</span>
          <h1>Política de Privacidade</h1>
          <p>Como o portal trata cookies, métricas e dados de contato para manter a navegação transparente e segura.</p>
        </section>

        <div className="legal-grid">
          <article className="legal-page legal-page--article">
            <p>
              Esta política descreve como o portal Raízes Negras coleta, utiliza e protege suas informações. Utilizamos cookies para melhorar a experiência, personalizar conteúdo e analisar o tráfego do site.
            </p>
            <p>
              O Google AdSense pode utilizar cookies para exibir anúncios relevantes. Ao navegar, você concorda com o uso de cookies conforme a LGPD. Suas informações não são compartilhadas com terceiros, exceto quando exigido por lei ou para o funcionamento do serviço.
            </p>
            <h2>Cookies e Google AdSense</h2>
            <p>
              Utilizamos cookies para armazenar preferências e estatísticas. Você pode gerenciar o consentimento de cookies pelo banner exibido ao acessar o site.
            </p>
            <h2>LGPD</h2>
            <p>
              O portal Raízes Negras respeita a LGPD e garante o direito de acesso, correção e exclusão de dados pessoais. Para exercer seus direitos, entre em contato conosco.
            </p>
          </article>

          <aside className="legal-aside">
            <strong>Resumo</strong>
            <div className="legal-aside__stack">
              <div className="legal-aside__card">
                <span>Uso de cookies</span>
                <p>Melhora da experiência, medição de navegação e personalização de anúncios.</p>
              </div>
              <div className="legal-aside__card">
                <span>Base legal</span>
                <p>Tratamento orientado pela LGPD e pelos consentimentos escolhidos pelo visitante.</p>
              </div>
            </div>
            <a className="legal-aside__link" href="mailto:acervo.raizesnegras@gmail.com">
              Solicitar informações
            </a>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
