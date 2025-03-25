import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./SearchBox.css";

const SearchBox = ({ onPlaceSelect, onCloseSidePanel }) => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOMAPS_API_KEY;

    if (!apiKey) {
      console.error("GoMaps API key is missing!");
      return;
    }

    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", async () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      const placeId = place.place_id; // Get place ID

      try {
        // Fetch the place details to get a photo_reference
        const detailsResponse = await fetch(
          `https://maps.gomaps.pro/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`
        );
        const detailsData = await detailsResponse.json();

        let mainImage = null;
        if (detailsData.result.photos && detailsData.result.photos.length > 0) {
          const photoReference = detailsData.result.photos[0].photo_reference;
          mainImage = `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=400&key=${apiKey}`;
        }

        onPlaceSelect({
          name: place.name,
          lat: location.lat(),
          lng: location.lng(),
          imageUrl: mainImage,
          galleryImages: [],
        });

        setSearchValue(place.name); // Set input field to selected place name
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    });
  }, [onPlaceSelect]);

  // Manually trigger search (if needed)
  const handleSearch = () => {
    if (inputRef.current) {
      const event = new Event("keydown");
      event.key = "Enter";
      inputRef.current.dispatchEvent(event);
    }
  };

  // Clear search box & close side panel
  const handleClear = () => {
    setSearchValue("");
    onCloseSidePanel();
  };

  return (
    <div className="search-box-container">
      <input
        ref={inputRef}
        id="searchBox"
        type="text"
        placeholder="Search for a place..."
        className="search-box"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <button className="clear-btn" onClick={handleClear}>
          <FaTimes size={16} />
        </button>
      )}
      <button className="search-btn" onClick={handleSearch}>
        <FaSearch size={18} />
      </button>
    </div>
  );
};

export default SearchBox;
