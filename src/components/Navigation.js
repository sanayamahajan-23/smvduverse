import React, { useEffect } from "react";

const MapComponent = () => {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY; // Get API key from .env

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    // Initialize GoMaps
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.94257, lng: 74.95469 }, // SMVDU coordinates
        zoom: 16,
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default MapComponent;
