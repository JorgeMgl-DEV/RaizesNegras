import regioes from './regioes.json';
import './region-list.css';

function slugify(s) {
    return s
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

const RegionList = () => {
    return (
        <div className="region-list-mobile">
            <h2 className="region-list-title">Regiões do Maranhão</h2>
            <ul className="region-list">
                {regioes.map(r => {
                    const slug = slugify(r.name);
                    const href = r.link && r.link !== '#' ? r.link : `/regiao/${slug}`;
                    return (
                        <li key={r.code} className="region-item">
                            <div className="region-item-head">
                                <span className="region-badge">#{r.code}</span>
                                <h3 className="region-name">{r.name}</h3>
                            </div>
                            <p className="region-desc">{r.descricao}</p>
                            <a className="region-cta" href={href}>Acessar mais informações</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RegionList;
