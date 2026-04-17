import Link from "next/link";
import regioes from "../regioes.json";
import slugify from "../../../../utils/slugify";

export default function Popup({ codigo }) {
  const regiao = regioes.find((item) => item.code === codigo);
  if (!regiao) return null;

  const href = regiao.link && regiao.link !== "#" ? regiao.link : `/regiao/${slugify(regiao.name)}`;
  const isInternal = href.startsWith("/regiao/");

  return (
    <div className="popup-container">
      <h2 className="popup-title">{regiao.name}</h2>
      <p className="popup-desc">{regiao.descricao}</p>
      {isInternal ? (
        <Link className="popup-btn" href={href}>
          Clique aqui para saber mais
        </Link>
      ) : (
        <a className="popup-btn" href={href} target="_blank" rel="noopener noreferrer">
          Clique aqui para saber mais
        </a>
      )}
    </div>
  );
}
