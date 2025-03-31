import React, { useState, useEffect, useRef } from "react";
import {
  FaLocationArrow,
  FaTimes,
  FaCar,
  FaMotorcycle,
  FaWalking,
} from "react-icons/fa";
import "./DirectionsPanel.css";

const DirectionsPanel = ({
  destination,
  placeName,
  onClose,
  map,
  setDirectionsRenderer,
}) => {
  const [start, setStart] = useState("");
  const [routeInfo, setRouteInfo] = useState({});
  const [selectedMode, setSelectedMode] = useState("DRIVING");
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (!window.google || !map) return;

    if (!directionsRendererRef.current) {
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(map);
      directionsRendererRef.current = renderer;

      if (setDirectionsRenderer) {
        setDirectionsRenderer(renderer); // Save reference in parent
      }
    } else {
      directionsRendererRef.current.setMap(map); // Ensure it's assigned properly
    }
  }, [map]);
  const handleClose = () => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections(null);
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    onClose();
  };

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

  const getDirections = () => {
    if (!start || !destination) {
      alert("Please enter both start and destination.");
      return;
    }
    const travelModes = ["DRIVING", "WALKING", "TWO_WHEELER"];
    const directionsService = new window.google.maps.DirectionsService();
    let newRouteInfo = {};
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections(null); // Properly clear previous routes
    }

    travelModes.forEach((mode) => {
      let travelMode = mode === "TWO_WHEELER" ? "DRIVING" : mode; // Google treats bikes as driving

      directionsService.route(
        {
          origin: start,
          destination: `${destination.lat},${destination.lng}`,
          travelMode: window.google.maps.TravelMode[travelMode],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            newRouteInfo[mode] = {
              distance: result.routes[0].legs[0].distance.text,
              duration: result.routes[0].legs[0].duration.text,
            };

            if (mode === selectedMode && directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(result);
            }

            setRouteInfo({ ...newRouteInfo });
          } else {
            console.error(`Failed to fetch ${mode} directions: `, status);
          }
        }
      );
    });
  };

  return (
    <div className="directions-panel">
      <button className="close-btn" onClick={handleClose}>
        <FaTimes size={20} />
      </button>

      <h2>Get Directions</h2>

      <div className="input-container">
        <label>Start Location:</label>
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Enter start location"
        />
        <button className="location-btn" onClick={handleUseCurrentLocation}>
          <FaLocationArrow />
        </button>
      </div>

      <div className="input-container">
        <label>Destination:</label>
        <input type="text" value={placeName} disabled />
      </div>

      <button className="start-btn" onClick={getDirections}>
        Find Route
      </button>

      {Object.keys(routeInfo).length > 0 && (
        <div className="route-info">
          <h3>Travel Options:</h3>
          <div className="travel-modes">
            <div
              className={`mode ${selectedMode === "DRIVING" ? "selected" : ""}`}
              onClick={() => setSelectedMode("DRIVING")}
            >
              <FaCar size={22} />
              <span>Car</span>
              <p>
                {routeInfo.DRIVING?.distance || "--"} |{" "}
                {routeInfo.DRIVING?.duration || "--"}
              </p>
            </div>
            <div
              className={`mode ${
                selectedMode === "TWO_WHEELER" ? "selected" : ""
              }`}
              onClick={() => setSelectedMode("TWO_WHEELER")}
            >
              <FaMotorcycle size={22} />
              <span>Bike</span>
              <p>
                {routeInfo.TWO_WHEELER?.distance || "--"} |{" "}
                {routeInfo.TWO_WHEELER?.duration || "--"}
              </p>
            </div>
            <div
              className={`mode ${selectedMode === "WALKING" ? "selected" : ""}`}
              onClick={() => setSelectedMode("WALKING")}
            >
              <FaWalking size={22} />
              <span>Walk</span>
              <p>
                {routeInfo.WALKING?.distance || "--"} |{" "}
                {routeInfo.WALKING?.duration || "--"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectionsPanel;
