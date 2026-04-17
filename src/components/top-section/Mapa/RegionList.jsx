import Link from "next/link";
import slugify from "../../../utils/slugify";
import data from "./regioes.json";

export default function RegionList() {
  return (
    <div className="region-list-mobile">
      <h2 className="region-list-title">Regiões do Maranhão</h2>
      <ul className="region-list">
        {data.map((region) => {
          const slug = slugify(region.name);
          const href = region.link && region.link !== "#" ? region.link : `/regiao/${slug}`;
          const isInternal = href.startsWith("/regiao/");

          return (
            <li key={region.code} className="region-item">
              <div className="region-item-head">
                <span className="region-badge">#{region.code}</span>
                <h3 className="region-name">{region.name}</h3>
              </div>
              <p className="region-desc">{region.descricao}</p>
              {isInternal ? (
                <Link className="region-cta" href={href}>
                  Acessar mais informações
                </Link>
              ) : (
                <a className="region-cta" href={href} target="_blank" rel="noreferrer">
                  Acessar mais informações
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
