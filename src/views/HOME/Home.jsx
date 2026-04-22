import Footer from "../../components/footer/footer";
import ProjectSection from "../../components/project-section/project-section";
import TopSection from "../../components/top-section/TopSection";

export default function Home() {
  return (
    <main className="home-page">
      <TopSection />
      <section id="home-intro" className="home-intro" aria-labelledby="intro-heading">
        <div className="container home-intro__grid">
          <div className="home-intro__header">
            <span className="home-intro__eyebrow">Arquivo vivo</span>
            <h2 id="intro-heading" className="main-title">Descobrindo as raízes negras do Maranhão</h2>
          </div>
          <div className="home-intro__body">
            <p>
              Explore a herança cultural afro-brasileira do Maranhão por meio de um acervo que reúne documentos históricos, manifestações culturais e pesquisas voltadas à preservação da identidade negra.
            </p>
            <p>
              A partir do mapa interativo, é possível navegar pelas regiões do estado, localizar materiais relacionados a cada território e acessar conteúdos em PDF com leitura pública e compartilhável.
            </p>
          </div>
        </div>
      </section>
      <ProjectSection />
      <Footer />
    </main>
  );
}
