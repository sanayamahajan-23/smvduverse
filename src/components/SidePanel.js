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

// Function to open Google Maps directions
const openDirections = (coordinates) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  window.open(url, "_blank");
};

// Function to copy location & share on WhatsApp
const shareCoordinates = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    alert("No location selected to share!");
    return;
  }

  const locationLink = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

  // Open WhatsApp for sharing
  const whatsappUrl = `https://wa.me/?text=Check out this location: ${encodeURIComponent(
    locationLink
  )}`;
  window.open(whatsappUrl, "_blank");
};

export default SidePanel;
