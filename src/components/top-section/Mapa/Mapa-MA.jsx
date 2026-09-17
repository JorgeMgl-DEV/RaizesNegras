"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import MapaMASVG from "./MapaMASVG";
import Popup from "./pop/popup";
import regioes from "./regioes.json";
import slugify from "../../../utils/slugify";

const POPUP_GAP = 18;
const POPUP_EDGE_GAP = 8;
const POPUP_FALLBACK_WIDTH = 300;
const POPUP_FALLBACK_HEIGHT = 220;

export default function MapaMA() {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const popupRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredRegionCode, setHoveredRegionCode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });

  const updatePopupPosition = (event) => {
    const container = mapContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const popupWidth = popupRef.current?.offsetWidth || POPUP_FALLBACK_WIDTH;
    const popupHeight = popupRef.current?.offsetHeight || POPUP_FALLBACK_HEIGHT;
    const isMouseEvent = event?.type?.startsWith("mouse");

    if (!isMouseEvent) {
      setPopupPosition({
        left: Math.max(POPUP_EDGE_GAP, containerRect.width - popupWidth - POPUP_EDGE_GAP),
        top: POPUP_EDGE_GAP,
      });
      return;
    }

    const cursorX = event.clientX - containerRect.left;
    const cursorY = event.clientY - containerRect.top;
    let left = cursorX + POPUP_GAP;
    let top = cursorY + POPUP_GAP;

    if (left + popupWidth > containerRect.width - POPUP_EDGE_GAP) {
      left = cursorX - popupWidth - POPUP_GAP;
    }

    if (top + popupHeight > containerRect.height - POPUP_EDGE_GAP) {
      top = cursorY - popupHeight - POPUP_GAP;
    }

    setPopupPosition({
      left: Math.max(
        POPUP_EDGE_GAP,
        Math.min(left, containerRect.width - popupWidth - POPUP_EDGE_GAP),
      ),
      top: Math.max(
        POPUP_EDGE_GAP,
        Math.min(top, containerRect.height - popupHeight - POPUP_EDGE_GAP),
      ),
    });
  };

  const showRegionPopup = (regionName, regionCode, event) => {
    setHoveredRegion(regionName);
    setHoveredRegionCode(regionCode);
    updatePopupPosition(event);
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
      ref={mapContainerRef}
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
        handleRegionMove={updatePopupPosition}
        handleRegionLeave={hideRegionPopup}
        handleRegionClick={handleRegionClick}
      />
      {hoveredRegionCode && (
        <div
          ref={popupRef}
          className="popup-wrapper"
          role="tooltip"
          style={{ left: popupPosition.left, top: popupPosition.top }}
        >
          <Popup codigo={hoveredRegionCode} />
        </div>
      )}
    </div>
  );
}
