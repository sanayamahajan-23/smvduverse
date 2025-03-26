import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import "./SearchBox.css";

const SearchBox = ({
  googleLoaded,
  onPlaceSelect,
  onCloseSidePanel,
  isSidePanelOpen,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (
      !googleLoaded ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      return;
    }

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["establishment","geocode"],
          componentRestrictions: { country: "in" },
          fields: [
            "place_id",
            "name",
            "geometry",
            "photos",
            "formatted_address",
          ],
        }
      );

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, [googleLoaded]);

  const handlePlaceChanged = () => {
    setLoading(true);
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      console.error("Invalid place selected");
      setLoading(false);
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const name = place.name;
    const address = place.formatted_address;
    const placeId = place.place_id;

    // Get photos directly from the place object
    let imageUrl = "https://via.placeholder.com/400"; // Default placeholder
    let galleryImages = [];

    if (place.photos && place.photos.length > 0) {
      galleryImages = place.photos.map((photo) =>
        photo.getUrl({ maxWidth: 800 })
      );
      imageUrl = galleryImages[0]; // Set the first image as the main image
    }

    onPlaceSelect({
      placeName: name,
      coordinates: { lat, lng },
      imageUrl,
      galleryImages,
      formattedAddress: address, // Pass address
      placeId,
    });

    setSearchValue(name);
    setLoading(false);
  };


  const handleClear = () => {
    setSearchValue("");
    onCloseSidePanel();
  };

  return (
    <div className="search-box-container">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a place..."
        className="search-box"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={!googleLoaded}
      />
      <button className="search-btn">
        <FaSearch size={18} />
      </button>
      {isSidePanelOpen ? (
        <button className="clear-btn" onClick={handleClear}>
          <FaTimes size={20} />
        </button>
      ) : loading ? (
        <FaSpinner className="loading-icon" size={20} />
      ) : null}
    </div>
  );
};

export default SearchBox;
