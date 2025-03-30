import React, { useState, useEffect, useRef } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import "./DirectionsPanel.css";

const DirectionsPanel = ({ destination, placeName, onClose }) => {
  const [start, setStart] = useState("");
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    // Initialize Google Map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: destination || { lat: 37.7749, lng: -122.4194 }, // Default SF
    });

    // Ensure the map resizes properly
    setTimeout(() => {
      window.google.maps.event.trigger(mapInstance, "resize");
    }, 1000);

    const renderer = new window.google.maps.DirectionsRenderer();
    renderer.setMap(mapInstance);
    directionsRendererRef.current = renderer;
  }, [destination]);

  // Get Current Location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStart(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fetch Directions
  const getDirections = () => {
    if (!start || !destination) {
      alert("Please enter both start and destination.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: start,
        destination: `${destination.lat},${destination.lng}`,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
          directionsRendererRef.current.setDirections(result);
        } else {
          alert("Directions request failed: " + status);
        }
      }
    );
  };

  return (
    <>
      {/* Fullscreen Map */}
      <div ref={mapRef} className="fullscreen-map"></div>

      {/* Directions Panel */}
      <div className="directions-panel">
        <button className="close-btn" onClick={onClose}>
          <FaTimes size={22} />
        </button>

        <h2>Get Directions</h2>

        {/* Start Input */}
        <div className="input-container">
          <label>Start:</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Enter starting location"
          />
          <button className="location-btn" onClick={handleUseCurrentLocation}>
            <FaLocationArrow />
          </button>
        </div>

        {/* Destination (Pre-filled) */}
        <div className="input-container">
          <label>Destination:</label>
          <input type="text" value={placeName} disabled />
        </div>

        <button className="start-btn" onClick={getDirections}>
          Start Navigation
        </button>

        {/* Show Distance & Duration */}
        {distance && duration && (
          <div className="route-info">
            <p>🚗 Distance: {distance}</p>
            <p>⏳ Estimated Time: {duration}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectionsPanel;
