import React, { useState } from "react";
import { FaLocationArrow, FaShareAlt } from "react-icons/fa";

const LiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      () => {
        setError("Unable to retrieve location.");
      }
    );
  };

  const shareOnWhatsApp = () => {
    if (!location) return;
    const message = `My Live Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="live-location-container">
      <button onClick={getLiveLocation} className="sidebar-btn">
        <FaLocationArrow size={20} /> Live Location
      </button>

      {location && (
        <div className="share-box">
          <button onClick={shareOnWhatsApp} className="share-btn">
            <FaShareAlt size={18} /> Share
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LiveLocation;
