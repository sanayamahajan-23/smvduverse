import React, { useState, useRef, useEffect } from "react";
import NearbyPlaces from "./NearbyPlaces";
import Recents from "./Recents";
import Favorites from "./Favorites";
import AddPlaceForm from "./AddPlaceForm";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { FaClock, FaStar, FaMapMarkerAlt, FaShareAlt , FaPlus} from "react-icons/fa";

const Sidebar = ( { onSearchLocation }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [showShareButton, setShowShareButton] = useState(false);
  const navigate = useNavigate();
  const shareIconRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0 });

  const handleTabClick = (tab) => {
    if (tab === "share") {
      const icon = shareIconRef.current;
      if (icon) {
        const rect = icon.getBoundingClientRect();
        setButtonPosition({ top: rect.top + window.scrollY });
      }
      setShowShareButton(!showShareButton);
      setActiveTab(null);
    } else {
      setShowShareButton(false);
      setActiveTab(tab);
    }
  };

  const handleShareClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `I'm sharing my live location: ${googleMapsLink}`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappURL, "_blank");
      },
      (error) => {
        alert("Unable to retrieve location. Please allow location access.");
        console.error(error);
      }
    );
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "recents":
        return <Recents />;
      case "favorites":
        return <Favorites  onSearchLocation={onSearchLocation}/>;
      case "nearby":
        return <NearbyPlaces />;
      case "add":
        return <AddPlaceForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="sidebar-container">
        <div className="button-list">
          <button onClick={() => handleTabClick("recents")} title="Recents">
            <FaClock className="icon" />
          </button>
          <button onClick={() => handleTabClick("favorites")} title="Favorites">
            <FaStar className="icon" />
          </button>
          <button
            onClick={() => handleTabClick("nearby")}
            title="Nearby Places"
          >
            <FaMapMarkerAlt className="icon" />
          </button>
          <button
            ref={shareIconRef}
            onClick={() => handleTabClick("share")}
            title="Share Live Location"
            className="share-icon"
          >
            <FaShareAlt className="icon" />
          </button>
          <button onClick={() => handleTabClick("add")} title="Add Place">
            <FaPlus className="icon" />
          </button>
        </div>
      </div>

      {/* Share button OUTSIDE sidebar */}
      {showShareButton && (
        <button
          className="floating-share-location-btn"
          style={{ top: `${buttonPosition.top}px` }}
          onClick={handleShareClick}
        >
          📍 Share Location
        </button>
      )}

      {activeTab && <div className="side-panel">{renderPanel()}</div>}
    </>
  );
};

export default Sidebar;
