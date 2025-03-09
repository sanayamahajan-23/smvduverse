import React, { useState } from "react";
import axios from "axios";
import "./SearchBox.css";

const SearchBox = ({ onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch location suggestions
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

  return (
    <div className="search-container">
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
              onClick={() => {
                onLocationSelect(
                  place.geometry.coordinates[1],
                  place.geometry.coordinates[0],
                  place.properties.name || "Unnamed Location"
                );
                setSuggestions([]);
                setSearch(place.properties.name || "");
              }}
            >
              {place.properties.name || place.properties.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
