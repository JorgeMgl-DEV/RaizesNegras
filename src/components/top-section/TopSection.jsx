import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import MapaMA from "./Mapa/Mapa-MA";
import RegionList from "./Mapa/RegionList";
import logoRdark from "../../assets/logos/logoRdark.png";

export default function TopSection() {
  return (
    <div className="top-section">
      <Navbar />
      <div className="content-section">
        <div className="project-info">
          <Image src={logoRdark} alt="Logo Raízes Negras" className="project-logo" priority />
          <div className="project-description">
            <p>O Raízes Negras é um acervo digital que reúne e valoriza a cultura afro-maranhense por meio de artigos, notícias e indicações de filmes e documentários.</p>
          </div>
        </div>
        <MapaMA />
      </div>
      <RegionList />
      <div className="scroll-arrow">↓</div>
    </div>
  );
}
