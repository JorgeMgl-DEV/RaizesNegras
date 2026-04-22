import paths from "./path.json";

const regions = [
  { name: "oeste", code: "4" },
  { name: "norte", code: "1" },
  { name: "leste", code: "3" },
  { name: "centro", code: "5" },
  { name: "sul", code: "2" },
];

const defaultStroke = "#F8BB5C";

export default function MapaMASVG({
  hoveredRegion,
  handleMouseEnter,
  handleMouseLeave,
  handleRegionClick,
}) {
  return (
    <svg
      className="mapa-ma"
      version="1.0"
      id="svg-map"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1272 1701"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <g
        transform="translate(0.000000,1701.000000) scale(0.100000,-0.100000)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {regions.map(({ name, code }) => {
          const isHovered = hoveredRegion === name;
          return (
            <path
              key={code}
              className="regiao"
              d={paths[name]}
              fill={isHovered ? "#F8BB5C" : "#460E06"}
              stroke={isHovered ? "#460E06" : defaultStroke}
              strokeWidth={155}
              role="link"
              tabIndex={0}
              aria-label={`Abrir regiao ${name}`}
              onMouseEnter={() => handleMouseEnter(name)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRegionClick(code)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleRegionClick(code);
                }
              }}
              style={{ transition: "fill 0.3s, stroke 0.3s" }}
            />
          );
        })}
      </g>
    </svg>
  );
}
