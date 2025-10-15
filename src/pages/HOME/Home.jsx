import TopSection from "../../components/top-section/TopSection";
import ProjectSection from "../../components/project-section/project-section";
import Footer from "../../components/footer/footer";
import "./home.css";
import { useEffect, useState } from "react";

function Home() {
    const [adsReady, setAdsReady] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("cookieConsent") === "true") {
            setAdsReady(true);
            // Adiciona o script do AdSense se não existir
            if (!document.getElementById("adsbygoogle-js")) {
                const script = document.createElement("script");
                script.id = "adsbygoogle-js";
                script.async = true;
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9866884710668386";
                script.crossOrigin = "anonymous";
                document.body.appendChild(script);
                script.onload = () => {
                    if (window.adsbygoogle) window.adsbygoogle.push({});
                };
            } else {
                if (window.adsbygoogle) window.adsbygoogle.push({});
            }
        }
    }, []);

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
            {adsReady && (
                <div className="ad-container">
                    <ins className="adsbygoogle"
                        style={{ display: "block", textAlign: "center", margin: "2rem auto", maxWidth: "100%" }}
                        data-ad-client="ca-pub-9866884710668386"
                        data-ad-slot="1234567890"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>
            )}
            <Footer />
        </>
    );
}

export default Home;
