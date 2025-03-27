import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaLocationArrow,
} from "react-icons/fa";
import "./DirectionsPanel.css";

const DirectionsPanel = ({ destination, placeName, onClose }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState(placeName);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [autocompleteStart, setAutocompleteStart] = useState(null);
  const [autocompleteEnd, setAutocompleteEnd] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
        },
        () => alert("Failed to get current location.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (window.google) {
      const startInput = document.getElementById("start-location");
      const endInput = document.getElementById("end-location");

      if (startInput) {
        const startAutocomplete = new window.google.maps.places.Autocomplete(
          startInput
        );
        startAutocomplete.addListener("place_changed", () => {
          const place = startAutocomplete.getPlace();
          if (place.geometry) {
            setStartLocation(place.formatted_address);
          }
        });
        setAutocompleteStart(startAutocomplete);
      }

      if (endInput) {
        const endAutocomplete = new window.google.maps.places.Autocomplete(
          endInput
        );
        endAutocomplete.addListener("place_changed", () => {
          const place = endAutocomplete.getPlace();
          if (place.geometry) {
            setEndLocation(place.formatted_address);
          }
        });
        setAutocompleteEnd(endAutocomplete);
      }
    }
  }, []);

  const initMap = (start, end) => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: start,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    setMap(map);
    setDirectionsRenderer(directionsRenderer);

    calculateRoute(directionsService, directionsRenderer, start, end);
  };

  const calculateRoute = (
    directionsService,
    directionsRenderer,
    start,
    end
  ) => {
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Could not calculate route: " + status);
        }
      }
    );
  };

  const handleSwap = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setStartLocation("Your location");
    } else {
      alert("Current location not available.");
    }
  };

  const handleStartNavigation = () => {
    if (startLocation === "Your location" && currentLocation) {
      initMap(currentLocation, endLocation);
    } else {
      // Geocode startLocation to get coordinates
      // Then call initMap with those coordinates and endLocation
    }
  };

  return (
    <div className="directions-panel">
      <button className="close-btn" onClick={onClose}>
        <FaArrowLeft size={22} />
      </button>

      <div className="input-container">
        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            id="start-location"
            type="text"
            placeholder="Choose starting point..."
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <button className="location-btn" onClick={handleUseCurrentLocation}>
            <FaLocationArrow />
          </button>
        </div>
        <button className="swap-btn" onClick={handleSwap}>
          <FaExchangeAlt />
        </button>
        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            id="end-location"
            type="text"
            placeholder="Choose destination..."
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>
      </div>

      <button className="start-btn" onClick={handleStartNavigation}>
        Start
      </button>

      <div id="map" className="map-container"></div>
    </div>
  );
};

export default DirectionsPanel;
