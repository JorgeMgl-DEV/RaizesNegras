import React, { useState } from 'react';
import MapaMASVG from './MapaMASVG';
import Popup from './pop/popup';
import './MapaMASVG.css';

const MapaMA = () => {
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [selectedRegion, setSelectedRegion] = useState(null);

    const handleMouseEnter = (region) => {
        setHoveredRegion(region);
    };

    const handleMouseLeave = () => {
        setHoveredRegion(null);
    };

    const handleRegionClick = (event, regionCode) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        
        // Dimensões do popup (estimativas)
        const popupWidth = 350;
        const popupHeight = 200;
        
        // Calcular posição ajustada para não sair da tela
        let adjustedX = x;
        let adjustedY = y;
        
        // Ajustar horizontalmente
        if (x + popupWidth > window.innerWidth) {
            adjustedX = x - popupWidth;
        }
        
        // Ajustar verticalmente
        if (y + popupHeight > window.innerHeight) {
            adjustedY = y - popupHeight;
        }
        
        setPopupPosition({ x: adjustedX, y: adjustedY });
        setSelectedRegion(regionCode);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedRegion(null);
    };

    const defaultFill = '#460E06';
    const hoverFill = '#460E06';

    return (
        <div className="mapa-container">
            <MapaMASVG
                hoveredRegion={hoveredRegion}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleRegionClick={handleRegionClick}
                defaultFill={defaultFill}
                hoverFill={hoverFill}
            />
            {showPopup && selectedRegion && (
                <div 
                    className="popup-overlay"
                    onClick={handleClosePopup}
                >
                    <div 
                        className="popup-wrapper"
                        style={{
                            position: 'fixed',
                            left: popupPosition.x,
                            top: popupPosition.y,
                            zIndex: 1000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Popup codigo={selectedRegion} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapaMA;