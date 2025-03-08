import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./Navigation.css"; // Import the CSS file

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Function to zoom & pan when selecting a location
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 17, { animate: true });
  return null;
};

const Navigate = () => {
  const [position, setPosition] = useState([32.93901, 74.9526]); // Default: SMVDU
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch location suggestions from Photon API
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.get(
        `https://photon.komoot.io/api/?q=${query}&limit=5`
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle location selection
  const handleSelectLocation = (lat, lon, name) => {
    setPosition([lat, lon]);
    setSelectedLocation({ lat, lon, name });
    setSuggestions([]);
    setSearch(name);
  };

  return (
    <div className="map-container">
      {/* Search Box (Placed Outside MapContainer) */}
      <div className="navigation-search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search for a location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((place) => (
              <li
                key={place.properties.osm_id}
                onClick={() =>
                  handleSelectLocation(
                    place.geometry.coordinates[1],
                    place.geometry.coordinates[0],
                    place.properties.name || "Unnamed Location"
                  )
                }
              >
                {place.properties.name || place.properties.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <MapContainer center={position} zoom={15} className="leaflet-map">
        <ChangeView center={position} />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />
        <Marker position={position}>
          <Popup>
            {selectedLocation ? selectedLocation.name : "You are here!"} <br />
            {selectedLocation ? "📍" : "SMVDU, Katra"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Navigate;
