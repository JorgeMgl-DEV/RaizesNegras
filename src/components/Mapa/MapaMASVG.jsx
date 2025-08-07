 import React from 'react';
import paths from './path.json';

const regions = [
  { name: 'oeste', code: '4' },
  { name: 'norte', code: '1' },
  { name: 'leste', code: '3' },
  { name: 'centro', code: '5' },
  { name: 'sul', code: '2' },
];

const defaultStroke = '#F8BB5C';

const MapaMASVG = ({ hoveredRegion, handleMouseEnter, handleMouseLeave, defaultFill, hoverFill }) => (
    <svg
        version="1.0"
        id="svg-map"
        xmlns="http://www.w3.org/2000/svg"
        width="700px"
        height="1000px"
        viewBox="0 0 1272 1701"
        preserveAspectRatio="xMidYMid meet"
    >
        <g
            transform="translate(0.000000,1701.000000) scale(0.100000,-0.100000)"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {regions.map(({ name, code }) => {
                const isHovered = hoveredRegion === name;
                return (
                    <a className="regiao" name={name} code={code} key={name}>
                        <path
                            d={paths[name]}
                            fill={isHovered ? defaultStroke : defaultFill}
                            stroke={isHovered ? hoverFill : defaultStroke}
                            strokeWidth={155}
                            onMouseEnter={() => handleMouseEnter(name)}
                            onMouseLeave={handleMouseLeave}
                            style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                        />
                    </a>
                );
            })}
        </g>
    </svg>
);

export default MapaMASVG;
