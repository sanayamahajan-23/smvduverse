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

const SearchBox = ({ googleLoaded, onPlaceSelect, onCloseSidePanel, isSidePanelOpen }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!googleLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "in" },
        fields: ["place_id", "name", "geometry", "photos", "formatted_address"],
      });

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, [googleLoaded]);

  useEffect(() => {
    const loadRecentSearchesFromFirestore = async () => {
      try {
        const q = query(collection(db, "recentSearches"), orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        const searches = querySnapshot.docs.map((doc) => doc.data().name);
        setRecentSearches(searches);
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearchesFromFirestore();
  }, []);

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
    let imageUrl = "https://via.placeholder.com/400";
    let galleryImages = [];

    if (place.photos && place.photos.length > 0) {
      galleryImages = place.photos.map((photo) => photo.getUrl({ maxWidth: 800 }));
      imageUrl = galleryImages[0];
    }

    onPlaceSelect({ placeName: name, coordinates: { lat, lng }, imageUrl, galleryImages, formattedAddress: address, placeId });
    setSearchValue(name);
    setLoading(false);
    saveRecentSearchToFirestore(name);
  };

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
    if (autocompleteRef.current) {
      handlePlaceChanged();
    }
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