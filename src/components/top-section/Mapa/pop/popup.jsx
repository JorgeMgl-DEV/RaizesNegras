import React from "react";
import regioes from "../regioes.json";
import slugify from "../../../../utils/slugify";
import "./popup.css";

const Popup = ({ codigo }) => {
  const regiao = regioes.find(r => r.code === codigo);
  if (!regiao) return null;
  const href = regiao.link && regiao.link !== "#" ? regiao.link : `/regiao/${slugify(regiao.name)}`;
  const isInternal = href.startsWith("/regiao/");
  return (
    <div className="popup-container">
      <h2 className="popup-title">{regiao.name}</h2>
      <p className="popup-desc">{regiao.descricao}</p>
      <a className="popup-btn" href={href} {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
        Clique aqui para saber mais
      </a>
    </div>
  );
};
export default Popup;
