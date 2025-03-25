import React, { useEffect } from "react";
import "./MapComponent.css"; // ✅ Import CSS file

const MapComponent = () => {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    // Load GoMaps Script
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.94257, lng: 74.95469 }, // SMVDU coordinates
        zoom: 17,
        mapTypeControl: false, // ✅ Removes "Map/Satellite" toggle
        clickableIcons: false,
        restriction: {
          latLngBounds: {
            north: 32.95,
            south: 32.935,
            west: 74.945,
            east: 74.965,
          },
          strictBounds: true,
        },
      });

      // Example marker (hotspot)
      const marker = new window.google.maps.Marker({
        position: { lat: 32.94257, lng: 74.95469 },
        map: map,
        title: "SMVDU Main Entrance",
      });

      // ✅ Disable Google Maps click behavior
      marker.addListener("click", () => {}); // Now clicking does nothing
    };

    document.body.appendChild(script);
  }, []);

  return <div id="map" className="map-container" />;
};

export default MapComponent;
