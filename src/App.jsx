import { Routes, Route } from "react-router-dom"
import Home from "./pages/HOME/Home.jsx"
import RegionPage from "./pages/REGIAO/RegionPage.jsx"
import Sobre from "./pages/SOBRE/Sobre.jsx"
import Conteudo from "./pages/CONTEUDO/Conteudo.jsx"
import Faq from "./pages/FAQ/Faq.jsx"
import Article from "./pages/ARTIGO/Article.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/regiao/:slug" element={<RegionPage />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/conteudo" element={<Conteudo />} />
      <Route path="/artigo/:id" element={<Article />} />
      <Route path="/faq" element={<Faq />} />
    </Routes>
  )
}
