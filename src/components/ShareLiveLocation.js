import React, { useState} from 'react';
import { FaShareAlt, FaLocationArrow, FaTimes } from 'react-icons/fa';

const ShareLiveLocation = ({ onHide }) => {
  const [location, setLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setShowPopup(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setShowPopup(false);
      },
      () => {
        setShowPopup(true);
      }
    );
  };

  const shareOnWhatsApp = () => {
    if (!location) return;
    const message = `My Live Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    if (onHide) onHide(); // Notify parent to deactivate
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Share Live Location</h2>

      <button
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded mb-3"
        onClick={getLiveLocation}
      >
        <FaLocationArrow /> Get Live Location
      </button>

      {location && (
        <button
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
          onClick={shareOnWhatsApp}
        >
          <FaShareAlt /> Share via WhatsApp
        </button>
      )}

      {showPopup && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Please enable location services in your browser or device settings.</p>
          <button
            className="mt-2 flex items-center gap-1 text-sm text-red-600 underline"
            onClick={() => setShowPopup(false)}
          >
            <FaTimes /> Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareLiveLocation;
