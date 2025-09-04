import Navbar from './Navbar/Navbar';
import MapaMA from './Mapa/Mapa-MA';
import RegionList from './Mapa/RegionList';
import logoRdark from '../../assets/logoRdark.png';
import './TopSection.css';

const TopSection = () => {
  return (
    <div className="top-section">
      <Navbar />
      <div className="content-section">
        <div className="project-info">
          <img src={logoRdark} alt="Logo Raízes Negras" className="project-logo" />
          <div className="project-description">
            <p>Raízes Negras é um acervo cultural...</p>
          </div>
        </div>
        <MapaMA />
      </div>
      <RegionList />
      <div className="scroll-arrow">↓</div>
    </div>
  );
};

export default TopSection;
