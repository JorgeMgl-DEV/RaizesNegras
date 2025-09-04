import paths from './path.json';
import './MapaMASVG.css';

const regions = [
    { name: 'oeste', code: '4' },
    { name: 'norte', code: '1' },
    { name: 'leste', code: '3' },
    { name: 'centro', code: '5' },
    { name: 'sul', code: '2' },
];

const defaultStroke = '#F8BB5C';

const MapaMASVG = ({ hoveredRegion, handleMouseEnter, handleMouseLeave, handleRegionClick, defaultFill, hoverFill }) => (
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
                const defaultFill = '#1E1E1E';
                const hoverFill = '#2A2A2A';
                return (
                    <a key={code} href="#" onClick={(e) => e.preventDefault()}>
                        <path
                            className="regiao"
                            d={paths[name]}
                            fill={isHovered ? hoverFill : defaultFill}
                            stroke={isHovered ? '#ffffff' : defaultStroke}
                            strokeWidth={155}
                            onMouseEnter={() => handleMouseEnter(name)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleRegionClick(e, code)}
                            style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                        />
                    </a>
                );
            })}
        </g>
    </svg>
);

export default MapaMASVG;
