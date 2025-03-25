import React, { useEffect } from "react";
import "./SearchBox.css";

const SearchBox = ({ onPlaceSelect }) => {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    // Ensure Google Maps API is loaded
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const input = document.getElementById("searchBox");
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode"], // Suggests locations, you can customize this
      componentRestrictions: { country: "in" }, // Restricts to India (optional)
    });

    // Listen for place selection
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;

      onPlaceSelect({
        name: place.name,
        lat: location.lat(),
        lng: location.lng(),
      });
    });
  }, [onPlaceSelect]);

  return (
    <input
      id="searchBox"
      type="text"
      placeholder="Search for a place..."
      className="search-box"
      autoComplete="on"
    />
  );
};

export default SearchBox;
