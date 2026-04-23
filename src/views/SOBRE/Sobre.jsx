import Image from "next/image";
import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import fotoErick from "./FotoErick.jpeg";
import fotoJorge from "./FotoJorge.jpeg";
import fotoMurilo from "./foto murilo.png";

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main className="sobre__main">
        <section className="sobre__hero">
          <span className="sobre__eyebrow">Institucional</span>
          <h1 className="sobre__title">Sobre o projeto</h1>
          <p className="sobre__text">
            Raízes Negras é um acervo digital dedicado a reunir e dar visibilidade a referências, artigos e registros sobre a cultura negra, com navegação por regiões e conteúdos temáticos.
          </p>
        </section>

        <section className="sobre__section sobre__section--mission">
          <div className="sobre__intro-card">
            <h2 className="sobre__subtitle">Propósito</h2>
            <p className="sobre__text">
              O projeto busca facilitar o acesso ao conhecimento, apoiar pesquisas e iniciativas educacionais e fortalecer a valorização da memória e da produção cultural afro-maranhense.
            </p>
          </div>
          <div className="sobre__intro-card">
            <h2 className="sobre__subtitle">Frentes de atuação</h2>
            <ul className="sobre__list">
              <li>Mapear e organizar conteúdos por região e tema.</li>
              <li>Facilitar a busca e o acesso a materiais de referência.</li>
              <li>Valorizar produções acadêmicas, artísticas e comunitárias.</li>
              <li>Apoiar educadores, estudantes e pesquisadores.</li>
            </ul>
          </div>
        </section>

        <section className="sobre__section">
          <div className="sobre__tech">
            <span className="sobre__tech-label">Base tecnológica</span>
            <p className="sobre__text">
              Aplicação em React com Next.js e integração com serviços em nuvem para facilitar a busca, a leitura e a curadoria de materiais do acervo.
            </p>
          </div>
        </section>

        <section className="sobre__team">
          <h2 className="sobre__subtitle">Equipe</h2>

          <article className="sobre__card">
            <div className="sobre__photo" aria-label="foto Jorge">
              <Image
                src={fotoJorge}
                alt="Foto de Jorge Miguel Viana Torres"
                className="sobre__img"
                width={320}
                height={320}
                sizes="(max-width: 640px) min(78vw, 320px), (max-width: 900px) 320px, 220px"
              />
            </div>
            <div className="sobre__card-body">
              <h3 className="sobre__name">Jorge Miguel Viana Torres</h3>
              <div className="sobre__role">Criador e Desenvolvedor</div>
              <p className="sobre__text">
                Nordestino, nascido em Coelho Neto, cidade do interior do Maranhão, sou estudante de Informática no IEMA e apaixonado por tecnologia e cultura. Bolsista do CNPq, ganhador do FECULEMA 2024 e destaque em eventos científicos e tecnológicos.
              </p>
              <p className="sobre__text">
                Como criador e principal desenvolvedor do Raízes Negras, uni minha formação técnica e o interesse pela preservação da memória afro-maranhense em uma plataforma digital, mostrando como a tecnologia pode fortalecer a cultura e a identidade do Maranhão.
              </p>
              <div className="sobre__actions">
                <a className="sobre__link" href="https://www.linkedin.com/in/jorge-creativo-tech" target="_blank" rel="noreferrer">
                  Perfil no LinkedIn
                </a>
              </div>
            </div>
          </article>

          <article className="sobre__card">
            <div className="sobre__photo" aria-label="foto Erick">
              <Image
                src={fotoErick}
                alt="Foto de Erick MacGregor"
                className="sobre__img"
                width={320}
                height={320}
                sizes="(max-width: 640px) min(78vw, 320px), (max-width: 900px) 320px, 220px"
              />
            </div>
            <div className="sobre__card-body">
              <h3 className="sobre__name">Erick MacGregor</h3>
              <div className="sobre__role">Orientador</div>
              <p className="sobre__text">
                Professor do IEMA e mestrando em Ciência da Computação pela UFPI, atua nas áreas de Inteligência Artificial, Ciência de Dados e Educação Tecnológica.
              </p>
              <p className="sobre__text">
                Como orientador do Raízes Negras, contribuiu na concepção metodológica, no acompanhamento técnico e na articulação acadêmica, garantindo rigor científico e relevância cultural ao projeto.
              </p>
              <div className="sobre__actions">
                <a className="sobre__link" href="https://www.linkedin.com/in/erickmacgregor/" target="_blank" rel="noreferrer">
                  Perfil no LinkedIn
                </a>
              </div>
            </div>
          </article>

          <article className="sobre__card sobre__card--last">
            <div className="sobre__photo" aria-label="foto Murilo">
              <Image
                src={fotoMurilo}
                alt="Foto de Murilo Gabriel Mourão"
                className="sobre__img"
                width={320}
                height={320}
                sizes="(max-width: 640px) min(78vw, 320px), (max-width: 900px) 320px, 220px"
              />
            </div>
            <div className="sobre__card-body">
              <h3 className="sobre__name">Murilo Gabriel Mourão</h3>
              <div className="sobre__role">Colaborador</div>
              <p className="sobre__text">
                Murilo Gabriel da Silva Mourão, nascido em 2007 em Coelho Neto-MA, é estudante do 3º ano do IEMA e apaixonado por informática. Participa de projetos de robótica e feiras científicas, com prêmios conquistados.
              </p>
              <p className="sobre__text">
                No Raízes Negras, colaborou com a pesquisa e a seleção de artigos sobre a cultura afro-maranhense.
              </p>
              <div className="sobre__actions">
                <a className="sobre__link" href="https://www.linkedin.com/in/murilo-undefined-90b629388?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer">
                  Perfil no LinkedIn
                </a>
              </div>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
