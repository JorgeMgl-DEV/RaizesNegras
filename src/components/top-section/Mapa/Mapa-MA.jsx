"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MapaMASVG from "./MapaMASVG";
import regioes from "./regioes.json";
import slugify from "../../../utils/slugify";

export default function MapaMA() {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState(null);

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
    <div className="mapa-container">
      <MapaMASVG
        hoveredRegion={hoveredRegion}
        handleMouseEnter={setHoveredRegion}
        handleMouseLeave={() => setHoveredRegion(null)}
        handleRegionClick={handleRegionClick}
      />
    </div>
  );
}
