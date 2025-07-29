import React, { useState } from 'react';
import MapaMASVG from './MapaMASVG';

const MapaMA = () => {
    const [hoveredRegion, setHoveredRegion] = useState(null);

    const handleMouseEnter = (region) => {
        setHoveredRegion(region);
    };

    const handleMouseLeave = () => {
        setHoveredRegion(null);
    };

    const defaultFill = '#460E06';
    const hoverFill = '#FF0000';

    return (
        <div>
            <MapaMASVG
                hoveredRegion={hoveredRegion}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                defaultFill={defaultFill}
                hoverFill={hoverFill}
            />
        </div>
    );
};

export default MapaMA;
