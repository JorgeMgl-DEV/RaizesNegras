import { useParams, Link } from 'react-router-dom';
import './RegionPage.css';
import './RegionPageCustom.css';
import Navbar from '../../components/top-section/Navbar/Navbar.jsx';
import regioes from '../../components/top-section/Mapa/regioes.json';
import logoNorte from '../../assets/logos/norte.png';
import logoSul from '../../assets/logos/sul.png';
import logoLeste from '../../assets/logos/leste.png';
import logoOeste from '../../assets/logos/oeste.png';
import logoCentro from '../../assets/logos/centro.png';
import mapaNorte from '../../assets/logos/maps/norte.png';
import mapaSul from '../../assets/logos/maps/Sul.png';
import mapaLeste from '../../assets/logos/maps/leste.png';
import mapaOeste from '../../assets/logos/maps/oeste.png';
import mapaCentro from '../../assets/logos/maps/centro.png';

// util simples de slug; se você já tem um em utils/slugify.js, use-o.
const slugify = (s) =>
    s
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // remove acentos
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-');

export default function RegionPage() {
    const { slug } = useParams();

    // 1) tenta por slug; 2) tenta por code (slug pode ser '1', por ex.)
    const region = regioes.find(r =>
        r.slug === slug ||
        r.code === slug ||
        slugify(r.name) === slug
    );

    // Mapeia as imagens de acordo com o código da região
    const logos = {
        '1': logoNorte,
        '2': logoSul,
        '3': logoLeste,
        '4': logoOeste,
        '5': logoCentro,
        'default': logoNorte
    };

    const mapas = {
        '1': mapaNorte,
        '2': mapaSul,
        '3': mapaLeste,
        '4': mapaOeste,
        '5': mapaCentro,
        'default': mapaNorte
    };

    const logoSrc = logos[region?.code] || logos['default'];
    const mapSrc = mapas[region?.code] || mapas['default'];

    return (
        <>
            <Navbar />
            <main className="region-page" id="conteudo" role="main" aria-labelledby="region-title">
                <div className="region-page__header">
                    <div className="region-page__info">
                        <img
                            src={logoSrc}
                            alt={region ? `Marca da região ${region.name}` : 'Marca de região'}
                            className="region-page__logo"
                            loading="lazy"
                            width={180}
                            height={100}
                        />

                        <p className="region-description">
                            {region ? region.descricao : (
                                <>
                                    Não encontramos a região <strong>{slug}</strong>.{' '}
                                    <Link to="/" className="region-backlink">Voltar à página inicial</Link>.
                                </>
                            )}
                        </p>
                    </div>

                    <img
                        src={mapSrc}
                        alt={region ? `Mapa ilustrativo da região ${region.name}` : 'Mapa de região'}
                        className="region-page__map-placeholder"
                        loading="lazy"
                        width={600}
                        height={300}
                    />
                </div>

                {/* Em breve: aqui entra a grade de itens do Drive (Passo 2) */}
                {region && (
                    <section
                        className="region-page__content"
                        aria-label={`Conteúdos da região ${region.name}`}
                    >
                        <div className="region-page__empty">
                            <p>Os conteúdos desta região aparecerão aqui. (Próximo passo: integração com Drive)</p>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
