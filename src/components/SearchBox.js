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
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, [googleLoaded]);

  const handlePlaceChanged = async () => {
    setLoading(true);
    const place = autocompleteRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      console.error("Invalid place selected");
      setLoading(false);
      return;
    }

    const location = place.geometry.location;
    const placeId = place.place_id;

    onPlaceSelect({
      name: place.name,
      lat: location.lat(),
      lng: location.lng(),
      placeId: placeId,
    });

    setSearchValue(place.name);
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
