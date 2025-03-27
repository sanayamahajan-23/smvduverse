import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes, FaSpinner, FaHistory } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import "./SearchBox.css";

const SearchBox = ({ onPlaceSelect, onCloseSidePanel, isSidePanelOpen }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is missing!");
      return;
    }

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeAutocomplete();
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }

    function initializeAutocomplete() {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });

      autocomplete.addListener("place_changed", async () => {
        setLoading(true);

        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.error("Failed to retrieve place details");
          setLoading(false);
          return;
        }

        const location = place.geometry.location;
        const placeData = {
          name: place.name,
          lat: location.lat(),
          lng: location.lng(),
          imageUrl: null,
          galleryImages: [],
        };

        onPlaceSelect(placeData);
        setSearchValue(place.name);
        setLoading(false);
        saveRecentSearchToFirestore(placeData.name);
      });
    }

    const loadRecentSearchesFromFirestore = async () => {
      try {
        const q = query(
          collection(db, "recentSearches"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const searches = querySnapshot.docs.map((doc) => doc.data().name);
        setRecentSearches(searches);
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearchesFromFirestore();
  }, [onPlaceSelect]);

  const saveRecentSearchToFirestore = async (placeName) => {
    if (!placeName || recentSearches.includes(placeName)) return;
    try {
      const docRef = await addDoc(collection(db, "recentSearches"), {
        name: placeName,
        timestamp: new Date(),
      });
      console.log("Search saved with ID:", docRef.id);
      setRecentSearches((prev) => [placeName, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Failed to save search:", error.message);
    }
  };

  const handleInputChange = (e) => setSearchValue(e.target.value);

  const handleSearchClick = () => {
    const event = new Event("keydown");
    event.key = "Enter";
    inputRef.current.dispatchEvent(event);
  };

  const handleClear = () => {
    setSearchValue("");
    onCloseSidePanel();
  };

  return (
    <div className="search-box-container" style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a place..."
        className="search-box"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        onFocus={() => setShowRecent(true)}
        onBlur={() => setTimeout(() => setShowRecent(false), 200)}
        autoFocus
      />

      <button className="search-btn" onClick={handleSearchClick}>
        <FaSearch size={18} />
      </button>

      {isSidePanelOpen ? (
        <button className="clear-btn" onClick={handleClear}>
          <FaTimes size={20} />
        </button>
      ) : loading ? (
        <FaSpinner className="loading-icon" size={20} />
      ) : null}

      {showRecent && recentSearches.length > 0 && (
        <ul className="recent-dropdown">
          {recentSearches.map((search, index) => (
            <li
              key={index}
              onMouseDown={() => {
                setSearchValue(search);
                handleSearchClick();
                setShowRecent(false);
              }}
            >
              <FaHistory size={16} style={{ marginRight: "8px", color: "#555" }} />
              {search}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;