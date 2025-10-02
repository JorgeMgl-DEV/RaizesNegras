import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import Footer from "../../components/footer/footer";
import "./sobre.css";
import fotoMurilo from "./foto murilo.png";
import fotoJorge from "./FotoJorge.jpeg";
import fotoErick from "./FotoErick.jpeg";

function Sobre() {
    return (
        <>
            <Navbar />
            <main className="sobre__main">
                <section className="sobre__section">
                    <h1 className="sobre__title">Sobre o Projeto</h1>
                    <p className="sobre__text">
                        Raízes Negras é um acervo digital dedicado a reunir e dar visibilidade a referências,
                        artigos e registros sobre a cultura negra, com navegação por regiões e conteúdos
                        temáticos. O projeto busca facilitar o acesso ao conhecimento, apoiar pesquisas e
                        iniciativas educacionais, e fortalecer a valorização da memória e produção cultural.
                    </p>
                    <ul className="sobre__list">
                        <li>Mapear e organizar conteúdos por região e tema.</li>
                        <li>Facilitar a busca e o acesso a materiais de referência.</li>
                        <li>Valorizar produções acadêmicas, artísticas e comunitárias.</li>
                        <li>Apoiar educadores, estudantes e pesquisadores.</li>
                    </ul>
                    <p className="sobre__text sobre__text--spaced">
                        Tecnologias: aplicação em React com Vite e integração com serviços em nuvem para
                        facilitar a busca e a curadoria de materiais.
                    </p>
                </section>

                <section>
                    <h2 className="sobre__subtitle">Equipe</h2>

                    <article className="sobre__card">
                        <div className="sobre__photo" aria-label="foto Jorge">
                            <img src={fotoJorge} alt="Foto de Jorge Miguel Viana Torres" className="sobre__img" />
                        </div>
                        <div>
                            <h3 className="sobre__name">Jorge Miguel Viana Torres</h3>
                            <div className="sobre__role">Criador e Desenvolvedor</div>
                            <p className="sobre__text">
                            Nordestino, nascido em Coelho Neto, cidade do interior do Maranhão, sou estudante de Informática no IEMA e apaixonado por tecnologia e cultura. Bolsista CNPq, ganhador do FECULEMA 2024 e destaque em eventos científicos e tecnológicos. Como criador e principal desenvolvedor do Raízes Negras, uni minha formação técnica e o interesse pela preservação da memória afro-maranhense em uma plataforma digital, mostrando como a tecnologia pode fortalecer a cultura e identidade do Maranhão.
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
                            <img src={fotoErick} alt="Foto de Erick MacGregor" className="sobre__img" />
                        </div>
                        <div>
                            <h3 className="sobre__name">Erick MacGregor</h3>
                            <div className="sobre__role">Orientador</div>
                            <p className="sobre__text">
                                Professor do IEMA e mestrando em Ciência da Computação pela UFPI, atua nas áreas de Inteligência Artificial, Ciência de Dados e Educação Tecnológica. Como orientador do Raízes Negras, contribuiu na concepção metodológica, no acompanhamento técnico e na articulação acadêmica, garantindo rigor científico e relevância cultural ao projeto.
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
                            <img src={fotoMurilo} alt="Foto de Murilo Gabriel Mourão" className="sobre__img" />
                        </div>
                        <div>
                            <h3 className="sobre__name">Murilo Gabriel Mourão</h3>
                            <div className="sobre__role">Colaborador</div>
                            <p className="sobre__text">
                                Murilo Gabriel da Silva Mourão, nascido em 2007 em Coelho Neto-MA, é estudante do 3º ano do IEMA e apaixonado por informática. Participa de projetos de robótica e feiras científicas, com prêmios conquistados. Sonha cursar Ciências da Computação. No Raízes Negras, pesquisou artigos sobre cultura afro-maranhense.
                            </p>
                            <div className="sobre__actions">
                                <a className="sobre__link" href="" target="_blank" rel="noreferrer">
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

export default Sobre;