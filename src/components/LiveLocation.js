import React, { useState } from "react";
import { FaLocationArrow, FaShareAlt, FaTimes } from "react-icons/fa";

const LiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Controls popup visibility

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setShowPopup(true); // Show popup if geolocation is unsupported
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setShowPopup(false); // Hide popup if location is fetched
      },
      () => {
        setShowPopup(true); // Show popup if location access is denied
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

      {/* Location Disabled Popup */}
      {showPopup && (
        <div className="location-popup">
          <p>Please enable location services in your device settings.</p>
          <button className="close-btn" onClick={() => setShowPopup(false)}>
            <FaTimes size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveLocation;
