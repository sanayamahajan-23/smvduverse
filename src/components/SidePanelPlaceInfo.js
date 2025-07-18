import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaWhatsapp,
  FaDirections,
  FaImages,
  FaTimes,
} from "react-icons/fa";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./SidePanelPlaceInfo.css";

const SidePanelPlaceInfo = ({ place, user, onGalleryOpen, onClose }) => {
  const [placeInfo, setPlaceInfo] = useState(null);

  useEffect(() => {
    if (place) setPlaceInfo(place);
  }, [place]);

  const handleAddToFavorites = async () => {
    if (!user || !placeInfo) return;
    try {
      await addDoc(collection(db, "users", user.uid, "favorites"), {
        name: placeInfo.name,
        lat: placeInfo.lat,
        lng: placeInfo.lng,
        timestamp: serverTimestamp(),
      });
      alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  const handleShareToWhatsapp = () => {
    const message = `Check this place: ${placeInfo.name}\nhttps://www.google.com/maps?q=${placeInfo.lat},${placeInfo.lng}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${placeInfo.lat},${placeInfo.lng}`;
    window.open(url, "_blank");
  };

  if (!placeInfo) return null;

  const coverImage = placeInfo.photos?.[0] || "/placeholder.jpg";
  const hasPhotos =
    Array.isArray(placeInfo.photos) && placeInfo.photos.length > 0;

  return (
    <div className="side-panel">
      <div className="panel-image-container">
        <img src={coverImage} alt={placeInfo.name} className="panel-image" />

        <button onClick={onClose} className="panel-close-btn" title="Close">
          <FaTimes size={16} />
        </button>

        <button
          onClick={() => onGalleryOpen(placeInfo.photos)}
          disabled={!hasPhotos}
          title={hasPhotos ? "Open Gallery" : "No Gallery Available"}
          className={`panel-gallery-btn ${hasPhotos ? "enabled" : "disabled"}`}
        >
          <FaImages size={20} />
        </button>
      </div>

      <div className="panel-content">
        <h3 className="panel-title">{placeInfo.name}</h3>

        <div className="panel-actions">
          <button onClick={handleAddToFavorites} className="icon-btn heart">
            <FaHeart size={20} />
          </button>
          <button onClick={handleShareToWhatsapp} className="icon-btn whatsapp">
            <FaWhatsapp size={20} />
          </button>
          <button onClick={handleDirections} className="icon-btn directions">
            <FaDirections size={20} />
          </button>
        </div>

        <div className="panel-description-card">
          <p>{placeInfo.info || "No description available."}</p>
        </div>
      </div>
    </div>
  );
};

export default SidePanelPlaceInfo;
