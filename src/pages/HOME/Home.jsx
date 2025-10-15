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
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        }
    }, []);

    return (
        <>
            <TopSection />
            <ProjectSection />
            {adsReady && (
                <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
                    <ins className="adsbygoogle"
                        style={{ display: "block", minHeight: "90px" }}
                        data-ad-client="ca-pub-9866884710668386"
                        data-ad-slot="1234567890"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>
            )}
            <Footer />
        </>
    )
}
export default Home
