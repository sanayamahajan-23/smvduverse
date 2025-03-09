import React, { useState, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user's live location
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => console.error("Error fetching location:", error),
          { enableHighAccuracy: true }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();
  }, []);

  // Function to share live location via WhatsApp
  const shareLiveLocation = () => {
    if (!userLocation) {
      alert("Unable to get your live location. Please enable GPS.");
      return;
    }
    const message = `Hey! Here's my live location: https://www.google.com/maps?q=${userLocation.lat},${userLocation.lon}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h3>Navigation</h3>
        <p>
          📍 Live Location:{" "}
          {userLocation
            ? `${userLocation.lat.toFixed(5)}, ${userLocation.lon.toFixed(5)}`
            : "Fetching..."}
        </p>
        <button onClick={shareLiveLocation} className="share-btn">
          Share Live Location
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
