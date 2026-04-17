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
    const popupWidth = 350;
    const popupHeight = 200;

    let adjustedX = x;
    let adjustedY = y;

    if (x + popupWidth > window.innerWidth) adjustedX = x - popupWidth;
    if (y + popupHeight > window.innerHeight) adjustedY = y - popupHeight;

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
