"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MapaMASVG from "./MapaMASVG";
import Popup from "./pop/popup";
import regioes from "./regioes.json";
import slugify from "../../../utils/slugify";

export default function MapaMA() {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredRegionCode, setHoveredRegionCode] = useState(null);

  const showRegionPopup = (regionName, regionCode) => {
    setHoveredRegion(regionName);
    setHoveredRegionCode(regionCode);
  };

  const hideRegionPopup = () => {
    setHoveredRegion(null);
    setHoveredRegionCode(null);
  };

  const handleRegionClick = (regionCode) => {
    const region = regioes.find((item) => item.code === regionCode);
    if (!region) return;

    const href = region.link && region.link !== "#" ? region.link : `/regiao/${slugify(region.name)}`;

    if (href.startsWith("/")) {
      router.push(href);
      return;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="mapa-container"
      onMouseLeave={hideRegionPopup}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          hideRegionPopup();
        }
      }}
    >
      <MapaMASVG
        hoveredRegion={hoveredRegion}
        handleRegionEnter={showRegionPopup}
        handleRegionClick={handleRegionClick}
      />
      {hoveredRegionCode && (
        <div className="popup-wrapper" role="status" aria-live="polite">
          <Popup codigo={hoveredRegionCode} />
        </div>
      )}
    </div>
  );
}
