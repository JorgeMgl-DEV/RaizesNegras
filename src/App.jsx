import { Routes, Route } from "react-router-dom";
import Home from "./pages/HOME/Home.jsx";
import RegionPage from "./pages/REGIAO/RegionPage.jsx";
import Sobre from "./pages/SOBRE/Sobre.jsx";
import Conteudo from "./pages/CONTEUDO/Conteudo.jsx";
import Faq from "./pages/FAQ/Faq.jsx";
import Article from "./pages/ARTIGO/Article.jsx";
import { Privacidade, Termos, Contato } from "./pages/legalPages";
import CookieConsent from "./components/CookieConsent.jsx";

export default function App() {
  return (
    <>
      <CookieConsent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regiao/:slug" element={<RegionPage />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/conteudo" element={<Conteudo />} />
        <Route path="/artigo/:id" element={<Article />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </>
  );
}
