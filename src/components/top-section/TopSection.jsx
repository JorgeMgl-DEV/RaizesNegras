import Link from "next/link";
import RegionList from "./Mapa/RegionList";
import MapaMA from "./Mapa/Mapa-MA";
import Navbar from "./Navbar/Navbar";

export default function TopSection() {
  return (
    <section className="top-section">
      <Navbar />
      <div className="content-section">
        <div className="project-info">
          <span className="hero-kicker">Acervo Digital Afro-Maranhense</span>
          <div className="hero-brand">
            <div className="project-description">
              <h1>Memória, território e circulação de saberes negros no Maranhão.</h1>
              <p>
                O Raízes Negras reúne documentos, artigos, registros culturais e materiais de pesquisa em uma
                navegação que conecta regiões, histórias e permanências.
              </p>
              <div className="hero-actions">
                <Link className="hero-action hero-action--primary" href="/conteudo">
                  Explorar o acervo
                </Link>
                <Link className="hero-action hero-action--secondary" href="/sobre">
                  Conhecer o projeto
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-meta" aria-label="Destaques do acervo">
            <article className="hero-meta-card">
              <strong>Mapa interativo</strong>
              <span>Entrada principal para explorar cada território do Maranhão.</span>
            </article>
            <article className="hero-meta-card">
              <strong>Acervo em PDF</strong>
              <span>Documentos e materiais organizados para leitura pública.</span>
            </article>
            <article className="hero-meta-card">
              <strong>Navegação regional</strong>
              <span>Conteúdos associados a contextos locais, narrativas e referências.</span>
            </article>
          </div>
        </div>
        <div className="hero-map-panel">
          <div className="hero-map-stage">
            <MapaMA />
            <span className="hero-map-caption">Passe o cursor para destacar e clique para abrir cada região.</span>
          </div>
        </div>
      </div>
      <RegionList />
      <a className="hero-scroll-arrow" href="#home-intro" aria-label="Ir para a apresentação da página inicial">
        ↓
      </a>
    </section>
  );
}
