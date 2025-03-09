import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import Sidebar from "./Sidebar";
import SearchBox from "./SearchBox";
import ChangeView from "./ChangeView";
import "./Navigation.css"; // Import CSS file

// Fix Leaflet Marker Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Navigate = () => {
  const [position, setPosition] = useState([32.93901, 74.9526]); // Default: SMVDU
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Function to update position when a new location is selected
  const handleLocationSelect = (lat, lon, name) => {
    setPosition([lat, lon]);
    setSelectedLocation({ lat, lon, name });
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <Sidebar position={position} />

      {/* Map Container */}
      <div className="map-container">
        <SearchBox onLocationSelect={handleLocationSelect} />

        <MapContainer
          center={position}
          zoom={15}
          className="leaflet-map"
          zoomControl={false}
        >
          <ChangeView center={position} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            subdomains="abcd"
            maxZoom={20}
          />
          <Marker position={position}>
            <Popup>
              {selectedLocation ? selectedLocation.name : "You are here!"}{" "}
              <br />
              {selectedLocation ? "📍" : "SMVDU, Katra"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Navigate;
