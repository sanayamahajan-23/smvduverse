import React, { useState } from "react";
import {
  FaDirections,
  FaShareAlt,
  FaImages,
  FaArrowLeft,
} from "react-icons/fa";
import "./SidePanel.css";

const SidePanel = ({ placeData }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!placeData) return null;

  return (
    <div className={`side-panel ${showGallery ? "expanded" : ""}`}>
      <button className="close-btn" onClick={() => setShowGallery(false)}>
        <FaArrowLeft size={22} />
      </button>

      <div className="image-container">
        <img
          src={placeData.imageUrl || "default-placeholder.jpg"}
          alt={placeData.placeName}
          className="place-image"
        />
        <button
          className="gallery-btn"
          disabled={true} // Disable since GoMaps doesn’t provide multiple images
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          <FaImages size={22} />
        </button>
      </div>

      <h2 className="place-title">{placeData.placeName}</h2>

      <div className="button-container">
        <button
          className="side-btn"
          onClick={() => openDirections(placeData.coordinates)}
        >
          <FaDirections size={18} /> Directions
        </button>
        <button
          className="side-btn"
          onClick={() => shareCoordinates(placeData.coordinates)}
        >
          <FaShareAlt size={18} /> Share
        </button>
      </div>
    </div>
  );
};

const openDirections = (coordinates) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  window.open(url, "_blank");
};

const shareCoordinates = (coordinates) => {
  const locationLink = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  navigator.clipboard.writeText(locationLink);
  alert("Location copied to clipboard!");
};

export default SidePanel;
