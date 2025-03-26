import React, { useState, useEffect } from "react";
import {
  FaDirections,
  FaShareAlt,
  FaImages,
  FaArrowLeft,
  FaExpand,
} from "react-icons/fa";
import DirectionsPanel from "./DirectionsPanel";
import "./SidePanel.css";

const SidePanel = ({ placeData, onClose }) => {
  const [showDirections, setShowDirections] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    if (!placeData || !window.google || !placeData.placeId) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: placeData.placeId,
        fields: ["photos", "formatted_address", "name", "geometry"],
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaceDetails(result);
          setGallery(
            result.photos
              ? result.photos.map((photo) => photo.getUrl({ maxWidth: 800 }))
              : []
          );
        } else {
          console.error("Failed to fetch place details:", status);
        }
      }
    );
  }, [placeData]);

  if (!placeData) return null;

  return showDirections ? (
    <DirectionsPanel
      destination={placeData.coordinates}
      placeName={placeData.placeName}
      onClose={() => setShowDirections(false)}
    />
  ) : (
    <div className="side-panel">
      <button className="close-btn" onClick={onClose}>
        <FaArrowLeft size={22} />
      </button>

      {/* Display Place Image or Placeholder */}
      <div className="image-container">
        {placeDetails?.photos?.[0] ? (
          <img
            src={gallery[0]}
            alt={placeDetails.name}
            className="place-image"
          />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}

        {gallery.length > 1 && (
          <button
            className="gallery-btn"
            onClick={() => setFullScreenImage(gallery)}
          >
            <FaImages size={22} />
          </button>
        )}
      </div>

      {/* Place Details */}
      <h2 className="place-title">{placeDetails?.name || "Unknown Place"}</h2>
      <p className="place-address">
        {placeDetails?.formatted_address || "Address not available"}
      </p>

      {/* Buttons for Directions and Sharing */}
      <div className="button-container">
        <button className="side-btn" onClick={() => setShowDirections(true)}>
          <FaDirections size={24} />
          <span>Directions</span>
        </button>
        <button
          className="side-btn"
          onClick={() => shareLocation(placeData.coordinates)}
        >
          <FaShareAlt size={24} />
          <span>Share</span>
        </button>
      </div>

      {/* Full Screen Image Gallery */}
      {fullScreenImage && (
        <div
          className="full-screen-gallery"
          onClick={() => setFullScreenImage(null)}
        >
          <button className="close-fullscreen">&times;</button>
          {fullScreenImage.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Gallery ${index}`}
              className="full-screen-image"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Function to Share Location
const shareLocation = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    alert("No location selected to share!");
    return;
  }
  const locationLink = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  const whatsappUrl = `https://wa.me/?text=Check out this location: ${encodeURIComponent(
    locationLink
  )}`;
  window.open(whatsappUrl, "_blank");
};

export default SidePanel;
