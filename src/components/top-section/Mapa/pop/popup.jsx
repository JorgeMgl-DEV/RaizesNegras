import regioes from "../regioes.json";

export default function Popup({ codigo }) {
  const regiao = regioes.find((item) => item.code === codigo);
  if (!regiao) return null;

  return (
    <div className="popup-container">
      <h2 className="popup-title">{regiao.name}</h2>
      <p className="popup-desc">{regiao.descricao}</p>
      <span className="popup-hint">Clique na região para saber mais</span>
    </div>
  );
}
