import TopSection from "../../components/top-section/TopSection";
import ProjectSection from "../../components/project-section/project-section";
import Footer from "../../components/footer/footer";
import "./home.css";

function Home() {

    return (
        <>
            <TopSection />
            <section className="home-intro">
                <div className="container">
                    <h2>Bem-vindo ao Portal Raízes Negras</h2>
                    <p>
                        O Portal Raízes Negras é uma iniciativa dedicada à valorização e preservação da cultura afro-brasileira,
                        com foco especial no estado do Maranhão. Nosso acervo digital reúne documentos históricos, registros culturais,
                        e pesquisas sobre a rica herança africana em nossa região.
                    </p>
                    <p>
                        Navegue pelo mapa interativo para descobrir histórias, tradições e manifestações culturais de cada região.
                        Todos os documentos estão disponíveis em formato PDF para fácil acesso e compartilhamento.
                    </p>
                </div>
            </section>
            <ProjectSection />
            <Footer />
        </>
    );
}

export default Home;
