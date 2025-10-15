import TopSection from "../../components/top-section/TopSection";
import ProjectSection from "../../components/project-section/project-section";
import Footer from "../../components/footer/footer";
import "./home.css";

function Home() {
    return (
        <main className="home-page">
            <TopSection />
            <section className="home-intro" aria-labelledby="intro-heading">
                <div className="container">
                    <h1 id="intro-heading" className="main-title">Descobrindo as Raízes Negras do Maranhão</h1>
                    <p>
                        Explore a rica herança cultural afro-brasileira do Maranhão através do nosso acervo digital.
                        Reunimos documentos históricos, manifestações culturais e pesquisas que preservam e celebram
                        a identidade negra em nossa região.
                    </p>
                    <p>
                        Através do nosso mapa interativo, você pode explorar as diferentes regiões do estado e descobrir
                        suas histórias únicas, tradições vivas e expressões culturais. Disponibilizamos todo o conteúdo
                        em formato PDF, garantindo fácil acesso e compartilhamento do conhecimento.
                    </p>
                </div>
            </section>
            <ProjectSection />
            <Footer />
        </main>
    );
}

export default Home;
