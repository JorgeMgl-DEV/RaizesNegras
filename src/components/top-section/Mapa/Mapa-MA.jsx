"use client";

import { useState } from "react";
import MapaMASVG from "./MapaMASVG";
import Popup from "./pop/popup";

export default function MapaMA() {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = (event, regionCode) => {
    const x = event.clientX;
    const y = event.clientY;
    const popupWidth = Math.min(360, window.innerWidth - 32);
    const popupHeight = 240;

    let adjustedX = Math.min(x + 18, window.innerWidth - popupWidth - 16);
    let adjustedY = Math.min(y + 18, window.innerHeight - popupHeight - 16);

    adjustedX = Math.max(16, adjustedX);
    adjustedY = Math.max(16, adjustedY);

    setPopupPosition({ x: adjustedX, y: adjustedY });
    setSelectedRegion(regionCode);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedRegion(null);
  };

  return (
    <div className="mapa-container">
      <MapaMASVG
        hoveredRegion={hoveredRegion}
        handleMouseEnter={setHoveredRegion}
        handleMouseLeave={() => setHoveredRegion(null)}
        handleRegionClick={handleRegionClick}
      />
      {showPopup && selectedRegion && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div
            className="popup-wrapper"
            style={{
              position: "fixed",
              left: popupPosition.x,
              top: popupPosition.y,
              zIndex: 1000,
              width: "min(360px, calc(100vw - 32px))",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Popup codigo={selectedRegion} />
          </div>
        </div>
      )}
    </div>
  );
}
