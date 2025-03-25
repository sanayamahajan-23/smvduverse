import React, { useEffect, useState } from "react";
import "./MapComponent.css";
import SearchBox from "./SearchBox";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    // Load GoMaps Script
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;

    script.onload = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 32.94257, lng: 74.95469 }, // SMVDU coordinates
          zoom: 17,
          mapTypeControl: false,
          clickableIcons: false,}
      );

      // Set the map instance for further use
      setMap(mapInstance);

      // Initial marker
      const initialMarker = new window.google.maps.Marker({
        position: { lat: 32.94257, lng: 74.95469 },
        map: mapInstance,
        title: "SMVDU Main Entrance",
      });

      setMarker(initialMarker);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to handle search box place selection
  const handlePlaceSelect = ({ lat, lng, name }) => {
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(18);

      // Move the marker to the selected place
      if (marker) marker.setMap(null); // Remove the old marker
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        animation: window.google.maps.Animation.DROP,
        title: name,
      });

      setMarker(newMarker);
    }
  };

  return (
    <div>
      <SearchBox onPlaceSelect={handlePlaceSelect} />
      <div id="map" className="map-container" />
    </div>
  );
};

export default MapComponent;
