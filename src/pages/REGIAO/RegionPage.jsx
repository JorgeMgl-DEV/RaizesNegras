import { useParams } from 'react-router-dom';
import './RegionPage.css';
import './RegionPageCustom.css';
import { mapPlaceholders } from './mapPlaceholders.js';
import Navbar from '../../components/top-section/Navbar/Navbar.jsx';
import regioes from '../../components/top-section/Mapa/regioes.json';
// Placeholder images for each region
const logoPlaceholders = {
    '1': 'https://via.placeholder.com/180x100?text=Norte',
    '2': 'https://gkpb.com.br/wp-content/uploads/2021/01/novo-logo-burger-king-2021.png',
    '3': 'https://via.placeholder.com/180x100?text=Leste',
    '4': 'https://via.placeholder.com/180x100?text=Oeste',
    '5': 'https://via.placeholder.com/180x100?text=Centro',
    'default': 'https://via.placeholder.com/180x100?text=Logo'
};

export default function RegionPage() {
    const { slug } = useParams();
    // Find region by slug (matches code or slugified name)
    const region = regioes.find(r => r.code === slug || r.name.toLowerCase().replace(/\s+/g, '-').replace(/ã/g, 'a').replace(/ç/g, 'c') === slug.toLowerCase());
    const logoSrc = logoPlaceholders[region?.code] || logoPlaceholders['default'];
    const mapSrc = mapPlaceholders[region?.code] || mapPlaceholders['default'];

    return (
        <>
            <Navbar />
            <main className="region-page">
                <div className="region-page__header">
                    <div className="region-page__info">
                        <img src={logoSrc} alt={`Logo ${region ? region.name : ''}`} className="region-page__logo" />
                        <h1 className="region-title">{region ? region.name : slug}</h1>
                        <p className="region-description">
                            {region ? region.descricao : 'Região não encontrada.'}
                        </p>
                    </div>
                    <img src={mapSrc} alt={`Mapa ${region ? region.name : ''}`} className="region-page__map-placeholder" />
                </div>
            </main>
        </>
    );
}
