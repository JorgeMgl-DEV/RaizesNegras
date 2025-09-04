import { Link } from "react-router-dom"
import slugify from "../../../utils/slugify"
import data from "./regioes.json"
import "./region-list.css"


export default function RegionList() {
    return (
        <div className="region-list-mobile">
            <h2 className="region-list-title">Regiões do Maranhão</h2>
            <ul className="region-list">
                {data.map((r) => {
                    const slug = slugify(r.name)
                    const href = r.link && r.link !== "#" ? r.link : `/regiao/${slug}`
                    const isInternal = href.startsWith("/regiao/")
                    return (
                        <li key={r.code} className="region-item">
                            <div className="region-item-head">
                                <span className="region-badge">#{r.code}</span>
                                <h3 className="region-name">{r.name}</h3>
                            </div>
                            <p className="region-desc">{r.descricao}</p>
                            {isInternal ? (
                                <Link className="region-cta" to={href}>Acessar mais informações</Link>
                            ) : (
                                <a className="region-cta" href={href} target="_blank" rel="noreferrer">Acessar mais informações</a>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
